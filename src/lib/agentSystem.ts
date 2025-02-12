import { openai } from './openai';
import { Block, KnowledgeEntry, Position } from '../types';
import { searchKnowledgeBase } from './knowledgeSearch';
import { ContextManager } from './contextManager';

interface AgentAction {
  type: string;
  params: any;
  priority: number;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: number;
}

interface AgentMemory {
  shortTerm: {
    recentActions: AgentAction[];
    currentContext: any;
    activeGoals: string[];
  };
  longTerm: {
    userPreferences: { [key: string]: any };
    patterns: { [key: string]: number };
    successfulStrategies: AgentAction[];
  };
}

interface AgentCapability {
  name: string;
  description: string;
  requiredPermissions: string[];
  handler: (params: any) => Promise<any>;
}

export class AgentSystem {
  private memory: AgentMemory;
  private capabilities: Map<string, AgentCapability>;
  private actionQueue: AgentAction[];
  private isProcessing: boolean;
  private permissionLevel: 'read' | 'write' | 'admin';

  constructor(initialPermissionLevel: 'read' | 'write' | 'admin' = 'read') {
    this.memory = {
      shortTerm: {
        recentActions: [],
        currentContext: {},
        activeGoals: []
      },
      longTerm: {
        userPreferences: {},
        patterns: {},
        successfulStrategies: []
      }
    };
    this.capabilities = new Map();
    this.actionQueue = [];
    this.isProcessing = false;
    this.permissionLevel = initialPermissionLevel;

    // Initialize core capabilities
    this.registerCoreCapabilities();
  }

  private registerCoreCapabilities() {
    // Block Management
    this.registerCapability({
      name: 'createBlock',
      description: 'Create a new block in the workspace',
      requiredPermissions: ['write'],
      handler: async ({ type, title, position, data }) => {
        return {
          id: Math.random().toString(36).slice(2),
          type,
          title,
          description: '',
          position,
          data
        };
      }
    });

    this.registerCapability({
      name: 'updateBlock',
      description: 'Update an existing block',
      requiredPermissions: ['write'],
      handler: async ({ blockId, updates }) => {
        return { blockId, ...updates };
      }
    });

    this.registerCapability({
      name: 'connectBlocks',
      description: 'Create a connection between blocks',
      requiredPermissions: ['write'],
      handler: async ({ sourceId, targetId }) => {
        return { sourceId, targetId };
      }
    });

    // Context Analysis
    this.registerCapability({
      name: 'analyzeContext',
      description: 'Analyze current workspace context',
      requiredPermissions: ['read'],
      handler: async ({ blocks, selectedBlock, knowledgeBase }) => {
        return ContextManager.analyzeWorkspaceContext(blocks, selectedBlock, knowledgeBase);
      }
    });

    // Knowledge Base
    this.registerCapability({
      name: 'searchKnowledge',
      description: 'Search knowledge base for relevant information',
      requiredPermissions: ['read'],
      handler: async ({ query, entries }) => {
        return searchKnowledgeBase(query, entries);
      }
    });

    // Workflow Optimization
    this.registerCapability({
      name: 'optimizeWorkflow',
      description: 'Suggest workflow improvements',
      requiredPermissions: ['read'],
      handler: async ({ blocks, patterns }) => {
        return this.generateWorkflowSuggestions(blocks, patterns);
      }
    });
  }

