// import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Package, CreditCard, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTenant } from '../../../hooks/useTenant';

interface OrderData {
  id: number;
  order_id: string;
  status: string;
  payment_status: string;
  total: number | string;
  delivery_fee: number | string;
  subtotal: number | string;
  payment_method: string;
  delivery_time: string;
  delivery_address: string;
  created_at: string;
}

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const tenant = useTenant();
  
  // Get order data from location state
  const orderData: OrderData | null = location.state?.orderData;
  
  // Debug: Log the order data to see what we're receiving
  console.log('Order confirmation - received order data:', orderData);

  const handleBackToHome = () => {
    navigate(`/${tenant}/`);
  };

  const handleViewOrders = () => {
    navigate(`/${tenant}/orders`);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-6">No order data found.</p>
              <Button onClick={handleBackToHome}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${numAmount.toFixed(3)} BD`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 space-y-4">
        
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Your order has been successfully placed
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <span className="text-sm text-gray-500">#{orderData.order_id}</span>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-900 capitalize">{orderData.status}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900 capitalize">{orderData.payment_method}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p className="font-medium text-gray-900">{orderData.delivery_time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium text-gray-900">{orderData.delivery_address}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{formatCurrency(orderData.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatCurrency(orderData.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <h3 className="font-medium text-blue-900">Payment Status</h3>
              <p className="text-sm text-blue-700">
                {orderData.payment_status === 'pending' 
                  ? 'Payment will be collected upon delivery'
                  : `Payment Status: ${orderData.payment_status}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleViewOrders}
            className="w-full"
          >
            <Package className="h-4 w-4 mr-2" />
            View My Orders
          </Button>
          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Order Date */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Order placed on {formatDate(orderData.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
