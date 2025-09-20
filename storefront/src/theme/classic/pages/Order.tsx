import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { StatusTimeline } from '../components/StatusTimeline';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/ui/skeleton';
import { useCustomerAuth } from '../../../contexts/CustomerAuthContext';
import { useTenant } from '../../../hooks/useTenant';
import { useCartStore } from '../stores/cartStore';

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

export function Order() {
  const { orderId } = useParams<{ orderId: string }>();
  const { customer, token } = useCustomerAuth();
  const tenant = useTenant();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId && customer && token && tenant) {
      fetchOrder();
    } else if (!customer || !token) {
      setLoading(false);
      setError('Please log in to view order details');
    }
  }, [orderId, customer, token, tenant]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/api/storefront/${tenant}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view order details');
        } else if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAgain = async () => {
    if (!order) return;

    try {
      // Add each item from the order to the cart
      for (const item of order.items) {
        // Create a product-like object for the cart
        const product = {
          id: `order-item-${item.product_name.replace(/\s+/g, '-').toLowerCase()}`,
          name: item.product_name,
          price: parseFloat(item.price.toString()) || 0,
          images: ['/images/no-image.png'], // Default image since we don't have product images
          stock: 999, // Assume in stock for reordering
          description: `Previously ordered item`,
        };

        // Add to cart with the same quantity
        addItem(product, item.quantity);
      }

      // Navigate to cart
      navigate(`/${tenant}/cart`);
    } catch (error) {
      console.error('Error adding items to cart:', error);
      // Still navigate to cart even if there's an error
      navigate(`/${tenant}/cart`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            title="Error loading order"
            description={error}
            action={{
              label: "Try again",
              onClick: fetchOrder
            }}
          />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            title="Order not found"
            description="The order you're looking for doesn't exist or has been removed."
            action={{
              label: "Go back to orders",
              onClick: () => window.location.href = `/${tenant}/orders`
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Order Status</CardTitle>
                    <CardDescription className="text-sm">
                      Track your order progress
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-1 mt-0.5">
                    {order.order_id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <StatusTimeline 
                  status={order.status}
                  estimatedTime={order.estimatedDelivery}
                />
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Items</CardTitle>
                <CardDescription className="text-sm">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No image</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-tight">{item.product_name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${(parseFloat(item.price.toString()) || 0).toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm">
                        ${(parseFloat(item.total.toString()) || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${(parseFloat(order.subtotal.toString()) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${(parseFloat(order.delivery_fee.toString()) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total</span>
                    <span>${(parseFloat(order.total.toString()) || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Payment Info</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Method: {order.payment_method}</div>
                      <div>Status: {order.payment_status}</div>
                    </div>
                  </div>

                  {order.delivery_address && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Delivery Address</h4>
                      <div className="text-xs text-muted-foreground flex items-start">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{order.delivery_address}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-sm mb-2">Order Time</h4>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="break-words">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Notes</h4>
                      <div className="text-xs text-muted-foreground break-words">
                        {order.notes}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleOrderAgain}
                  className="w-full h-10 text-sm"
                >
                  Order Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
