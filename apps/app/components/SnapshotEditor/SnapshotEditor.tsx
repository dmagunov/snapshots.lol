import type { Snapshot as SnapshotType } from "types";
import type { onEditorMount } from "components/Editor/Editor";
import type { Theme } from "@thenftsnapshot/themes"

import { useState, useRef, useCallback, useEffect } from "react";
import { merge as _merge } from "lodash-es";
import { useIsClient, useMediaQuery } from 'usehooks-ts'
import { toast } from 'react-toastify';
import { useTheme } from "styled-components";
import Image from "next/image";

import { YConfig } from "lib/YConfig";
import { base64ToBuffer } from "lib/utils";
import { META_SAMPLE, META_SAMPLE_ENCODED, getSnapshotIdFromUrl, fromMetaToSnapshot } from "lib/snapshot";

import Editor from "components/Editor/Editor";
import Snapshot from "components/Snapshot/Snapshot";
import MintSnapshot from "components/MintSnapshot/MintSnapshot";
import MintButton from "components/MintButton/MintButton";
import GesturesWrapper from "components/GesturesWrapper/GesturesWrapper";
import Dialog from "components/Dialog/Dialog";
import IconButton from "components/IconButton/IconButton";
import ToolBar from "components/ToolBar/ToolBar";

import QuestionIcon from "public/images/question.svg";
import { Container, CodeContainer, PreviewContainer, EditButton } from "./SnapshotEditor.styles";

type SnapshotEditorComponentProps = {
  updateTheme: (theme: Theme) => void;
};

const VIEW_STATE_EDITOR = 0;
const VIEW_STATE_PREVIEW = 1;
const VIEW_STATE_SPLIT = 2;

export default function SnapshotEditorComponent({ updateTheme }: SnapshotEditorComponentProps) {
  const [snapshot, setSnapshot] = useState<SnapshotType>(undefined);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isMint, setMint] = useState<boolean>(false);
  const [isHelpShown, setIsHelpShown] = useState<boolean>(false);
  const config = useRef<YConfig | undefined>(undefined);
  const isClient = useIsClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints?.mobile})`);
  const [viewState, setViewState] = useState<number>(VIEW_STATE_SPLIT);

  useEffect(() => {
    isMobile ? setViewState(VIEW_STATE_EDITOR) : setViewState(VIEW_STATE_SPLIT);
  }, [isMobile]);

  useEffect(() => {
    getInitSnapshot()
      .then(
        (snapshot) => setSnapshot(snapshot)
      )
      .catch(
        () => toast.error("Something went wrong while loading the sample snapshot data", { theme: "dark" })
      );
  }, []);

  const onEditorMount = useCallback<onEditorMount>((editor, monaco) => {
    config.current?.destroy();
    config.current = new YConfig(
      monaco,
      editor,
      Math.floor(Math.random() * 8),
      snapshot.id,
      base64ToBuffer(META_SAMPLE_ENCODED)
    );
  }, [snapshot, config]);

  const onValidate = useCallback((value: string, isValid: boolean) => {
    if (!value || !isValid) {
      setIsValid(false);
      return;
    }
    
    updateSnapshot({ ...snapshot }, value).then((snapshot) => {
      setSnapshot(snapshot);
      setIsValid(true);
    });
  }, [snapshot]);

  if (!snapshot) return null;

  return (
    <Container>
      
      <CodeContainer 
        style={{display: [VIEW_STATE_SPLIT, VIEW_STATE_EDITOR].includes(viewState) ? 'flex' : 'none'}}
      >
        <Editor
          width={viewState === VIEW_STATE_SPLIT ? "50vw" : "100vw"}
          height="100%"
          onMount={onEditorMount}
          onValidate={onValidate}
        />
      </CodeContainer>
      
      <PreviewContainer
        style={{display: [VIEW_STATE_SPLIT, VIEW_STATE_PREVIEW].includes(viewState) ? 'flex' : 'none'}}
      >
        <Snapshot
          snapshot={snapshot}
          updateTheme={updateTheme}
        />
      </PreviewContainer>

      {isClient && (
        <GesturesWrapper
          scale={isMobile ? 0.7 : 1}
          zIndex={4}
          top={isMobile ? `calc(95vh - 8rem)` : `calc(50vh - 6.5rem)`}
          left={isMobile ? `calc(90vw - 10rem)` : `calc(50vw - 6.5rem)`}
        >
          <MintButton
            disabled={!isValid}
            onClick={() => setMint(true)}
          />
        </GesturesWrapper>
      )}

      {isMobile && (
        <GesturesWrapper
          scale={0.7}
          zIndex={4}
          top={`calc(95vh - 8rem)`}
          left={`calc(90vw - 21rem)`}
        >
          <EditButton 
            color={(viewState === VIEW_STATE_EDITOR ? 'blue' : 'green')} 
            onClick={() => setViewState(viewState === VIEW_STATE_EDITOR ? VIEW_STATE_PREVIEW : VIEW_STATE_EDITOR)}
            title={viewState === VIEW_STATE_EDITOR ? 'Toggle Preview' : 'Toggle Editor'}
          >
            {viewState === VIEW_STATE_PREVIEW ? (
              <Image src={'/images/code.png'} width={60} height={60} alt="Toggle Editor"/>
            ) : (
              <Image src={'/images/preview.png'} width={70} height={70} alt="Toggle Preview"/>
            )}
            
          </EditButton>
        </GesturesWrapper>
      )}

      <ToolBar>
        <IconButton
          onClick={() => setIsHelpShown(true)}
        >
          <QuestionIcon width="20" />
        </IconButton>
      </ToolBar>

      {isMint && 
        <Dialog zIndex={4}>
          <MintSnapshot snapshot={snapshot} onClose={() => setMint(false)}/>
        </Dialog>
      }

      {isHelpShown && 
        <Dialog zIndex={4} onDismiss={() => setIsHelpShown(false)}>
          TODO: Text for help page
        </Dialog>
      }

    </Container>
  );
}

async function getInitSnapshot(): Promise<SnapshotType> {
  try {
    let snapshot = await fromMetaToSnapshot(META_SAMPLE);
    snapshot.id = getSnapshotIdFromUrl();
    snapshot.url = window.location.href;
    return snapshot;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateSnapshot(snapshot: SnapshotType, value: string): Promise<SnapshotType> {
  try {
    let json = JSON.parse(value);
    snapshot.blocks = [];
    return _merge({}, snapshot, await fromMetaToSnapshot(json));
  } catch (error) {
    return snapshot;
  }
}