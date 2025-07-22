// src/components/CodeMirror.tsx
import {
    autocompletion,
    CompletionContext,
} from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { createVeltCodeMirrorStore, VeltCodeMirrorStore } from "@veltdev/codemirror-crdt-dev";
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
        if (editorRef.current && !viewRef.current && client) {

            // // Initialize Velt CodeMirror with the Y.Doc
            // // 'velt-codemirror-crdt-demo-test1-22-jul', client
            // codeMirrorStoreRef.current = new VeltCodeMirrorStore({
            //     editorId: 'velt-codemirror-crdt-demo-test1-22-jul',
            //     veltClient: client,
            // });

            // const startState = EditorState.create({
            //     doc: codeMirrorStoreRef.current.getYText()?.toString() ?? '',
            //     extensions: [
            //         basicSetup,
            //         javascript(),
            //         // oneDark,
            //         autocompletion(),
            //         // autocompletion(customCompletions),
            //         yCollab(codeMirrorStoreRef.current.getYText()!, codeMirrorStoreRef.current.getAwareness(), { undoManager: codeMirrorStoreRef.current.getUndoManager() }),
            //     ],
            // });

            // viewRef.current = new EditorView({
            //     state: startState,
            //     parent: editorRef.current,
            // });

            setupCodeMirrorEditor();
        }

        return () => {
            viewRef.current?.destroy();
            viewRef.current = null;
        };
    }, [client]);

    const setupCodeMirrorEditor = async () => {
        if (!client) return;
        // Initialize Velt CodeMirror with the Y.Doc
        // 'velt-codemirror-crdt-demo-test1-22-jul', client
        codeMirrorStoreRef.current = await createVeltCodeMirrorStore({
            editorId: 'velt-codemirror-crdt-demo-test1-22-jul',
            veltClient: client!,
        });

        if (!codeMirrorStoreRef.current) return;

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
            parent: editorRef.current!,
        });
    }

    return (
        <div
            ref={editorRef}
            className="codemirror-container"
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
