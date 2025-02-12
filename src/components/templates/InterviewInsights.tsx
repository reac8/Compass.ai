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

interface Interview {
  id: string;
  participant: string;
  date: string;
  duration: string;
  keyFindings: string[];
  quotes: string[];
  observations: string[];
}

interface InsightData {
  overview: {
    objective: string;
    methodology: string;
    participants: string;
    timeframe: string;
  };
  interviews: Interview[];
  patterns: StickyNote[];
  insights: StickyNote[];
  recommendations: StickyNote[];
  nextSteps: StickyNote[];
}

const defaultInsightData: InsightData = {
  overview: {
    objective: '',
    methodology: '',
    participants: '',
    timeframe: ''
  },
  interviews: [{
    id: '1',
    participant: '',
    date: '',
    duration: '',
    keyFindings: [''],
    quotes: [''],
    observations: ['']
  }],
  patterns: [{ id: '1', content: '' }],
  insights: [{ id: '1', content: '' }],
  recommendations: [{ id: '1', content: '' }],
  nextSteps: [{ id: '1', content: '' }]
};

export const InterviewInsights: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [insightData, setInsightData] = useState<InsightData>(() => {
    return selectedBlock?.data || defaultInsightData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, insightData);
    }
  }, [insightData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof insightData.overview, value: string) => {
    setInsightData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddInterview = () => {
    setInsightData(prev => ({
      ...prev,
      interviews: [
        ...prev.interviews,
        {
          id: Math.random().toString(36).slice(2),
          participant: '',
          date: '',
          duration: '',
          keyFindings: [''],
          quotes: [''],
          observations: ['']
        }
      ]
    }));
  };

  const handleUpdateInterview = (id: string, field: keyof Interview, value: any) => {
    setInsightData(prev => ({
      ...prev,
      interviews: prev.interviews.map(interview =>
        interview.id === id ? { ...interview, [field]: value } : interview
      )
    }));
  };

  const handleAddArrayItem = (interviewId: string, field: 'keyFindings' | 'quotes' | 'observations') => {
    setInsightData(prev => ({
      ...prev,
      interviews: prev.interviews.map(interview =>
        interview.id === interviewId
          ? { ...interview, [field]: [...interview[field], ''] }
          : interview
      )
    }));
  };

  const handleUpdateArrayItem = (
    interviewId: string,
    field: 'keyFindings' | 'quotes' | 'observations',
    index: number,
    value: string
  ) => {
    setInsightData(prev => ({
      ...prev,
      interviews: prev.interviews.map(interview =>
        interview.id === interviewId
          ? {
              ...interview,
              [field]: interview[field].map((item, i) => i === index ? value : item)
            }
          : interview
      )
    }));
  };

  const handleRemoveArrayItem = (
    interviewId: string,
    field: 'keyFindings' | 'quotes' | 'observations',
    index: number
  ) => {
    setInsightData(prev => ({
      ...prev,
      interviews: prev.interviews.map(interview =>
        interview.id === interviewId
          ? {
              ...interview,
              [field]: interview[field].filter((_, i) => i !== index)
            }
          : interview
      )
    }));
  };

  const handleRemoveInterview = (id: string) => {
    setInsightData(prev => ({
      ...prev,
      interviews: prev.interviews.filter(interview => interview.id !== id)
    }));
  };

  const handleAddNote = (section: keyof Omit<InsightData, 'overview' | 'interviews'>) => {
    setInsightData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (
    section: keyof Omit<InsightData, 'overview' | 'interviews'>,
    id: string,
    content: string
  ) => {
    setInsightData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<InsightData, 'overview' | 'interviews'>, id: string) => {
    setInsightData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<InsightData, 'overview' | 'interviews'>, id: string) => {
    setInsightData(prev => {
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
            <h2 className="text-xl font-semibold mb-4">Research Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Research Objective</label>
                <textarea
                  rows={4}
                  value={insightData.overview.objective}
                  onChange={(e) => handleOverviewChange('objective', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What were you trying to learn?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Methodology</label>
                <textarea
                  rows={4}
                  value={insightData.overview.methodology}
                  onChange={(e) => handleOverviewChange('methodology', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="How did you conduct the research?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Participants</label>
                <textarea
                  rows={4}
                  value={insightData.overview.participants}
                  onChange={(e) => handleOverviewChange('participants', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Who participated in the research?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                <input
                  type="text"
                  value={insightData.overview.timeframe}
                  onChange={(e) => handleOverviewChange('timeframe', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="When was the research conducted?"
                />
              </div>
            </div>
          </div>

          {/* Interviews and Analysis Sections */}
          <div className="md:col-span-2">
            {/* Interviews Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Interview Summaries</h2>
                <button
                  onClick={handleAddInterview}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Interview
                </button>
              </div>
              <div className="space-y-6">
                {insightData.interviews.map(interview => (
                  <div key={interview.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Participant</label>
                        <input
                          type="text"
                          value={interview.participant}
                          onChange={(e) => handleUpdateInterview(interview.id, 'participant', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Participant name/ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          value={interview.date}
                          onChange={(e) => handleUpdateInterview(interview.id, 'date', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input
                          type="text"
                          value={interview.duration}
                          onChange={(e) => handleUpdateInterview(interview.id, 'duration', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="e.g., 45 minutes"
                        />
                      </div>
                    </div>

                    {/* Key Findings */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Findings</h4>
                      <div className="space-y-2">
                        {interview.keyFindings.map((finding, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={finding}
                              onChange={(e) => handleUpdateArrayItem(interview.id, 'keyFindings', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add key finding..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(interview.id, 'keyFindings', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(interview.id, 'keyFindings')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Finding
                        </button>
                      </div>
                    </div>

                    {/* Notable Quotes */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Notable Quotes</h4>
                      <div className="space-y-2">
                        {interview.quotes.map((quote, index) => (
                          <div key={index} className="flex gap-2">
                            <textarea
                              value={quote}
                              onChange={(e) => handleUpdateArrayItem(interview.id, 'quotes', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px]"
                              placeholder="Add notable quote..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(interview.id, 'quotes', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(interview.id, 'quotes')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Quote
                        </button>
                      </div>
                    </div>

                    {/* Observations */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Observations</h4>
                      <div className="space-y-2">
                        {interview.observations.map((observation, index) => (
                          <div key={index} className="flex gap-2">
                            <textarea
                              value={observation}
                              onChange={(e) => handleUpdateArrayItem(interview.id, 'observations', index, e.target.value)}
                              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px]"
                              placeholder="Add observation..."
                            />
                            <button
                              onClick={() => handleRemoveArrayItem(interview.id, 'observations', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddArrayItem(interview.id, 'observations')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          + Add Observation
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveInterview(interview.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Interview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Patterns"
                color="bg-blue-100"
                notes={insightData.patterns}
                onAddNote={() => handleAddNote('patterns')}
                onUpdateNote={(id, content) => handleUpdateNote('patterns', id, content)}
                onRemoveNote={(id) => handleRemoveNote('patterns', id)}
                onDuplicateNote={(id) => handleDuplicateNote('patterns', id)}
              />

              <StickyNotesGroup
                title="Key Insights"
                color="bg-green-100"
                notes={insightData.insights}
                onAddNote={() => handleAddNote('insights')}
                onUpdateNote={(id, content) => handleUpdateNote('insights', id, content)}
                onRemoveNote={(id) => handleRemoveNote('insights', id)}
                onDuplicateNote={(id) => handleDuplicateNote('insights', id)}
              />

              <StickyNotesGroup
                title="Recommendations"
                color="bg-purple-100"
                notes={insightData.recommendations}
                onAddNote={() => handleAddNote('recommendations')}
                onUpdateNote={(id, content) => handleUpdateNote('recommendations', id, content)}
                onRemoveNote={(id) => handleRemoveNote('recommendations', id)}
                onDuplicateNote={(id) => handleDuplicateNote('recommendations', id)}
              />

              <StickyNotesGroup
                title="Next Steps"
                color="bg-yellow-100"
                notes={insightData.nextSteps}
                onAddNote={() => handleAddNote('nextSteps')}
                onUpdateNote={(id, content) => handleUpdateNote('nextSteps', id, content)}
                onRemoveNote={(id) => handleRemoveNote('nextSteps', id)}
                onDuplicateNote={(id) => handleDuplicateNote('nextSteps', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};