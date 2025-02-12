import React from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Competitor {
  id: string;
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  uniqueFeatures: string[];
  marketPosition: string;
  targetAudience: string;
  pricing: string;
}

export const CompetitorAnalysis: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [competitors, setCompetitors] = React.useState<Competitor[]>(
    selectedBlock?.data?.competitors || [
      {
        id: '1',
        name: '',
        website: '',
        strengths: [''],
        weaknesses: [''],
        uniqueFeatures: [''],
        marketPosition: '',
        targetAudience: '',
        pricing: ''
      }
    ]
  );

  React.useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { competitors });
    }
  }, [competitors, selectedBlock, updateBlockData]);

  const handleAddCompetitor = () => {
    setCompetitors([
      ...competitors,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        website: '',
        strengths: [''],
        weaknesses: [''],
        uniqueFeatures: [''],
        marketPosition: '',
        targetAudience: '',
        pricing: ''
      }
    ]);
  };

  const handleUpdateCompetitor = (id: string, field: keyof Competitor, value: any) => {
    setCompetitors(competitors.map(competitor =>
      competitor.id === id ? { ...competitor, [field]: value } : competitor
    ));
  };

  const handleAddArrayItem = (id: string, field: 'strengths' | 'weaknesses' | 'uniqueFeatures') => {
    setCompetitors(competitors.map(competitor =>
      competitor.id === id ? { ...competitor, [field]: [...competitor[field], ''] } : competitor
    ));
  };

  const handleUpdateArrayItem = (id: string, field: 'strengths' | 'weaknesses' | 'uniqueFeatures', index: number, value: string) => {
    setCompetitors(competitors.map(competitor =>
      competitor.id === id ? {
        ...competitor,
        [field]: competitor[field].map((item, i) => i === index ? value : item)
      } : competitor
    ));
  };

  const handleRemoveArrayItem = (id: string, field: 'strengths' | 'weaknesses' | 'uniqueFeatures', index: number) => {
    setCompetitors(competitors.map(competitor =>
      competitor.id === id ? {
        ...competitor,
        [field]: competitor[field].filter((_, i) => i !== index)
      } : competitor
    ));
  };

  const handleRemoveCompetitor = (id: string) => {
    setCompetitors(competitors.filter(competitor => competitor.id !== id));
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
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Competitor Analysis</h2>
          <button
            onClick={handleAddCompetitor}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Competitor
          </button>
        </div>

        <div className="space-y-8">
          {competitors.map(competitor => (
            <div key={competitor.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold">Competitor Details</h3>
                <button
                  onClick={() => handleRemoveCompetitor(competitor.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={competitor.name}
                    onChange={(e) => handleUpdateCompetitor(competitor.id, 'name', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={competitor.website}
                    onChange={(e) => handleUpdateCompetitor(competitor.id, 'website', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Strengths</h4>
                <div className="space-y-2">
                  {competitor.strengths.map((strength, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={strength}
                        onChange={(e) => handleUpdateArrayItem(competitor.id, 'strengths', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add strength..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(competitor.id, 'strengths', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddArrayItem(competitor.id, 'strengths')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Strength
                  </button>
                </div>
              </div>

              {/* Weaknesses */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Weaknesses</h4>
                <div className="space-y-2">
                  {competitor.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={weakness}
                        onChange={(e) => handleUpdateArrayItem(competitor.id, 'weaknesses', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add weakness..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(competitor.id, 'weaknesses', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddArrayItem(competitor.id, 'weaknesses')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Weakness
                  </button>
                </div>
              </div>

              {/* Unique Features */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Unique Features</h4>
                <div className="space-y-2">
                  {competitor.uniqueFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleUpdateArrayItem(competitor.id, 'uniqueFeatures', index, e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add unique feature..."
                      />
                      <button
                        onClick={() => handleRemoveArrayItem(competitor.id, 'uniqueFeatures', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddArrayItem(competitor.id, 'uniqueFeatures')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Market Position
                  </label>
                  <textarea
                    value={competitor.marketPosition}
                    onChange={(e) => handleUpdateCompetitor(competitor.id, 'marketPosition', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                    placeholder="Describe their market position..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <textarea
                    value={competitor.targetAudience}
                    onChange={(e) => handleUpdateCompetitor(competitor.id, 'targetAudience', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                    placeholder="Describe their target audience..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pricing Strategy
                  </label>
                  <textarea
                    value={competitor.pricing}
                    onChange={(e) => handleUpdateCompetitor(competitor.id, 'pricing', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                    placeholder="Describe their pricing strategy..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};