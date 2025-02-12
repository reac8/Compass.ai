import { openai } from './openai';

// Template interfaces
interface InterviewTemplate {
  objective: string;
  targetAudience: string;
  keyTopics: string[];
}

interface CompetitorTemplate {
  competitors: string[];
  metrics: string[];
  goals: string[];
}

interface TrendTemplate {
  focusArea: string;
  timeFrame: string;
  desiredInsights: string[];
}

interface InsightsTemplate {
  dataSource: string;
  themes: string[];
  goals: string[];
}

interface AffinityTemplate {
  dataInputs: string[];
  categories: string[];
  expectedOutput: string;
}

interface SmartGoalsTemplate {
  goalDescription: string;
  metrics: string[];
  timeFrame: string;
}

interface BrainstormTemplate {
  problemStatement: string;
  constraints: string[];
  desiredOutcome: string;
}

interface CharretteTemplate {
  topic: string;
  participants: string[];
  deliverables: string[];
}

interface ScamperTemplate {
  idea: string;
  prompts: string[];
  targetOutcome: string;
}

interface MindmapTemplate {
  centralIdea: string;
  relatedTopics: string[];
  connections: string[];
}

interface WireframeTemplate {
  interfaceType: string;
  elements: string[];
  layoutStyle: string;
}

interface PrototypeTemplate {
  idea: string;
  tools: string[];
  functionalities: string[];
}

interface UsabilityTemplate {
  product: string;
  tasks: string[];
  feedbackQuestions: string[];
}

interface FeedbackTemplate {
  source: string;
  themes: string[];
  format: string;
}

interface ScenarioTemplate {
  feature: string;
  persona: string;
  goals: string[];
}

interface ImpactTemplate {
  change: string;
  kpis: string[];
  targetAudience: string;
}

interface SentimentTemplate {
  source: string;
  breakdown: string[];
  format: string;
}

interface HorizonTemplate {
  industry: string;
  disruptions: string[];
  insights: string[];
}

// GPT Handler class
export class GPTHandler {
  private static async generateResponse(prompt: string, template: any): Promise<any> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI assistant helping with UX research and design tasks.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nTemplate data:\n${JSON.stringify(template, null, 2)}`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating GPT response:', error);
      throw error;
    }
  }

  // Research Phase handlers
  static async generateInterviewQuestions(template: InterviewTemplate) {
    const prompt = `Generate a list of interview questions to understand ${template.targetAudience}. 
    Ensure they are open-ended, conversational, and tailored to uncover insights about ${template.objective}.`;
    return this.generateResponse(prompt, template);
  }

  static async analyzeCompetitors(template: CompetitorTemplate) {
    const prompt = `Analyze competitors by identifying their strengths, weaknesses, key differentiators, and customer feedback. 
    Focus on the specified metrics and goals.`;
    return this.generateResponse(prompt, template);
  }

  static async analyzeTrends(template: TrendTemplate) {
    const prompt = `Identify emerging trends in ${template.focusArea}. 
    Highlight their relevance, potential impact, and examples of implementation.`;
    return this.generateResponse(prompt, template);
  }

  // Analysis Phase handlers
  static async analyzeInsights(template: InsightsTemplate) {
    const prompt = `Analyze the provided data source. Identify patterns, anomalies, and recurring themes to derive actionable insights.`;
    return this.generateResponse(prompt, template);
  }

  static async createAffinityMap(template: AffinityTemplate) {
    const prompt = `Group the provided data points into logical clusters. Use labels for each group based on common themes.`;
    return this.generateResponse(prompt, template);
  }

  static async createSmartGoals(template: SmartGoalsTemplate) {
    const prompt = `Create SMART goals for the project. Ensure the goals are Specific, Measurable, Achievable, Relevant, and Time-bound.`;
    return this.generateResponse(prompt, template);
  }

  // Ideate Phase handlers
  static async generateIdeas(template: BrainstormTemplate) {
    const prompt = `Generate creative ideas for the problem. Use lateral thinking techniques and push boundaries while considering constraints.`;
    return this.generateResponse(prompt, template);
  }

  static async facilitateCharrette(template: CharretteTemplate) {
    const prompt = `Facilitate a design charrette for the topic. Provide a framework for collaboration and sketches or storyboarding tools.`;
    return this.generateResponse(prompt, template);
  }

  static async applyScamper(template: ScamperTemplate) {
    const prompt = `Apply the SCAMPER technique to the idea. Explore how to Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, and Reverse elements.`;
    return this.generateResponse(prompt, template);
  }

  static async createMindmap(template: MindmapTemplate) {
    const prompt = `Create a mindmap for the central idea. Connect related concepts, subtopics, and ideas visually.`;
    return this.generateResponse(prompt, template);
  }

  // Prototype Phase handlers
  static async generateWireframe(template: WireframeTemplate) {
    const prompt = `Generate a low-fidelity wireframe description for the interface. Include the specified features and elements.`;
    return this.generateResponse(prompt, template);
  }

  static async suggestPrototype(template: PrototypeTemplate) {
    const prompt = `Suggest tools and steps to quickly prototype the idea. Focus on speed and functionality.`;
    return this.generateResponse(prompt, template);
  }

  // Test Phase handlers
  static async createUsabilityTest(template: UsabilityTemplate) {
    const prompt = `Create usability test scenarios for the product. Include participant instructions, tasks, and expected feedback.`;
    return this.generateResponse(prompt, template);
  }

  static async synthesizeFeedback(template: FeedbackTemplate) {
    const prompt = `Summarize user feedback from the source. Identify key themes, challenges, and opportunities.`;
    return this.generateResponse(prompt, template);
  }

  static async createScenarios(template: ScenarioTemplate) {
    const prompt = `Develop scenarios for testing the feature. Include user personas, tasks, and expected outcomes.`;
    return this.generateResponse(prompt, template);
  }

  // Measure Phase handlers
  static async analyzeImpact(template: ImpactTemplate) {
    const prompt = `Analyze the impact of the change on the target audience. Use KPIs and qualitative feedback.`;
    return this.generateResponse(prompt, template);
  }

  static async analyzeSentiment(template: SentimentTemplate) {
    const prompt = `Analyze customer sentiment data from the source. Identify positive, neutral, and negative themes.`;
    return this.generateResponse(prompt, template);
  }

  static async scanHorizon(template: HorizonTemplate) {
    const prompt = `Forecast long-term trends in the industry. Include potential disruptions, opportunities, and challenges.`;
    return this.generateResponse(prompt, template);
  }
}

// Export template types
export type {
  InterviewTemplate,
  CompetitorTemplate,
  TrendTemplate,
  InsightsTemplate,
  AffinityTemplate,
  SmartGoalsTemplate,
  BrainstormTemplate,
  CharretteTemplate,
  ScamperTemplate,
  MindmapTemplate,
  WireframeTemplate,
  PrototypeTemplate,
  UsabilityTemplate,
  FeedbackTemplate,
  ScenarioTemplate,
  ImpactTemplate,
  SentimentTemplate,
  HorizonTemplate
};