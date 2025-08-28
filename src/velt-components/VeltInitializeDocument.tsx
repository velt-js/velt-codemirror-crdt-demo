import { useSetDocuments } from '@veltdev/react';
import { useEffect } from 'react';

function VeltInitializeDocument() {

    const { setDocuments } = useSetDocuments();

    useEffect(() => {
        setDocuments([
            {
                id: 'velt-codemirror-crdt-demo-test1-28-aug',
                metadata: {
                    documentName: 'Velt CodeMirror CRDT Demo Test1 28 Aug 2025',
                }
            }
        ])
    }, []);

    return (
        <></>
    )
}

export default VeltInitializeDocument;