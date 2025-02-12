import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Plus, X, Wand2 } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { openai } from '../../lib/openai';

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
  overview: {
    industry: string;
    scope: string;
    timeframe: string;
    objectives: string;
  };
  emergingTrends: {
    id: string;
    trend: string;
    impact: 'high' | 'medium' | 'low';
    timeframe: 'short' | 'medium' | 'long';
    description: string;
  }[];
  technologicalTrends: StickyNote[];
  socialTrends: StickyNote[];
  economicTrends: StickyNote[];
  environmentalTrends: StickyNote[];
  politicalTrends: StickyNote[];
  implications: StickyNote[];
}

const defaultTrendData: TrendData = {
  overview: {
    industry: '',
    scope: '',
    timeframe: '',
    objectives: ''
  },
  emergingTrends: [{
    id: '1',
    trend: '',
    impact: 'medium',
    timeframe: 'medium',
    description: ''
  }],
  technologicalTrends: [{ id: '1', content: '' }],
  socialTrends: [{ id: '1', content: '' }],
  economicTrends: [{ id: '1', content: '' }],
  environmentalTrends: [{ id: '1', content: '' }],
  politicalTrends: [{ id: '1', content: '' }],
  implications: [{ id: '1', content: '' }]
};

export const TrendRadar: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [trendData, setTrendData] = useState<TrendData>(() => {
    return selectedBlock?.data || defaultTrendData;
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, trendData);
    }
  }, [trendData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof typeof trendData.overview, value: string) => {
    setTrendData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddEmergingTrend = () => {
    setTrendData(prev => ({
      ...prev,
      emergingTrends: [
        ...prev.emergingTrends,
        {
          id: Math.random().toString(36).slice(2),
          trend: '',
          impact: 'medium',
          timeframe: 'medium',
          description: ''
        }
      ]
    }));
  };

  const handleUpdateEmergingTrend = (id: string, field: keyof TrendData['emergingTrends'][0], value: string) => {
    setTrendData(prev => ({
      ...prev,
      emergingTrends: prev.emergingTrends.map(trend =>
        trend.id === id ? { ...trend, [field]: value } : trend
      )
    }));
  };

  const handleRemoveEmergingTrend = (id: string) => {
    setTrendData(prev => ({
      ...prev,
      emergingTrends: prev.emergingTrends.filter(trend => trend.id !== id)
    }));
  };

  const handleAddNote = (section: keyof Omit<TrendData, 'overview' | 'emergingTrends'>) => {
    setTrendData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof Omit<TrendData, 'overview' | 'emergingTrends'>, id: string, content: string) => {
    setTrendData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<TrendData, 'overview' | 'emergingTrends'>, id: string) => {
    setTrendData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<TrendData, 'overview' | 'emergingTrends'>, id: string) => {
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

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert in trend analysis and forecasting. Generate a comprehensive PESTLE analysis based on the following prompt. Include emerging trends, their impact, and timeframe. Format the response as a JSON object with this structure:

            {
              "overview": {
                "industry": string,
                "scope": string,
                "timeframe": string,
                "objectives": string
              },
              "emergingTrends": [
                {
                  "id": string,
                  "trend": string,
                  "impact": "high" | "medium" | "low",
                  "timeframe": "short" | "medium" | "long",
                  "description": string
                }
              ],
              "technologicalTrends": [{ "id": string, "content": string }],
              "socialTrends": [{ "id": string, "content": string }],
              "economicTrends": [{ "id": string, "content": string }],
              "environmentalTrends": [{ "id": string, "content": string }],
              "politicalTrends": [{ "id": string, "content": string }],
              "implications": [{ "id": string, "content": string }]
            }`
          },
          { role: 'user', content: aiPrompt }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const generatedData = JSON.parse(content);
        setTrendData(generatedData);
        setShowAIDialog(false);
      }
    } catch (error) {
      console.error('Error generating trends:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      {/* AI Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAIDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Generate Trends with AI</h2>
              </div>
              <button 
                onClick={() => setShowAIDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe the industry, market, or domain you want to analyze. Include any specific areas of interest or time horizons.
            </p>

            <div className="mb-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Example: Analyze emerging trends in the fintech industry over the next 3-5 years, focusing on payment technologies, digital banking, and financial inclusion..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAIDialog(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateWithAI}
                disabled={!aiPrompt.trim() || isGenerating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={() => selectBlock(null)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Canvas
        </button>

        <button
          onClick={() => setShowAIDialog(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate with AI
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Trend Analysis Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry/Domain</label>
                <textarea
                  rows={4}
                  value={trendData.overview.industry}
                  onChange={(e) => handleOverviewChange('industry', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What industry or domain are you analyzing?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Scope</label>
                <textarea
                  rows={4}
                  value={trendData.overview.scope}
                  onChange={(e) => handleOverviewChange('scope', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What is the scope of your analysis?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                <select
                  value={trendData.overview.timeframe}
                  onChange={(e) => handleOverviewChange('timeframe', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select timeframe...</option>
                  <option value="1year">Next year</option>
                  <option value="2years">Next 2 years</option>
                  <option value="3years">Next 3 years</option>
                  <option value="5years">Next 5 years</option>
                  <option value="10years">Next 10 years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Objectives</label>
                <textarea
                  rows={4}
                  value={trendData.overview.objectives}
                  onChange={(e) => handleOverviewChange('objectives', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are your objectives for this trend analysis?"
                />
              </div>
            </div>
          </div>

          {/* Emerging Trends Section */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Emerging Trends</h2>
                <button
                  onClick={handleAddEmergingTrend}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Add Trend
                </button>
              </div>
              <div className="space-y-6">
                {trendData.emergingTrends.map(trend => (
                  <div key={trend.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Trend</label>
                        <input
                          type="text"
                          value={trend.trend}
                          onChange={(e) => handleUpdateEmergingTrend(trend.id, 'trend', e.target.value)}
                          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Name of the trend"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Impact</label>
                          <select
                            value={trend.impact}
                            onChange={(e) => handleUpdateEmergingTrend(trend.id, 'impact', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                          <select
                            value={trend.timeframe}
                            onChange={(e) => handleUpdateEmergingTrend(trend.id, 'timeframe', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="short">Short-term</option>
                            <option value="medium">Medium-term</option>
                            <option value="long">Long-term</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={trend.description}
                        onChange={(e) => handleUpdateEmergingTrend(trend.id, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Describe the trend and its potential impact..."
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleRemoveEmergingTrend(trend.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Trend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PESTLE Analysis Sections */}
            <div className="space-y-8">
              <StickyNotesGroup
                title="Technological Trends"
                color="bg-blue-100"
                notes={trendData.technologicalTrends}
                onAddNote={() => handleAddNote('technologicalTrends')}
                onUpdateNote={(id, content) => handleUpdateNote('technologicalTrends', id, content)}
                onRemoveNote={(id) => handleRemoveNote('technologicalTrends', id)}
                onDuplicateNote={(id) => handleDuplicateNote('technologicalTrends', id)}
              />

              <StickyNotesGroup
                title="Social Trends"
                color="bg-purple-100"
                notes={trendData.socialTrends}
                onAddNote={() => handleAddNote('socialTrends')}
                onUpdateNote={(id, content) => handleUpdateNote('socialTrends', id, content)}
                onRemoveNote={(id) => handleRemoveNote('socialTrends', id)}
                onDuplicateNote={(id) => handleDuplicateNote('socialTrends', id)}
              />

              <StickyNotesGroup
                title="Economic Trends"
                color="bg-green-100"
                notes={trendData.economicTrends}
                onAddNote={() => handleAddNote('economicTrends')}
                onUpdateNote={(id, content) => handleUpdateNote('economicTrends', id, content)}
                onRemoveNote={(id) => handleRemoveNote('economicTrends', id)}
                onDuplicateNote={(id) => handleDuplicateNote('economicTrends', id)}
              />

              <StickyNotesGroup
                title="Environmental Trends"
                color="bg-yellow-100"
                notes={trendData.environmentalTrends}
                onAddNote={() => handleAddNote('environmentalTrends')}
                onUpdateNote={(id, content) => handleUpdateNote('environmentalTrends', id, content)}
                onRemoveNote={(id) => handleRemoveNote('environmentalTrends', id)}
                onDuplicateNote={(id) => handleDuplicateNote('environmentalTrends', id)}
              />

              <StickyNotesGroup
                title="Political Trends"
                color="bg-orange-100"
                notes={trendData.politicalTrends}
                onAddNote={() => handleAddNote('politicalTrends')}
                onUpdateNote={(id, content) => handleUpdateNote('politicalTrends', id, content)}
                onRemoveNote={(id) => handleRemoveNote('politicalTrends', id)}
                onDuplicateNote={(id) => handleDuplicateNote('politicalTrends', id)}
              />

              <StickyNotesGroup
                title="Strategic Implications"
                color="bg-red-100"
                notes={trendData.implications}
                onAddNote={() => handleAddNote('implications')}
                onUpdateNote={(id, content) => handleUpdateNote('implications', id, content)}
                onRemoveNote={(id) => handleRemoveNote('implications', id)}
                onDuplicateNote={(id) => handleDuplicateNote('implications', id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};