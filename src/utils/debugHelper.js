// Debug helper for AI chat functionality
export const debugAI = {
    // Check if AI configuration is valid
    checkConfig: config => {
        console.group('🔧 AI Configuration Check');
        console.log(
            'API Key:',
            config.apiKey ? `${config.apiKey.slice(0, 8)}...` : 'Not set'
        );
        console.log('Base URL:', config.baseUrl);
        console.log('Model:', config.model);
        console.log('Max Tokens:', config.maxTokens);
        console.log('Temperature:', config.temperature);

        const issues = [];
        if (!config.apiKey) issues.push('API Key is missing');
        if (!config.baseUrl) issues.push('Base URL is missing');
        if (!config.model) issues.push('Model is missing');

        if (issues.length > 0) {
            console.warn('Issues found:', issues);
        } else {
            console.log('✅ Configuration looks good');
        }
        console.groupEnd();

        return issues.length === 0;
    },

    // Check localStorage data
    checkStorage: () => {
        console.group('💾 Storage Check');

        const aiConfig = localStorage.getItem('ai-config');
        const conversations = localStorage.getItem('ai-conversations');
        const currentConvId = localStorage.getItem('current-conversation-id');

        console.log(
            'AI Config:',
            aiConfig ? JSON.parse(aiConfig) : 'Not found'
        );
        console.log(
            'Conversations:',
            conversations
                ? JSON.parse(conversations).length + ' conversations'
                : 'Not found'
        );
        console.log('Current Conversation ID:', currentConvId);

        console.groupEnd();
    },

    // Log API request details
    logAPIRequest: (url, headers, body) => {
        console.group('🌐 API Request');
        console.log('URL:', url);
        console.log('Headers:', headers);
        console.log('Body:', body);
        console.groupEnd();
    },

    // Log API response details
    logAPIResponse: (status, headers, data) => {
        console.group('📥 API Response');
        console.log('Status:', status);
        console.log('Headers:', headers);
        console.log('Data:', data);
        console.groupEnd();
    },

    // Test basic fetch functionality
    testFetch: async () => {
        console.group('🧪 Fetch Test');
        try {
            const response = await fetch('https://httpbin.org/json');
            const data = await response.json();
            console.log('✅ Fetch works:', data);
        } catch (error) {
            console.error('❌ Fetch failed:', error);
        }
        console.groupEnd();
    },

    // Clear all AI-related storage
    clearStorage: () => {
        console.log('🗑️ Clearing AI storage...');
        localStorage.removeItem('ai-config');
        localStorage.removeItem('ai-conversations');
        localStorage.removeItem('current-conversation-id');
        console.log('✅ Storage cleared');
    },

    // Export debug data
    exportDebugData: () => {
        const debugData = {
            timestamp: new Date().toISOString(),
            config: localStorage.getItem('ai-config'),
            conversations: localStorage.getItem('ai-conversations'),
            currentConversationId: localStorage.getItem(
                'current-conversation-id'
            ),
            userAgent: navigator.userAgent,
            url: window.location.href,
        };

        console.log('📋 Debug data:', debugData);

        // Copy to clipboard if possible
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(JSON.stringify(debugData, null, 2))
                .then(() => console.log('✅ Debug data copied to clipboard'))
                .catch(() => console.log('❌ Failed to copy to clipboard'));
        }

        return debugData;
    },
};

// Make it available globally for easy debugging
if (typeof window !== 'undefined') {
    window.debugAI = debugAI;
}
