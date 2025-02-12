import React from 'react';
import { X } from 'lucide-react';
import { useWhiteboardStore } from '../store/whiteboard';
import { Template } from '../types';

const templates: Template[] = [
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Capture and organize ideas collaboratively',
    thumbnail: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=300&q=80',
    shapes: []
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    description: 'Visualize and manage work progress',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&q=80',
    shapes: []
  },
  {
    id: 'mindmap',
    name: 'Mind Map',
    description: 'Create visual diagrams of your thoughts',
    thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300&q=80',
    shapes: []
  },
  {
    id: 'research',
    name: 'Research Board',
    description: 'Organize research findings and insights',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&q=80',
    shapes: []
  }
];

export const TemplatesPanel: React.FC = () => {
  const { toggleTemplates } = useWhiteboardStore();

  return (
    <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Templates</h2>
          <button
            onClick={toggleTemplates}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Start with a template to speed up your workflow
        </p>
      </div>

      <div className="p-4 grid gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            className="block text-left hover:bg-gray-50 rounded-lg transition-colors p-2"
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-2">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};