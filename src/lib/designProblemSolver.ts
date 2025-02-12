import { openai } from './openai';
import { Block, KnowledgeEntry, Position } from '../types';
import { BLOCK_TYPES } from './constants';
import { searchKnowledgeBase } from './knowledgeSearch';
import { ContextManager } from './contextManager';

interface TaskNode {
  id: string;
  type: string;
  title: string;
  description: string;
  requirements: string[];
  inputs: {
    source: string;
    data: any;
  }[];
  operations: {
    type: string;
    description: string;
    parameters: any;
    result: any;
  }[];
  outputs: {
    target: string;
    data: any;
  }[];
  reasoning: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  verification: {
    success: boolean;
    message: string;
    metrics?: Record<string, any>;
  };
}

interface DesignProblemAnalysis {
  problem_statement: string;
  key_challenges: string[];
  research_questions: string[];
  task_breakdown: {
    nodes: TaskNode[];
    flow: {
      from: string;
      to: string;
      description: string;
      data_dependencies: string[];
    }[];
  };
  recommended_blocks: {
    type: string;
    title: string;
    description: string;
    position: { x: number; y: number };
    data: any;
    template_type: string;
    task_nodes: string[];
    relationships: {
      connectedTo: string[];
      relationship_type: 'hierarchical' | 'sequential' | 'supportive';
      relationship_description: string;
    };
  }[];
  connections: {
    from: number;
    to: number;
    relationship: string;
    description: string;
    data_flow: {
      inputs: string[];
      outputs: string[];
      transformations: string[];
    };
  }[];
  knowledgeBaseReferences: string[];
  solution_explanation: {
    overview: string;
    node_selection_rationale: {
      [nodeType: string]: {
        reason: string;
        template_alignment: string;
        content_strategy: string;
        task_nodes: string[];
      };
    };
    workflow_steps: {
      step: number;
      description: string;
      nodes_involved: string[];
      expected_outcome: string;
      content_requirements: string[];
      verification_steps: string[];
    }[];
    key_considerations: string[];
    potential_challenges: string[];
    success_metrics: string[];
    verification: {
      requirements_met: boolean;
      missing_requirements: string[];
      assumptions: string[];
      limitations: string[];
      validation_steps: string[];
    };
  };
}

const BLOCK_TEMPLATES = {
  interviewGenerator: {
    type: BLOCK_TYPES.interviewGenerator,
    defaultData: {
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
          ],
          collapsed: false
        }
      ],
      notes: ''
    }
  },
  marketAnalysis: {
    type: BLOCK_TYPES.marketAnalysis,
    defaultData: {
      overview: {
        industry: '',
        scope: '',
        timeframe: '',
        objectives: ''
      },
      competitors: [{ id: '1', content: '' }],
      strengths: [{ id: '1', content: '' }],
      weaknesses: [{ id: '1', content: '' }],
      opportunities: [{ id: '1', content: '' }],
      threats: [{ id: '1', content: '' }],
      strategies: [{ id: '1', content: '' }]
    }
  },
  personaBuilder: {
    type: BLOCK_TYPES.personaBuilder,
    defaultData: {
      profile: {
        name: '',
        age: '',
        occupation: '',
        location: '',
        bio: ''
      },
      goals: [{ id: '1', content: '' }],
      painPoints: [{ id: '1', content: '' }],
      behaviors: [{ id: '1', content: '' }],
      needs: [{ id: '1', content: '' }],
      influences: [{ id: '1', content: '' }]
    }
  },
  empathyMapper: {
    type: BLOCK_TYPES.empathyMapper,
    defaultData: {
      thinks: [{ id: '1', content: '' }],
      feels: [{ id: '1', content: '' }],
      says: [{ id: '1', content: '' }],
      does: [{ id: '1', content: '' }]
    }
  },
  swotAnalyzer: {
    type: BLOCK_TYPES.swotAnalyzer,
    defaultData: {
      strengths: [''],
      weaknesses: [''],
      opportunities: [''],
      threats: ['']
    }
  },
  affinityMapper: {
    type: BLOCK_TYPES.affinityMapper,
    defaultData: {
      overview: {
        dataSource: '',
        clusteringCriteria: '',
        objectives: '',
        methodology: ''
      },
      clusters: [{
        id: '1',
        name: '',
        description: '',
        items: [''],
        themes: [''],
        insights: ['']
      }]
    }
  }
};

