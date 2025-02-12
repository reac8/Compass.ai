import React from 'react';
import {
  MousePointer2,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  StickyNote,
  Type,
  Image as ImageIcon,
  Grid as GridIcon,
  Download,
  Undo2,
  Redo2,
  Layout
} from 'lucide-react';
import { useWhiteboardStore } from '../store/whiteboard';

export const Toolbar: React.FC = () => {
  const {
    selectedTool,
    setSelectedTool,
    gridEnabled,
    toggleGrid,
    snapToGrid,
    toggleSnapToGrid,
    undo,
    redo,
    canUndo,
    canRedo,
    toggleTemplates,
    toggleExportPanel
  } = useWhiteboardStore();

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'sticky', icon: StickyNote, label: 'Sticky Note' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: ImageIcon, label: 'Image' }
  ];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-1.5 flex items-center gap-1 z-50">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => setSelectedTool(tool.id)}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            selectedTool === tool.id ? 'bg-gray-100' : ''
          }`}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
        </button>
      ))}

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={toggleGrid}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          gridEnabled ? 'bg-gray-100' : ''
        }`}
        title="Toggle Grid"
      >
        <GridIcon className="w-5 h-5" />
      </button>

      <button
        onClick={toggleSnapToGrid}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          snapToGrid ? 'bg-gray-100' : ''
        }`}
        title="Snap to Grid"
      >
        <Layout className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={undo}
        disabled={!canUndo}
        className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
        title="Undo"
      >
        <Undo2 className="w-5 h-5" />
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
        title="Redo"
      >
        <Redo2 className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        onClick={toggleTemplates}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Templates"
      >
        <Layout className="w-5 h-5" />
      </button>

      <button
        onClick={toggleExportPanel}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Export"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};