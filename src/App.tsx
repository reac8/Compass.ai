import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { AIChatbot } from './components/AIChatbot';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { useCanvasStore } from './store';
import * as Templates from './components/templates';

function App() {
  const { showCanvas, selectedBlock } = useCanvasStore();

  // If we have a selected block, show its template
  if (selectedBlock) {
    // Map block types to template components
    const templateMap: { [key: string]: React.ComponentType } = {
      interviewGenerator: Templates.InterviewGenerator,
      marketAnalysis: Templates.MarketAnalysis,
      trendRadar: Templates.TrendRadar,
      competitiveMatrix: Templates.CompetitiveMatrix,
      patternRecognition: Templates.PatternRecognition,
      empathyMapper: Templates.EmpathyMapper,
      personaBuilder: Templates.PersonaBuilder,
      swotAnalyzer: Templates.SwotAnalyzer,
      ideaGenerator: Templates.IdeaGenerator,
      designSprint: Templates.DesignSprint,
      mindMapper: Templates.MindMapper,
      valueProposition: Templates.ValueProposition,
      wireframeBuilder: Templates.WireframeBuilder,
      rapidPrototyper: Templates.RapidPrototyper,
      storyboarder: Templates.Storyboarder,
      mvpPlanner: Templates.MVPPlanner,
      testPlanner: Templates.TestPlanner,
      feedbackAnalyzer: Templates.FeedbackAnalyzer,
      heuristicReview: Templates.HeuristicReview,
      a11yTester: Templates.A11YTester,
      impactAnalyzer: Templates.ImpactAnalyzer,
      sentimentTracker: Templates.SentimentTracker,
      roiCalculator: Templates.ROICalculator
    };

    // Get the template component for this block type
    const TemplateComponent = templateMap[selectedBlock.type];
    if (TemplateComponent) {
      return <TemplateComponent />;
    }
  }

  // If no template or not showing canvas, show dashboard
  if (!showCanvas) {
    return <Dashboard />;
  }

  // Otherwise show the main canvas
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <AIChatbot />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;