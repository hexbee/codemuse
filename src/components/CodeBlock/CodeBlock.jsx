import { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Copy,
    Download,
    Import,
    Code,
    Check,
} from 'lucide-react';
import {
    getLanguageDisplayName,
    canImportToEditor,
    formatCodeForDisplay,
} from '../../utils/codeBlockParser';
import styles from './CodeBlock.module.css';

const CodeBlock = ({
    language,
    content,
    id,
    onImportCode,
    maxPreviewLines = 6,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const { preview, isLong, totalLines, fullCode } = formatCodeForDisplay(
        content,
        maxPreviewLines
    );

    const displayName = getLanguageDisplayName(language);
    const canImport = canImportToEditor(language);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const handleDownload = () => {
        const fileExtensions = {
            html: 'html',
            css: 'css',
            javascript: 'js',
            js: 'js',
            jsx: 'jsx',
            typescript: 'ts',
            ts: 'ts',
            tsx: 'tsx',
            json: 'json',
            xml: 'xml',
            python: 'py',
            java: 'java',
            c: 'c',
            cpp: 'cpp',
            csharp: 'cs',
            php: 'php',
            ruby: 'rb',
            go: 'go',
            rust: 'rs',
            swift: 'swift',
            kotlin: 'kt',
            sql: 'sql',
            bash: 'sh',
            shell: 'sh',
            yaml: 'yml',
            yml: 'yml',
        };

        const extension = fileExtensions[language.toLowerCase()] || 'txt';
        const filename = `code-${Date.now()}.${extension}`;

        const blob = new Blob([fullCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        if (onImportCode && canImport) {
            onImportCode(fullCode, language);
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.codeBlock}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button
                        onClick={toggleExpanded}
                        className={styles.toggleButton}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </button>
                    <Code size={14} className={styles.codeIcon} />
                    <span className={styles.language}>{displayName}</span>
                    {isLong && (
                        <span className={styles.lineCount}>
                            {totalLines} lines
                        </span>
                    )}
                </div>

                <div className={styles.headerActions}>
                    {canImport && (
                        <button
                            onClick={handleImport}
                            className={styles.actionButton}
                            title="Import to editor"
                        >
                            <Import size={12} />
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className={`${styles.actionButton} ${isCopied ? styles.copied : ''}`}
                        title="Copy code"
                    >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className={styles.actionButton}
                        title="Download file"
                    >
                        <Download size={12} />
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div
                className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}
            >
                <pre className={styles.code}>
                    <code className={`language-${language}`}>
                        {isExpanded ? fullCode : preview}
                    </code>
                </pre>

                {isLong && !isExpanded && (
                    <div className={styles.expandHint}>
                        <button
                            onClick={toggleExpanded}
                            className={styles.expandButton}
                        >
                            Show {totalLines - maxPreviewLines} more lines
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeBlock;
