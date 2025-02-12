import { Block, KnowledgeEntry, ConnectionContext } from '../types';
import { openai } from './openai';
import { searchKnowledgeBase } from './knowledgeSearch';

export class ContextManager {
  private static instance: ContextManager;
  private initialized: boolean = false;

  private constructor() {}

  static async initialize() {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    ContextManager.instance.initialized = true;
    return ContextManager.instance;
  }

  static async updateContextOnWorkflowCreation(analysis: any) {
    if (!this.instance?.initialized) {
      await this.initialize();
    }

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Analyze the workflow and generate initial context:
            ${JSON.stringify(analysis, null, 2)}
            
            Generate context that:
            1. Identifies key relationships
            2. Establishes data dependencies
            3. Suggests potential optimizations
            4. Notes important considerations
            
            Return a JSON object with the analysis.`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
      });

      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Error updating context on workflow creation:', error);
      return {};
    }
  }

  static async updateContextOnConnection(
    sourceBlock: Block,
    targetBlock: Block,
    knowledgeBase: KnowledgeEntry[]
  ): Promise<ConnectionContext> {
    if (!this.instance?.initialized) {
      await this.initialize();
    }

    try {
      // Search knowledge base for relevant entries
      const relevantEntries = await searchKnowledgeBase(
        `${sourceBlock.type} ${targetBlock.type} connection context`,
        knowledgeBase
      );

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Generate shared context for connected blocks:
            
            Source Block (${sourceBlock.type}):
            ${JSON.stringify(sourceBlock.data || {}, null, 2)}
            
            Target Block (${targetBlock.type}):
            ${JSON.stringify(targetBlock.data || {}, null, 2)}
            
            Knowledge Base Context:
            ${JSON.stringify(relevantEntries, null, 2)}
            
            Generate context that:
            1. Identifies shared concepts
            2. Establishes data flow
            3. Suggests optimizations
            4. Notes important considerations
            
            Return a JSON object with the shared context.`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No content generated');

      const context = JSON.parse(content);

      return {
        sourceBlock: context.sourceBlock || {},
        targetBlock: context.targetBlock || {},
        knowledgeBaseReferences: relevantEntries.map(entry => entry.id),
        insights: context.insights || [],
        sharedContext: {
          relevantData: context.relevantData || {},
          lastUpdated: new Date().toISOString(),
          status: 'active'
        }
      };
    } catch (error) {
      console.error('Error updating context on connection:', error);
      return {
        sourceBlock: {},
        targetBlock: {},
        knowledgeBaseReferences: [],
        insights: [],
        sharedContext: {
          relevantData: {},
          lastUpdated: new Date().toISOString(),
          status: 'active'
        }
      };
    }
  }

  static async updateContextOnDataChange(
    blocks: Block[],
    changedBlockId: string,
    knowledgeBase: KnowledgeEntry[]
  ): Promise<Block[]> {
    if (!this.instance?.initialized) {
      await this.initialize();
    }

    try {
      const changedBlock = blocks.find(b => b.id === changedBlockId);
      if (!changedBlock) return blocks;

      const connectedBlocks = blocks.filter(b => 
        b.connectedTo?.includes(changedBlockId) ||
        changedBlock.connectedTo?.includes(b.id)
      );

      const updates = await Promise.all(
        connectedBlocks.map(async block => {
          const context = await this.updateContextOnConnection(
            changedBlock,
            block,
            knowledgeBase
          );

          return {
            ...block,
            data: {
              ...block.data,
              ...context.targetBlock,
              _connections: {
                ...(block.data?._connections || {}),
                [changedBlockId]: {
                  type: changedBlock.type,
                  insights: context.insights,
                  knowledgeBaseRefs: context.knowledgeBaseReferences,
                  sharedContext: context.sharedContext
                }
              }
            }
          };
        })
      );

      return blocks.map(block => 
        updates.find(u => u.id === block.id) || block
      );
    } catch (error) {
      console.error('Error updating context on data change:', error);
      return blocks;
    }
  }
}