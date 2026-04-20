'use client';

import React, { useEffect, useRef, memo } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type LineData,
  CrosshairMode,
  LineStyle,
  ColorType,
} from 'lightweight-charts';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OHLCVBar {
  time: number;     // Unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Props {
  bars: OHLCVBar[];
  onCrosshairMove?: (bar: OHLCVBar | null) => void;
}

// ─── MA helper ────────────────────────────────────────────────────────────────
function calcMA(bars: OHLCVBar[], period: number): LineData[] {
  const result: LineData[] = [];
  for (let i = period - 1; i < bars.length; i++) {
    const avg =
      bars.slice(i - period + 1, i + 1).reduce((s, b) => s + b.close, 0) / period;
    result.push({ time: bars[i].time as any, value: parseFloat(avg.toFixed(8)) });
  }
  return result;
}

// ─── Colours ─────────────────────────────────────────────────────────────────
const UP_COLOR   = '#0ecb81';
const DOWN_COLOR = '#f6465d';
const BG_COLOR   = '#0b0e11';
const GRID_COLOR = '#1e2329';
const TEXT_COLOR = '#848e9c';

const ProfessionalChart: React.FC<Props> = memo(({ bars, onCrosshairMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const candleRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef    = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ma7Ref       = useRef<ISeriesApi<'Line'> | null>(null);
  const ma25Ref      = useRef<ISeriesApi<'Line'> | null>(null);

  // ── Create chart once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background:  { type: ColorType.Solid, color: BG_COLOR },
        textColor:   TEXT_COLOR,
        fontFamily:  '"Inter", "SF Pro Display", sans-serif',
        fontSize:    11,
      },
      grid: {
        vertLines: { color: GRID_COLOR, style: LineStyle.Dashed },
        horzLines: { color: GRID_COLOR, style: LineStyle.Dashed },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width:                1,
          color:                '#4b5563',
          style:                LineStyle.Dashed,
          labelBackgroundColor: '#1e2329',
        },
        horzLine: {
          width:                1,
          color:                '#4b5563',
          style:                LineStyle.Dashed,
          labelBackgroundColor: '#1e2329',
        },
      },
      rightPriceScale: {
        borderColor: GRID_COLOR,
        scaleMargins: { top: 0.06, bottom: 0.25 },
      },
      leftPriceScale: { visible: false },
      timeScale: {
        borderColor:    GRID_COLOR,
        timeVisible:    true,
        secondsVisible: false,
        fixLeftEdge:    true,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale:  { mouseWheel: true, pinch: true },
    });

    // ── CandlestickSeries (v5 API) ────────────────────────────────────────
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:          UP_COLOR,
      downColor:        DOWN_COLOR,
      borderUpColor:    UP_COLOR,
      borderDownColor:  DOWN_COLOR,
      wickUpColor:      UP_COLOR,
      wickDownColor:    DOWN_COLOR,
      priceLineVisible: true,
      priceLineWidth:   1,
      priceLineColor:   '#f0b90b',
      priceLineStyle:   LineStyle.Dashed,
      lastValueVisible: true,
    });

    // ── Volume Histogram ─────────────────────────────────────────────────
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat:  { type: 'volume' },
      priceScaleId: '',                   // overlay on the main pane
      color:        '#26304280',
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.78, bottom: 0 },
    });

    // ── MA7 ──────────────────────────────────────────────────────────────
    const ma7Series = chart.addSeries(LineSeries, {
      color:                  '#f0b90b',
      lineWidth:              1,
      priceLineVisible:       false,
      lastValueVisible:       false,
      crosshairMarkerVisible: false,
    });

    // ── MA25 ─────────────────────────────────────────────────────────────
    const ma25Series = chart.addSeries(LineSeries, {
      color:                  '#7b61ff',
      lineWidth:              1,
      priceLineVisible:       false,
      lastValueVisible:       false,
      crosshairMarkerVisible: false,
    });

    chartRef.current  = chart;
    candleRef.current = candleSeries;
    volumeRef.current = volumeSeries;
    ma7Ref.current    = ma7Series;
    ma25Ref.current   = ma25Series;

    // ── Auto-resize ──────────────────────────────────────────────────────
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height });
      }
    });
    ro.observe(containerRef.current);

    // ── Crosshair hover callback ─────────────────────────────────────────
    if (onCrosshairMove) {
      chart.subscribeCrosshairMove(param => {
        if (!param?.time || !param.seriesData) {
          onCrosshairMove(null);
          return;
        }
        const d = param.seriesData.get(candleSeries) as CandlestickData | undefined;
        const v = param.seriesData.get(volumeSeries) as HistogramData | undefined;
        if (d) {
          onCrosshairMove({
            time:   param.time as number,
            open:   d.open,
            high:   d.high,
            low:    d.low,
            close:  d.close,
            volume: v?.value ?? 0,
          });
        }
      });
    }

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current  = null;
      candleRef.current = null;
      volumeRef.current = null;
      ma7Ref.current    = null;
      ma25Ref.current   = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update data whenever bars change ─────────────────────────────────────
  useEffect(() => {
    if (!candleRef.current || !volumeRef.current || !ma7Ref.current || !ma25Ref.current) return;
    if (bars.length === 0) return;

    const candleData: CandlestickData[] = bars.map(b => ({
      time:  b.time as any,
      open:  b.open,
      high:  b.high,
      low:   b.low,
      close: b.close,
    }));
    candleRef.current.setData(candleData);

    const volumeData: HistogramData[] = bars.map(b => ({
      time:  b.time as any,
      value: b.volume,
      color: b.close >= b.open ? `${UP_COLOR}55` : `${DOWN_COLOR}55`,
    }));
    volumeRef.current.setData(volumeData);

    ma7Ref.current.setData(calcMA(bars, 7));
    ma25Ref.current.setData(calcMA(bars, 25));

    chartRef.current?.timeScale().scrollToRealTime();
  }, [bars]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: 420 }}
    />
  );
});

ProfessionalChart.displayName = 'ProfessionalChart';
export default ProfessionalChart;
