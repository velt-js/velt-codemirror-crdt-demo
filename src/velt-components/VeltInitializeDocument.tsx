import { useSetDocuments } from '@veltdev/react';
import { useEffect } from 'react';

function VeltInitializeDocument() {

    const { setDocuments } = useSetDocuments();

    useEffect(() => {
        setDocuments([
            {
                id: 'velt-codemirror-crdt-demo-test1-24-jul',
                metadata: {
                    documentName: 'Velt CodeMirror CRDT Demo Test1 24 Jul 2025',
                }
            }
        ])
    }, []);

    return (
        <></>
    )
}

export default VeltInitializeDocument;