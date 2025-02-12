import React from 'react';
import { useWhiteboardStore } from '../store/whiteboard';
import rough from 'roughjs';

export const ShapesLayer: React.FC = () => {
  const { shapes } = useWhiteboardStore();
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const rc = rough.svg(svgRef.current);
    const ctx = svgRef.current;

    // Clear previous drawings
    while (ctx.firstChild) {
      ctx.removeChild(ctx.firstChild);
    }

    // Draw all shapes
    shapes.forEach(shape => {
      let element;

      switch (shape.type) {
        case 'rectangle':
          element = rc.rectangle(
            shape.x,
            shape.y,
            shape.width,
            shape.height,
            { roughness: 0.5 }
          );
          break;
        case 'circle':
          element = rc.ellipse(
            shape.x + shape.width / 2,
            shape.y + shape.height / 2,
            shape.width,
            shape.height,
            { roughness: 0.5 }
          );
          break;
        case 'line':
          element = rc.line(
            shape.x,
            shape.y,
            shape.x + shape.width,
            shape.y + shape.height,
            { roughness: 0.5 }
          );
          break;
        case 'arrow':
          const arrowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          
          // Line part
          const line = rc.line(
            shape.x,
            shape.y,
            shape.x + shape.width,
            shape.y + shape.height,
            { roughness: 0.5 }
          );
          
          // Arrow head
          const angle = Math.atan2(shape.height, shape.width);
          const arrowLength = 20;
          const arrowAngle = Math.PI / 6;
          
          const x2 = shape.x + shape.width;
          const y2 = shape.y + shape.height;
          
          const arrow1 = rc.line(
            x2,
            y2,
            x2 - arrowLength * Math.cos(angle - arrowAngle),
            y2 - arrowLength * Math.sin(angle - arrowAngle),
            { roughness: 0.5 }
          );
          
          const arrow2 = rc.line(
            x2,
            y2,
            x2 - arrowLength * Math.cos(angle + arrowAngle),
            y2 - arrowLength * Math.sin(angle + arrowAngle),
            { roughness: 0.5 }
          );
          
          arrowGroup.appendChild(line);
          arrowGroup.appendChild(arrow1);
          arrowGroup.appendChild(arrow2);
          
          element = arrowGroup;
          break;
      }

      if (element) {
        if (shape.rotation) {
          const bbox = element.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;
          element.setAttribute(
            'transform',
            `rotate(${shape.rotation} ${centerX} ${centerY})`
          );
        }
        ctx.appendChild(element);
      }
    });
  }, [shapes]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0"
      style={{ zIndex: 1 }}
    />
  );
};