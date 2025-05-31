import { parseMessageContent } from '../../utils/codeBlockParser';
import CodeBlock from '../CodeBlock/CodeBlock';
import styles from './MessageContent.module.css';

const MessageContent = ({ content, onImportCode, isStreaming }) => {
    // 如果正在流式传输，直接显示原始内容
    if (isStreaming) {
        return (
            <div className={styles.messageContent}>
                {content}
            </div>
        );
    }

    // 解析消息内容
    const contentBlocks = parseMessageContent(content);

    return (
        <div className={styles.messageContent}>
            {contentBlocks.map((block, index) => {
                if (block.type === 'code') {
                    return (
                        <CodeBlock
                            key={block.id || `code-${index}`}
                            language={block.language}
                            content={block.content}
                            id={block.id}
                            onImportCode={onImportCode}
                        />
                    );
                } else {
                    // 处理普通文本，保持换行
                    return (
                        <div key={`text-${index}`} className={styles.textBlock}>
                            {block.content.split('\n').map((line, lineIndex) => (
                                <div key={lineIndex}>
                                    {line || '\u00A0'} {/* 使用非断空格保持空行 */}
                                </div>
                            ))}
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default MessageContent;
