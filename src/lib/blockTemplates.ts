import { GPTHandler } from './gptTemplates';
import { BLOCK_TYPES } from './constants';

export const blockTemplates = {
  // Research Phase
  'interview-micro': {
    title: BLOCK_TYPES.interviewGenerator,
    fields: {
      objective: {
        type: 'text',
        label: 'Objective of the interview',
        placeholder: 'What do you want to learn from these interviews?'
      },
      targetAudience: {
        type: 'text',
        label: 'Target audience',
        placeholder: 'Who are you interviewing?'
      },
      keyTopics: {
        type: 'array',
        label: 'Key topics to explore',
        placeholder: 'Add a topic to explore'
      }
    },
    handler: GPTHandler.generateInterviewQuestions
  },

  'competitor-analysis-gpt': {
    title: BLOCK_TYPES.marketAnalysis,
    fields: {
      competitors: {
        type: 'array',
        label: 'Competitors to analyze',
        placeholder: 'Add a competitor'
      },
      metrics: {
        type: 'array',
        label: 'Metrics to assess',
        placeholder: 'Add a metric'
      },
      goals: {
        type: 'array',
        label: 'Goals of analysis',
        placeholder: 'Add a goal'
      }
    },
    handler: GPTHandler.analyzeCompetitors
  },

  // Add all other block templates...
  // Each template should include:
  // - title from BLOCK_TYPES
  // - fields configuration
  // - handler from GPTHandler
};

export type BlockTemplate = {
  title: string;
  fields: {
    [key: string]: {
      type: 'text' | 'array' | 'select';
      label: string;
      placeholder?: string;
      options?: string[];
    };
  };
  handler: Function;
};