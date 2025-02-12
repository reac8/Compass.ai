import { TemplateSection } from '../components/StickyNoteTemplate';

export const templateConfigs: Record<string, TemplateSection[]> = {
  'interview-micro': [
    {
      title: 'Interview Questions',
      color: 'bg-blue-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Key Topics',
      color: 'bg-green-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Follow-up Questions',
      color: 'bg-purple-100',
      notes: [{ id: '1', content: '' }]
    }
  ],

  'competitor-analysis-gpt': [
    {
      title: 'Competitors',
      color: 'bg-blue-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Strengths',
      color: 'bg-green-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Weaknesses',
      color: 'bg-red-100',
      notes: [{ id: '1', content: '' }]
    },
    {
      title: 'Opportunities',
      color: 'bg-yellow-100',
      notes: [{ id: '1', content: '' }]
    }
  ],

  // Add configurations for all other block types...
  // Each configuration should define the sticky note sections
  // with appropriate titles and colors
};