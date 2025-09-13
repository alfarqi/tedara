import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { AddressInfo } from '../../types';

interface AddressStepProps {
  onSubmit: (info: AddressInfo) => void;
}

export function AddressStep({ onSubmit }: AddressStepProps) {
  const [formData, setFormData] = useState({
    street: '',
    building: '',
    floor: '',
    apartment: '',
    area: '',
    city: 'Manama',
    additionalInstructions: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.building.trim()) {
      newErrors.building = 'Building number is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData as AddressInfo);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-sm font-medium mb-2">
            Street Address *
          </label>
          <Input
            id="street"
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Enter street address"
            className={errors.street ? 'border-destructive' : ''}
          />
          {errors.street && (
            <p className="text-sm text-destructive mt-1">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="building" className="block text-sm font-medium mb-2">
              Building Number *
            </label>
            <Input
              id="building"
              type="text"
              value={formData.building}
              onChange={(e) => handleChange('building', e.target.value)}
              placeholder="e.g., 123"
              className={errors.building ? 'border-destructive' : ''}
            />
            {errors.building && (
              <p className="text-sm text-destructive mt-1">{errors.building}</p>
            )}
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm font-medium mb-2">
              Floor (Optional)
            </label>
            <Input
              id="floor"
              type="text"
              value={formData.floor}
              onChange={(e) => handleChange('floor', e.target.value)}
              placeholder="e.g., 2nd Floor"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium mb-2">
              Apartment (Optional)
            </label>
            <Input
              id="apartment"
              type="text"
              value={formData.apartment}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder="e.g., Apt 5A"
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium mb-2">
              Area *
            </label>
            <Input
              id="area"
              type="text"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="e.g., Adliya"
              className={errors.area ? 'border-destructive' : ''}
            />
            {errors.area && (
              <p className="text-sm text-destructive mt-1">{errors.area}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            City
          </label>
          <Input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
          />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium mb-2">
            Additional Delivery Instructions (Optional)
          </label>
          <Textarea
            id="instructions"
            value={formData.additionalInstructions}
            onChange={(e) => handleChange('additionalInstructions', e.target.value)}
            placeholder="Any special instructions for delivery..."
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Continue to Payment
      </Button>
    </form>
  );
}
