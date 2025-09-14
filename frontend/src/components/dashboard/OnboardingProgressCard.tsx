import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../hooks/useUserStore';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link: string;
  icon: string;
  subSteps: {
    completed: number;
    total: number;
  };
}

interface OnboardingProgressCardProps {
  steps: OnboardingStep[];
  completedSteps: number;
  totalSteps: number;
}

const OnboardingProgressCard: React.FC<OnboardingProgressCardProps> = ({
  steps,
  completedSteps,
  totalSteps
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check localStorage for saved collapsed state
    const savedState = localStorage.getItem('onboarding-card-collapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const { store } = useUserStore();

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Save the state to localStorage
    localStorage.setItem('onboarding-card-collapsed', JSON.stringify(newCollapsedState));
  };

  // Add/remove class to body when collapsed state changes
  React.useEffect(() => {
    if (isCollapsed) {
      document.documentElement.classList.add('onboarding-collapsed');
    } else {
      document.documentElement.classList.remove('onboarding-collapsed');
    }
    
    // Cleanup on unmount
    return () => {
      document.documentElement.classList.remove('onboarding-collapsed');
    };
  }, [isCollapsed]);

  return (
    <>
      {/* CSS for height adjustment when onboarding is collapsed */}
      <style>
        {`
          html[data-sidenav-size="condensed"].onboarding-collapsed .content-page {
            height: calc(100vh - 120px) !important;
            min-height: calc(100vh - 120px) !important;
          }
          
          html.onboarding-collapsed .content-page {
            height: calc(100vh - 120px) !important;
            min-height: calc(100vh - 120px) !important;
          }
        `}
      </style>
      
      <div className={`card mb-4 ${isCollapsed ? 'bg-dark' : ''}`} style={isCollapsed ? { backgroundColor: '#333', borderRadius: '10px' } : { borderRadius: '10px' }}>
      {/* Collapsible Header */}
      <div 
        className={`card-header d-flex align-items-center justify-content-between cursor-pointer ${isCollapsed ? 'border-0' : ''}`}
        onClick={handleToggleCollapse}
        style={{ 
          cursor: 'pointer',
          backgroundColor: isCollapsed ? '#333' : '',
          color: isCollapsed ? 'white' : '',
          borderRadius: isCollapsed ? '10px' : '10px 10px 0 0'
        }}
      >
        <div className="d-flex align-items-center">
          <div className="me-3">
            <div 
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
              style={{ width: '60px', height: '60px' }}
            >
              <i className="ti ti-rocket text-white fs-24"></i>
            </div>
          </div>
          <div>
            <h4 className={`mb-1 fw-bold ${isCollapsed ? 'text-white' : ''}`}>Complete Your Store Setup</h4>
            <p className={`mb-0 ${isCollapsed ? 'text-light' : 'text-muted'}`}>
              {completedSteps} of {totalSteps} steps completed • {Math.round(progressPercentage)}% done
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center">
          {/* Circular Progress */}
          <div className="position-relative d-inline-block me-3">
            <svg width="70" height="70">
              <circle
                cx="35"
                cy="35"
                r="28"
                stroke={isCollapsed ? "#555" : "#e9ecef"}
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="35"
                cy="35"
                r="28"
                stroke={isCollapsed ? "#ffffff" : "#6f42c1"}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 35 35)"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div 
              className="position-absolute top-50 start-50 translate-middle text-center"
              style={{ width: '55px' }}
            >
              <div className={`fw-bold fs-13 mb-0 ${isCollapsed ? 'text-white' : 'text-primary'}`}>{completedSteps}/{totalSteps}</div>
              <small className={isCollapsed ? 'text-light' : 'text-muted'} style={{ fontSize: '0.65rem', lineHeight: '0.8' }}>steps</small>
            </div>
          </div>

          {/* Toggle Button */}
          <button 
            className={`btn btn-sm ${isCollapsed ? 'btn-link text-white' : 'btn-outline-primary'}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleCollapse();
            }}
            style={isCollapsed ? { 
              border: 'none', 
              backgroundColor: 'transparent',
              color: 'white',
              padding: '0.25rem 0.5rem'
            } : {}}
          >
            <i className={`ti ti-chevron-${isCollapsed ? 'down' : 'up'} fs-16`}></i>
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="card-body" style={{ borderRadius: '0 0 10px 10px' }}>
          <div className="row">
            {/* Left side - Onboarding Steps */}
            <div className="col-lg-7 col-md-6 col-12">
              {/* Progress Bar */}
              <div className="progress mb-3" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar" 
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>

              {/* Step Dots */}
              <div className="d-flex align-items-center gap-1 mb-4">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`rounded-circle ${
                      i < completedSteps ? 'bg-success' : 'bg-light border'
                    }`}
                    style={{ width: '8px', height: '8px' }}
                  ></div>
                ))}
                <small className="text-muted ms-2">Progress indicators</small>
              </div>

            {/* Steps */}
            <div className="d-flex flex-column gap-3">
              {steps.map((step) => (
                <Link 
                  key={step.id}
                  to={step.link} 
                  className="text-decoration-none"
                  style={{ color: 'inherit' }}
                >
                  <div 
                    className={`border rounded p-3 hover-bg-light d-flex align-items-center ${
                      step.completed ? 'border-success bg-success bg-opacity-10' : 'border-secondary border-opacity-25'
                    }`}
                    style={{ transition: 'all 0.2s ease-in-out' }}
                  >
                    {/* Step Icon */}
                    <div className="me-3">
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          step.completed 
                            ? 'bg-success text-white' 
                            : 'text-white'
                        }`}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          minWidth: '50px',
                          backgroundColor: step.completed ? '#28a745' : '#6f42c1'
                        }}
                      >
                        {step.completed ? (
                          <i className="ti ti-check fs-20"></i>
                        ) : (
                          <i className={`${step.icon} fs-20`}></i>
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-grow-1">
                      <h4 className="mb-1 fw-semibold">{step.title}</h4>
                      <p className="text-muted mb-0 fs-sm">{step.description}</p>
                    </div>

                    {/* Individual Step Progress Circle */}
                    <div className="ms-3 me-3">
                      <div className="position-relative d-inline-block">
                        <svg width="50" height="50">
                          <circle
                            cx="25"
                            cy="25"
                            r="20"
                            stroke="#e9ecef"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          <circle
                            cx="25"
                            cy="25"
                            r="20"
                            stroke={step.completed ? "#28a745" : "#6f42c1"}
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - (step.subSteps.completed / step.subSteps.total))}`}
                            strokeLinecap="round"
                            transform="rotate(-90 25 25)"
                            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                          />
                        </svg>
                        <div 
                          className="position-absolute top-50 start-50 translate-middle text-center"
                          style={{ width: '40px' }}
                        >
                          <div 
                            className={`fw-bold ${step.completed ? 'text-success' : 'text-primary'}`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {step.subSteps.completed}/{step.subSteps.total}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="ms-2">
                      <i className="ti ti-chevron-right text-muted fs-16"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side - Mobile Preview */}
          <div className="col-lg-5 col-md-6 d-none d-md-block">
            <div className="d-flex justify-content-center align-items-start h-100">
              <div className="mobile-preview-container">
                {/* Mobile Frame */}
                <div className="mobile-frame">
                  <iframe 
                    src="/mobile-preview" 
                    className="mobile-screen-iframe"
                    title="Mobile Store Preview"
                    width="328"
                    height="718"
                    frameBorder="0"
                    scrolling="auto"
                    key={`preview-${store?.id}-${completedSteps}-${Date.now()}`}
                  ></iframe>
                </div>
                
                <div className="text-center mt-2">
                  <small className="text-muted">Live Mobile Preview</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
    </>
  );
};

export default OnboardingProgressCard;
