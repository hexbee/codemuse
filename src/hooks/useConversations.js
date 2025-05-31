import { useState, useEffect, useCallback } from 'react';

const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    // Load conversations from localStorage on mount
    useEffect(() => {
        try {
            const savedConversations = localStorage.getItem('ai-conversations');
            const savedCurrentId = localStorage.getItem(
                'current-conversation-id'
            );

            if (savedConversations) {
                const parsedConversations = JSON.parse(savedConversations);
                setConversations(parsedConversations);

                if (
                    savedCurrentId &&
                    parsedConversations.find(c => c.id === savedCurrentId)
                ) {
                    setCurrentConversationId(savedCurrentId);
                } else if (parsedConversations.length > 0) {
                    const firstConvId = parsedConversations[0].id;
                    setCurrentConversationId(firstConvId);
                    localStorage.setItem(
                        'current-conversation-id',
                        firstConvId
                    );
                }
            } else {
                // Create initial conversation
                createNewConversation();
            }
        } catch (error) {
            console.error('Failed to load conversations:', error);
            createNewConversation();
        }
    }, [createNewConversation]);

    // Save conversations to localStorage
    const saveConversations = (newConversations, newCurrentId = null) => {
        try {
            localStorage.setItem(
                'ai-conversations',
                JSON.stringify(newConversations)
            );
            if (newCurrentId !== null) {
                localStorage.setItem('current-conversation-id', newCurrentId);
            }
        } catch (error) {
            console.error('Failed to save conversations:', error);
        }
    };

    // Check if conversation is effectively empty (only has initial AI message)
    const isConversationEmpty = useCallback(conversation => {
        if (!conversation || !conversation.messages) return true;

        // Consider empty if only has 1 message and it's the initial AI greeting
        if (conversation.messages.length === 1) {
            const message = conversation.messages[0];
            return (
                message.type === 'ai' &&
                message.content.includes("Hello! I'm your AI assistant")
            );
        }

        return conversation.messages.length === 0;
    }, []);

    // Smart create new conversation - reuse empty conversation if available
    const createNewConversation = useCallback(() => {
        const currentConv = getCurrentConversation();

        // If current conversation is empty, just reuse it
        if (currentConv && isConversationEmpty(currentConv)) {
            return currentConv.id;
        }

        const newConversation = {
            id: generateId(),
            title: 'New Conversation',
            messages: [
                {
                    id: generateId(),
                    type: 'ai',
                    content:
                        "Hello! I'm your AI assistant. I can help you with HTML editing, formatting, and content generation. How can I assist you today?",
                    timestamp: new Date().toISOString(),
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const newConversations = [newConversation, ...conversations];
        setConversations(newConversations);
        setCurrentConversationId(newConversation.id);
        saveConversations(newConversations, newConversation.id);

        return newConversation.id;
    }, [conversations, getCurrentConversation, isConversationEmpty]);

    // Get current conversation
    const getCurrentConversation = useCallback(() => {
        return conversations.find(c => c.id === currentConversationId) || null;
    }, [conversations, currentConversationId]);

    // Add message to current conversation
    const addMessage = message => {
        if (!currentConversationId) {
            console.error('No current conversation ID');
            return;
        }

        const newMessage = {
            id: generateId(),
            ...message,
            timestamp: new Date().toISOString(),
        };

        setConversations(prevConversations => {
            const updatedConversations = prevConversations.map(conv => {
                if (conv.id === currentConversationId) {
                    const updatedConv = {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        updatedAt: new Date().toISOString(),
                    };

                    // Auto-generate title from first user message
                    if (
                        conv.title === 'New Conversation' &&
                        message.type === 'user'
                    ) {
                        updatedConv.title =
                            message.content.slice(0, 50) +
                            (message.content.length > 50 ? '...' : '');
                    }

                    return updatedConv;
                }
                return conv;
            });

            saveConversations(updatedConversations);
            return updatedConversations;
        });

        return newMessage;
    };

    // Update message in current conversation
    const updateMessage = (messageId, updates) => {
        if (!currentConversationId) return;

        setConversations(prevConversations => {
            const updatedConversations = prevConversations.map(conv => {
                if (conv.id === currentConversationId) {
                    return {
                        ...conv,
                        messages: conv.messages.map(msg =>
                            msg.id === messageId ? { ...msg, ...updates } : msg
                        ),
                        updatedAt: new Date().toISOString(),
                    };
                }
                return conv;
            });

            saveConversations(updatedConversations);
            return updatedConversations;
        });
    };

    // Switch to different conversation
    const switchConversation = conversationId => {
        if (conversations.find(c => c.id === conversationId)) {
            setCurrentConversationId(conversationId);
            localStorage.setItem('current-conversation-id', conversationId);
        }
    };

    // Delete conversation
    const deleteConversation = conversationId => {
        const updatedConversations = conversations.filter(
            c => c.id !== conversationId
        );
        setConversations(updatedConversations);

        if (currentConversationId === conversationId) {
            const newCurrentId =
                updatedConversations.length > 0
                    ? updatedConversations[0].id
                    : null;
            setCurrentConversationId(newCurrentId);
            if (newCurrentId) {
                localStorage.setItem('current-conversation-id', newCurrentId);
            } else {
                localStorage.removeItem('current-conversation-id');
            }
        }

        saveConversations(updatedConversations);

        // If no conversations left, create a new one
        if (updatedConversations.length === 0) {
            createNewConversation();
        }
    };

    // Clear all conversations
    const clearAllConversations = () => {
        setConversations([]);
        setCurrentConversationId(null);
        localStorage.removeItem('ai-conversations');
        localStorage.removeItem('current-conversation-id');
        createNewConversation();
    };

    // Get current conversation as a computed value
    const currentConversation =
        conversations.find(c => c.id === currentConversationId) || null;

    return {
        conversations,
        currentConversationId,
        currentConversation,
        getCurrentConversation,
        createNewConversation,
        addMessage,
        updateMessage,
        switchConversation,
        deleteConversation,
        clearAllConversations,
        isConversationEmpty,
    };
};
