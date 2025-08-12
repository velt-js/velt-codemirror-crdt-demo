// src/components/CodeMirror.tsx
import React, { useEffect, useRef, useState } from "react";
import {
    autocompletion,
} from "@codemirror/autocomplete";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import { yCollab } from "y-codemirror.next";
import { createVeltCodeMirrorStore, VeltCodeMirrorStore } from "@veltdev/codemirror-crdt";
import { useVeltClient, useVeltInitState } from "@veltdev/react";
import LoadingSpinner from './LoadingSpinner';

interface CodeMirrorProps {
    editorId: string;
    fileType: 'html' | 'css' | 'javascript' | 'typescript';
}

const CodeMirror: React.FC<CodeMirrorProps> = ({ editorId, fileType }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const editorIdRef = useRef<string | null>(null);
    const codeMirrorStoreRef = useRef<VeltCodeMirrorStore | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState('Initializing editor...');

    const { client } = useVeltClient();

    const veltInitialised = useVeltInitState();

    const getLanguageExtension = (type: string) => {
        switch (type) {
            case 'html':
                return html();
            case 'css':
                return css();
            case 'javascript':
            case 'typescript':
            default:
                return javascript();
        }
    };

    const getFileTypeSubtitle = (id: string) => {
        if (id.includes('.html')) return '🌐 HTML Document';
        if (id.includes('.css')) return '🎨 Stylesheet';
        if (id.includes('.js')) return '📜 JavaScript';
        if (id.includes('.ts')) return '📘 TypeScript';
        return '';
    };

    const cleanupEditor = () => {
        if (viewRef.current) {
            viewRef.current.destroy();
            viewRef.current = null;
        }
        codeMirrorStoreRef.current = null;
        editorIdRef.current = null;
    };

    useEffect(() => {
        // Clean up if editorId has changed or if we need to initialize
        if (editorIdRef.current !== editorId) {
            cleanupEditor();
        }

        if (editorRef.current && client && editorId && veltInitialised) {
            setupCodeMirrorEditor();
        }

        return cleanupEditor;
    }, [client, editorId, fileType, veltInitialised]);

    const setupCodeMirrorEditor = async () => {
        if (!client || !veltInitialised || !editorId) return;

        // Prevent duplicate setups
        if (editorIdRef.current === editorId && viewRef.current) {
            return;
        }

        // Clean up existing editor first
        cleanupEditor();
        
        // Set loading state
        setIsLoading(true);
        setLoadingText('Connecting to collaboration server...');
        
        // Set the current editorId
        editorIdRef.current = editorId;
        
        try {
            codeMirrorStoreRef.current = await createVeltCodeMirrorStore({
                editorId: editorId,
                veltClient: client!,
            });

            if (!codeMirrorStoreRef.current || editorIdRef.current !== editorId) {
                // Editor might have changed while we were creating the store
                return;
            }

            setLoadingText('Setting up editor...');
            
            // Small delay to show the loading state
            await new Promise(resolve => setTimeout(resolve, 300));

            const startState = EditorState.create({
                doc: codeMirrorStoreRef.current.getYText()?.toString() ?? '',
                extensions: [
                    basicSetup,
                    getLanguageExtension(fileType),
                    autocompletion(),
                    yCollab(codeMirrorStoreRef.current.getYText()!, codeMirrorStoreRef.current.getAwareness(), { undoManager: codeMirrorStoreRef.current.getUndoManager() }),
                ],
            });

            // Double-check we're still on the same editor
            if (editorIdRef.current !== editorId) {
                return;
            }

            setLoadingText('Ready to code!');

            viewRef.current = new EditorView({
                state: startState,
                parent: editorRef.current!,
            });

            // Small delay before hiding loading state
            setTimeout(() => {
                setIsLoading(false);
            }, 200);

        } catch (error) {
            console.error('Failed to initialize CodeMirror:', error);
            setLoadingText('Failed to load editor');
            setTimeout(() => setIsLoading(false), 1000);
        }
    }

    return (
        <div
            ref={editorRef}
            className="codemirror-container"
            style={{ position: 'relative', minHeight: '400px' }}
        >
            {isLoading && (
                <LoadingSpinner
                    loadingText={loadingText}
                    subtitle={getFileTypeSubtitle(editorId)}
                />
            )}
        </div>
    );
};

function CodeMirrorComponent({ editorId, fileType }: CodeMirrorProps) {
    const veltInitialized = useVeltInitState();

    if (!veltInitialized) {
        return (
            <div style={{ 
                position: 'relative', 
                height: '100%', 
                minHeight: '400px',
                width: '100%',
                flex: 1
            }}>
                <LoadingSpinner
                    loadingText="Initializing Velt collaboration..."
                    subtitle="🚀 Setting up real-time collaboration"
                    size="large"
                />
            </div>
        );
    }

    return (
        <>
            <CodeMirror editorId={editorId} fileType={fileType} />
        </>
    )
}

export default CodeMirrorComponent;
