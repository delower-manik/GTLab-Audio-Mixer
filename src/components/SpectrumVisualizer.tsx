import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { audioEngine } from '../services/audioEngine';

interface Props {
  isPlaying: boolean;
}

export const SpectrumVisualizer: React.FC<Props> = ({ isPlaying }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 140;
    const numBars = 48;
    const barWidth = width / numBars - 3;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'none');

    // Generate initial data
    const data = Array.from({ length: numBars }, () => Math.random() * 50 + 10);

    // Bind data
    const bars = svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (_, i) => i * (width / numBars))
      .attr('width', barWidth)
      .attr('rx', 3)
      .attr('fill', (_, i) => {
        const ratio = i / numBars;
        if (ratio < 0.3) return '#10b981'; // emerald
        if (ratio < 0.7) return '#3b82f6'; // blue
        return '#8b5cf6'; // purple
      });

    let animationId: number;
    const dataArray = new Uint8Array(128);

    const render = () => {
      if (isPlaying) {
        audioEngine.getAnalyserData(dataArray);
      }

      svg.selectAll('rect')
        .data(dataArray.length > 0 && isPlaying 
          ? Array.from(dataArray).slice(0, numBars) 
          : Array.from({ length: numBars }, () => (isPlaying ? Math.random() * 80 + 20 : 5))
        )
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr('y', d => height - (Number(d) / 255) * height)
        .attr('height', d => Math.max(4, (Number(d) / 255) * height));

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 shadow-xl overflow-hidden relative">
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">Real-Time D3 Frequency Spectrum Analyzer</span>
      </div>
      <div className="w-full h-32 flex items-end pt-4">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
};
