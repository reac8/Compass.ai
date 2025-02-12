import React, { useRef, useEffect, useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboard';

interface MinimapProps {
  width?: number;
  height?: number;
  padding?: number;
}

export const Minimap: React.FC<MinimapProps> = ({
  width = 240,
  height = 180,
  padding = 20
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { 
    shapes, 
    scale, 
    viewportPosition,
    setViewportPosition
  } = useWhiteboardStore();

  // Calculate the bounds of all shapes
  const getBounds = () => {
    if (shapes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };

    return shapes.reduce((bounds, shape) => {
      const shapeRight = shape.x + shape.width;
      const shapeBottom = shape.y + shape.height;
      return {
        minX: Math.min(bounds.minX, shape.x),
        minY: Math.min(bounds.minY, shape.y),
        maxX: Math.max(bounds.maxX, shapeRight),
        maxY: Math.max(bounds.maxY, shapeBottom)
      };
    }, {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });
  };

  // Draw the minimap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get bounds
    const bounds = getBounds();
    const contentWidth = bounds.maxX - bounds.minX + padding * 2;
    const contentHeight = bounds.maxY - bounds.minY + padding * 2;

    // Calculate scale to fit content in minimap
    const scaleX = (width - padding * 2) / contentWidth;
    const scaleY = (height - padding * 2) / contentHeight;
    const minimapScale = Math.min(scaleX, scaleY);

    // Draw dark theme background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw subtle grid pattern
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw connections first (under the shapes)
    shapes.forEach(shape => {
      if (shape.connectedTo) {
        const x = (shape.x - bounds.minX + padding) * minimapScale;
        const y = (shape.y - bounds.minY + padding) * minimapScale;
        const w = shape.width * minimapScale;
        const h = shape.height * minimapScale;

        shape.connectedTo.forEach(targetId => {
          const targetShape = shapes.find(s => s.id === targetId);
          if (targetShape) {
            const startX = x + w / 2;
            const startY = y + h / 2;
            const endX = (targetShape.x - bounds.minX + padding) * minimapScale + targetShape.width * minimapScale / 2;
            const endY = (targetShape.y - bounds.minY + padding) * minimapScale + targetShape.height * minimapScale / 2;

            // Draw curved connection line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            // Calculate control points for curve
            const dx = endX - startX;
            const dy = endY - startY;
            const controlX = startX + dx / 2;
            const controlY = startY + dy / 2;
            
            ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            
            // Create gradient for connection
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, '#ffd700');  // Gold color
            gradient.addColorStop(1, '#daa520');  // Golden rod color
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw arrow at end
            const angle = Math.atan2(endY - controlY, endX - controlX);
            const arrowLength = 8;

            ctx.beginPath();
            ctx.moveTo(
              endX - arrowLength * Math.cos(angle - Math.PI / 6),
              endY - arrowLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(endX, endY);
            ctx.lineTo(
              endX - arrowLength * Math.cos(angle + Math.PI / 6),
              endY - arrowLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.fillStyle = '#daa520';
            ctx.fill();
          }
        });
      }
    });

    // Draw shapes
    shapes.forEach(shape => {
      const x = (shape.x - bounds.minX + padding) * minimapScale;
      const y = (shape.y - bounds.minY + padding) * minimapScale;
      const w = shape.width * minimapScale;
      const h = shape.height * minimapScale;

      // Draw shape shadow
      ctx.shadowColor = 'rgba(255, 215, 0, 0.2)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw shape background with gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + h);
      gradient.addColorStop(0, '#2a2a2a');
      gradient.addColorStop(1, '#1f1f1f');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();

      // Draw shape border with glow effect
      const borderGradient = ctx.createLinearGradient(x, y, x + w, y + h);
      borderGradient.addColorStop(0, '#ffd700');
      borderGradient.addColorStop(1, '#daa520');
      
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

    // Draw viewport rectangle with animation
    const viewportWidth = window.innerWidth / scale;
    const viewportHeight = window.innerHeight / scale;
    const viewportX = (-viewportPosition.x - bounds.minX + padding) * minimapScale;
    const viewportY = (-viewportPosition.y - bounds.minY + padding) * minimapScale;
    const viewportW = viewportWidth * minimapScale;
    const viewportH = viewportHeight * minimapScale;

    // Animated dashed border
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = -Date.now() / 50; // Animate dash pattern
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(viewportX, viewportY, viewportW, viewportH);

    // Draw viewport fill with subtle gradient
    const viewportGradient = ctx.createLinearGradient(viewportX, viewportY, viewportX, viewportY + viewportH);
    viewportGradient.addColorStop(0, 'rgba(255, 215, 0, 0.05)');
    viewportGradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
    ctx.fillStyle = viewportGradient;
    ctx.fillRect(viewportX, viewportY, viewportW, viewportH);

    // Request next animation frame for continuous dash animation
    requestAnimationFrame(() => {
      if (canvas) {
        canvas.style.opacity = '0.99'; // Trigger repaint
        setTimeout(() => {
          if (canvas) canvas.style.opacity = '1';
        }, 0);
      }
    });

  }, [shapes, scale, viewportPosition, width, height, padding]);

  // Handle minimap interaction
  const handleMinimapInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = getBounds();
    const contentWidth = bounds.maxX - bounds.minX + padding * 2;
    const contentHeight = bounds.maxY - bounds.minY + padding * 2;
    const scaleX = (width - padding * 2) / contentWidth;
    const scaleY = (height - padding * 2) / contentHeight;
    const minimapScale = Math.min(scaleX, scaleY);

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / minimapScale - padding;
    const y = (e.clientY - rect.top) / minimapScale - padding;

    setViewportPosition({
      x: -x - bounds.minX,
      y: -y - bounds.minY
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMinimapInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleMinimapInteraction(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-4 right-4 bg-[#1a1a1a]/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-50 border border-[#2a2a2a]"
    >
      <div className="text-xs font-medium text-gray-400 mb-2 select-none flex items-center justify-between">
        <span>Mind Map Overview</span>
        <span className="px-2 py-0.5 bg-[#2a2a2a] rounded-full text-gray-300 text-[10px]">
          {shapes.length} nodes
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-gray-400">
          Zoom: <span className="text-gray-300 font-medium">{Math.round(scale * 100)}%</span>
        </span>
        <span className="text-gray-400">
          {isDragging ? 'Navigating...' : 'Click to navigate'}
        </span>
      </div>
    </div>
  );
};