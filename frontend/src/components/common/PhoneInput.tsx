import React, { useState, useRef, useEffect } from 'react';
import '../../styles/phone-input.css';

interface CountryCode {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>({
    code: 'BH',
    dialCode: '+973',
    flag: '🇧🇭',
    name: 'Bahrain'
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Popular countries list
  const countries: CountryCode[] = [
    { code: 'BH', dialCode: '+973', flag: '🇧🇭', name: 'Bahrain' },
    { code: 'SA', dialCode: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: 'KW', dialCode: '+965', flag: '🇰🇼', name: 'Kuwait' },
    { code: 'QA', dialCode: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: 'OM', dialCode: '+968', flag: '🇴🇲', name: 'Oman' },
    { code: 'JO', dialCode: '+962', flag: '🇯🇴', name: 'Jordan' },
    { code: 'LB', dialCode: '+961', flag: '🇱🇧', name: 'Lebanon' },
    { code: 'EG', dialCode: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
    { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
    { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: 'Netherlands' },
    { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
    { code: 'PK', dialCode: '+92', flag: '🇵🇰', name: 'Pakistan' },
    { code: 'BD', dialCode: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: 'PH', dialCode: '+63', flag: '🇵🇭', name: 'Philippines' },
    { code: 'MY', dialCode: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: 'TH', dialCode: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: 'VN', dialCode: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: 'ID', dialCode: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
    { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: 'Argentina' },
    { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: 'ZA', dialCode: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: 'NG', dialCode: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: 'KE', dialCode: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: 'GH', dialCode: '+233', flag: '🇬🇭', name: 'Ghana' },
    { code: 'ET', dialCode: '+251', flag: '🇪🇹', name: 'Ethiopia' },
    { code: 'UG', dialCode: '+256', flag: '🇺🇬', name: 'Uganda' },
    { code: 'TZ', dialCode: '+255', flag: '🇹🇿', name: 'Tanzania' },
    { code: 'RW', dialCode: '+250', flag: '🇷🇼', name: 'Rwanda' },
    { code: 'BI', dialCode: '+257', flag: '🇧🇮', name: 'Burundi' },
    { code: 'DJ', dialCode: '+253', flag: '🇩🇯', name: 'Djibouti' },
    { code: 'SO', dialCode: '+252', flag: '🇸🇴', name: 'Somalia' },
    { code: 'ER', dialCode: '+291', flag: '🇪🇷', name: 'Eritrea' },
    { code: 'SD', dialCode: '+249', flag: '🇸🇩', name: 'Sudan' },
    { code: 'SS', dialCode: '+211', flag: '🇸🇸', name: 'South Sudan' },
    { code: 'CF', dialCode: '+236', flag: '🇨🇫', name: 'Central African Republic' },
    { code: 'CM', dialCode: '+237', flag: '🇨🇲', name: 'Cameroon' },
    { code: 'TD', dialCode: '+235', flag: '🇹🇩', name: 'Chad' },
    { code: 'NE', dialCode: '+227', flag: '🇳🇪', name: 'Niger' },
    { code: 'ML', dialCode: '+223', flag: '🇲🇱', name: 'Mali' },
    { code: 'BF', dialCode: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
    { code: 'CI', dialCode: '+225', flag: '🇨🇮', name: 'Ivory Coast' },
    { code: 'SN', dialCode: '+221', flag: '🇸🇳', name: 'Senegal' },
    { code: 'GN', dialCode: '+224', flag: '🇬🇳', name: 'Guinea' },
    { code: 'SL', dialCode: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
    { code: 'LR', dialCode: '+231', flag: '🇱🇷', name: 'Liberia' },
    { code: 'TG', dialCode: '+228', flag: '🇹🇬', name: 'Togo' },
    { code: 'BJ', dialCode: '+229', flag: '🇧🇯', name: 'Benin' },
    { code: 'GW', dialCode: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
    { code: 'CV', dialCode: '+238', flag: '🇨🇻', name: 'Cape Verde' },
    { code: 'GM', dialCode: '+220', flag: '🇬🇲', name: 'Gambia' },
    { code: 'MR', dialCode: '+222', flag: '🇲🇷', name: 'Mauritania' },
    { code: 'DZ', dialCode: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: 'TN', dialCode: '+216', flag: '🇹🇳', name: 'Tunisia' },
    { code: 'LY', dialCode: '+218', flag: '🇱🇾', name: 'Libya' },
    { code: 'MA', dialCode: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: 'EH', dialCode: '+212', flag: '🇪🇭', name: 'Western Sahara' },
  ];

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    
    // Update the phone number with new country code
    const phoneNumber = value.replace(/^\+\d+/, '');
    onChange(country.dialCode + phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    
    // If user starts typing without country code, add it
    if (!phoneValue.startsWith('+')) {
      onChange(selectedCountry.dialCode + phoneValue);
    } else {
      onChange(phoneValue);
    }
  };

  const getDisplayValue = () => {
    // Remove country code from display value for the input
    const countryCode = selectedCountry.dialCode;
    if (value.startsWith(countryCode)) {
      return value.substring(countryCode.length);
    }
    return value;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`phone-input-container ${className}`}>
      <div className="input-group">
        {/* Country Code Dropdown */}
        <div className="dropdown" ref={dropdownRef}>
          <button
            className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            style={{ minWidth: '120px' }}
          >
            <span className="fs-5">{selectedCountry.flag}</span>
            <span className="d-none d-sm-inline">{selectedCountry.dialCode}</span>
          </button>
          
          {isOpen && (
            <div className="dropdown-menu show" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 9999 }}>
              <div className="px-3 py-2 border-bottom">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    className={`dropdown-item d-flex align-items-center gap-2 ${
                      selectedCountry.code === country.code ? 'active' : ''
                    }`}
                    onClick={() => handleCountrySelect(country)}
                    type="button"
                  >
                    <span className="fs-5">{country.flag}</span>
                    <span className="flex-grow-1 text-start">{country.name}</span>
                    <span className="text-muted">{country.dialCode}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-muted text-center">
                  No countries found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={getDisplayValue()}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      
      {error && (
        <div className="invalid-feedback d-block">
          <small className="text-danger">{error}</small>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
