import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { StatusTimeline } from '../components/StatusTimeline';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/ui/skeleton';

export function Order() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading order data
    setTimeout(() => {
      // Mock order data
      const mockOrder = {
        id: orderId,
        status: 'preparing' as const,
        items: [
          {
            id: '1',
            product: {
              name: 'Classic Cheeseburger',
              price: 4.500,
              images: ['/images/products/classic-cheeseburger-1.jpg']
            },
            quantity: 2,
            customizations: { 'Cooking Level': 'Medium' },
            price: 4.500
          },
          {
            id: '2',
            product: {
              name: 'French Fries',
              price: 2.250,
              images: ['/images/products/french-fries-1.jpg']
            },
            quantity: 1,
            customizations: {},
            price: 2.250
          }
        ],
        total: 11.250,
        estimatedDelivery: '2024-01-15T14:30:00Z',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+973 1234 5678'
        },
        fulfillment: {
          type: 'delivery',
          address: 'Block 123, Road 456, Manama, Bahrain'
        },
        createdAt: '2024-01-15T14:00:00Z'
      };
      
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [orderId]);

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

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            title="Order not found"
            description="The order you're looking for doesn't exist or has been removed."
            action={{
              label: "Go back to menu",
              onClick: () => window.location.href = '/'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <Badge variant="secondary" className="ml-2">
            {order.id}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>
                  Track your order progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatusTimeline 
                  status={order.status}
                  estimatedTime={order.estimatedDelivery}
                />
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                      {item.product.images[0] && (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      {Object.keys(item.customizations).length > 0 && (
                        <div className="mt-1">
                          {Object.entries(item.customizations).map(([key, value]) => (
                            <div key={key} className="text-xs text-muted-foreground">
                              {key}: {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {(item.price * item.quantity).toFixed(3)} BD
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
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{(order.total - 1.5).toFixed(3)} BD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>1.500 BD</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total</span>
                    <span>{order.total.toFixed(3)} BD</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Customer Info</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>{order.customer.name}</div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {order.customer.phone}
                      </div>
                    </div>
                  </div>

                  {order.fulfillment.type === 'delivery' && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Delivery Address</h4>
                      <div className="text-sm text-muted-foreground flex items-start">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                        {order.fulfillment.address}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-sm mb-2">Order Time</h4>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link to="/">Order Again</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
