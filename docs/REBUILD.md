# Compass.ai Rebuild Guide

## Project Overview
Compass.ai is an AI-powered knowledge management and design thinking platform with the following core features:

1. Infinite Canvas System
   - Draggable blocks
   - Block connections
   - Space bar panning
   - Zoom controls
   - Grid background

2. AI-Powered Assistance
   - OpenAI integration
   - Context-aware suggestions
   - Block-specific AI generation
   - Natural language processing

3. Design System Integration
   - Ant Design (default)
   - Material Design support
   - Figma import capability
   - Design token management

4. Analytics Integration
   - Google Analytics 4
   - Mixpanel
   - Amplitude
   - Hotjar
   - Plausible
   - PostHog

## Technical Stack

### Core Technologies
- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- Jotai (State Management)
- Lucide React (Icons)

### Key Dependencies
```json
{
  "dependencies": {
    "@use-gesture/react": "^10.3.0",
    "jotai": "^2.7.0",
    "lucide-react": "^0.344.0",
    "openai": "^4.28.0",
    "react": "^18.3.1",
    "react-dnd": "^16.0.1", 
    "react-dnd-html5-backend": "^16.0.1",
    "react-dom": "^18.3.1"
  }
}
```

## Project Structure

### Core Components
1. Dashboard
   - Navigation
   - Sidebar
   - Main content area
   - AI chat interface

2. Canvas System
   - Infinite scrollable workspace
   - Block management
   - Connection system
   - Grid background

3. Block Templates
   - Research phase templates
   - Analysis phase templates
   - Ideation phase templates
   - Prototyping templates
   - Testing templates
   - Measurement templates

4. Integration System
   - Design system manager
   - Analytics integrations
   - Knowledge base
   - AI capabilities

## Implementation Steps

1. Project Setup
```bash
npm create vite@latest compass-ai -- --template react-ts
cd compass-ai
npm install
```

2. Install Dependencies
```bash
npm install @use-gesture/react jotai lucide-react openai react-dnd react-dnd-html5-backend
```

3. Configure Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Environment Setup
```bash
# .env
VITE_OPENAI_API_KEY=your_openai_api_key
```

5. Implementation Order
   1. Core layout and navigation
   2. Canvas system
   3. Block templates
   4. AI integration
   5. Design system
   6. Analytics
   7. Knowledge base

## Key Features Implementation

### 1. Canvas System
- Implement infinite scrollable workspace
- Add block drag and drop
- Create connection system
- Add zoom and pan controls

### 2. Block System
- Create block templates
- Implement block data management
- Add block connections
- Enable AI-powered block generation

### 3. AI Integration
- Setup OpenAI client
- Implement prompt templates
- Create AI-powered suggestions
- Add context-aware assistance

### 4. Design System
- Implement design token management
- Add component library integration
- Create Figma import capability
- Enable theme customization

### 5. Analytics
- Setup analytics platforms
- Implement tracking system
- Create analytics dashboard
- Enable custom event tracking

### 6. Knowledge Base
- Create knowledge entry system
- Implement search functionality
- Add categorization
- Enable file uploads

## File Structure
```
src/
  components/
    Dashboard/
    Canvas/
    Templates/
    Integrations/
  lib/
    openai.ts
    designSystem.ts
    knowledgeSearch.ts
    blockConnector.ts
  store/
    index.ts
    whiteboard.ts
    knowledgeBase.ts
  types/
    index.ts
```

## Key Considerations

1. Performance
   - Use React.memo for components
   - Implement virtualization for large lists
   - Optimize canvas rendering
   - Use efficient state management

2. Security
   - Secure API key handling
   - Input validation
   - Data sanitization
   - Error handling

3. Accessibility
   - ARIA labels
   - Keyboard navigation
   - Focus management
   - Screen reader support

4. Error Handling
   - Graceful degradation
   - Error boundaries
   - User feedback
   - Fallback UI

5. Testing
   - Unit tests
   - Integration tests
   - E2E tests
   - Performance testing

## Development Guidelines

1. Code Style
   - Use TypeScript
   - Follow ESLint rules
   - Maintain consistent formatting
   - Write clear documentation

2. Component Structure
   - Functional components
   - Custom hooks
   - Proper prop typing
   - Clear component boundaries

3. State Management
   - Use Jotai for global state
   - Local state when appropriate
   - Proper state organization
   - Efficient updates

4. Performance Optimization
   - Memoization
   - Code splitting
   - Lazy loading
   - Bundle optimization

## Deployment

1. Build Process
```bash
npm run build
```

2. Environment Variables
   - OpenAI API key
   - Analytics tokens
   - Other API keys

3. Hosting
   - Static hosting
   - CDN configuration
   - Environment setup
   - SSL certificates

## Maintenance

1. Regular Updates
   - Dependency updates
   - Security patches
   - Feature enhancements
   - Bug fixes

2. Monitoring
   - Error tracking
   - Performance monitoring
   - Usage analytics
   - User feedback

3. Documentation
   - Code documentation
   - API documentation
   - User guides
   - Contribution guidelines