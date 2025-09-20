import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Clock, MapPin, Package } from 'lucide-react';
import { useCustomerAuth } from '../../../contexts/CustomerAuthContext';
import { useTenant } from '../../../hooks/useTenant';
import { getStorefrontApiUrl } from '../../../config/api';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number | string;
  total: number | string;
}

interface Order {
  id: number;
  order_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  items: OrderItem[];
  total: number | string;
  delivery_fee: number | string;
  subtotal: number | string;
  delivery_address: string;
  notes?: string;
  created_at: string;
}

export function Orders() {
  const { customer, token } = useCustomerAuth();
  const tenant = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer && token && tenant) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [customer, token, tenant]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getStorefrontApiUrl(tenant)}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view your orders');
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading orders</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button 
                onClick={fetchOrders}
                className="bg-primary hover:bg-primary/90"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!customer || !token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Please log in</h3>
              <p className="text-gray-500 mb-6">You need to be logged in to view your orders</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href={`/${tenant}/auth`}>Log In</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start ordering delicious food!</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href={`/${tenant}/`}>Browse Menu</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{order.order_id}</h3>
                    <Badge className={`${getStatusColor(order.status)} rounded-full px-3 py-1`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  
                  {/* Order Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDate(order.created_at)}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.product_name}</span>
                        <span className="font-medium text-gray-900">${(parseFloat(item.total) || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Delivery Address */}
                  {order.delivery_address && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {order.delivery_address}
                    </div>
                  )}
                  
                  {/* Order Total and Actions */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total: ${(parseFloat(order.total) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-10 rounded-xl border-gray-300 hover:bg-gray-50"
                        onClick={() => window.location.href = `/${tenant}/orders/${order.id}`}
                      >
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button 
                          variant="outline" 
                          className="flex-1 h-10 rounded-xl border-gray-300 hover:bg-gray-50"
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
