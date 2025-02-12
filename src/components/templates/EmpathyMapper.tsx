import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
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
}

const StickyNotesGroup: React.FC<StickyNotesGroupProps> = ({
  title,
  color,
  notes = [],
  onAddNote,
  onUpdateNote,
  onRemoveNote,
}) => (
  <div className="relative">
    <h3 className="text-sm font-medium text-gray-600 mb-4">{title}</h3>
    <div className="grid grid-cols-2 gap-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`${color} group relative p-3 rounded-lg shadow-md hover:shadow-lg transition-all transform rotate-1 hover:rotate-0`}
          style={{ minHeight: '120px' }}
        >
          <textarea
            value={note.content}
            onChange={(e) => onUpdateNote(note.id, e.target.value)}
            placeholder="Add note..."
            className="w-full h-full bg-transparent resize-none border-none focus:ring-0 text-sm"
          />
          <button
            onClick={() => onRemoveNote(note.id)}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      ))}
      <button
        onClick={onAddNote}
        className={`${color} opacity-50 hover:opacity-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all`}
        style={{ minHeight: '120px' }}
      >
        <Plus className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  </div>
);

interface EmpathyData {
  thinks: StickyNote[];
  feels: StickyNote[];
  says: StickyNote[];
  does: StickyNote[];
}

const defaultEmpathyData: EmpathyData = {
  thinks: [{ id: '1', content: '' }],
  feels: [{ id: '1', content: '' }],
  says: [{ id: '1', content: '' }],
  does: [{ id: '1', content: '' }]
};

export const EmpathyMapper: React.FC = () => {
  const { selectBlock, selectedBlock, updateBlockData } = useCanvasStore();
  const [empathyData, setEmpathyData] = useState<EmpathyData>(() => {
    return selectedBlock?.data || defaultEmpathyData;
  });

  useEffect(() => {
    if (selectedBlock) {
      updateBlockData(selectedBlock.id, empathyData);
    }
  }, [empathyData, selectedBlock, updateBlockData]);

  const handleAddNote = (section: keyof EmpathyData) => {
    setEmpathyData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Math.random().toString(36).slice(2), content: '' }]
    }));
  };

  const handleUpdateNote = (section: keyof EmpathyData, id: string, content: string) => {
    setEmpathyData(prev => ({
      ...prev,
      [section]: prev[section].map(note =>
        note.id === id ? { ...note, content } : note
      )
    }));
  };

  const handleRemoveNote = (section: keyof EmpathyData, id: string) => {
    setEmpathyData(prev => ({
      ...prev,
      [section]: prev[section].filter(note => note.id !== id)
    }));
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center sticky top-0 z-10">
        <button 
          onClick={() => selectBlock(null)}
          className="flex items-center text-blue-600 hover:text-blue-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Canvas
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-8">Empathy Map</h2>
        
        <div className="grid grid-cols-2 gap-12">
          {/* Top Row */}
          <div className="border-r border-b border-gray-200 pb-8 pr-8">
            <StickyNotesGroup
              title="THINKS"
              color="bg-yellow-100"
              notes={empathyData.thinks}
              onAddNote={() => handleAddNote('thinks')}
              onUpdateNote={(id, content) => handleUpdateNote('thinks', id, content)}
              onRemoveNote={(id) => handleRemoveNote('thinks', id)}
            />
          </div>
          <div className="border-b border-gray-200 pb-8">
            <StickyNotesGroup
              title="FEELS"
              color="bg-red-100"
              notes={empathyData.feels}
              onAddNote={() => handleAddNote('feels')}
              onUpdateNote={(id, content) => handleUpdateNote('feels', id, content)}
              onRemoveNote={(id) => handleRemoveNote('feels', id)}
            />
          </div>

          {/* Bottom Row */}
          <div className="border-r border-gray-200 pt-8 pr-8">
            <StickyNotesGroup
              title="SAYS"
              color="bg-blue-100"
              notes={empathyData.says}
              onAddNote={() => handleAddNote('says')}
              onUpdateNote={(id, content) => handleUpdateNote('says', id, content)}
              onRemoveNote={(id) => handleRemoveNote('says', id)}
            />
          </div>
          <div className="pt-8">
            <StickyNotesGroup
              title="DOES"
              color="bg-green-100"
              notes={empathyData.does}
              onAddNote={() => handleAddNote('does')}
              onUpdateNote={(id, content) => handleUpdateNote('does', id, content)}
              onRemoveNote={(id) => handleRemoveNote('does', id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};