export async function analyzeDesignProblem(problem: string): Promise<DesignProblemAnalysis> {
  if (!problem.trim()) {
    throw new Error('Design problem description cannot be empty');
  }

  try {
    // Initialize context manager
    await ContextManager.initialize();

    // Search knowledge base for relevant entries
    const relevantEntries = await searchKnowledgeBase(problem, []);

    const systemPrompt = `You are an expert UX research and design strategist. Analyze the given design problem and create a comprehensive solution strategy using available blocks and task nodes.

Key Instructions:
1. Break down the problem into specific task nodes:
   - Define clear requirements and inputs
   - Specify operations and calculations
   - Document reasoning and outputs
   - Track dependencies between nodes
   - Include verification steps
2. Create an efficient workflow using 3-6 blocks
3. For each block:
   - Map to relevant task nodes
   - Generate contextually relevant content
   - Define relationships with other blocks
   - Specify data flow and transformations
4. Ensure logical connections between blocks
5. Position blocks in a clear left-to-right flow
6. Provide detailed explanation of the solution
7. Include verification steps for each component

Return a JSON response with this structure:
{
  "problem_statement": string,
  "key_challenges": string[],
  "research_questions": string[],
  "task_breakdown": {
    "nodes": [
      {
        "id": string,
        "type": string,
        "title": string,
        "description": string,
        "requirements": string[],
        "inputs": [{ "source": string, "data": any }],
        "operations": [
          {
            "type": string,
            "description": string,
            "parameters": any,
            "result": any
          }
        ],
        "outputs": [{ "target": string, "data": any }],
        "reasoning": string,
        "status": "pending" | "in-progress" | "completed" | "failed",
        "verification": {
          "success": boolean,
          "message": string,
          "metrics": Record<string, any>
        }
      }
    ],
    "flow": [
      {
        "from": string,
        "to": string,
        "description": string,
        "data_dependencies": string[]
      }
    ]
  },
  "recommended_blocks": [
    {
      "type": string,
      "title": string,
      "description": string,
      "position": { "x": number, "y": number },
      "data": any,
      "template_type": string,
      "task_nodes": string[],
      "relationships": {
        "connectedTo": string[],
        "relationship_type": "hierarchical" | "sequential" | "supportive",
        "relationship_description": string
      }
    }
  ],
  "connections": [
    {
      "from": number,
      "to": number,
      "relationship": string,
      "description": string,
      "data_flow": {
        "inputs": string[],
        "outputs": string[],
        "transformations": string[]
      }
    }
  ],
  "knowledgeBaseReferences": string[],
  "solution_explanation": {
    "overview": string,
    "node_selection_rationale": {
      [nodeType: string]: {
        "reason": string,
        "template_alignment": string,
        "content_strategy": string,
        "task_nodes": string[]
      }
    },
    "workflow_steps": [
      {
        "step": number,
        "description": string,
        "nodes_involved": string[],
        "expected_outcome": string,
        "content_requirements": string[],
        "verification_steps": string[]
      }
    ],
    "key_considerations": string[],
    "potential_challenges": string[],
    "success_metrics": string[],
    "verification": {
      "requirements_met": boolean,
      "missing_requirements": string[],
      "assumptions": string[],
      "limitations": string[],
      "validation_steps": string[]
    }
  }
}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: problem }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response received from OpenAI');
    }

    let analysis: DesignProblemAnalysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse AI response into valid JSON');
    }

    // Validate and map blocks to templates
    analysis.recommended_blocks = analysis.recommended_blocks.map((block: any) => {
      const template = Object.values(BLOCK_TEMPLATES).find(t => t.type === block.type);
      if (!template) {
        console.warn(`Invalid block type: ${block.type}, skipping block`);
        return null;
      }

      // Find relevant task nodes for this block
      const relatedTaskNodes = analysis.task_breakdown.nodes.filter(node => 
        block.task_nodes.includes(node.id)
      );

      // Merge generated data with template defaults and add context
      const mergedData = {
        ...template.defaultData,
        ...block.data,
        _prompt: problem,
        _template: {
          type: block.template_type,
          relationships: block.relationships,
          generation_strategy: analysis.solution_explanation.node_selection_rationale[block.type]
        },
        _taskNodes: relatedTaskNodes,
        _verification: {
          steps: relatedTaskNodes.map(node => node.verification),
          requirements: analysis.solution_explanation.verification
        }
      };

      return {
        ...block,
        data: mergedData
      };
    }).filter(Boolean);

    // Validate and enhance connections with data flow
    analysis.connections = analysis.connections.filter(
      (conn: any) =>
        conn.from >= 0 &&
        conn.from < analysis.recommended_blocks.length &&
        conn.to >= 0 &&
        conn.to < analysis.recommended_blocks.length &&
        conn.from !== conn.to
    );

    // Add knowledge base references
    analysis.knowledgeBaseReferences = relevantEntries.map(entry => entry.id);

    // Initialize context for the workflow
    await ContextManager.updateContextOnWorkflowCreation(analysis);

    return analysis;
  } catch (error) {
    console.error('Error analyzing design problem:', error);
    throw new Error('Failed to analyze design problem. Please try again.');
  }
}

export async function generateBlockContent(
  blockType: string,
  context: string,
  templateType: string,
  relationships: any[],
  knowledgeBase: KnowledgeEntry[] = []
): Promise<any> {
  const template = Object.values(BLOCK_TEMPLATES).find(t => t.type === blockType);
  if (!template) {
    throw new Error(`Invalid block type: ${blockType}`);
  }

  try {
    // Search knowledge base for relevant content
    const relevantEntries = await searchKnowledgeBase(context, knowledgeBase);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert in ${blockType}. Generate appropriate content for this block type based on the given context, template type, and relationships. Use the following template structure:

Template Type: ${templateType}
Template Structure:
${JSON.stringify(template.defaultData, null, 2)}

Relationships:
${JSON.stringify(relationships, null, 2)}

Knowledge Base Context:
${JSON.stringify(relevantEntries, null, 2)}

Generate content that:
1. Follows the template structure
2. Aligns with the template type
3. Maintains consistency with related nodes
4. Incorporates relevant knowledge base insights`
        },
        { role: 'user', content: context }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const generatedContent = JSON.parse(content);
    return {
      ...template.defaultData,
      ...generatedContent,
      _knowledgeBaseRefs: relevantEntries.map(entry => entry.id),
      _prompt: context,
      _template: {
        type: templateType,
        relationships: relationships
      }
    };
  } catch (error) {
    console.error(`Error generating content for ${blockType}:`, error);
    return template.defaultData;
  }
}