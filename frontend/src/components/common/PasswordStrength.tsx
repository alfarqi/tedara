import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

interface StrengthLevel {
  score: number;
  label: string;
  color: string;
  width: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (password: string): StrengthLevel => {
    if (!password) {
      return { score: 0, label: '', color: '', width: '0%' };
    }

    let score = 0;
    let feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Lowercase letter');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Uppercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Number');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Special character');
    }

    // Determine strength level
    if (score <= 1) {
      return {
        score,
        label: 'Very Weak',
        color: '#dc3545',
        width: '20%'
      };
    } else if (score === 2) {
      return {
        score,
        label: 'Weak',
        color: '#fd7e14',
        width: '40%'
      };
    } else if (score === 3) {
      return {
        score,
        label: 'Fair',
        color: '#ffc107',
        width: '60%'
      };
    } else if (score === 4) {
      return {
        score,
        label: 'Good',
        color: '#20c997',
        width: '80%'
      };
    } else {
      return {
        score,
        label: 'Strong',
        color: '#198754',
        width: '100%'
      };
    }
  };

  const strength = calculateStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="password-strength mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="text-muted">Password Strength</small>
        <small 
          className="fw-medium" 
          style={{ color: strength.color }}
        >
          {strength.label}
        </small>
      </div>
      
      <div className="progress" style={{ height: '4px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: strength.width,
            backgroundColor: strength.color,
            transition: 'all 0.3s ease'
          }}
          aria-valuenow={strength.score}
          aria-valuemin={0}
          aria-valuemax={5}
        />
      </div>
      
      {strength.score < 5 && (
        <div className="mt-1">
          <small className="text-muted">
            Add: {[
              password.length < 8 ? '8+ characters' : null,
              !/[a-z]/.test(password) ? 'lowercase' : null,
              !/[A-Z]/.test(password) ? 'uppercase' : null,
              !/\d/.test(password) ? 'number' : null,
              !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'special character' : null
            ].filter(Boolean).join(', ')}
          </small>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;


