// ... (keep all imports and interfaces)

export const MindMapper: React.FC = () => {
  // ... (keep all state and handlers until renderConnections)

  const renderConnections = () => {
    return connections.map(conn => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      if (!fromNode || !toNode) return null;

      // Calculate control points for curved line
      const dx = toNode.position.x - fromNode.position.x;
      const dy = toNode.position.y - fromNode.position.y;
      const controlX = fromNode.position.x + dx / 2;
      const controlY = fromNode.position.y + dy / 2;

      const path = `M ${fromNode.position.x} ${fromNode.position.y} 
                   Q ${controlX} ${controlY} ${toNode.position.x} ${toNode.position.y}`;

      // Calculate position for prompt button
      const buttonX = controlX;
      const buttonY = controlY;

      return (
        <g key={conn.id} style={{ pointerEvents: 'all' }}>
          <path
            d={path}
            stroke="#E5E7EB"
            strokeWidth="2"
            fill="none"
            className="transition-all duration-300"
          />
          
          {/* Prompt Button */}
          <g
            transform={`translate(${buttonX - 12}, ${buttonY - 12})`}
            onClick={(e) => handlePromptClick(e, conn)}
            className="cursor-pointer hover:scale-110 transition-transform"
            style={{ pointerEvents: 'all' }}
          >
            <rect
              x="0"
              y="0"
              width="24"
              height="24"
              fill="white"
              rx="6"
              className="shadow-sm"
              stroke={conn.prompt ? '#3B82F6' : '#E5E7EB'}
              strokeWidth="2"
            />
            <MessageSquare
              className={`w-4 h-4 ${conn.prompt ? 'text-blue-500' : 'text-gray-400'}`}
              style={{
                transform: 'translate(4px, 4px)'
              }}
            />
          </g>
        </g>
      );
    });
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-hidden">
      {/* Keep AI Dialog */}
      {/* Keep Prompt Dialog */}

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
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate with AI
        </button>
      </div>
      
      <div 
        id="mind-map-container"
        className="relative w-full h-[calc(100vh-3rem)] overflow-auto"
        onMouseMove={e => draggedNode && handleDrag(e)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <svg
          className="absolute inset-0"
          style={{ 
            minWidth: '100%', 
            minHeight: '100%',
            pointerEvents: 'none'
          }}
        >
          {renderConnections()}
        </svg>
        {renderNodes()}
      </div>
    </div>
  );
};