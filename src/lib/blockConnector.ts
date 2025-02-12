import { openai } from './openai';
import { Block, KnowledgeEntry, ConnectionContext } from '../types';
import { searchKnowledgeBase } from './knowledgeSearch';
import { ContextManager } from './contextManager';

export async function connectBlocks(
  sourceBlock: Block,
  targetBlock: Block,
  knowledgeBase: KnowledgeEntry[]
): Promise<ConnectionContext> {
  try {
    // Generate shared context between blocks
    const context = await ContextManager.updateContextOnConnection(
      sourceBlock,
      targetBlock,
      knowledgeBase
    );

    // Generate block-specific updates based on shared context
    const prompt = `Given two connected blocks and their shared context:

Source Block (${sourceBlock.type}):
${JSON.stringify(sourceBlock.data || {}, null, 2)}

Target Block (${targetBlock.type}):
${JSON.stringify(targetBlock.data || {}, null, 2)}

Shared Context:
${JSON.stringify(context, null, 2)}

Generate updates for both blocks that:
1. Incorporate the shared context
2. Enhance their data based on the connection
3. Maintain consistency with their respective purposes
4. Utilize relevant knowledge base insights

Return a JSON object with updates for both blocks.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content received from OpenAI');

    const updates = JSON.parse(content);

    return {
      sourceBlock: {
        ...updates.sourceBlock,
        _connections: {
          [targetBlock.id]: {
            type: targetBlock.type,
            insights: context.insights,
            knowledgeBaseRefs: context.knowledgeBaseReferences,
            sharedContext: context.sharedContext
          }
        }
      },
      targetBlock: {
        ...updates.targetBlock,
        _connections: {
          [sourceBlock.id]: {
            type: sourceBlock.type,
            insights: context.insights,
            knowledgeBaseRefs: context.knowledgeBaseReferences,
            sharedContext: context.sharedContext
          }
        }
      },
      knowledgeBaseReferences: context.knowledgeBaseReferences,
      insights: context.insights,
      sharedContext: context.sharedContext
    };
  } catch (error) {
    console.error('Error connecting blocks:', error);
    throw error;
  }
}

export async function updateConnectedBlocks(
  blocks: Block[],
  knowledgeBase: KnowledgeEntry[]
): Promise<Block[]> {
  const updatedBlocks = [...blocks];
  const processedConnections = new Set<string>();

  for (const block of blocks) {
    if (!block.connectedTo) continue;

    for (const targetId of block.connectedTo) {
      const connectionId = [block.id, targetId].sort().join('-');
      if (processedConnections.has(connectionId)) continue;

      const targetBlock = blocks.find(b => b.id === targetId);
      if (!targetBlock) continue;

      try {
        const context = await connectBlocks(block, targetBlock, knowledgeBase);

        // Update both blocks with new context
        const sourceIndex = updatedBlocks.findIndex(b => b.id === block.id);
        const targetIndex = updatedBlocks.findIndex(b => b.id === targetId);

        if (sourceIndex !== -1) {
          updatedBlocks[sourceIndex] = {
            ...updatedBlocks[sourceIndex],
            data: context.sourceBlock
          };
        }

        if (targetIndex !== -1) {
          updatedBlocks[targetIndex] = {
            ...updatedBlocks[targetIndex],
            data: context.targetBlock
          };
        }

        processedConnections.add(connectionId);
      } catch (error) {
        console.error('Error updating connected blocks:', error);
      }
    }
  }

  return updatedBlocks;
}

export async function updateBlockContext(
  blocks: Block[],
  changedBlockId: string,
  knowledgeBase: KnowledgeEntry[]
): Promise<Block[]> {
  return ContextManager.updateContextOnDataChange(blocks, changedBlockId, knowledgeBase);
}