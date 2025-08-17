import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartWidgetProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  period: string;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  value,
  change,
  changeType,
  period
}) => {
  // Simple chart visualization using CSS
  const chartData = [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90];
  const maxValue = Math.max(...chartData);
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="mb-1">{value}</h3>
            <div className="d-flex align-items-center gap-2">
              {changeType === 'positive' ? (
                <TrendingUp size={16} className="text-success" />
              ) : (
                <TrendingDown size={16} className="text-danger" />
              )}
              <span className={`fs-sm ${changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                {change}
              </span>
              <span className="text-muted fs-xs">vs {period}</span>
            </div>
          </div>
        </div>
        
        {/* Simple Chart Visualization */}
        <div className="chart-container" style={{ height: '100px', marginTop: '1rem' }}>
          <div className="d-flex align-items-end justify-content-between h-100 gap-1">
            {chartData.map((value, index) => (
              <div
                key={index}
                className="chart-bar bg-primary"
                style={{
                  height: `${(value / maxValue) * 100}%`,
                  minHeight: '4px',
                  flex: 1,
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.7
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
