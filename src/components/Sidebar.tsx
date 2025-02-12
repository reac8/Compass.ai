import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useCanvasStore } from '../store';
import { DragItem } from '../types';
import { 
  Users, LineChart, Brain, Target, Network, Box, X, FileText, 
  Search, Lightbulb, Layout, Wand2, TestTube, BarChart, MessageSquare
} from 'lucide-react';

const blocks = [
  // Research Phase - Top 3
  {
    type: 'interviewGenerator',
    title: 'Interview Generator',
    description: 'Create targeted interview scripts',
    Icon: MessageSquare,
    category: 'Research'
  },
  {
    type: 'marketAnalysis',
    title: 'Market Analysis',
    description: 'Analyze market competitors',
    Icon: LineChart,
    category: 'Research'
  },
  {
    type: 'personaBuilder',
    title: 'Persona Builder',
    description: 'Create user personas',
    Icon: Users,
    category: 'Research'
  },

  // Analysis Phase - Top 3
  {
    type: 'empathyMapper',
    title: 'Empathy Mapper',
    description: 'Map user experiences',
    Icon: Brain,
    category: 'Analysis'
  },
  {
    type: 'swotAnalyzer',
    title: 'SWOT Analyzer',
    description: 'Analyze strengths & weaknesses',
    Icon: Target,
    category: 'Analysis'
  },
  {
    type: 'affinityMapper',
    title: 'Affinity Mapper',
    description: 'Group related insights',
    Icon: Network,
    category: 'Analysis'
  },

  // Ideate Phase - Top 3
  {
    type: 'ideaGenerator',
    title: 'Idea Generator',
    description: 'Generate creative solutions',
    Icon: Lightbulb,
    category: 'Ideate'
  },
  {
    type: 'designSprint',
    title: 'Design Sprint',
    description: 'Run design sprint workshops',
    Icon: Wand2,
    category: 'Ideate'
  },
  {
    type: 'mindMapper',
    title: 'Mind Mapper',
    description: 'Create visual mind maps',
    Icon: Network,
    category: 'Ideate'
  },

  // Prototype Phase - Top 3
  {
    type: 'wireframeBuilder',
    title: 'Wireframe Builder',
    description: 'Create low-fi wireframes',
    Icon: Layout,
    category: 'Prototype'
  },
  {
    type: 'rapidPrototyper',
    title: 'Rapid Prototyper',
    description: 'Build quick prototypes',
    Icon: Box,
    category: 'Prototype'
  },
  {
    type: 'mvpPlanner',
    title: 'MVP Planner',
    description: 'Plan minimum viable product',
    Icon: Target,
    category: 'Prototype'
  },

  // Test Phase - Top 3
  {
    type: 'testPlanner',
    title: 'Test Planner',
    description: 'Plan user testing sessions',
    Icon: TestTube,
    category: 'Test'
  },
  {
    type: 'feedbackAnalyzer',
    title: 'Feedback Analyzer',
    description: 'Analyze user feedback',
    Icon: FileText,
    category: 'Test'
  },
  {
    type: 'heuristicReview',
    title: 'Heuristic Review',
    description: 'Evaluate usability heuristics',
    Icon: Search,
    category: 'Test'
  },

  // Measure Phase - Top 3
  {
    type: 'impactAnalyzer',
    title: 'Impact Analyzer',
    description: 'Measure feature impact',
    Icon: BarChart,
    category: 'Measure'
  },
  {
    type: 'uxMetrics',
    title: 'UX Metrics',
    description: 'Track UX performance',
    Icon: LineChart,
    category: 'Measure'
  },
  {
    type: 'roiCalculator',
    title: 'ROI Calculator',
    description: 'Calculate return on investment',
    Icon: BarChart,
    category: 'Measure'
  }
];

interface BlockItemProps {
  type: string;
  title: string;
  description: string;
  Icon: React.FC<any>;
}

const BlockItem: React.FC<BlockItemProps> = ({ type, title, description, Icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: { type, title, description },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useCanvasStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = searchQuery
      ? block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  // Group blocks by category after filtering
  const groupedBlocks = filteredBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, typeof blocks>);

  if (!isSidebarOpen) return null;

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Blocks</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-9 bg-gray-50 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedBlocks).map(([category, categoryBlocks]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 mb-3">{category}</h3>
            <div className="space-y-3">
              {categoryBlocks.map(block => (
                <BlockItem
                  key={block.type}
                  type={block.type}
                  title={block.title}
                  description={block.description}
                  Icon={block.Icon}
                />
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groupedBlocks).length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No blocks found matching your search
          </div>
        )}
      </div>
    </div>
  );
};