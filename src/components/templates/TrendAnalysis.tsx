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

interface TrendData {
  profile: {
    name: string;
    description: string;
    impact: string;
    timeframe: string;
    relevance: string;
  };
  opportunities: StickyNote[];
  risks: StickyNote[];
  sources: StickyNote[];
  implications: StickyNote[];
  stakeholders: StickyNote[];
}

const defaultTrendData: TrendData = {
  profile: {
    name: '',
    description: '',
    impact: '',
    timeframe: '',
    relevance: ''
  },
  opportunities: [{ id: '1', content: '' }],
  risks: [{ id: '1', content: '' }],
  sources: [{ id: '1', content: '' }],
  implications: [{ id: '1', content: '' }],
  stakeholders: [{ id: '1', content: '' }]
};

export const TrendAnalysis: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [trendData, setTrendData] = useState<TrendData>(() => {
    return selectedBlock?.data || defaultTrendData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, trendData);
    }
  }, [trendData, selectedBlock, updateBlockData]);

  const handleProfileChange = (field: keyof typeof trendData.profile, value: string) => {
    setTrendData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleAddNote = (section: keyof Omit<TrendData, 'profile'>) => {
    setTrendData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof Omit<TrendData, 'profile'>, id: string, content: string) => {
    setTrendData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<TrendData, 'profile'>, id: string) => {
    setTrendData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<TrendData, 'profile'>, id: string) => {
    setTrendData(prev => {
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
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Trend Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={trendData.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={4}
                  value={trendData.profile.description}
                  onChange={(e) => handleProfileChange('description', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Impact Level</label>
                <select
                  value={trendData.profile.impact}
                  onChange={(e) => handleProfileChange('impact', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select impact...</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                <select
                  value={trendData.profile.timeframe}
                  onChange={(e) => handleProfileChange('timeframe', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select timeframe...</option>
                  <option value="Short-term">Short-term (0-1 year)</option>
                  <option value="Medium-term">Medium-term (1-3 years)</option>
                  <option value="Long-term">Long-term (3+ years)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relevance</label>
                <select
                  value={trendData.profile.relevance}
                  onChange={(e) => handleProfileChange('relevance', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select relevance...</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Sections Grid */}
          <div className="md:col-span-2 space-y-8">
            <StickyNotesGroup
              title="Opportunities"
              color="bg-green-200"
              notes={trendData.opportunities}
              onAddNote={() => handleAddNote('opportunities')}
              onUpdateNote={(id, content) => handleUpdateNote('opportunities', id, content)}
              onRemoveNote={(id) => handleRemoveNote('opportunities', id)}
              onDuplicateNote={(id) => handleDuplicateNote('opportunities', id)}
            />

            <StickyNotesGroup
              title="Risks"
              color="bg-red-200"
              notes={trendData.risks}
              onAddNote={() => handleAddNote('risks')}
              onUpdateNote={(id, content) => handleUpdateNote('risks', id, content)}
              onRemoveNote={(id) => handleRemoveNote('risks', id)}
              onDuplicateNote={(id) => handleDuplicateNote('risks', id)}
            />

            <StickyNotesGroup
              title="Sources"
              color="bg-blue-200"
              notes={trendData.sources}
              onAddNote={() => handleAddNote('sources')}
              onUpdateNote={(id, content) => handleUpdateNote('sources', id, content)}
              onRemoveNote={(id) => handleRemoveNote('sources', id)}
              onDuplicateNote={(id) => handleDuplicateNote('sources', id)}
            />

            <StickyNotesGroup
              title="Implications"
              color="bg-purple-200"
              notes={trendData.implications}
              onAddNote={() => handleAddNote('implications')}
              onUpdateNote={(id, content) => handleUpdateNote('implications', id, content)}
              onRemoveNote={(id) => handleRemoveNote('implications', id)}
              onDuplicateNote={(id) => handleDuplicateNote('implications', id)}
            />

            <StickyNotesGroup
              title="Stakeholders"
              color="bg-amber-200"
              notes={trendData.stakeholders}
              onAddNote={() => handleAddNote('stakeholders')}
              onUpdateNote={(id, content) => handleUpdateNote('stakeholders', id, content)}
              onRemoveNote={(id) => handleRemoveNote('stakeholders', id)}
              onDuplicateNote={(id) => handleDuplicateNote('stakeholders', id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};