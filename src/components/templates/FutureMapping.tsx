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

interface Milestone {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  impact: 'low' | 'medium' | 'high';
}

interface FutureData {
  overview: {
    vision: string;
    scope: string;
    timeframe: string;
    objectives: string;
  };
  milestones: Milestone[];
  opportunities: StickyNote[];
  risks: StickyNote[];
  drivers: StickyNote[];
  barriers: StickyNote[];
  actions: StickyNote[];
}

const defaultFutureData: FutureData = {
  overview: {
    vision: '',
    scope: '',
    timeframe: '',
    objectives: ''
  },
  milestones: [{
    id: '1',
    title: '',
    description: '',
    timeframe: '',
    impact: 'medium'
  }],
  opportunities: [{ id: '1', content: '' }],
  risks: [{ id: '1', content: '' }],
  drivers: [{ id: '1', content: '' }],
  barriers: [{ id: '1', content: '' }],
  actions: [{ id: '1', content: '' }]
};

export const FutureMapping: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [futureData, setFutureData] = useState<FutureData>(() => {
    return selectedBlock?.data || defaultFutureData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, futureData);
    }
  }, [futureData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof futureData.overview, value: string) => {
    setFutureData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddMilestone = () => {
    setFutureData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: Math.random().toString(36).slice(2),
          title: '',
          description: '',
          timeframe: '',
          impact: 'medium'
        }
      ]
    }));
  };

  const handleUpdateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setFutureData(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const handleRemoveMilestone = (id: string) => {
    setFutureData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== id)
    }));
  };

  const handleAddNote = (section: keyof Omit<FutureData, 'overview' | 'milestones'>) => {
    setFutureData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof Omit<FutureData, 'overview' | 'milestones'>, id: string, content: string) => {
    setFutureData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<FutureData, 'overview' | 'milestones'>, id: string) => {
    setFutureData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<FutureData, 'overview' | 'milestones'>, id: string) => {
    setFutureData(prev => {
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
            <h2 className="text-xl font-semibold mb-4">Future Vision</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vision Statement</label>
                <textarea
                  rows={4}
                  value={futureData.overview.vision}
                  onChange={(e) => handleOverviewChange('vision', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Describe your vision for the future..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scope</label>
                <textarea
                  rows={4}
                  value={futureData.overview.scope}
                  onChange={(e) => handleOverviewChange('scope', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Define the scope of your future mapping..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                <select
                  value={futureData.overview.timeframe}
                  onChange={(e) => handleOverviewChange('timeframe', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select timeframe...</option>
                  <option value="1year">1 year</option>
                  <option value="2years">2 years</option>
                  <option value="3years">3 years</option>
                  <option value="5years">5 years</option>
                  <option value="10years">10 years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Objectives</label>
                <textarea
                  rows={4}
                  value={futureData.overview.objectives}
                  onChange={(e) => handleOverviewChange('objectives', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are your key objectives?"
                />
              </div>
            </div>
          </div>

          {/* Milestones and Analysis Sections */}
          <div className="md:col-span-2">
            {/* Milestones Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Key Milestones</h2>
                <button
                  onClick={handleAddMilestone}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Milestone
                </button>
              </div>
              <div className="space-y-6">
                {futureData.milestones.map(milestone => (
                  <div key={milestone.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => handleUpdateMilestone(milestone.id, 'title', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Milestone title"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                          <select
                            value={milestone.timeframe}
                            onChange={(e) => handleUpdateMilestone(milestone.id, 'timeframe', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="">Select...</option>
                            <option value="3months">3 months</option>
                            <option value="6months">6 months</option>
                            <option value="1year">1 year</option>
                            <option value="2years">2 years</option>
                            <option value="5years">5 years</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Impact</label>
                          <select
                            value={milestone.impact}
                            onChange={(e) => handleUpdateMilestone(milestone.id, 'impact', e.target.value as 'low' | 'medium' | 'high')}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => handleUpdateMilestone(milestone.id, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Describe this milestone..."
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveMilestone(milestone.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Milestone
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Opportunities"
                color="bg-green-100"
                notes={futureData.opportunities}
                onAddNote={() => handleAddNote('opportunities')}
                onUpdateNote={(id, content) => handleUpdateNote('opportunities', id, content)}
                onRemoveNote={(id) => handleRemoveNote('opportunities', id)}
                onDuplicateNote={(id) => handleDuplicateNote('opportunities', id)}
              />

              <StickyNotesGroup
                title="Risks"
                color="bg-red-100"
                notes={futureData.risks}
                onAddNote={() => handleAddNote('risks')}
                onUpdateNote={(id, content) => handleUpdateNote('risks', id, content)}
                onRemoveNote={(id) => handleRemoveNote('risks', id)}
                onDuplicateNote={(id) => handleDuplicateNote('risks', id)}
              />

              <StickyNotesGroup
                title="Change Drivers"
                color="bg-blue-100"
                notes={futureData.drivers}
                onAddNote={() => handleAddNote('drivers')}
                onUpdateNote={(id, content) => handleUpdateNote('drivers', id, content)}
                onRemoveNote={(id) => handleRemoveNote('drivers', id)}
                onDuplicateNote={(id) => handleDuplicateNote('drivers', id)}
              />

              <StickyNotesGroup
                title="Barriers"
                color="bg-yellow-100"
                notes={futureData.barriers}
                onAddNote={() => handleAddNote('barriers')}
                onUpdateNote={(id, content) => handleUpdateNote('barriers', id, content)}
                onRemoveNote={(id) => handleRemoveNote('barriers', id)}
                onDuplicateNote={(id) => handleDuplicateNote('barriers', id)}
              />

              <StickyNotesGroup
                title="Action Items"
                color="bg-purple-100"
                notes={futureData.actions}
                onAddNote={() => handleAddNote('actions')}
                onUpdateNote={(id, content) => handleUpdateNote('actions', id, content)}
                onRemoveNote={(id) => handleRemoveNote('actions', id)}
                onDuplicateNote={(id) => handleDuplicateNote('actions', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};