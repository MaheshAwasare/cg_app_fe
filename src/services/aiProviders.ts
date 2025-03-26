import { AIProvider, PromptTemplate } from '../types';
import { promptTemplates } from '../utils/promptTemplates';
import { textGeneration } from "@huggingface/inference";
// Base prompt template that will be used across all providers
const getBasePrompt = (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  console.log("Prompt Template selected ", promptTemplates[template])
  if (template !== 'default' && promptTemplates[template]) {
   
    const customTemplate = promptTemplates[template]
   
      .replace(/\[concept\/topic\]/g, query)
      .trim();
    
    return `
You are ConceptGood, an expert at explaining complex concepts simply. You are explaining it to a ${complexityAdjustment}.

Your goal is to help someone understand ${query}  through a carefully structured explanation.

Use the following template format for your explanation:
${customTemplate}

Format your response in Markdown.  Avoid technical terms unless user is expert and unless absolutely necessary, and when used, explain them immediately with a 
comparison to everyday objects or experiences.
`;
  }
  
  // Default template with proper markdown formatting
  return `
You are ConceptGood, an expert at explaining complex concepts simply. Your goal is to help someone understand ${query} in exactly 2 minutes through a carefully structured explanation.

Use this exact format for your response, including the markdown headers and time ranges:

## What It Is (0-10 seconds)
[One clear sentence definition with absolutely no jargon, followed by a suggestion for a simple visual]

## The Everyday Analogy (10-30 seconds)
[Create a relatable analogy comparing the concept to a common experience everyone has had]

## Core Principles (30-60 seconds)
[First key principle with a simple everyday comparison]

[Second key principle with a simple everyday comparison]

[Third key principle with a simple everyday comparison]

## Real-World Application (60-90 seconds)
[One concrete example of how this concept is already being used in the world in a way that affects people's lives]

## Common Misconception Cleared (90-110 seconds)
[Address the most widespread misunderstanding about this concept]

## Quick Practical Takeaway (110-120 seconds)
[How understanding this concept might benefit the person in their lifetime]

## Want to go deeper?
[Three specific suggestions for next learning steps]

Format your response exactly as shown above, keeping the markdown headers (##) and time ranges. Use simple language a 12-year-old could understand. ${complexityAdjustment} Avoid technical terms unless absolutely necessary, and when used, explain them immediately with a comparison to everyday objects or experiences.
`;
};

// Local Ollama API
export const fetchFromOllama = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-r1:14b',
      prompt: getBasePrompt(query, complexityAdjustment, template),
      stream: false
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch from Ollama API');
  }
  
  const data = await response.json();
  return data.response;
};

