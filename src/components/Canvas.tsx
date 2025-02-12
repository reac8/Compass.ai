import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useCanvasStore } from '../store';
import { DragItem, Block } from '../types';
import { Plus, Wand2, X } from 'lucide-react';
import { DraggableBlock } from './DraggableBlock';
import { BlockConnection } from './BlockConnection';
import { analyzeDesignProblem } from '../lib/designProblemSolver';

const MemoizedDraggableBlock = memo(DraggableBlock);
const MemoizedBlockConnection = memo(BlockConnection);

export const Canvas: React.FC = memo(() => {
  const {
    blocks,
    selectedBlock,
    connectionState,
    updateBlockPosition,
    endConnection,
    cancelConnection,
    toggleSidebar,
    addBlock,
    selectBlock,
    zoomLevel
  } = useCanvasStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Memoize drop handler
  const [, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item: DragItem, monitor) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const offset = monitor.getClientOffset();
      if (!offset) return;

      const x = (offset.x - containerRect.left + (containerRef.current?.scrollLeft || 0)) / zoomLevel;
      const y = (offset.y - containerRect.top + (containerRef.current?.scrollTop || 0)) / zoomLevel;

      // Initialize with default data based on block type
      let initialData = {};
      if (item.type === 'interviewGenerator') {
        initialData = {
          overview: {
            objective: '',
            duration: '',
            participant: '',
            preparation: ''
          },
          sections: [
            {
              id: '1',
              title: 'Introduction',
              description: 'Build rapport and set context for the interview',
              questions: [
                { id: '1', content: 'Can you tell me a bit about yourself?', timeEstimate: '2m', notes: '' },
                { id: '2', content: 'What does a typical day look like for you?', timeEstimate: '3m', notes: '' }
              ],
              collapsed: false
            }
          ]
        };
      }

      addBlock({
        id: Math.random().toString(36).substr(2, 9),
        type: item.type,
        title: item.title,
        description: item.description,
        position: { x, y },
        data: initialData
      });
    }
  }), [zoomLevel, addBlock]);

  // Space bar pan handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed) {
        setIsSpacePressed(true);
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isSpacePressed]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isSpacePressed || e.button !== 0) return;

    setIsPanning(true);
    if (containerRef.current) {
      setPanStart({ x: e.clientX, y: e.clientY });
      setScrollPosition({
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop
      });
    }
  }, [isSpacePressed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;

      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollPosition.x - deltaX;
        containerRef.current.scrollTop = scrollPosition.y - deltaY;
      }
    });
  }, [isPanning, panStart.x, panStart.y, scrollPosition.x, scrollPosition.y]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      if (containerRef.current && isSpacePressed) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  }, [isPanning, isSpacePressed]);

  const handleSolveWithAI = async () => {
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const analysis = await analyzeDesignProblem(aiPrompt);

      // Create blocks based on the analysis
      analysis.recommended_blocks.forEach((blockConfig) => {
        addBlock({
          id: Math.random().toString(36).slice(2),
          type: blockConfig.type,
          title: blockConfig.title,
          description: blockConfig.description,
          position: blockConfig.position,
          data: blockConfig.data
        });
      });

      // Add connections between blocks
      analysis.connections.forEach(connection => {
        const sourceBlock = analysis.recommended_blocks[connection.from];
        const targetBlock = analysis.recommended_blocks[connection.to];
        if (sourceBlock && targetBlock) {
          const block = blocks.find(b => b.type === sourceBlock.type);
          if (block) {
            updateBlockPosition(block.id, block.position.x, block.position.y);
          }
        }
      });

      setShowAIDialog(false);
    } catch (error) {
      console.error('Error generating solution:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      className="flex-1 overflow-auto bg-gray-50 relative"
      style={{
        cursor: isPanning ? 'grabbing' : isSpacePressed ? 'grab' : 'default'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Toolbar */}
      <div className="fixed top-20 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors"
          title="Add Block"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowAIDialog(true)}
          className="p-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-600 transition-colors"
          title="Solve with AI"
        >
          <Wand2 className="w-5 h-5" />
        </button>
      </div>

      {/* AI Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setShowAIDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Solve with AI</h2>
              </div>
              <button 
                onClick={() => setShowAIDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Describe your design challenge or problem. Our AI will analyze it and create a comprehensive solution strategy using design thinking methodology.
            </p>

            <div className="mb-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder="Example: Design a mobile app that helps people reduce their carbon footprint..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[200px]"
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
                onClick={handleSolveWithAI}
                disabled={!aiPrompt.trim() || isGenerating}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Solution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={drop}
        className="relative"
        style={{
          width: '3000px',
          height: '3000px',
          transform: `scale(${zoomLevel})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(55, 65, 81, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(55, 65, 81, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {blocks.map(block => (
          <React.Fragment key={block.id}>
            {block.connectedTo?.map(targetId => {
              const targetBlock = blocks.find(b => b.id === targetId);
              if (!targetBlock) return null;
              return (
                <MemoizedBlockConnection
                  key={`${block.id}-${targetId}`}
                  sourceBlock={block}
                  targetBlock={targetBlock}
                />
              );
            })}
            <MemoizedDraggableBlock
              block={block}
              isSelected={selectedBlock?.id === block.id}
              onSelect={() => selectBlock(block)}
              onPositionChange={(x, y) => updateBlockPosition(block.id, x, y)}
            />
          </React.Fragment>
        ))}

        {/* Active Connection Line */}
        {connectionState.isConnecting && connectionState.sourceBlock && (
          <MemoizedBlockConnection
            sourceBlock={connectionState.sourceBlock}
            targetBlock={connectionState.sourceBlock}
            isCreating={true}
          />
        )}
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';