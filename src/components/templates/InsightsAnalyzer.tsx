import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCanvasStore } from '../../store';

export const InsightsAnalyzer: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [insights, setInsights] = React.useState<string[]>(
    selectedBlock?.data?.insights || ['']
  );

  React.useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { insights });
    }
  }, [insights, selectedBlock, updateBlockData]);

  const handleAddInsight = () => {
    setInsights([...insights, '']);
  };

  const handleUpdateInsight = (index: number, value: string) => {
    const newInsights = [...insights];
    newInsights[index] = value;
    setInsights(newInsights);
  };

  const handleRemoveInsight = (index: number) => {
    setInsights(insights.filter((_, i) => i !== index));
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">Insights Analysis</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insight {index + 1}
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        value={insight}
                        onChange={(e) => handleUpdateInsight(index, e.target.value)}
                        className="flex-1 min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe your insight here..."
                      />
                      <button
                        onClick={() => handleRemoveInsight(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddInsight}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Insight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};