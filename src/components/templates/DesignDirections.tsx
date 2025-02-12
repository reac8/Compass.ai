import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface StickyNote {
  id: string;
  content: string;
}

interface StickyNotesGroupProps {
  title: string;
  color: string;
  notes: StickyNote[];
  onAddNote: () => void;
  onUpdateNote: (id: string, content: string) => void;
  onRemoveNote: (id: string) => void;
  onDuplicateNote: (id: string) => void;
}

const StickyNotesGroup: React.FC<StickyNotesGroupProps> = ({
  title,
  color,
  notes = [],
  onAddNote,
  onUpdateNote,
  onRemoveNote,
  onDuplicateNote,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="flex gap-4 flex-wrap">
      {notes.map((note) => (
        <div key={note.id} className="relative group">
          <div
            className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-text relative group-hover:shadow-lg transition-shadow`}
          >
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => onDuplicateNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Duplicate note"
              >
                <Copy className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={() => onRemoveNote(note.id)}
                className="p-1 hover:bg-black/5 rounded"
                title="Remove note"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="w-full h-full text-sm focus:outline-none"
              onBlur={(e) => onUpdateNote(note.id, e.currentTarget.textContent || '')}
            >
              {note.content}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={onAddNote}
        className={`w-32 h-32 ${color} rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center border-2 border-dashed border-gray-300/50`}
      >
        <Plus className="w-6 h-6 text-gray-500/50" />
      </button>
    </div>
  </div>
);

interface DesignData {
  overview: {
    challenge: string;
    audience: string;
    constraints: string;
  };
  insights: StickyNote[];
  directions: StickyNote[];
  principles: StickyNote[];
  requirements: StickyNote[];
  inspirations: StickyNote[];
}

const defaultDesignData: DesignData = {
  overview: {
    challenge: '',
    audience: '',
    constraints: ''
  },
  insights: [{ id: '1', content: '' }],
  directions: [{ id: '1', content: '' }],
  principles: [{ id: '1', content: '' }],
  requirements: [{ id: '1', content: '' }],
  inspirations: [{ id: '1', content: '' }]
};

export const DesignDirections: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [designData, setDesignData] = useState<DesignData>(() => {
    return selectedBlock?.data || defaultDesignData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, designData);
    }
  }, [designData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof designData.overview, value: string) => {
    setDesignData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddNote = (section: keyof Omit<DesignData, 'overview'>) => {
    setDesignData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof Omit<DesignData, 'overview'>, id: string, content: string) => {
    setDesignData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<DesignData, 'overview'>, id: string) => {
    setDesignData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<DesignData, 'overview'>, id: string) => {
    setDesignData(prev => {
      const noteToClone = prev[section].find(note => note.id === id);
      if (!noteToClone) return prev;

      return {
        ...prev,
        [section]: [
          ...prev[section],
          { id: Math.random().toString(36).slice(2), content: noteToClone.content }
        ]
      };
    });
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center sticky top-0 z-10">
        <button 
          onClick={() => selectBlock(null)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Canvas
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Design Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Design Challenge</label>
                <textarea
                  rows={4}
                  value={designData.overview.challenge}
                  onChange={(e) => handleOverviewChange('challenge', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Define the design challenge..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                <textarea
                  rows={4}
                  value={designData.overview.audience}
                  onChange={(e) => handleOverviewChange('audience', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Describe the target audience..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Constraints</label>
                <textarea
                  rows={4}
                  value={designData.overview.constraints}
                  onChange={(e) => handleOverviewChange('constraints', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="List key constraints..."
                />
              </div>
            </div>
          </div>

          {/* Main Sections Grid */}
          <div className="md:col-span-2 space-y-8">
            <StickyNotesGroup
              title="Key Insights"
              color="bg-blue-200"
              notes={designData.insights}
              onAddNote={() => handleAddNote('insights')}
              onUpdateNote={(id, content) => handleUpdateNote('insights', id, content)}
              onRemoveNote={(id) => handleRemoveNote('insights', id)}
              onDuplicateNote={(id) => handleDuplicateNote('insights', id)}
            />

            <StickyNotesGroup
              title="Design Directions"
              color="bg-purple-200"
              notes={designData.directions}
              onAddNote={() => handleAddNote('directions')}
              onUpdateNote={(id, content) => handleUpdateNote('directions', id, content)}
              onRemoveNote={(id) => handleRemoveNote('directions', id)}
              onDuplicateNote={(id) => handleDuplicateNote('directions', id)}
            />

            <StickyNotesGroup
              title="Design Principles"
              color="bg-green-200"
              notes={designData.principles}
              onAddNote={() => handleAddNote('principles')}
              onUpdateNote={(id, content) => handleUpdateNote('principles', id, content)}
              onRemoveNote={(id) => handleRemoveNote('principles', id)}
              onDuplicateNote={(id) => handleDuplicateNote('principles', id)}
            />

            <StickyNotesGroup
              title="Requirements"
              color="bg-yellow-200"
              notes={designData.requirements}
              onAddNote={() => handleAddNote('requirements')}
              onUpdateNote={(id, content) => handleUpdateNote('requirements', id, content)}
              onRemoveNote={(id) => handleRemoveNote('requirements', id)}
              onDuplicateNote={(id) => handleDuplicateNote('requirements', id)}
            />

            <StickyNotesGroup
              title="Inspirations"
              color="bg-amber-200"
              notes={designData.inspirations}
              onAddNote={() => handleAddNote('inspirations')}
              onUpdateNote={(id, content) => handleUpdateNote('inspirations', id, content)}
              onRemoveNote={(id) => handleRemoveNote('inspirations', id)}
              onDuplicateNote={(id) => handleDuplicateNote('inspirations', id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};