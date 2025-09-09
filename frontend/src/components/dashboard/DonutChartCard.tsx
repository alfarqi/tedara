

import React, { useEffect, useRef } from 'react';

interface DonutChartCardProps {
  title: string;
  value: string;
  subtitle: string;
  badge: {
    text: string;
    color: string;
  };
  chartData?: {
    target: number;
    current: number;
  };
  growth?: {
    value: number;
    isPositive: boolean;
  };
}

const DonutChartCard: React.FC<DonutChartCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  badge,
  chartData,
  growth 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateRandomData = () => {
      const data = ["A", "B", "C"].map(name => ({
        name: name,
        value: Math.floor(Math.random() * 100) + 1
      }));
      
      let total = data.reduce((sum, item) => sum + item.value, 0);
      data.forEach(item => {
        item.value = (item.value / total) * 100;
      });
      
      return data;
    };

    const initializeChart = () => {
      if (!chartRef.current || typeof window.echarts === 'undefined') {
        return;
      }

      // Use the same random data generation as the reference
      const data = generateRandomData();

      const chart = window.echarts.init(chartRef.current);
      
      const option = {
        tooltip: {
          show: false
        },
        series: [{
          type: 'pie',
          radius: ['65%', '100%'],
          hoverAnimation: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: data.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: index === 0 ? '#6f42c1' : index === 1 ? '#6c757d' : '#bbcae14d' // Purple for first, secondary for second, light gray for third
            }
          }))
        }]
      };

      chart.setOption(option);

      // Handle resize
      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeChart, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="card">
      <div className="card-header d-flex border-dashed justify-content-between align-items-center">
        <h5 className="card-title">{title}</h5>
        <span className={`badge badge-soft-${badge.color}`}>{badge.text}</span>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div 
            ref={chartRef}
            style={{ minHeight: '60px', width: '60px' }}
          />
          <div className="text-end">
            <h3 className="mb-2 fw-normal">
              {value}
            </h3>
            <p className="mb-0 text-muted">{subtitle}</p>
            {growth && (
              <div className="d-flex align-items-center justify-content-end gap-1 mt-1">
                <i className={`ti ti-arrow-${growth.isPositive ? 'up' : 'down'} ${growth.isPositive ? 'text-success' : 'text-danger'}`}></i>
                <span className={`fs-sm ${growth.isPositive ? 'text-success' : 'text-danger'}`}>
                  {Math.abs(growth.value).toFixed(1)}%
                </span>
                <span className="text-muted fs-xs">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChartCard;
