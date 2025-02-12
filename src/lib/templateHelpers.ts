import { openai } from './openai';

// Common interfaces for all templates
export interface TemplateData {
  sections: {
    id: string;
    title: string;
    description: string;
    blocks: any[];
  }[];
}

export interface AIGenerationConfig {
  systemPrompt: string;
  responseFormat: string;
  temperature?: number;
  maxTokens?: number;
}

// AI generation helper
export async function generateWithAI(
  prompt: string,
  config: AIGenerationConfig
): Promise<any> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: config.systemPrompt
        },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content generated');

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Template configurations for each block type
export const templateConfigs: Record<string, AIGenerationConfig> = {
  // Research Phase
  interviewGenerator: {
    systemPrompt: `You are an expert UX researcher specializing in creating interview guides. Generate a comprehensive interview guide that includes:
    - Clear research objectives
    - Structured sections (intro, main topics, closing)
    - Open-ended questions
    - Follow-up prompts
    - Time estimates`,
    responseFormat: `{
      "overview": {
        "objective": string,
        "duration": string,
        "participant": string,
        "preparation": string
      },
      "sections": [
        {
          "id": string,
          "title": string,
          "description": string,
          "questions": [
            {
              "id": string,
              "content": string,
              "timeEstimate": string,
              "notes": string
            }
          ]
        }
      ]
    }`
  },

  marketAnalysis: {
    systemPrompt: `You are a market research expert. Generate a comprehensive market analysis framework that includes:
    - Industry overview
    - Competitor analysis
    - Market trends
    - Opportunities and threats`,
    responseFormat: `{
      "overview": {
        "industry": string,
        "scope": string,
        "timeframe": string,
        "objectives": string
      },
      "competitors": [{ "id": string, "content": string }],
      "strengths": [{ "id": string, "content": string }],
      "weaknesses": [{ "id": string, "content": string }],
      "opportunities": [{ "id": string, "content": string }],
      "threats": [{ "id": string, "content": string }],
      "strategies": [{ "id": string, "content": string }]
    }`
  },

  personaBuilder: {
    systemPrompt: `You are an expert in creating user personas. Generate a detailed persona that includes:
    - Demographic information
    - Goals and motivations
    - Pain points and needs
    - Behaviors and preferences`,
    responseFormat: `{
      "profile": {
        "name": string,
        "age": string,
        "occupation": string,
        "location": string,
        "bio": string
      },
      "goals": [{ "id": string, "content": string }],
      "painPoints": [{ "id": string, "content": string }],
      "behaviors": [{ "id": string, "content": string }],
      "needs": [{ "id": string, "content": string }],
      "influences": [{ "id": string, "content": string }]
    }`
  },

  // Analysis Phase
  empathyMapper: {
    systemPrompt: `You are an expert in empathy mapping. Generate a comprehensive empathy map that includes:
    - What users think and feel
    - What they see and hear
    - What they say and do
    - Pain points and gains`,
    responseFormat: `{
      "thinks": [{ "id": string, "content": string }],
      "feels": [{ "id": string, "content": string }],
      "says": [{ "id": string, "content": string }],
      "does": [{ "id": string, "content": string }]
    }`
  },

  swotAnalyzer: {
    systemPrompt: `You are a strategic analysis expert. Generate a SWOT analysis that includes:
    - Internal strengths
    - Internal weaknesses
    - External opportunities
    - External threats`,
    responseFormat: `{
      "strengths": [{ "id": string, "content": string }],
      "weaknesses": [{ "id": string, "content": string }],
      "opportunities": [{ "id": string, "content": string }],
      "threats": [{ "id": string, "content": string }]
    }`
  },

  affinityMapper: {
    systemPrompt: `You are an expert in organizing research data. Generate an affinity mapping structure that includes:
    - Data grouping suggestions
    - Theme identification
    - Pattern recognition
    - Insight generation`,
    responseFormat: `{
      "groups": [
        {
          "id": string,
          "name": string,
          "description": string,
          "items": [{ "id": string, "content": string }],
          "themes": [{ "id": string, "content": string }],
          "insights": [{ "id": string, "content": string }]
        }
      ]
    }`
  },

  // Ideate Phase
  ideaGenerator: {
    systemPrompt: `You are an innovation expert. Generate creative ideas that include:
    - Problem solving approaches
    - Feature suggestions
    - Implementation considerations
    - Success metrics`,
    responseFormat: `{
      "ideas": [
        {
          "id": string,
          "title": string,
          "description": string,
          "impact": "low" | "medium" | "high",
          "feasibility": "low" | "medium" | "high",
          "pros": string[],
          "cons": string[]
        }
      ]
    }`
  },

  designSprint: {
    systemPrompt: `You are a design sprint facilitator. Generate a sprint plan that includes:
    - Daily activities
    - Workshop exercises
    - Time allocations
    - Expected outcomes`,
    responseFormat: `{
      "overview": {
        "challenge": string,
        "team": string,
        "duration": string,
        "objectives": string
      },
      "days": [
        {
          "id": string,
          "name": string,
          "activities": [
            {
              "id": string,
              "title": string,
              "duration": string,
              "description": string,
              "materials": string[],
              "outcomes": string[]
            }
          ]
        }
      ]
    }`
  },

  mindMapper: {
    systemPrompt: `You are an expert in mind mapping. Generate a mind map structure that includes:
    - Central theme
    - Main branches
    - Sub-topics
    - Connections`,
    responseFormat: `{
      "central": {
        "id": string,
        "content": string
      },
      "branches": [
        {
          "id": string,
          "content": string,
          "children": [
            {
              "id": string,
              "content": string
            }
          ]
        }
      ]
    }`
  },

  // Add configurations for remaining blocks...
  // Each configuration should include:
  // 1. System prompt that defines the AI's role and output expectations
  // 2. Response format that matches the block's data structure
  // 3. Any specific parameters needed for that block type
};

// Default template data for each block type
export const defaultTemplateData: Record<string, any> = {
  interviewGenerator: {
    overview: {
      objective: '',
      duration: '',
      participant: '',
      preparation: ''
    },
    sections: [
      {
        id: '1',
        title: 'Introduction',
        description: 'Build rapport and set context',
        questions: [
          { id: '1', content: '', timeEstimate: '5m', notes: '' }
        ]
      }
    ]
  },
  // Add default data for other block types...
};

// Helper to get template configuration
export function getTemplateConfig(blockType: string): AIGenerationConfig {
  return templateConfigs[blockType] || {
    systemPrompt: 'Generate content for the template.',
    responseFormat: '{ "content": string }'
  };
}

// Helper to get default data
export function getDefaultData(blockType: string): any {
  return defaultTemplateData[blockType] || {};
}