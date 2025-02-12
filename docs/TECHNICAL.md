# Compass.ai Technical Documentation

## System Architecture

### Frontend Architecture
- **Framework**: React 18.3.1
- **State Management**: Jotai
- **Drag & Drop**: React DnD
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API

### Core Components Hierarchy
```
App
├── Dashboard
│   ├── TopNav
│   ├── Sidebar
│   └── MainContent
└── Canvas
    ├── CanvasContent
    │   ├── Toolbar
    │   │   ├── AddButton (Green)
    │   │   ├── ZoomControls
    │   │   └── AIButton
    │   ├── DraggableBlock
    │   ├── BlockConnection
    │   └── Grid
    └── Templates
        ├── PersonaBuilder
        ├── InsightsAnalyzer
        └── [Other Templates]
```

## Component Specifications

### Canvas System
```typescript
interface CanvasProps {
  blocks: Block[];
  zoomLevel: number;
  canvasSize: { width: number; height: number };
  isPanning: boolean;
  isSpacePressed: boolean;
}

// Required Features
const Canvas: React.FC = () => {
  // Space bar pan handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed) {
        setIsSpacePressed(true);
        containerRef.current.style.cursor = 'grab';
      }
    };
    // ... key handlers
  }, [isSpacePressed]);

  // Pan implementation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isSpacePressed || e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    // ... pan logic
  }, [isSpacePressed]);

  return (
    <div className="flex flex-col h-screen relative">
      {/* Toolbar */}
      <div className="fixed top-20 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors"
          title="Add Block"
        >
          <Plus className="w-5 h-5" />
        </button>
        {/* Other controls */}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-50 relative"
        style={{
          transform: `scale(${zoomLevel})`,
          cursor: isPanning ? 'grabbing' : isSpacePressed ? 'grab' : 'default'
        }}
      >
        {/* Grid and content */}
      </div>
    </div>
  );
};
```

### Error Handling

#### AI Error Handling
```typescript
try {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: problem }
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 2000,
  });

  if (!completion.choices[0]?.message?.content) {
    throw new Error('No response received from OpenAI');
  }

  let analysis: DesignProblemAnalysis;
  try {
    analysis = JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Failed to parse AI response into valid JSON');
  }

  // Validate the response structure
  if (!analysis.problem_statement || !analysis.key_challenges || !analysis.research_questions) {
    throw new Error('Invalid response structure from AI');
  }

  return analysis;
} catch (error) {
  console.error('Error analyzing design problem:', {
    error,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  throw new Error('Failed to analyze design problem. Please try again.');
}
```

### Required Implementation Details

#### 1. Toolbar Button Styling
```typescript
// Green Add Button
<button
  onClick={toggleSidebar}
  className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors"
  title="Add Block"
>
  <Plus className="w-5 h-5" />
</button>

// Secondary Buttons
<button
  onClick={zoomIn}
  className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
  title="Zoom In"
>
  <ZoomIn className="w-5 h-5 text-gray-600" />
</button>
```

#### 2. Pan Implementation
```typescript
const handleMouseMove = useCallback((e: React.MouseEvent) => {
  if (!isPanning) return;

  const deltaX = e.clientX - panStart.x;
  const deltaY = e.clientY - panStart.y;

  if (containerRef.current) {
    containerRef.current.scrollLeft = scrollPosition.x - deltaX;
    containerRef.current.scrollTop = scrollPosition.y - deltaY;
  }
}, [isPanning, panStart, scrollPosition]);
```

#### 3. Grid Background
```typescript
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
```

#### 4. Block Connection System
```typescript
const BlockConnection: React.FC<BlockConnectionProps> = ({
  sourceBlock,
  targetBlock,
  isCreating,
  mousePosition
}) => {
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    // Calculate smooth curve path
    const dx = Math.abs(targetX - sourceX);
    const controlPointOffset = Math.min(dx * 0.5, 150);
    
    const pathData = `
      M ${sourceX} ${sourceY}
      C ${sourceX + controlPointOffset} ${sourceY},
        ${targetX - controlPointOffset} ${targetY},
        ${targetX} ${targetY}
    `;

    setPath(pathData);
  }, [sourceBlock, targetBlock, mousePosition]);

  return (
    <svg className="absolute inset-0 pointer-events-none">
      <path
        d={path}
        stroke="url(#gradient)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrow)"
      />
    </svg>
  );
};
```

## Quality Assurance Checklist

### Required Features
- [x] Green add button in toolbar
- [x] Space bar activated panning
- [x] Grid background (20px spacing)
- [x] Smooth connections with arrows
- [x] Block drag and drop
- [x] Zoom controls
- [x] Error handling
- [x] Performance optimizations

### Performance Requirements
- Canvas renders at 60fps
- Smooth pan/zoom operations
- Responsive block dragging
- Quick AI response times

### Error Handling Requirements
- Connection validation
- Data validation
- API error recovery
- State consistency
- Network resilience

### Visual Requirements
- Consistent spacing
- Green add button
- White secondary buttons
- Smooth animations
- Grid background