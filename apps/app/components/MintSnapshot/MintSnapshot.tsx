import type { Snapshot as SnapshotType } from "types";
import type { ContractReceipt } from "@ethersproject/contracts";

import { useReducer } from "react";
import { useNetwork } from "wagmi";

import MintSnapshotScreenshot from "./MintSnapshotScreenshot";
import MintSnapshotMeta from "./MintSnapshotMeta";
import MintSnapshotContract from "./MintSnapshotContract";
import { EaselLoader, HandsLoader, RoadLoader, BoardLoader, CupLoader, NoHumanLoader } from "components/Loader/Loader";
import { getEtherScanTxUrl } from "lib/wagmiClient";

import { PixelButtonStyled, CloseButton } from "./MintSnapshot.styles";

type MintSnapshotProps = {
  snapshot: SnapshotType;
  onClose: () => void;
}

type MintState = {
  type: string | null;
  metaUrl: string | null;
  receipt: ContractReceipt | null;
}

const INITIAL_STATE: MintState = {type: 'MINT_SCREENSHOT', metaUrl: null, receipt: null };

function reducer(state, action) {
  switch (action.type) {
    case 'MINT_SCREENSHOT':
    case 'MINT_SCREENSHOT_SUCCESS':
    case 'MINT_META':
      return {type: action.type};
    case 'MINT_CONTRACT':
      return {...state, type: action.type, metaUrl: action.metaUrl};
    case 'MINT_CONTRACT_CONFIRM':
      return {...state, type: action.type}; 
    case 'MINT_SUCCESS':
      return {...state, type: action.type, receipt: action.receipt};
    default:
      return {...state, type: action.type}; 
  }
}

export default function MintSnapshot({ snapshot, onClose }: MintSnapshotProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { chain } = useNetwork();

  const MINT_SCREENSHOT = (
    <MintSnapshotScreenshot
      snapshot={snapshot}
      onSuccess={() => dispatch({ type: "MINT_SCREENSHOT_SUCCESS" })}
      onError={e => dispatch({ type: "MINT_ERROR" })}
    >
      <EaselLoader/>
      <p>
        Taking screenshot ...
      </p>
    </MintSnapshotScreenshot>
  )

  const MINT_SCREENSHOT_SUCCESS = (
    <PixelButtonStyled
      onClick={() => dispatch({ type: "MINT_META"} )}
    >
      Mint
    </PixelButtonStyled>
  )

  const MINT_META = (
    <MintSnapshotMeta
      snapshot={snapshot}
      onSuccess={metaUrl => dispatch({ type: "MINT_CONTRACT", metaUrl})}
      onError={e => dispatch({ type: "MINT_ERROR" })}
    >
      <RoadLoader/>
      <p>
        Pushing metadata to IPFS ... Can take a while ...
      </p>
    </MintSnapshotMeta>
  )

  const MINT_CONTRACT = (
    <>
      <HandsLoader/>
      <p>
        Awaiting approval of transaction ...
      </p>
    </>
  )

  const MINT_CONTRACT_CONFIRM = (
    <>
      <BoardLoader/>
      <p>
        Minting token ... Can take a while ... <b>Do not close this window!</b>
      </p>
    </>
  )

  const MINT_SUCCESS = (
    <>
      <CupLoader/>
      <p>
        Congratulations! Your NFT has been successfully minted and added to the blockchain. Transaction hash: {" "}
        <a
          href={`${getEtherScanTxUrl(chain.id, state.receipt?.transactionHash)}`}
          target="_blank" rel="noreferrer"
          title={state.receipt?.transactionHash}
        >
          {state.receipt?.transactionHash?.slice(0, 6)}...
          {state.receipt?.transactionHash?.slice(state.receipt.transactionHash?.length - 4)}
        </a>
      </p>
      <p>
        The interactive version of your NFT can be viewed online at <a href={snapshot.url}>{snapshot.url}</a>
      </p>
    </>
  )

  if (state.type === "MINT_ERROR") {
    return (
      <>
        <NoHumanLoader/>
        <p>
          Error! Please try again. 
        </p>
        <CloseButton role="button" onClick={onClose}>Close</CloseButton>
      </>
    )
  }

  return (
    <>
      {["MINT_SCREENSHOT", "MINT_SCREENSHOT_SUCCESS"].includes(state.type) && (
        <>
          {MINT_SCREENSHOT}
          
          {["MINT_SCREENSHOT_SUCCESS"].includes(state.type) && (
            <>
              {MINT_SCREENSHOT_SUCCESS}
              <CloseButton role="button" onClick={onClose}>Close</CloseButton>
            </>
            
          )}
        </>
      )}
      
      {["MINT_META"].includes(state.type) && (
        <>
          {MINT_META}
        </>
      )}

      {["MINT_CONTRACT", "MINT_CONTRACT_CONFIRM"].includes(state.type) && (
        <MintSnapshotContract
            snapshot={snapshot}
            metaUrl={state.metaUrl}
            onConfirm={() => dispatch({ type: "MINT_CONTRACT_CONFIRM" })}
            onSuccess={receipt => dispatch({ type: "MINT_SUCCESS", receipt })}
            onError={e => dispatch({ type: "MINT_ERROR" })}
        >
          <>
            {["MINT_CONTRACT"].includes(state.type) && (
              <>
                {MINT_CONTRACT}
              </>
            )}

            {["MINT_CONTRACT_CONFIRM"].includes(state.type) && (
              <>
                {MINT_CONTRACT_CONFIRM}
              </>
            )}
          </>
        </MintSnapshotContract>
      )}

      {["MINT_SUCCESS"].includes(state.type) && (
        <>
          {MINT_SUCCESS}
        </>
      )}
    </>
  )
}