// Google Gemini API
export const fetchFromGoogle = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  // This would use the Google Gemini API in a production environment
  // For now, we'll simulate a response with a message
  if (template === 'storytelling') {
    return `## The Spark (0-30 seconds)
Let me tell you a story. Once upon a time, there was a curious student facing a challenge: understanding ${query}. They needed to find a way to grasp this concept quickly and effectively.

## The Discovery (30-60 seconds)
Then, they stumbled upon a simple explanation of ${query}. It was like a hidden key that unlocked a new understanding. They learned that ${query} is fundamentally about organizing information in a way that makes connections clear and accessible.

## The Transformation (60-90 seconds)
Using this new understanding of ${query}, the student was able to apply it to their studies and see immediate improvements. They learned that breaking complex ideas into simpler parts makes learning easier and realized that this approach could work for any difficult concept.

## A Modern Parallel (90-110 seconds)
This isn't just a story. Today, we see ${query} in action when teachers use visual aids and analogies to explain difficult subjects. Just like in the story, it helps us transform confusion into clarity.

## Your Takeaway (110-120 seconds)
Remember, ${query} is about making the complex simple. Think of it as your own key to unlocking understanding of difficult topics you encounter in school, work, or life.

## To Learn More
- Find similar stories of how people have mastered ${query}
- Reflect on how ${query} might apply to subjects you're currently studying
- Discuss ${query} with teachers or mentors who can share their experiences`;
  } else {
    return `## What It Is (0-10 seconds)
${query} is a concept that helps us understand how information is organized and processed. Imagine a diagram showing connected dots representing ideas.

## The Everyday Analogy (10-30 seconds)
Think of ${query} like organizing your kitchen. Just as you group similar items together (utensils in one drawer, plates in another), ${query} helps us group and connect related information.

## Core Principles (30-60 seconds)
First, ${query} involves categorization - putting similar things together, like sorting your laundry into colors and whites.

Second, ${query} requires connections - linking related ideas, similar to how a recipe connects ingredients to create a meal.

Third, ${query} needs structure - arranging information in a logical order, like how a story has a beginning, middle, and end.

## Real-World Application (60-90 seconds)
${query} is used in modern search engines. When you search for something online, the search engine uses ${query} to find the most relevant information and present it to you in a useful way.

## Common Misconception Cleared (90-110 seconds)
Many people think ${query} is only about memorizing facts, but it's actually about understanding relationships between ideas. It's not about how much you know, but how well you connect what you know.

## Quick Practical Takeaway (110-120 seconds)
Understanding ${query} can help you learn new subjects more effectively by connecting new information to what you already know, making it easier to remember and apply.

## Want to go deeper?
- Explore cognitive mapping techniques
- Learn about knowledge graphs
- Study information architecture basics`;
  }
};
export const fetchFromHuggingFace = async (
  query: string, 
  complexityAdjustment: string, 
  template: PromptTemplate
) => {
  try {
     
    // Get model name from environment or use a default
    const modelName ='meta-llama/Meta-Llama-3-8B-Instruct';
    
    // Use the internal method to format the system prompt
    const formattedPrompt = getBasePrompt(query, complexityAdjustment, template);
    console.log(formattedPrompt)
    // Make the API call using textGeneration
    const response = await textGeneration({
      model: modelName,
      inputs: formattedPrompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
      },
      apiToken: "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", // Make sure this is set in your environment
    });

    return response.generated_text;
  } catch (error) {
    console.error('Error fetching from Hugging Face:', error);
    throw error;
  }
};


// OpenAI API
  export const fetchFromOpenAI = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
    // This would use the OpenAI API in a production environment
    // For now, we'll simulate a response with a message
    if (template === 'buildingBlocks') {
      return `## The Foundation (0-30 seconds)
  Every complex idea is built from simpler parts. Let's look at ${query}. At its core, it's made up of basic principles that anyone can understand. The most fundamental element is the concept of organization - arranging information in a logical way.

  ## The Second Layer (30-60 seconds)
  Then, we add the element of relationships. This is where we see how different pieces of information connect to each other. It's like adding a layer to a building, each one supporting the next. These relationships help us see patterns and make predictions.

  ## The Connecting Element (60-90 seconds)
  The glue that holds everything together is context. This shows how the organization and relationships exist within a specific situation or environment. Without context, the whole structure wouldn't make sense. Context helps us understand when and how to apply our knowledge.

  ## Putting It Together (90-110 seconds)
  When we combine these three elements, we get ${query} in action. For example, when you're learning a new subject in school, you organize the facts, understand how they relate to each other, and see how they apply in different contexts. You can see how each part plays a crucial role.

  ## Your First Step (110-120 seconds)
  To understand ${query} better, focus on mastering the skill of organization. Once you grasp that, the relationships and context will fall into place more easily.

  ## Further Study
  - Break down other complex ideas into their fundamental components
  - Practice identifying the relationships between different parts of a system
  - Create a visual representation of the building blocks of ${query}`;
    } else {
      return `## What It Is (0-10 seconds)
  ${query} is a way to solve problems by breaking them down into smaller, manageable steps. Picture a flowchart with decision points and arrows showing the path forward.

  ## The Everyday Analogy (10-30 seconds)
  ${query} is like following a recipe when cooking. You start with ingredients (your problem), follow a series of steps (your approach), and end with a finished dish (your solution).

  ## Core Principles (30-60 seconds)
  First, ${query} requires clear definition - understanding exactly what problem you're trying to solve, like knowing what dish you want to cook before starting.

  Second, ${query} uses decomposition - breaking big problems into smaller ones, similar to how you might tackle cleaning your entire house by focusing on one room at a time.

  Third, ${query} involves pattern recognition - identifying similarities to problems you've solved before, like recognizing that a new recipe uses techniques you've already mastered.

  ## Real-World Application (60-90 seconds)
  ${query} is used by navigation apps to find the fastest route to your destination. The app breaks down the journey into segments, considers traffic patterns, and calculates the optimal path.

  ## Common Misconception Cleared (90-110 seconds)
  People often think ${query} is only for mathematicians or programmers, but we all use it daily when we plan our schedules, organize tasks, or figure out the best way to accomplish something.

  ## Quick Practical Takeaway (110-120 seconds)
  By consciously applying ${query} to challenges in your life, you can make better decisions, solve problems more efficiently, and reduce the feeling of being overwhelmed by complex situations.

  ## Want to go deeper?
  - Learn about computational thinking
  - Explore decision tree analysis
  - Study problem-solving frameworks`;
    }
  };

