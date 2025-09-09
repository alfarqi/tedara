import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../contexts/OnboardingContext';

interface ProcessingStepProps {
  onComplete?: () => void;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { data, completeOnboarding } = useOnboarding();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Preparing store data...');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasStartedProcessing = useRef(false);

  const steps = [
    { label: 'Preparing store data...', duration: 600, action: null },
    { label: 'Creating store in database...', duration: 0, action: 'createStore' },
    { label: 'Processing store configuration...', duration: 400, action: null },
    // Only include logo upload step if there's a logo
    ...(data.logo ? [{ label: 'Uploading store logo...', duration: 0, action: 'uploadLogo' as const }] : []),
    { label: 'Finalizing store setup...', duration: 400, action: null },
    { label: 'Store created successfully!', duration: 300, action: null },
  ];

  useEffect(() => {
    const processOnboarding = async () => {
      if (hasStartedProcessing.current) return; // Prevent multiple executions
      hasStartedProcessing.current = true;
      
      try {
        let currentProgress = 0;

        for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
          const step = steps[stepIndex];
          setCurrentStep(step.label);
          
          const stepProgress = 100 / steps.length;
          const startProgress = currentProgress;
          const endProgress = currentProgress + stepProgress;

          // Handle API actions
          if (step.action === 'createStore') {
            try {
              // Set progress to show we're starting the API call
              setProgress(startProgress + stepProgress * 0.2);
              
              // Add a small delay to show the step
              await new Promise(resolve => setTimeout(resolve, 300));
              setProgress(startProgress + stepProgress * 0.5);
              
              // Make the actual API call
              await completeOnboarding(navigate);
              
              // Complete this step's progress
              setProgress(endProgress);
              currentProgress = endProgress;
              continue; // Skip the animation for API steps
            } catch (err) {
              console.error('ProcessingStep: Store creation API failed:', err);
              setError(err instanceof Error ? err.message : 'Failed to create store');
              return;
            }
          } else if (step.action === 'uploadLogo') {
            // Logo upload is handled within completeOnboarding
            // This step only appears if there's a logo to upload
            // Add a brief pause to show this step
            await new Promise(resolve => setTimeout(resolve, 200));
            setProgress(endProgress);
            currentProgress = endProgress;
            continue;
          }

          // For non-API steps, animate the progress
          if (step.duration > 0) {
            const intervalTime = 50; // Update every 50ms
            const totalIntervals = step.duration / intervalTime;
            const progressIncrement = stepProgress / totalIntervals;

            await new Promise<void>((resolve) => {
              let intervals = 0;
              const interval = setInterval(() => {
                intervals++;
                const newProgress = Math.min(
                  startProgress + (progressIncrement * intervals),
                  endProgress
                );
                setProgress(newProgress);

                if (intervals >= totalIntervals) {
                  clearInterval(interval);
                  resolve();
                }
              }, intervalTime);
            });
          } else {
            // Instant progress for zero-duration steps
            setProgress(endProgress);
          }

          currentProgress = endProgress;
        }

        setProgress(100);
        setIsCompleted(true);
        
        // Redirect immediately without showing completion overlay
        if (onComplete) {
          onComplete();
        } else {
          navigate('/dashboard', { replace: true });
        }

      } catch (err) {
        console.error('ProcessingStep: Error during processing:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during setup');
      }
    };

    processOnboarding();
  }, []); // Empty dependency array to run only once

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    setCurrentStep('Preparing store data...');
    setIsCompleted(false);
    hasStartedProcessing.current = false; // Reset the processing flag
    // The useEffect will trigger again and restart the process
  };

  if (error) {
    return (
      <div className="step-content text-center">
        <div className="mb-4">
          <div className="text-danger mb-3">
            <i className="ti ti-alert-circle" style={{ fontSize: '3rem' }}></i>
          </div>
          <h3 className="text-danger mb-3">Setup Failed</h3>
          <p className="text-muted mb-4">{error}</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleRetry}
          >
            <i className="ti ti-refresh me-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content text-center">
      <div className="mb-4">
        {/* Store Icon */}
        <div className="mb-4">
          {isCompleted ? (
            <div className="text-success mb-3">
              <i className="ti ti-check-circle" style={{ fontSize: '3rem' }}></i>
            </div>
          ) : (
            <div className="text-primary mb-3">
              <div 
                className="spinner-border" 
                role="status" 
                style={{ width: '3rem', height: '3rem' }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>

        {/* Store Name */}
        <h2 className="mb-2">
          {isCompleted ? 'Welcome to your store!' : `Setting up "${data.shopName}"`}
        </h2>
        
        {/* Current Step */}
        <p className="text-muted mb-4 fs-5">
          {isCompleted ? 'Your store is ready to go!' : currentStep}
        </p>

        {/* Progress Bar */}
        <div className="progress mb-4" style={{ height: '12px' }}>
          <div 
            className={`progress-bar ${isCompleted ? 'bg-success' : 'bg-primary'}`}
            role="progressbar" 
            style={{ width: `${progress}%` }}
            aria-valuenow={progress} 
            aria-valuemin={0} 
            aria-valuemax={100}
          >
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="mb-4">
          <span className="badge bg-light text-dark fs-6">
            {Math.round(progress)}% Complete
          </span>
        </div>


        {/* Loading Message */}
        {!isCompleted && (
          <div className="mt-4">
            <p className="text-muted small">
              <i className="ti ti-info-circle me-1"></i>
              Please don't close this page while we set up your store...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStep;
