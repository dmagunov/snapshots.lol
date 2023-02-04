import React, { useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

import { META_JSON_SCHEMA } from "lib/snapshot";

export type onEditorMount = (
  editor: Monaco.editor.ICodeEditor,
  monaco: typeof Monaco
) => void;

type EditorProps = {
  defaultValue?: string;
  width?: string;
  height?: string;
  onMount: onEditorMount;
  onValidate: (value: string, isValid: boolean) => void;
};

export default function Editor({
  defaultValue,
  onMount,
  onValidate,
  width,
  height,
}: EditorProps) {
  const onEditorMount = useCallback<onEditorMount>(
    (editor, monaco) => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: window.location.href,
            fileMatch: ["*"],
            schema: META_JSON_SCHEMA,
          },
        ],
      });

      const setModelMarkers = monaco.editor.setModelMarkers;

      monaco.editor.setModelMarkers = function(model, owner, markers) {
        setModelMarkers.call(monaco.editor, model, owner, markers);
        onValidate(editor.getValue(), markers.length === 0);
      };

      onMount(editor, monaco);
    },
    [onMount, onValidate]
  );

  return (
    <MonacoEditor
      options={{
        automaticLayout: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
      }}
      width={width}
      height={height}
      theme="vs-dark"
      defaultLanguage="json"
      defaultValue={defaultValue}
      onMount={onEditorMount}
    />
  );
}
