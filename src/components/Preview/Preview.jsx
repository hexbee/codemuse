import { useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import styles from './Preview.module.css';

const Preview = ({ htmlCode }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const doc = iframe.contentDocument || iframe.contentWindow.document;

            // Write the HTML content to the iframe
            doc.open();
            doc.write(htmlCode);
            doc.close();
        }
    }, [htmlCode]);

    const handleRefresh = () => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(htmlCode);
            doc.close();
        }
    };

    return (
        <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
                <div className={styles.previewTitle}>
                    <span>Live Preview</span>
                </div>
                <button
                    onClick={handleRefresh}
                    className={styles.refreshButton}
                    title="Refresh preview"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className={styles.previewContent}>
                <iframe
                    ref={iframeRef}
                    className={styles.previewFrame}
                    title="HTML Preview"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default Preview;
