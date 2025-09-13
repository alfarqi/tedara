import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentStepProps {
  onSubmit: () => void;
  total: number;
}

export function PaymentStep({ onSubmit, total }: PaymentStepProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate payment processing
      setTimeout(() => {
        onSubmit();
      }, 1000);
    }
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
        <p className="text-muted-foreground">
          Secure payment processing - your information is encrypted
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Card Details
            </CardTitle>
            <CardDescription>
              <div className="flex items-center text-sm">
                <Lock className="h-4 w-4 mr-1" />
                Your payment information is secure and encrypted
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                Card Number *
              </label>
              <Input
                id="cardNumber"
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={errors.cardNumber ? 'border-destructive' : ''}
              />
              {errors.cardNumber && (
                <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium mb-2">
                Cardholder Name *
              </label>
              <Input
                id="cardholderName"
                type="text"
                value={formData.cardholderName}
                onChange={(e) => handleChange('cardholderName', e.target.value)}
                placeholder="John Doe"
                className={errors.cardholderName ? 'border-destructive' : ''}
              />
              {errors.cardholderName && (
                <p className="text-sm text-destructive mt-1">{errors.cardholderName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                  Expiry Date *
                </label>
                <Input
                  id="expiryDate"
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={errors.expiryDate ? 'border-destructive' : ''}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                  CVV *
                </label>
                <Input
                  id="cvv"
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => handleChange('cvv', e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className={errors.cvv ? 'border-destructive' : ''}
                />
                {errors.cvv && (
                  <p className="text-sm text-destructive mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-xl font-bold text-primary">
              {total.toFixed(3)} BD
            </span>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Complete Order
        </Button>
      </form>
    </div>
  );
}
