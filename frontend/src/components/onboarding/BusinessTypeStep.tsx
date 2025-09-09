import React, { useState, useMemo } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useBusinessCategories } from '../../hooks/useBusinessCategories';

const BusinessTypeStep: React.FC = () => {
  const { data, updateBusinessType, nextStep, previousStep } = useOnboarding();
  const { categories, loading, createCategory, error } = useBusinessCategories();
  const [selectedType, setSelectedType] = useState(data.businessType);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customType, setCustomType] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fallback categories if API fails
  const fallbackCategories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports-fitness', label: 'Sports & Fitness' },
    { value: 'food-beverages', label: 'Food & Beverages' },
    { value: 'health-wellness', label: 'Health & Wellness' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'books-media', label: 'Books & Media' },
    { value: 'toys-games', label: 'Toys & Games' },
    { value: 'services', label: 'Services' },
  ];

  // Convert API categories to dropdown options
  const categoryOptions = useMemo(() => {
    if (error || (!loading && categories.length === 0)) {
      return fallbackCategories;
    }
    
    return categories.map(category => ({
      value: category.name.toLowerCase(),
      label: category.name,
      description: category.description,
    }));
  }, [categories, error, loading]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalType = selectedType;
    
    // If user selected custom option and entered custom type
    if (selectedType === 'custom' && customType.trim()) {
      try {
        setIsCreating(true);
        const newCategory = await createCategory(customType.trim());
        finalType = newCategory.name.toLowerCase();
      } catch (err) {
        console.error('Failed to create custom category:', err);
        // For now, just use the custom type as entered
        finalType = customType.trim().toLowerCase();
      } finally {
        setIsCreating(false);
      }
    }
    
    if (finalType && finalType !== 'custom') {
      updateBusinessType(finalType);
      nextStep();
    }
  };

  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);
    setShowCustomInput(value === 'custom');
    if (value !== 'custom') {
      setCustomType('');
    }
  };

  return (
    <div className="step-content">
      {/* Error Display */}
      {error && (
        <div className="alert alert-warning mb-3" role="alert">
          <i className="ti ti-alert-triangle me-2"></i>
          Failed to load business categories. Using default options.
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Business Type Selection */}
        <div className="mb-4">
          <label htmlFor="businessType" className="form-label fw-semibold">
            Select Business Type <span className="text-danger">*</span>
          </label>
          
          
          
          <div className="position-relative">
            <select
              className="form-select form-select-lg"
              id="businessType"
              value={selectedType || ''}
              onChange={handleTypeSelect}
              required
              disabled={loading}
              style={{ paddingRight: loading ? '3rem' : undefined }}
            >
              <option value="">
                {loading ? 'Loading business types...' : 'Choose a business type...'}
              </option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option value="custom">Other (Add custom type)</option>
            </select>
            
            {/* Loading Spinner */}
            {loading && (
              <div 
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ zIndex: 5 }}
              >
                <div 
                  className="spinner-border spinner-border-sm text-primary" 
                  role="status"
                  style={{ width: '1rem', height: '1rem' }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Custom Type Input */}
          {showCustomInput && (
            <div className="mt-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter your business type..."
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                required
              />
              <div className="form-text">
                This will be added to our business types database for other users.
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg flex-fill"
            onClick={previousStep}
          >
            <i className="ti ti-arrow-left me-2"></i>
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg flex-fill"
            disabled={!selectedType || (selectedType === 'custom' && !customType.trim()) || isCreating}
          >
            {isCreating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>
                Next
                <i className="ti ti-arrow-right ms-2"></i>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessTypeStep;
