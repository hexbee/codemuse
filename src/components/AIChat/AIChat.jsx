import { useState, useEffect, useRef } from 'react';
import {
    Send,
    Bot,
    User,
    Trash2,
    ChevronDown,
    Loader2,
    AlertCircle,
    RefreshCw,
    Plus,
} from 'lucide-react';
import { useAIConfig } from '../../hooks/useAIConfig';
import { useConversations } from '../../hooks/useConversations';
import OpenAIService from '../../services/openaiService';
import { debugAI } from '../../utils/debugHelper';
import styles from './AIChat.module.css';

const AIChat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConversations, setShowConversations] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const openAIServiceRef = useRef(null);
    const conversationSelectorRef = useRef(null);

    const { config, isConfigured } = useAIConfig();
    const {
        conversations,
        currentConversationId,
        currentConversation,
        getCurrentConversation,
        createNewConversation,
        addMessage,
        updateMessage,
        switchConversation,
        deleteConversation,
        isConversationEmpty,
    } = useConversations();

    // Initialize OpenAI service when config changes
    useEffect(() => {
        if (isConfigured) {
            console.log('Initializing OpenAI service with config:', {
                baseUrl: config.baseUrl,
                model: config.model,
                hasApiKey: !!config.apiKey,
            });
            debugAI.checkConfig(config);
            openAIServiceRef.current = new OpenAIService(config);
        }
    }, [config, isConfigured]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [currentConversation?.messages]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = event => {
            if (
                conversationSelectorRef.current &&
                !conversationSelectorRef.current.contains(event.target) &&
                showConversations
            ) {
                setShowConversations(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showConversations]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading || !isConfigured) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setError(null);
        setIsLoading(true);

        try {
            // Add user message
            const addedUserMessage = addMessage({
                type: 'user',
                content: userMessage,
            });

            // Get conversation history for API (including the just-added user message)
            const currentConv = getCurrentConversation();
            // Include the user message we just added by manually adding it to the messages
            const allMessages = [...currentConv.messages, addedUserMessage];
            const messagesToSend = allMessages.filter(
                msg => !msg.isStreaming && msg.content.trim() !== ''
            );

            // Add placeholder AI message
            const aiMessage = addMessage({
                type: 'ai',
                content: '',
                isStreaming: true,
            });

            // Ensure we have the OpenAI service
            if (!openAIServiceRef.current) {
                throw new Error('OpenAI service not initialized');
            }

            // Send to OpenAI
            await openAIServiceRef.current.sendMessage(
                messagesToSend,
                // onChunk
                (_chunk, fullContent) => {
                    updateMessage(aiMessage.id, {
                        content: fullContent,
                        isStreaming: true,
                    });
                },
                // onComplete
                fullContent => {
                    updateMessage(aiMessage.id, {
                        content: fullContent,
                        isStreaming: false,
                    });

                    setIsLoading(false);
                },
                // onError
                error => {
                    console.error('OpenAI API Error:', error);
                    setError(error.message);
                    updateMessage(aiMessage.id, {
                        content:
                            'Sorry, I encountered an error while processing your request.',
                        isStreaming: false,
                        hasError: true,
                    });

                    setIsLoading(false);
                }
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleRetry = () => {
        setError(null);
        // Re-send the last user message
        const currentConv = getCurrentConversation();
        const lastUserMessage = [...currentConv.messages]
            .reverse()
            .find(msg => msg.type === 'user');
        if (lastUserMessage) {
            setInputMessage(lastUserMessage.content);
        }
    };

    if (!isConfigured) {
        return (
            <div className={styles.configPrompt}>
                <Bot size={48} />
                <h3>AI Assistant Not Configured</h3>
                <p>
                    Please configure your OpenAI API settings in the Settings
                    panel to start using the AI assistant.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.chatContainer}>
            {/* Conversation Selector */}
            <div className={styles.conversationHeader}>
                <div
                    className={styles.conversationSelector}
                    ref={conversationSelectorRef}
                >
                    <button
                        onClick={() => setShowConversations(!showConversations)}
                        className={styles.conversationButton}
                    >
                        <span className={styles.conversationTitle}>
                            {currentConversation?.title || 'New Conversation'}
                        </span>
                        <ChevronDown
                            size={16}
                            className={showConversations ? styles.rotated : ''}
                        />
                    </button>

                    {showConversations && (
                        <div className={styles.conversationDropdown}>
                            <div className={styles.conversationList}>
                                {conversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        onClick={() => {
                                            switchConversation(conv.id);
                                            setShowConversations(false);
                                        }}
                                        className={`${styles.conversationItem} ${
                                            conv.id === currentConversationId
                                                ? styles.active
                                                : ''
                                        }`}
                                    >
                                        <span
                                            className={
                                                styles.conversationItemTitle
                                            }
                                        >
                                            {conv.title}
                                        </span>
                                        <span
                                            className={
                                                styles.conversationItemDate
                                            }
                                        >
                                            {new Date(
                                                conv.updatedAt
                                            ).toLocaleDateString()}
                                        </span>
                                        {conversations.length > 1 && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    deleteConversation(conv.id);
                                                }}
                                                className={styles.deleteButton}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* New Conversation Button */}
                <button
                    onClick={() => {
                        createNewConversation();
                        setShowConversations(false);
                    }}
                    className={styles.newConversationButton}
                    title={
                        currentConversation &&
                        isConversationEmpty(currentConversation)
                            ? 'Current conversation is ready for use'
                            : 'Start new conversation'
                    }
                >
                    <div className={styles.plusIcon}>
                        <Plus size={16} />
                    </div>
                </button>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
                <div className={styles.messages}>
                    {currentConversation?.messages.map(message => (
                        <div
                            key={message.id}
                            className={`${styles.message} ${styles[message.type]}`}
                        >
                            <div className={styles.messageIcon}>
                                {message.type === 'ai' ? (
                                    <Bot size={16} />
                                ) : (
                                    <User size={16} />
                                )}
                            </div>
                            <div className={styles.messageContent}>
                                {message.content}
                                {message.isStreaming && (
                                    <Loader2
                                        size={14}
                                        className={styles.streamingIndicator}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className={styles.errorContainer}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                    <button
                        onClick={handleRetry}
                        className={styles.retryButton}
                    >
                        <RefreshCw size={14} />
                        Retry
                    </button>
                </div>
            )}

            {/* Input */}
            <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                    <textarea
                        ref={textareaRef}
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about HTML..."
                        className={styles.messageInput}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className={styles.sendButton}
                    >
                        {isLoading ? (
                            <Loader2 size={16} className={styles.spinning} />
                        ) : (
                            <Send size={16} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
