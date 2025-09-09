import React from 'react';

interface TableSkeletonProps {
  count?: number;
  columns?: number;
  className?: string;
  showAvatar?: boolean;
  showCheckbox?: boolean;
  showBadge?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  count = 8, 
  columns = 7,
  className = '',
  showAvatar = false,
  showCheckbox = false,
  showBadge = false
}) => {
  const renderSkeletonCell = (columnIndex: number) => {
    const getColumnStyle = (index: number) => {
      const columnWidths = ['120px', '280px', '120px', '120px', '120px', '100px', '200px'];
      const isCentered = [false, false, false, true, true, true, false];
      
      return {
        padding: '12px 16px',
        width: columnWidths[index] || '120px',
        textAlign: isCentered[index] ? 'center' : 'left'
      };
    };

    const cellStyle = getColumnStyle(columnIndex);

    switch (columnIndex) {
      case 0:
        if (showCheckbox) {
          return (
            <div className="d-flex align-items-center">
              <div className="skeleton-checkbox me-3" style={{ width: '16px', height: '16px' }}></div>
              <div className="skeleton-line" style={{ width: '35px', height: '14px' }}></div>
            </div>
          );
        }
        return <div className="skeleton-line" style={{ width: '60px', height: '16px' }}></div>;
      
      case 1:
        if (showAvatar) {
          return (
            <div className="d-flex align-items-center">
              <div className="skeleton-avatar me-3" style={{ width: '36px', height: '36px' }}></div>
              <div>
                <div className="skeleton-line mb-1" style={{ width: '120px', height: '16px' }}></div>
                <div className="skeleton-line" style={{ width: '160px', height: '13px' }}></div>
              </div>
            </div>
          );
        }
        return <div className="skeleton-line" style={{ width: '120px', height: '16px' }}></div>;
      
      case 2:
        return <div className="skeleton-line" style={{ width: '85px', height: '16px' }}></div>;
      
      case 3:
        return <div className="skeleton-line" style={{ width: '20px', height: '16px', margin: '0 auto' }}></div>;
      
      case 4:
        return <div className="skeleton-line" style={{ width: '45px', height: '16px', margin: '0 auto' }}></div>;
      
      case 5:
        if (showBadge) {
          return <div className="skeleton-badge" style={{ width: '50px', height: '22px', margin: '0 auto' }}></div>;
        }
        return <div className="skeleton-line" style={{ width: '100px', height: '16px' }}></div>;
      
      case 6:
        return (
          <div>
            <div className="skeleton-line mb-1" style={{ width: '110px', height: '14px' }}></div>
            <div className="skeleton-line" style={{ width: '140px', height: '13px' }}></div>
          </div>
        );
      
      default:
        return <div className="skeleton-line" style={{ width: '100px', height: '16px' }}></div>;
    }
  };

  return (
    <div className={`table-skeleton-container ${className}`}>
      <style jsx>{`
        .table-skeleton-container {
          animation: skeleton-loading 1.5s ease-in-out infinite;
        }
        
        .skeleton-line {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
        }
        
        .skeleton-avatar {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 50%;
        }
        
        .skeleton-checkbox {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
        }
        
        .skeleton-badge {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 12px;
        }
        
        @keyframes skeleton-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes skeleton-loading {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .dark .skeleton-line,
        .dark .skeleton-avatar,
        .dark .skeleton-checkbox,
        .dark .skeleton-badge {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
        }
      `}</style>
      
      <tbody>
        {Array.from({ length: count }).map((_, index) => (
          <tr key={index} style={{ height: '60px' }}>
            {Array.from({ length: columns }).map((_, colIndex) => {
              const getColumnStyle = (index: number) => {
                const columnWidths = ['120px', '280px', '120px', '120px', '120px', '100px', '200px'];
                const isCentered = [false, false, false, true, true, true, false];
                
                return {
                  padding: '12px 16px',
                  width: columnWidths[index] || '120px',
                  textAlign: isCentered[index] ? 'center' : 'left'
                };
              };

              return (
                <td key={colIndex} style={getColumnStyle(colIndex)}>
                  {renderSkeletonCell(colIndex)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default TableSkeleton;