  private async generateWorkflowSuggestions(blocks: Block[], patterns: any): Promise<any> {
    const prompt = `Analyze the current workspace and suggest optimizations:

Blocks: ${JSON.stringify(blocks)}
Usage Patterns: ${JSON.stringify(patterns)}

Generate suggestions for:
1. Block organization
2. Connection improvements
3. Workflow efficiency
4. Automation opportunities
5. Best practices

Return a JSON object with actionable recommendations.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  }

  public registerCapability(capability: AgentCapability) {
    this.capabilities.set(capability.name, capability);
  }

  public async processUserInput(
    input: string,
    context: {
      blocks: Block[];
      selectedBlock: Block | null;
      knowledgeBase: KnowledgeEntry[];
    }
  ): Promise<any> {
    try {
      // Analyze user intent
      const intent = await this.analyzeIntent(input, context);

      // Generate action plan
      const actions = await this.planActions(intent, context);

      // Queue actions
      actions.forEach(action => this.queueAction(action));

      // Process action queue
      return this.processActionQueue();
    } catch (error) {
      console.error('Error processing user input:', error);
      throw error;
    }
  }

  private async analyzeIntent(
    input: string,
    context: any
  ): Promise<any> {
    const prompt = `Analyze user intent from this input:

Input: ${input}

Current Context:
${JSON.stringify(context, null, 2)}

Determine:
1. Primary goal
2. Required actions
3. Priority level
4. Required capabilities
5. Potential constraints

Return a JSON object with the analysis.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  }

  private async planActions(intent: any, context: any): Promise<AgentAction[]> {
    const prompt = `Plan actions to fulfill this intent:

Intent: ${JSON.stringify(intent)}

Available Capabilities:
${Array.from(this.capabilities.keys()).join('\n')}

Current Context:
${JSON.stringify(context, null, 2)}

Generate a sequence of actions that:
1. Efficiently achieves the goal
2. Respects system constraints
3. Maintains data integrity
4. Follows best practices

Return a JSON array of actions with types and parameters.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
    });

    const actions = JSON.parse(completion.choices[0]?.message?.content || '[]');
    return actions.map((action: any) => ({
      ...action,
      status: 'pending',
      timestamp: Date.now()
    }));
  }

  private queueAction(action: AgentAction) {
    // Check permissions
    const capability = this.capabilities.get(action.type);
    if (!capability) {
      throw new Error(`Unknown action type: ${action.type}`);
    }

    if (!this.hasPermission(capability.requiredPermissions)) {
      throw new Error(`Insufficient permissions for action: ${action.type}`);
    }

    // Add to queue
    this.actionQueue.push(action);
  }

  private async processActionQueue(): Promise<any> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const results = [];
    try {
      while (this.actionQueue.length > 0) {
        const action = this.actionQueue.shift();
        if (!action) continue;

        const capability = this.capabilities.get(action.type);
        if (!capability) continue;

        action.status = 'executing';
        try {
          const result = await capability.handler(action.params);
          action.status = 'completed';
          
          // Update memory
          this.memory.shortTerm.recentActions.push(action);
          if (this.memory.shortTerm.recentActions.length > 10) {
            this.memory.shortTerm.recentActions.shift();
          }

          results.push({ action, result });
        } catch (error) {
          action.status = 'failed';
          console.error(`Error executing action ${action.type}:`, error);
          throw error;
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return results;
  }

  private hasPermission(required: string[]): boolean {
    const permissionLevels = {
      'read': 1,
      'write': 2,
      'admin': 3
    };

    const userLevel = permissionLevels[this.permissionLevel];
    return required.every(perm => {
      const requiredLevel = permissionLevels[perm as keyof typeof permissionLevels];
      return userLevel >= requiredLevel;
    });
  }

  public updateContext(context: any) {
    this.memory.shortTerm.currentContext = context;
  }

  public learnFromAction(action: AgentAction, success: boolean) {
    if (success) {
      // Update pattern recognition
      this.memory.longTerm.patterns[action.type] = 
        (this.memory.longTerm.patterns[action.type] || 0) + 1;

      // Store successful strategy
      this.memory.longTerm.successfulStrategies.push(action);
      if (this.memory.longTerm.successfulStrategies.length > 100) {
        this.memory.longTerm.successfulStrategies.shift();
      }
    }
  }

  public setPermissionLevel(level: 'read' | 'write' | 'admin') {
    this.permissionLevel = level;
  }

  public getCapabilities(): string[] {
    return Array.from(this.capabilities.keys());
  }

  public getMemorySnapshot(): AgentMemory {
    return { ...this.memory };
  }
}