import { useSetDocuments } from '@veltdev/react';
import { useEffect } from 'react';

function VeltInitializeDocument() {

    const { setDocuments } = useSetDocuments();

    useEffect(() => {
        setDocuments([
            {
                id: 'velt-codemirror-crdt-demo-test1-11-aug',
                metadata: {
                    documentName: 'Velt CodeMirror CRDT Demo Test1 11 Aug 2025',
                }
            }
        ])
    }, []);

    return (
        <></>
    )
}

export default VeltInitializeDocument;