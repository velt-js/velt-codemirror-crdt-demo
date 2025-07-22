// src/components/CodeMirror.tsx
import {
    autocompletion,
    CompletionContext,
} from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { VeltCodeMirrorStore } from "@veltdev/codemirror-crdt-dev";
import { useVeltClient, useVeltInitState } from "@veltdev/react";
import { basicSetup, EditorView } from "codemirror";
import React, { useEffect, useRef } from "react";
import { yCollab } from "y-codemirror.next";

const customCompletions = {
    override: [
        (context: CompletionContext) => {
            const word = context.matchBefore(/\w*/);
            if (!word || word.from === word.to) return null;
            return {
                from: word.from,
                options: [
                    { label: "console", type: "keyword" },
                    { label: "log", type: "function" },
                    { label: "alert", type: "function" },
                    { label: "document", type: "variable" },
                ],
            };
        },
    ],
};

const CodeMirror: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const codeMirrorStoreRef = useRef<VeltCodeMirrorStore | null>(null);

    const { client } = useVeltClient();

    useEffect(() => {
        if (editorRef.current && !viewRef.current) {

            // Initialize Velt CodeMirror with the Y.Doc
            codeMirrorStoreRef.current = new VeltCodeMirrorStore('velt-codemirror-crdt-demo-test1-22-jul', client);

            const startState = EditorState.create({
                doc: codeMirrorStoreRef.current.getYText()?.toString() ?? '',
                extensions: [
                    basicSetup,
                    javascript(),
                    // oneDark,
                    autocompletion(),
                    // autocompletion(customCompletions),
                    yCollab(codeMirrorStoreRef.current.getYText()!, codeMirrorStoreRef.current.getAwareness(), { undoManager: codeMirrorStoreRef.current.getUndoManager() }),
                ],
            });

            viewRef.current = new EditorView({
                state: startState,
                parent: editorRef.current,
            });
        }

        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, []);

    return (
        <div
            ref={editorRef}
            style={{ height: "500px", border: "1px solid #ccc", borderRadius: 4 }}
        />
    );
};

// export default CodeMirror;

function CodeMirrorComponent() {

    const veltInitialized = useVeltInitState();

    if (!veltInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <CodeMirror />
        </>
    )
}

export default CodeMirrorComponent;