// Anthropic Claude API
export const fetchFromClaude = async (query: string, complexityAdjustment: string, template: PromptTemplate) => {
  // This would use the Anthropic Claude API in a production environment
  // For now, we'll simulate a response with a message
  if (template === 'questionAnswer') {
    return `## The Big Question (0-30 seconds)
Have you ever wondered how ${query} actually works? It's a question that many people ask, and understanding it provides a powerful foundation for learning.

## The Simple Answer (30-60 seconds)
In simple terms, ${query} means organizing information in a way that makes it easier to understand and remember. It's essentially about creating connections between ideas so you can see how they relate to each other.

## Why Does It Matter? (60-90 seconds)
You might be thinking, "So what?" Well, ${query} matters because it's the foundation of effective learning. It helps us to move beyond memorizing facts to truly understanding concepts and how they connect to each other.

## A Real-World Example (90-110 seconds)
Let's look at a real example. When students use mind maps to study for exams, they're applying ${query}. They put the main topic in the center and branch out to related subtopics, creating a visual representation of how ideas connect. This demonstrates how ${query} works in practice and why it's important.

## Your Key Insight (110-120 seconds)
The main takeaway is that ${query} is about making connections, not just collecting facts. Next time you're learning something new, remember to apply ${query} by looking for relationships between new information and what you already know.

## Where to Learn More
- Look for tutorials on mind mapping and concept mapping
- Explore learning techniques that emphasize connections between ideas
- Find videos explaining how memory works and how we organize information`;
  } else {
    return `## What It Is (0-10 seconds)
${query} is a method for making sense of complex information by finding patterns and connections. Imagine a map showing how different ideas relate to each other.

## The Everyday Analogy (10-30 seconds)
${query} works like organizing a library. Books (information) are categorized by subject, author, and other attributes so you can easily find what you need and understand how different books relate to each other.

## Core Principles (30-60 seconds)
First, ${query} involves observation - carefully noticing details, like a detective collecting clues at a crime scene.

Second, ${query} requires interpretation - making sense of what you observe, similar to how you might interpret someone's tone of voice to understand their feelings.

Third, ${query} needs synthesis - combining different pieces of information to form a complete picture, like assembling puzzle pieces to see the whole image.

## Real-World Application (60-90 seconds)
${query} is used in medical diagnosis. Doctors collect symptoms (data points), interpret them based on medical knowledge, and synthesize a diagnosis that explains the patient's condition.

## Common Misconception Cleared (90-110 seconds)
Many believe ${query} is purely objective and free from bias, but it's always influenced by our existing knowledge and perspectives. Like looking through colored glasses, our background affects how we interpret information.

## Quick Practical Takeaway (110-120 seconds)
By improving your ${query} skills, you can make better decisions in everyday life, from evaluating news sources to understanding complex social issues or making important personal choices.

## Want to go deeper?
- Study critical thinking techniques
- Explore data visualization methods
- Learn about cognitive biases and how they affect analysis`;
  }
};

// Function to get the appropriate API based on the provider
export const getAIResponse = async (query: string, provider: AIProvider, complexityAdjustment: string, template: PromptTemplate = 'default') => {
  switch (provider) {
    case 'local-ollama':
      return fetchFromOllama(query, complexityAdjustment, template);
    case 'remote-google':
      return fetchFromHuggingFace(query, complexityAdjustment, template);
    case 'remote-openai':
      return fetchFromOpenAI(query, complexityAdjustment, template);
    case 'remote-claude':
      return fetchFromClaude(query, complexityAdjustment, template);
    default:
      throw new Error('Invalid AI provider');
  }
};