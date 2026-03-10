/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { IonSpinner } from '@ionic/react';
import { PriceHistoryPoint } from '../types/stock';

interface PriceChartProps {
  data: PriceHistoryPoint[];
  isLoading: boolean;
  color?: string;
}

const containerStyle = css`
  width: 100%;
  padding: 8px 0;
`;

const svgStyle = css`
  width: 100%;
  height: 200px;
`;

const loadingStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

export function PriceChart({ data, isLoading, color = '#4caf50' }: PriceChartProps) {
  if (isLoading) {
    return (
      <div css={loadingStyle}>
        <IonSpinner name="dots" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div css={loadingStyle}>
        <span>No price data available</span>
      </div>
    );
  }

  const prices = data.map((d) => parseFloat(d.close));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const width = 400;
  const height = 200;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((parseFloat(d.close) - minPrice) / range) * chartHeight;
    return `${x},${y}`;
  });

  const polylinePoints = points.join(' ');

  // Build area fill path
  const firstX = padding;
  const lastX = padding + chartWidth;
  const areaPath = `M ${firstX},${height - padding} L ${points.join(' L ')} L ${lastX},${height - padding} Z`;

  return (
    <div css={containerStyle}>
      <svg css={svgStyle} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Area fill */}
        <path d={areaPath} fill={color} opacity="0.15" />
        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Min / Max labels */}
        <text x={padding} y={height - 2} fontSize="10" fill="#888">
          ${minPrice.toFixed(2)}
        </text>
        <text x={padding} y={padding - 2} fontSize="10" fill="#888">
          ${maxPrice.toFixed(2)}
        </text>
      </svg>
    </div>
  );
}
