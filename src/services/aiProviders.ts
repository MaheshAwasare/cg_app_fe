import { AIProvider, PromptTemplate } from '../types';
import { promptTemplates } from '../utils/promptTemplates';
import axios from 'axios';

// Base prompt template that will be used across all providers
const getBasePrompt = (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  if (template !== 'default' && promptTemplates[template]) {
    const customTemplate = promptTemplates[template]
      .replace(/\[concept\/topic\]/g, query)
      .trim();
    
    return `
You are ConceptGood, an expert at explaining complex concepts simply. You are explaining it to a ${complexityAdjustment}.

Your goal is to help someone understand ${query} through a carefully structured explanation.

Use the following template format for your explanation:
${customTemplate}

Format your response in Markdown. Avoid technical terms unless user is expert and unless absolutely necessary, and when used, explain them immediately with a 
comparison to everyday objects or experiences.
`;
  }
  
  // Default template with proper markdown formatting
  return `
You are ConceptGood, an expert at explaining complex concepts simply. Your goal is to help someone understand ${query}  through a carefully structured explanation.

Use this exact format for your response, including the markdown headers and time ranges:

## What It Is
[One clear sentence definition with absolutely no jargon, followed by a suggestion for a simple visual]

## The Everyday Analogy 
[Create a relatable analogy comparing the concept to a common experience everyone has had]

## Core Principles
[First key principle with a simple everyday comparison]

[Second key principle with a simple everyday comparison]

[Third key principle with a simple everyday comparison]

## Real-World Application 
[One concrete example of how this concept is already being used in the world in a way that affects people's lives]

## Common Misconception Cleared 
[Address the most widespread misunderstanding about this concept]

## Quick Practical Takeaway 
[How understanding this concept might benefit the person in their lifetime]

## Want to go deeper?
[Three specific suggestions for next learning steps]

Format your response exactly as shown above, keeping the markdown headers (##) and time ranges. Use simple language a 12-year-old could understand. ${complexityAdjustment} Avoid technical terms unless absolutely necessary, and when used, explain them immediately with a comparison to everyday objects or experiences.
`;
};

// Function to call the backend API
const callBackendAPI = async (prompt: string, query:string,template:string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/ai/aiResponseGoogle', {
      prompt,
      query,
      template
    });
    return response.data.response;
  } catch (error) {
    console.error('Error calling backend API:', error);
    throw new Error('Failed to generate explanation');
  }
};

// Local Ollama API
export const fetchFromOllama = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  const prompt = getBasePrompt(query, complexityAdjustment, template);
  return callBackendAPI(prompt,query,template);
};

// Google Gemini API
export const fetchFromGoogle = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  const prompt = getBasePrompt(query, complexityAdjustment, template);
  return callBackendAPI(prompt,query,template);
};

// OpenAI API
export const fetchFromOpenAI = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  const prompt = getBasePrompt(query, complexityAdjustment, template);
  return callBackendAPI(prompt,query,template);
};

// Anthropic Claude API
export const fetchFromClaude = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  const prompt = getBasePrompt(query, complexityAdjustment, template);
  return callBackendAPI(prompt,query,template);
};

// Function to get the appropriate API based on the provider
export const getAIResponse = async (query: string, provider: AIProvider, complexityAdjustment: string, template: PromptTemplate = 'default') => {
  switch (provider) {
    case 'local-ollama':
      return fetchFromOllama(query, complexityAdjustment, template);
    case 'remote-google':
      return fetchFromGoogle(query, complexityAdjustment, template);
    case 'remote-openai':
      return fetchFromOpenAI(query, complexityAdjustment, template);
    case 'remote-claude':
      return fetchFromClaude(query, complexityAdjustment, template);
    default:
      throw new Error('Invalid AI provider');
  }
};