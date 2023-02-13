// https://github.com/motifland/yfs
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness.js";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import * as mutex from "lib0/mutex.js";
import MonacoBinding from "./MonacoBinding";

export const WEBRTC_SIGNALING_SERVERS = JSON.parse(
  process.env.NEXT_PUBLIC_WEBRTC_SIGNALING_SERVERS!
);
export const YDOC_UPDATE_ORIGIN_CURRENT_EDITOR =
  "YDOC_UPDATE_ORIGIN_CURRENT_EDITOR";

export class YConfig {
  roomId: string;
  monaco: any;
  model: any;
  editor: any;
  userId: number;
  initialValue: Uint8Array;
  doc: Y.Doc | undefined;
  initialEncodedYDoc: string | undefined;
  awareness: awarenessProtocol.Awareness | undefined;
  webRTCProvider: WebrtcProvider | undefined;
  indexedDBPersistence: IndexeddbPersistence | undefined;
  monacoBinding: MonacoBinding | undefined;
  mux: mutex.mutex;
  checkIfConnectedIntervalId: ReturnType<typeof setInterval> | null;

  constructor(
    monaco: any,
    editor: any,
    userId: number,
    roomId: string,
    initialValue: Uint8Array
  ) {
    this.roomId = roomId;
    this.monaco = monaco;
    this.editor = editor;
    this.model = editor.getModel();
    this.userId = userId;
    this.mux = mutex.createMutex();
    this.checkIfConnectedIntervalId = null;
    this.initialValue = initialValue;
    this.initYDoc();
  }

  initYDoc(): void {
    this.doc = new Y.Doc();

    this.awareness = new awarenessProtocol.Awareness(this.doc);

    this.webRTCProvider = new WebrtcProvider(this.roomId, this.doc, {
      signaling: WEBRTC_SIGNALING_SERVERS,
      password: null,
      awareness: this.awareness,
      maxConns: Number.POSITIVE_INFINITY,
      filterBcConns: true,
      peerOpts: {},
    });

    this.monacoBinding = new MonacoBinding(
      this.monaco,
      this.doc.getText(),
      this.model,
      this.editor,
      this.awareness,
      this.userId
    );

    if (!this.webRTCProvider.connected) {
      this.webRTCProvider.connect();
      this.setupInitialValue();
    }
  }

  setupInitialValue(): void {
    this.checkIfConnectedIntervalId = setInterval(() => {
      if (this.webRTCProvider?.connected && this.doc) {
        Y.applyUpdate(this.doc, this.initialValue);
        this.clearInterval();
      }
    }, 600);
  }

  clearInterval(): void {
    if (this.checkIfConnectedIntervalId !== null) {
      clearTimeout(this.checkIfConnectedIntervalId);
    }
  }

  destroy(): void {
    this.clearInterval();
    this.awareness?.destroy();
    this.monacoBinding?.destroy();
    this.webRTCProvider?.disconnect();
    this.webRTCProvider?.destroy();
    this.doc?.destroy();
  }
}
