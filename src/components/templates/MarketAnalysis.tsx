import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Plus, X, Wand2 } from 'lucide-react';
import { useCanvasStore } from '../../store';
import { openai } from '../../lib/openai';

interface StickyNote {
  id: string;
  content: string;
}

interface MarketData {
  overview: {
    industry: string;
    targetMarket: string;
    timeframe: string;
    objectives: string;
  };
  competitors: StickyNote[];
  strengths: StickyNote[];
  weaknesses: StickyNote[];
  opportunities: StickyNote[];
  threats: StickyNote[];
  strategies: StickyNote[];
}

const defaultMarketData: MarketData = {
  overview: {
    industry: '',
    targetMarket: '',
    timeframe: '',
    objectives: ''
  },
  competitors: [{ id: '1', content: '' }],
  strengths: [{ id: '1', content: '' }],
  weaknesses: [{ id: '1', content: '' }],
  opportunities: [{ id: '1', content: '' }],
  threats: [{ id: '1', content: '' }],
  strategies: [{ id: '1', content: '' }]
};

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

export const MarketAnalysis: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [marketData, setMarketData] = useState<MarketData>(() => {
    // Initialize with either existing data or defaults
    return selectedBlock?.data || defaultMarketData;
  });
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Update block data when market data changes
  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, marketData);
    }
  }, [marketData, selectedBlock, updateBlockData]);

  const handleOverviewChange = (field: keyof MarketData['overview'], value: string) => {
    setMarketData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value
      }
    }));
  };

  const handleAddNote = (section: keyof Omit<MarketData, 'overview'>) => {
    setMarketData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof Omit<MarketData, 'overview'>, id: string, content: string) => {
    setMarketData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof Omit<MarketData, 'overview'>, id: string) => {
    setMarketData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  const handleDuplicateNote = (section: keyof Omit<MarketData, 'overview'>, id: string) => {
    setMarketData(prev => {
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
            content: `You are an expert market analyst. Generate a comprehensive market analysis based on the following prompt. Include:
            - Industry overview
            - Target market analysis
            - Competitor analysis
            - SWOT analysis
            - Strategic recommendations

            Format the response as a JSON object with this structure:
            {
              "overview": {
                "industry": string,
                "targetMarket": string,
                "timeframe": string,
                "objectives": string
              },
              "competitors": [{ "id": string, "content": string }],
              "strengths": [{ "id": string, "content": string }],
              "weaknesses": [{ "id": string, "content": string }],
              "opportunities": [{ "id": string, "content": string }],
              "threats": [{ "id": string, "content": string }],
              "strategies": [{ "id": string, "content": string }]
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
        try {
          const generatedData = JSON.parse(content);
          setMarketData(generatedData);
          setShowAIDialog(false);
        } catch (error) {
          console.error('Error parsing AI response:', error);
          throw new Error('Failed to parse AI response');
        }
      }
    } catch (error) {
      console.error('Error generating market analysis:', error);
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
                <h2 className="text-xl font-semibold">Generate Market Analysis with AI</h2>
              </div>
              <button 
                onClick={() => setShowAIDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe the market or industry you want to analyze. Include any specific areas of focus, competitors, or objectives.
            </p>

            <div className="mb-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Example: Analyze the mobile payment solutions market in Southeast Asia, focusing on digital wallets and QR-based payments. Include major players like GrabPay and GoPay..."
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
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry/Domain</label>
                <textarea
                  rows={4}
                  value={marketData.overview.industry}
                  onChange={(e) => handleOverviewChange('industry', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What industry or domain are you analyzing?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Market</label>
                <textarea
                  rows={4}
                  value={marketData.overview.targetMarket}
                  onChange={(e) => handleOverviewChange('targetMarket', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Define the target market segment..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeframe</label>
                <select
                  value={marketData.overview.timeframe}
                  onChange={(e) => handleOverviewChange('timeframe', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select timeframe...</option>
                  <option value="current">Current market</option>
                  <option value="6months">Next 6 months</option>
                  <option value="1year">Next year</option>
                  <option value="2years">Next 2 years</option>
                  <option value="5years">Next 5 years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Analysis Objectives</label>
                <textarea
                  rows={4}
                  value={marketData.overview.objectives}
                  onChange={(e) => handleOverviewChange('objectives', e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="What are the key objectives of this analysis?"
                />
              </div>
            </div>
          </div>

          {/* Analysis Sections Grid */}
          <div className="md:col-span-2 space-y-8">
            <StickyNotesGroup
              title="Key Competitors"
              color="bg-blue-100"
              notes={marketData.competitors}
              onAddNote={() => handleAddNote('competitors')}
              onUpdateNote={(id, content) => handleUpdateNote('competitors', id, content)}
              onRemoveNote={(id) => handleRemoveNote('competitors', id)}
              onDuplicateNote={(id) => handleDuplicateNote('competitors', id)}
            />

            <StickyNotesGroup
              title="Market Strengths"
              color="bg-green-100"
              notes={marketData.strengths}
              onAddNote={() => handleAddNote('strengths')}
              onUpdateNote={(id, content) => handleUpdateNote('strengths', id, content)}
              onRemoveNote={(id) => handleRemoveNote('strengths', id)}
              onDuplicateNote={(id) => handleDuplicateNote('strengths', id)}
            />

            <StickyNotesGroup
              title="Market Weaknesses"
              color="bg-red-100"
              notes={marketData.weaknesses}
              onAddNote={() => handleAddNote('weaknesses')}
              onUpdateNote={(id, content) => handleUpdateNote('weaknesses', id, content)}
              onRemoveNote={(id) => handleRemoveNote('weaknesses', id)}
              onDuplicateNote={(id) => handleDuplicateNote('weaknesses', id)}
            />

            <StickyNotesGroup
              title="Market Opportunities"
              color="bg-yellow-100"
              notes={marketData.opportunities}
              onAddNote={() => handleAddNote('opportunities')}
              onUpdateNote={(id, content) => handleUpdateNote('opportunities', id, content)}
              onRemoveNote={(id) => handleRemoveNote('opportunities', id)}
              onDuplicateNote={(id) => handleDuplicateNote('opportunities', id)}
            />

            <StickyNotesGroup
              title="Market Threats"
              color="bg-orange-100"
              notes={marketData.threats}
              onAddNote={() => handleAddNote('threats')}
              onUpdateNote={(id, content) => handleUpdateNote('threats', id, content)}
              onRemoveNote={(id) => handleRemoveNote('threats', id)}
              onDuplicateNote={(id) => handleDuplicateNote('threats', id)}
            />

            <StickyNotesGroup
              title="Strategic Recommendations"
              color="bg-purple-100"
              notes={marketData.strategies}
              onAddNote={() => handleAddNote('strategies')}
              onUpdateNote={(id, content) => handleUpdateNote('strategies', id, content)}
              onRemoveNote={(id) => handleRemoveNote('strategies', id)}
              onDuplicateNote={(id) => handleDuplicateNote('strategies', id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};