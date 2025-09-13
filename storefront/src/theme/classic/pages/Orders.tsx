import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Clock, MapPin, Package } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderDate: string;
  estimatedTime?: string;
  address?: string;
}

export function Orders() {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '#ORD-001',
      status: 'preparing',
      items: [
        { name: 'Chicken Burger', quantity: 2, price: 12.99 },
        { name: 'French Fries', quantity: 1, price: 4.99 }
      ],
      total: 30.97,
      orderDate: '2024-01-15T14:30:00Z',
      estimatedTime: '25 min',
      address: '123 Main St, City'
    },
    {
      id: '2',
      orderNumber: '#ORD-002',
      status: 'delivered',
      items: [
        { name: 'Pizza Margherita', quantity: 1, price: 15.99 }
      ],
      total: 15.99,
      orderDate: '2024-01-14T19:45:00Z',
      address: '456 Oak Ave, City'
    }
  ]);

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
                <a href="/">Browse Menu</a>
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
                    <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                    <Badge className={`${getStatusColor(order.status)} rounded-full px-3 py-1`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  
                  {/* Order Date and ETA */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(order.orderDate).toLocaleDateString()}
                    {order.estimatedTime && (
                      <>
                        <span className="mx-2">•</span>
                        <span>ETA: {order.estimatedTime}</span>
                      </>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                        <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Delivery Address */}
                  {order.address && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {order.address}
                    </div>
                  )}
                  
                  {/* Order Total and Actions */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total: ${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-10 rounded-xl border-gray-300 hover:bg-gray-50"
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
