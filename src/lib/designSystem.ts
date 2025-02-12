import { openai } from './openai';
import { KnowledgeEntry } from '../types';

export interface DesignToken {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'radius' | 'component';
  category: string;
  description: string;
}

export interface DesignSystem {
  id: string;
  name: string;
  source: 'antd' | 'material' | 'figma' | 'custom';
  tokens: DesignToken[];
  components: {
    id: string;
    name: string;
    category: string;
    variants: string[];
    props: Record<string, string>;
    description: string;
    usage: string;
    preview?: string;
  }[];
  documentation: string;
  version: string;
  lastUpdated: string;
}

// Default Ant Design system configuration
export const antDesignSystem: DesignSystem = {
  id: 'antd',
  name: 'Ant Design',
  source: 'antd',
  tokens: [
    // Colors
    { id: 'primary', name: 'Primary', value: '#1890ff', type: 'color', category: 'colors', description: 'Primary brand color' },
    { id: 'success', name: 'Success', value: '#52c41a', type: 'color', category: 'colors', description: 'Success state color' },
    { id: 'warning', name: 'Warning', value: '#faad14', type: 'color', category: 'colors', description: 'Warning state color' },
    { id: 'error', name: 'Error', value: '#f5222d', type: 'color', category: 'colors', description: 'Error state color' },
    
    // Typography
    { id: 'font-family', name: 'Font Family', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial', type: 'typography', category: 'typography', description: 'Default font family' },
    { id: 'font-size-base', name: 'Base Font Size', value: '14px', type: 'typography', category: 'typography', description: 'Base font size' },
    
    // Spacing
    { id: 'padding-lg', name: 'Large Padding', value: '24px', type: 'spacing', category: 'spacing', description: 'Large padding size' },
    { id: 'padding-md', name: 'Medium Padding', value: '16px', type: 'spacing', category: 'spacing', description: 'Medium padding size' },
    { id: 'padding-sm', name: 'Small Padding', value: '12px', type: 'spacing', category: 'spacing', description: 'Small padding size' },
    
    // Border Radius
    { id: 'border-radius-base', name: 'Base Radius', value: '2px', type: 'radius', category: 'radius', description: 'Base border radius' }
  ],
  components: [
    {
      id: 'button',
      name: 'Button',
      category: 'General',
      variants: ['primary', 'default', 'dashed', 'text', 'link'],
      props: {
        type: 'primary | default | dashed | text | link',
        size: 'large | middle | small',
        loading: 'boolean',
        disabled: 'boolean'
      },
      description: 'To trigger an operation.',
      usage: 'Used for actions in forms, dialogs, and more.'
    },
    {
      id: 'input',
      name: 'Input',
      category: 'Data Entry',
      variants: ['default', 'textarea', 'search'],
      props: {
        size: 'large | middle | small',
        disabled: 'boolean',
        placeholder: 'string'
      },
      description: 'A basic widget for getting user input.',
      usage: 'Used for text input in forms and search interfaces.'
    }
  ],
  documentation: 'https://ant.design/components/overview/',
  version: '5.0.0',
  lastUpdated: new Date().toISOString()
};

export async function importFigmaDesignSystem(accessToken: string, fileKey: string): Promise<DesignSystem> {
  try {
    // This would be implemented to fetch from Figma API
    // For now, return a placeholder
    return {
      id: 'figma-' + Math.random().toString(36).slice(2),
      name: 'Figma Design System',
      source: 'figma',
      tokens: [],
      components: [],
      documentation: '',
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error importing Figma design system:', error);
    throw error;
  }
}

export async function generateAIDesign(
  prompt: string,
  designSystem: DesignSystem
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert UI designer using the ${designSystem.name} design system. 
          Generate a design specification using only components and tokens from this system:
          
          Design System: ${JSON.stringify(designSystem, null, 2)}
          
          Return a JSON specification that:
          1. Only uses available components and tokens
          2. Follows the design system's patterns and guidelines
          3. Creates a cohesive and accessible interface
          4. Includes detailed component props and styling`
        },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating AI design:', error);
    throw error;
  }
}