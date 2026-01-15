// Canvas component for visual output

import { useEffect, useRef } from 'react';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width?: number;
  height?: number;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  width = 400,
  height = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Initial white background
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
    }
  }, [canvasRef, width, height]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-ide-bg flex items-center justify-center p-4 overflow-auto"
    >
      <canvas
        ref={canvasRef}
        className="border border-ide-border shadow-lg bg-white"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};
