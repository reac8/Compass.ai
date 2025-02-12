import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export const SwotAnalyzer: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [swotData, setSwotData] = React.useState<SwotData>(
    selectedBlock?.data?.swotData || {
      strengths: [''],
      weaknesses: [''],
      opportunities: [''],
      threats: ['']
    }
  );

  React.useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { swotData });
    }
  }, [swotData, selectedBlock, updateBlockData]);

  const handleAddItem = (category: keyof SwotData) => {
    setSwotData({
      ...swotData,
      [category]: [...swotData[category], '']
    });
  };

  const handleUpdateItem = (category: keyof SwotData, index: number, value: string) => {
    const newData = { ...swotData };
    newData[category][index] = value;
    setSwotData(newData);
  };

  const handleRemoveItem = (category: keyof SwotData, index: number) => {
    const newData = { ...swotData };
    newData[category] = newData[category].filter((_, i) => i !== index);
    setSwotData(newData);
  };

  const renderSection = (title: string, category: keyof SwotData, color: string) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${color}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {swotData[category].map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateItem(category, index, e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Add ${category}...`}
            />
            <button
              onClick={() => handleRemoveItem(category, index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddItem(category)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Item
        </button>
      </div>
    </div>
  );

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
      
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-6">SWOT Analysis</h2>
        
        <div className="grid grid-cols-2 gap-6">
          {renderSection('Strengths', 'strengths', 'border-t-4 border-green-500')}
          {renderSection('Weaknesses', 'weaknesses', 'border-t-4 border-red-500')}
          {renderSection('Opportunities', 'opportunities', 'border-t-4 border-blue-500')}
          {renderSection('Threats', 'threats', 'border-t-4 border-yellow-500')}
        </div>
      </div>
    </div>
  );
};