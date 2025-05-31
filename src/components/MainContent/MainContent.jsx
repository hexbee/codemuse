import { useState } from 'react';
import { Edit3, Eye, Copy, Download, Settings } from 'lucide-react';
import CodeEditor from '../Editor/CodeEditor';
import Preview from '../Preview/Preview';
import SettingsPanel from '../Settings/Settings';
import styles from './MainContent.module.css';

const MainContent = ({ htmlCode, onHtmlChange, theme, onToggleTheme }) => {
    const [activeTab, setActiveTab] = useState('edit');
    const [showSettings, setShowSettings] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(htmlCode);
            // You could add a toast notification here
            console.log('Code copied to clipboard');
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.mainContent}>
            <div className={styles.header}>
                <div className={styles.topSection}>
                    <div className={styles.actions}>
                        <button
                            onClick={handleCopy}
                            className={styles.actionButton}
                            title="Copy HTML to clipboard"
                        >
                            <Copy size={14} />
                            Copy
                        </button>
                        <button
                            onClick={handleDownload}
                            className={styles.actionButton}
                            title="Download HTML file"
                        >
                            <Download size={14} />
                            Download
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`${styles.actionButton} ${showSettings ? styles.active : ''}`}
                            title="Settings"
                        >
                            <Settings size={14} />
                            Settings
                        </button>
                    </div>
                </div>

                <div className={styles.tabSection}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'edit' ? styles.active : ''}`}
                            onClick={() => setActiveTab('edit')}
                        >
                            <Edit3 size={14} />
                            Edit
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'preview' ? styles.active : ''}`}
                            onClick={() => setActiveTab('preview')}
                        >
                            <Eye size={14} />
                            Preview
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {activeTab === 'edit' ? (
                    <CodeEditor
                        value={htmlCode}
                        onChange={onHtmlChange}
                        theme={theme}
                    />
                ) : (
                    <Preview htmlCode={htmlCode} />
                )}
            </div>

            {showSettings && (
                <SettingsPanel
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default MainContent;
