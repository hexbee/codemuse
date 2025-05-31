class OpenAIService {
    constructor(config) {
        this.config = config;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    async sendMessage(
        messages,
        onChunk = null,
        onComplete = null,
        onError = null
    ) {
        try {
            console.log('OpenAI Service - Starting request');
            console.log('Config:', {
                baseUrl: this.config.baseUrl,
                model: this.config.model,
                hasApiKey: !!this.config.apiKey,
                maxTokens: this.config.maxTokens,
                temperature: this.config.temperature,
            });

            if (!this.config.apiKey) {
                throw new Error('API Key is required');
            }

            const apiMessages = messages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content,
            }));

            console.log('API Messages:', apiMessages);

            const requestBody = {
                model: this.config.model,
                messages: apiMessages,
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                stream: true,
            };

            console.log('Request body:', requestBody);

            const response = await fetch(
                `${this.config.baseUrl}/chat/completions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.config.apiKey}`,
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            console.log('Response status:', response.status);
            console.log(
                'Response headers:',
                Object.fromEntries(response.headers.entries())
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error?.message ||
                        `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);

                            if (data === '[DONE]') {
                                if (onComplete) onComplete(fullContent);
                                return fullContent;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                const content =
                                    parsed.choices?.[0]?.delta?.content;

                                if (content) {
                                    fullContent += content;
                                    if (onChunk) onChunk(content, fullContent);
                                }
                            } catch {
                                // Ignore parsing errors for incomplete chunks
                                continue;
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }

            if (onComplete) onComplete(fullContent);
            return fullContent;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            if (onError) onError(error);
            throw error;
        }
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.config.baseUrl}/models`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error?.message ||
                        `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();
            return {
                success: true,
                models: data.data || [],
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Helper method to format messages for API
    formatMessagesForAPI(messages) {
        return messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content,
        }));
    }

    // Helper method to estimate token count (rough approximation)
    estimateTokens(text) {
        // Rough estimation: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    }

    // Helper method to truncate conversation history if too long
    truncateMessages(messages, maxTokens = 3000) {
        let totalTokens = 0;
        const truncatedMessages = [];

        // Always keep the system message if it exists
        if (messages.length > 0 && messages[0].type === 'system') {
            truncatedMessages.push(messages[0]);
            totalTokens += this.estimateTokens(messages[0].content);
        }

        // Add messages from the end (most recent first)
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            if (message.type === 'system') continue; // Skip system message as it's already added

            const messageTokens = this.estimateTokens(message.content);

            if (totalTokens + messageTokens > maxTokens) {
                break;
            }

            truncatedMessages.unshift(message);
            totalTokens += messageTokens;
        }

        return truncatedMessages;
    }
}

export default OpenAIService;
