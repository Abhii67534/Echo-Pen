import { ChatGroq } from '@langchain/groq';

const apiKey =import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
    console.error('REACT_APP_GROQ_API_KEY is not defined! Check your .env file.');
}

export const llm = new ChatGroq({
    model: 'mixtral-8x7b-32768',
    temperature: 0.3,
    maxTokens: 200,
    maxRetries: 2,
    apiKey: apiKey,  // Pass the API key from the environment variable
});

