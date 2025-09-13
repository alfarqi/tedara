import { CreditCard, Banknote } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod: 'cash' | 'card' | null;
  onSelectMethod: (method: 'cash' | 'card') => void;
}

export function PaymentMethod({ selectedMethod, onSelectMethod }: PaymentMethodProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Payment Method</h3>
            <p className="text-sm text-gray-500">Choose how you'd like to pay</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {/* Cash on Delivery */}
        <div 
          className={`cursor-pointer transition-all duration-200 rounded-2xl border-2 p-4 ${
            selectedMethod === 'cash' 
              ? 'border-purple-500 bg-purple-50 shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
          onClick={() => onSelectMethod('cash')}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedMethod === 'cash' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'
            }`}>
              <Banknote className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
              <p className="text-sm text-gray-500">Pay when your order arrives</p>
            </div>
            {selectedMethod === 'cash' && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            )}
          </div>
        </div>

        {/* Debit/Credit Card */}
        <div 
          className={`cursor-pointer transition-all duration-200 rounded-2xl border-2 p-4 ${
            selectedMethod === 'card' 
              ? 'border-purple-500 bg-purple-50 shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
          onClick={() => onSelectMethod('card')}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'
            }`}>
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Debit/Credit Card</h3>
              <p className="text-sm text-gray-500">Pay securely online</p>
            </div>
            {selectedMethod === 'card' && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            )}
          </div>
        </div>

        {/* Card Payment Form (shown when card is selected) */}
        {selectedMethod === 'card' && (
          <div className="p-4 bg-gray-50 rounded-2xl space-y-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Card Number</div>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Expiry Date</div>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">CVV</div>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Cardholder Name</div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
