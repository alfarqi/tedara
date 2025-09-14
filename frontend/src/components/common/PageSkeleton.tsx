import React from 'react';

interface PageSkeletonProps {
  type?: 'list' | 'table' | 'grid' | 'form' | 'card';
  count?: number;
  className?: string;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ 
  type = 'list', 
  count = 5, 
  className = '' 
}) => {
  const renderSkeletonItem = () => {
    switch (type) {
      case 'list':
        return (
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
            <div className="flex-grow-1">
              <div className="skeleton-line mb-2" style={{ width: '60%', height: '20px' }}></div>
              <div className="skeleton-line" style={{ width: '40%', height: '16px' }}></div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="skeleton-line" style={{ width: '50px', height: '30px', borderRadius: '15px' }}></div>
              <div className="skeleton-line" style={{ width: '30px', height: '30px', borderRadius: '4px' }}></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <tr>
            <td>
              <div className="d-flex align-items-center">
                <div className="skeleton-line me-2" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
                <div className="skeleton-line" style={{ width: '120px', height: '16px' }}></div>
              </div>
            </td>
            <td>
              <div className="skeleton-line" style={{ width: '140px', height: '16px' }}></div>
            </td>
            <td>
              <div className="skeleton-line" style={{ width: '100px', height: '16px' }}></div>
            </td>
            <td>
              <div className="skeleton-line" style={{ width: '60px', height: '16px' }}></div>
            </td>
            <td>
              <div className="skeleton-line" style={{ width: '80px', height: '16px' }}></div>
            </td>
            <td>
              <div className="skeleton-line" style={{ width: '100px', height: '16px' }}></div>
            </td>
            <td>
              <div className="skeleton-line" style={{ width: '60px', height: '20px', borderRadius: '10px' }}></div>
            </td>
            <td>
              <div className="d-flex gap-1">
                <div className="skeleton-line" style={{ width: '28px', height: '28px', borderRadius: '4px' }}></div>
                <div className="skeleton-line" style={{ width: '28px', height: '28px', borderRadius: '4px' }}></div>
              </div>
            </td>
          </tr>
        );
      
      case 'grid':
        return (
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="skeleton-line" style={{ width: '100%', height: '200px', borderRadius: '8px 8px 0 0' }}></div>
              <div className="card-body">
                <div className="skeleton-line mb-2" style={{ width: '80%', height: '20px' }}></div>
                <div className="skeleton-line mb-3" style={{ width: '100%', height: '16px' }}></div>
                <div className="skeleton-line mb-3" style={{ width: '60%', height: '16px' }}></div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="skeleton-line" style={{ width: '80px', height: '16px' }}></div>
                  <div className="skeleton-line" style={{ width: '60px', height: '32px', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'form':
        return (
          <div className="mb-3">
            <div className="skeleton-line mb-2" style={{ width: '20%', height: '16px' }}></div>
            <div className="skeleton-line" style={{ width: '100%', height: '40px', borderRadius: '4px' }}></div>
          </div>
        );
      
      case 'card':
        return (
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="skeleton-line me-2" style={{ width: '24px', height: '24px', borderRadius: '4px' }}></div>
                  <div className="skeleton-line" style={{ width: '150px', height: '20px' }}></div>
                </div>
                <div className="skeleton-line" style={{ width: '120px', height: '36px', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div className="card-body">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="d-flex align-items-center justify-content-between p-3 border-bottom">
                  <div className="flex-grow-1">
                    <div className="skeleton-line mb-2" style={{ width: '60%', height: '20px' }}></div>
                    <div className="skeleton-line" style={{ width: '40%', height: '16px' }}></div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="skeleton-line" style={{ width: '50px', height: '30px', borderRadius: '15px' }}></div>
                    <div className="skeleton-line" style={{ width: '30px', height: '30px', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="d-flex align-items-center p-3 border-bottom">
            <div className="skeleton-line me-3" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
            <div className="flex-grow-1">
              <div className="skeleton-line mb-2" style={{ width: '70%', height: '18px' }}></div>
              <div className="skeleton-line" style={{ width: '50%', height: '14px' }}></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`skeleton-container ${className}`}>
      <style>{`
        .skeleton-container {
          animation: skeleton-loading 1.5s ease-in-out infinite;
        }
        
        .skeleton-line {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
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
        
        .dark .skeleton-line {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
        }
      `}</style>
      
      {type === 'table' ? (
        <tbody>
          {Array.from({ length: count }).map((_, index) => (
            <React.Fragment key={index}>
              {renderSkeletonItem()}
            </React.Fragment>
          ))}
        </tbody>
      ) : type === 'grid' ? (
        <div className="row">
          {Array.from({ length: count }).map((_, index) => (
            <React.Fragment key={index}>
              {renderSkeletonItem()}
            </React.Fragment>
          ))}
        </div>
      ) : (
        Array.from({ length: count }).map((_, index) => (
          <React.Fragment key={index}>
            {renderSkeletonItem()}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default PageSkeleton;
