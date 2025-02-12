import React from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useCanvasStore } from '../../store';

interface Interview {
  id: string;
  participant: string;
  date: string;
  duration: string;
  keyFindings: string[];
  quotes: string[];
  observations: string[];
}

export const InterviewAnalysis: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [interviews, setInterviews] = React.useState<Interview[]>(
    selectedBlock?.data?.interviews || [
      {
        id: '1',
        participant: '',
        date: '',
        duration: '',
        keyFindings: [''],
        quotes: [''],
        observations: ['']
      }
    ]
  );

  React.useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, { interviews });
    }
  }, [interviews, selectedBlock, updateBlockData]);

  const handleAddInterview = () => {
    setInterviews([
      ...interviews,
      {
        id: Math.random().toString(36).substr(2, 9),
        participant: '',
        date: '',
        duration: '',
        keyFindings: [''],
        quotes: [''],
        observations: ['']
      }
    ]);
  };

  const handleUpdateInterview = (id: string, field: keyof Interview, value: any) => {
    setInterviews(interviews.map(interview =>
      interview.id === id ? { ...interview, [field]: value } : interview
    ));
  };

  const handleAddArrayItem = (id: string, field: 'keyFindings' | 'quotes' | 'observations') => {
    setInterviews(interviews.map(interview =>
      interview.id === id ? { ...interview, [field]: [...interview[field], ''] } : interview
    ));
  };

  const handleUpdateArrayItem = (id: string, field: 'keyFindings' | 'quotes' | 'observations', index: number, value: string) => {
    setInterviews(interviews.map(interview =>
      interview.id === id ? {
        ...interview,
        [field]: interview[field].map((item, i) => i === index ? value : item)
      } : interview
    ));
  };

  const handleRemoveArrayItem = (id: string, field: 'keyFindings' | 'quotes' | 'observations', index: number) => {
    setInterviews(interviews.map(interview =>
      interview.id === id ? {
        ...interview,
        [field]: interview[field].filter((_, i) => i !== index)
      } : interview
    ));
  };

  const handleRemoveInterview = (id: string) => {
    setInterviews(interviews.filter(interview => interview.id !== id));
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
          <h2 className="text-2xl font-semibold">Interview Analysis</h2>
          <button
            onClick={handleAddInterview}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Interview
          </button>
        </div>

        <div className="space-y-8">
          {interviews.map(interview => (
            <div key={interview.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold">Interview Details</h3>
                <button
                  onClick={() => handleRemoveInterview(interview.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participant
                  </label>
                  <input
                    type="text"
                    value={interview.participant}
                    onChange={(e) => handleUpdateInterview(interview.id, 'participant', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Participant name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={interview.date}
                    onChange={(e) => handleUpdateInterview(interview.id, 'date', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={interview.duration}
                    onChange={(e) => handleUpdateInterview(interview.id, 'duration', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 45 minutes"
                  />
                </div>
              </div>

              {/* Key Findings */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Key Findings</h4>
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
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Notable Quotes</h4>
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
                <h4 className="text-lg font-medium mb-2">Observations</h4>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};