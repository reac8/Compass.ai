import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Only for demo purposes
});