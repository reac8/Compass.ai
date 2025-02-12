export const GRID_SIZE = 20;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 2;
export const ZOOM_STEP = 0.1;

export const BLOCK_CATEGORIES = {
  research: 'Research Phase',
  analysis: 'Analysis Phase',
  ideate: 'Ideate Phase',
  prototype: 'Prototype Phase',
  test: 'Test Phase',
  measure: 'Measure Phase'
} as const;

export const BLOCK_TYPES = {
  // Research Phase (3 core methods)
  interviewGenerator: 'Interview Generator',
  marketAnalysis: 'Market Analysis',
  personaBuilder: 'Persona Builder',

  // Analysis Phase (3 core methods)
  empathyMapper: 'Empathy Mapper',
  swotAnalyzer: 'SWOT Analyzer',
  affinityMapper: 'Affinity Mapper',

  // Ideate Phase (3 core methods)
  ideaGenerator: 'Idea Generator',
  designSprint: 'Design Sprint',
  mindMapper: 'Mind Mapper',

  // Prototype Phase (3 core methods)
  wireframeBuilder: 'Wireframe Builder',
  rapidPrototyper: 'Rapid Prototyper',
  mvpPlanner: 'MVP Planner',

  // Test Phase (3 core methods)
  testPlanner: 'Test Planner',
  feedbackAnalyzer: 'Feedback Analyzer',
  heuristicReview: 'Heuristic Review',

  // Measure Phase (3 core methods)
  impactAnalyzer: 'Impact Analyzer',
  uxMetrics: 'UX Metrics',
  roiCalculator: 'ROI Calculator'
} as const;

export const BLOCK_DESCRIPTIONS = {
  // Research Phase
  interviewGenerator: 'Create targeted interview scripts',
  marketAnalysis: 'Analyze market competitors',
  personaBuilder: 'Create user personas',

  // Analysis Phase
  empathyMapper: 'Map user experiences',
  swotAnalyzer: 'Analyze strengths & weaknesses',
  affinityMapper: 'Group related insights',

  // Ideate Phase
  ideaGenerator: 'Generate creative solutions',
  designSprint: 'Run design sprint workshops',
  mindMapper: 'Create visual mind maps',

  // Prototype Phase
  wireframeBuilder: 'Create low-fi wireframes',
  rapidPrototyper: 'Quick prototype iteration',
  mvpPlanner: 'Plan minimum viable product',

  // Test Phase
  testPlanner: 'Plan user testing sessions',
  feedbackAnalyzer: 'Analyze user feedback',
  heuristicReview: 'Evaluate usability',

  // Measure Phase
  impactAnalyzer: 'Measure feature impact',
  uxMetrics: 'Track UX performance',
  roiCalculator: 'Calculate return on investment'
} as const;

export const COLORS = {
  primary: {
    DEFAULT: '#062925',
    50: '#E6ECEC',
    100: '#CCDAD9',
    200: '#99B5B3',
    300: '#668F8C',
    400: '#336A66',
    500: '#062925',
    600: '#052421',
    700: '#041F1D',
    800: '#031A18',
    900: '#021514'
  },
  accent: {
    DEFAULT: '#F7C769',
    50: '#FEF9F0',
    100: '#FEF3E1',
    200: '#FCE7C3',
    300: '#FBDBA5',
    400: '#F9CF87',
    500: '#F7C769',
    600: '#F5BF5E',
    700: '#F4B753',
    800: '#F2AF48',
    900: '#F0A73D'
  }
} as const;