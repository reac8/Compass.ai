import { openai } from './openai';
import { KnowledgeEntry } from '../types';

export async function searchKnowledgeBase(
  query: string,
  entries: KnowledgeEntry[]
): Promise<KnowledgeEntry[]> {
  if (!entries || entries.length === 0) {
    return [];
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a knowledge base search expert. Given a search query and a list of entries, return the most relevant entries based on semantic similarity. Consider:
          1. Direct keyword matches
          2. Semantic relevance
          3. Context awareness
          4. Related concepts
          
          Format your response as a JSON array of entry IDs, ordered by relevance.`
        },
        {
          role: 'user',
          content: `Query: ${query}\n\nEntries: ${JSON.stringify(entries)}`
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.warn('No response from OpenAI, falling back to basic search');
      return fallbackSearch(query, entries);
    }

    try {
      const relevantIds = JSON.parse(content) as string[];
      return entries.filter(entry => relevantIds.includes(entry.id));
    } catch (parseError) {
      console.warn('Error parsing OpenAI response, falling back to basic search:', parseError);
      return fallbackSearch(query, entries);
    }
  } catch (error) {
    console.warn('Error searching knowledge base, falling back to basic search:', error);
    return fallbackSearch(query, entries);
  }
}

function fallbackSearch(query: string, entries: KnowledgeEntry[]): KnowledgeEntry[] {
  const searchTerms = query.toLowerCase().split(' ');
  return entries.filter(entry =>
    searchTerms.some(term =>
      entry.title.toLowerCase().includes(term) ||
      entry.content.toLowerCase().includes(term) ||
      entry.tags.some(tag => tag.toLowerCase().includes(term))
    )
  );
}

export async function suggestRelevantContent(
  blockContent: string,
  entries: KnowledgeEntry[]
): Promise<KnowledgeEntry[]> {
  if (!entries || entries.length === 0) {
    return [];
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a knowledge base recommendation expert. Given the content of a canvas block and a list of knowledge base entries, suggest the most relevant entries that could help the user. Consider:
          1. Content similarity
          2. Related concepts
          3. Potential applications
          4. Historical precedents
          
          Format your response as a JSON array of entry IDs, ordered by relevance.`
        },
        {
          role: 'user',
          content: `Block Content: ${blockContent}\n\nEntries: ${JSON.stringify(entries)}`
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    try {
      const relevantIds = JSON.parse(content) as string[];
      return entries.filter(entry => relevantIds.includes(entry.id));
    } catch (parseError) {
      console.warn('Error parsing OpenAI response:', parseError);
      return [];
    }
  } catch (error) {
    console.warn('Error suggesting relevant content:', error);
    return [];
  }
}