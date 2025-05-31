import { useRef, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import styles from './Preview.module.css';

const Preview = ({ htmlCode }) => {
    const iframe1Ref = useRef(null);
    const iframe2Ref = useRef(null);
    const updateTimeoutRef = useRef(null);
    const [activeIframe, setActiveIframe] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);

    // 防抖更新函数
    useEffect(() => {
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
            updatePreview(htmlCode);
        }, 150); // 150ms 防抖延迟

        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [htmlCode]);

    const updatePreview = code => {
        if (!code) return;

        setIsUpdating(true);

        // 选择非活跃的iframe进行更新
        const targetIframe =
            activeIframe === 1 ? iframe2Ref.current : iframe1Ref.current;

        if (targetIframe) {
            // 创建一个blob URL来避免srcdoc的限制
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            const handleLoad = () => {
                // 切换到新加载的iframe
                setActiveIframe(activeIframe === 1 ? 2 : 1);
                setIsUpdating(false);

                // 清理blob URL
                URL.revokeObjectURL(url);

                // 移除事件监听器
                targetIframe.removeEventListener('load', handleLoad);
            };

            targetIframe.addEventListener('load', handleLoad);
            targetIframe.src = url;
        }
    };

    const handleRefresh = () => {
        // 强制刷新当前内容
        updatePreview(htmlCode);
    };

    // 初始化第一个iframe
    useEffect(() => {
        if (htmlCode && iframe1Ref.current) {
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            const handleLoad = () => {
                URL.revokeObjectURL(url);
                iframe1Ref.current.removeEventListener('load', handleLoad);
            };

            iframe1Ref.current.addEventListener('load', handleLoad);
            iframe1Ref.current.src = url;
        }
    }, []);

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
                    ref={iframe1Ref}
                    className={`${styles.previewFrame} ${activeIframe === 1 ? styles.active : styles.hidden}`}
                    title="HTML Preview 1"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
                <iframe
                    ref={iframe2Ref}
                    className={`${styles.previewFrame} ${activeIframe === 2 ? styles.active : styles.hidden}`}
                    title="HTML Preview 2"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
                {isUpdating && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.loadingSpinner}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preview;
