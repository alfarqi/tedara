

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
}

const DonutChartCard: React.FC<DonutChartCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  badge,
  chartData 
}) => {
  return (
    <div className="card">
      <div className="card-header d-flex border-dashed justify-content-between align-items-center">
        <h5 className="card-title">{title}</h5>
        <span className={`badge badge-soft-${badge.color}`}>{badge.text}</span>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="donut-chart" data-chart="donut" style={{ minHeight: '60px', width: '60px' }}>
            {/* Chart will be rendered by JavaScript */}
          </div>
          <div className="text-end">
            <h3 className="mb-2 fw-normal">
              {value.startsWith('$') ? '$' : ''}
              {chartData ? (
                <span data-target={chartData.target}>0</span>
              ) : (
                value.replace('$', '')
              )}
              {value.includes('K') && 'K'}
            </h3>
            <p className="mb-0 text-muted">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChartCard;
