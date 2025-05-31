import { useState } from 'react';
import { 
    MessageCircle, 
    Send, 
    ChevronLeft, 
    ChevronRight, 
    Sun, 
    Moon,
    Bot,
    User
} from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ isCollapsed, onToggleCollapse, theme, onToggleTheme }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: 'Hello! I\'m your AI assistant. I can help you with HTML editing, formatting, and content generation. How can I assist you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage
        };

        setMessages(prev => [...prev, userMessage]);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                content: generateAIResponse(inputMessage)
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);

        setInputMessage('');
    };

    const generateAIResponse = (userInput) => {
        const responses = [
            "I can help you with that! Here are some suggestions for improving your HTML code...",
            "That's a great question! Let me provide you with some HTML best practices...",
            "I'd be happy to help you format that HTML. Here's what I recommend...",
            "For better accessibility, consider adding these attributes to your HTML elements...",
            "Here's a clean way to structure that HTML section..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    {!isCollapsed && (
                        <>
                            <MessageCircle size={20} />
                            <span>AI Assistant</span>
                        </>
                    )}
                    <div className={styles.headerActions}>
                        <button
                            onClick={onToggleTheme}
                            className={styles.themeToggle}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                        >
                            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                        <button
                            onClick={onToggleCollapse}
                            className={styles.collapseToggle}
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {!isCollapsed && (
                <>
                    <div className={styles.messagesContainer}>
                        <div className={styles.messages}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`${styles.message} ${styles[message.type]}`}
                                >
                                    <div className={styles.messageIcon}>
                                        {message.type === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={styles.messageContent}>
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.inputWrapper}>
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about HTML..."
                                className={styles.messageInput}
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className={styles.sendButton}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
