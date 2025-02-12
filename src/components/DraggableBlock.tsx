import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { Block } from '../types';
import { Users, LineChart, Brain, Target, Network, Box, Trash2, Plus, Link2, Copy, Edit2, Maximize2, ChevronRight, Wand2 } from 'lucide-react';
import { useCanvasStore } from '../store';

interface DraggableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: (block: Block) => void;
  onPositionChange: (x: number, y: number) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'personaBuilder':
      return Users;
    case 'insightsAnalyser':
      return LineChart;
    case 'empathyMapper':
      return Brain;
    case 'swotAnalyzer':
      return Target;
    case 'affinityMapper':
      return Network;
    default:
      return Box;
  }
};

export const DraggableBlock: React.FC<DraggableBlockProps> = memo(({
  block,
  isSelected,
  onSelect,
  onPositionChange,
}) => {
  const { 
    selectBlock,
    setShowCanvas,
    showCanvas,
    zoomLevel,
    startConnection,
    endConnection,
    connectionState
  } = useCanvasStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(block.title);
  const [showActions, setShowActions] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastPositionRef = useRef(block.position);

  const Icon = getIcon(block.type);

  // Update title when block changes
  useEffect(() => {
    setTitle(block.title);
  }, [block.title]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || isEditing) return;
    
    const container = document.getElementById('canvas-container');
    if (!container) return;

    e.stopPropagation();
    const rect = container.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX - rect.left + container.scrollLeft - block.position.x * zoomLevel,
      y: e.clientY - rect.top + container.scrollTop - block.position.y * zoomLevel
    };
    setIsDragging(true);
    lastPositionRef.current = block.position;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !container) return;

      const rect = container.getBoundingClientRect();
      const newX = (e.clientX - rect.left + container.scrollLeft - dragStartRef.current.x) / zoomLevel;
      const newY = (e.clientY - rect.top + container.scrollTop - dragStartRef.current.y) / zoomLevel;

      requestAnimationFrame(() => {
        onPositionChange(newX, newY);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [block.position.x, block.position.y, isDragging, isEditing, onPositionChange, zoomLevel]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      if (connectionState.isConnecting) {
        endConnection(block);
      } else {
        onSelect(block);
      }
    }
  }, [block, isDragging, onSelect, connectionState.isConnecting, endConnection]);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // First select the block to ensure it's loaded in state
    selectBlock(block);
    // Then hide the canvas to show the template
    setShowCanvas(false);
  }, [block, selectBlock, setShowCanvas]);

  const handleStartConnection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    startConnection(block);
  }, [block, startConnection]);

  return (
    <div
      ref={blockRef}
      style={{
        position: 'absolute',
        left: block.position.x,
        top: block.position.y,
        zIndex: isDragging || isSelected ? 100 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: `scale(${isDragging ? 1.02 : 1})`,
        transition: isDragging ? 'none' : 'all 0.2s ease',
        willChange: isDragging ? 'transform' : 'auto'
      }}
      className="relative group"
      data-block-id={block.id}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div 
        className={`w-64 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all ${
          isSelected ? 'ring-2 ring-indigo-500' : ''
        } ${isDragging ? 'shadow-2xl' : ''}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-b border-indigo-500 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="flex items-center space-x-1 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                  >
                    <Edit2 className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500">{block.description}</p>

          {/* Show original prompt if exists */}
          {block.data?._prompt && (
            <div className="mt-2 text-xs">
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                {showPrompt ? 'Hide Prompt' : 'Show Prompt'}
              </button>
              {showPrompt && (
                <div className="mt-1 p-2 bg-gray-50 rounded text-gray-600">
                  {block.data._prompt}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Open Button with Active State */}
        <div 
          className="border-t border-gray-100 p-2 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={handleExpand}
        >
          <span className="text-xs text-gray-600">Open</span>
          <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform ${
            showCanvas ? 'rotate-90' : ''
          }`} />
        </div>
      </div>

      {/* Action Buttons */}
      {(isSelected || showActions) && (
        <div className="absolute -right-12 top-0 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleExpand}
            className="w-10 h-10 bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-indigo-50 transition-all flex items-center justify-center border-2 border-indigo-600 group"
            title="Expand node"
          >
            <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Connection Points */}
      <div className={`absolute inset-0 pointer-events-none ${showActions || connectionState.isConnecting ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
        <div 
          className={`absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 ${connectionState.isConnecting ? 'border-green-500 scale-125' : 'border-indigo-500'} pointer-events-auto cursor-pointer hover:scale-125 transition-all`}
          onClick={handleStartConnection}
        />
        <div 
          className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 ${connectionState.isConnecting ? 'border-green-500 scale-125' : 'border-indigo-500'} pointer-events-auto cursor-pointer hover:scale-125 transition-all`}
          onClick={handleStartConnection}
        />
      </div>
    </div>
  );
});

DraggableBlock.displayName = 'DraggableBlock';