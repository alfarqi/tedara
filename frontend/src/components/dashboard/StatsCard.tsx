import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = '#1ab394',
  bgColor = '#e8f7f4'
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="mb-1">{value}</h3>
            {change && (
              <p className={`mb-0 fs-sm ${getChangeColor()}`}>
                <span className="me-1">{getChangeIcon()}</span>
                {change}
              </p>
            )}
          </div>
          <div className="avatar-xl">
            <span 
              className="avatar-title rounded-circle"
              style={{ backgroundColor: bgColor, color: iconColor }}
            >
              <Icon size={24} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
