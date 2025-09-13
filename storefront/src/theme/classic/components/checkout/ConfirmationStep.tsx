import { Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { ContactInfo, AddressInfo } from '../../types';

interface ConfirmationStepProps {
  orderId: string;
  contactInfo: ContactInfo | null;
  addressInfo: AddressInfo | null;
  fulfillmentType?: 'delivery' | 'pickup';
}

export function ConfirmationStep({ 
  orderId, 
  contactInfo, 
  addressInfo, 
  fulfillmentType 
}: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
        <p className="text-muted-foreground">
          Thank you for your order. We'll start preparing your food right away.
        </p>
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            Order ID: <span className="font-mono">{orderId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Type:</span>
            <Badge variant="secondary" className="capitalize">
              {fulfillmentType}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Time:</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {fulfillmentType === 'delivery' ? '30-45 minutes' : '15-20 minutes'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      {contactInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground w-20">Name:</span>
              <span className="text-sm font-medium">{contactInfo.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{contactInfo.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{contactInfo.phone}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Address */}
      {fulfillmentType === 'delivery' && addressInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <div>{addressInfo.street}</div>
                <div>
                  Building {addressInfo.building}
                  {addressInfo.floor && `, ${addressInfo.floor}`}
                  {addressInfo.apartment && `, ${addressInfo.apartment}`}
                </div>
                <div>{addressInfo.area}, {addressInfo.city}</div>
                {addressInfo.additionalInstructions && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <strong>Instructions:</strong> {addressInfo.additionalInstructions}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <div className="font-medium">Order Confirmed</div>
              <div className="text-sm text-muted-foreground">
                We've received your order and will start preparing it soon.
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <div className="font-medium">Preparation</div>
              <div className="text-sm text-muted-foreground">
                Our chefs are preparing your delicious meal with fresh ingredients.
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <div className="font-medium">
                {fulfillmentType === 'delivery' ? 'Delivery' : 'Ready for Pickup'}
              </div>
              <div className="text-sm text-muted-foreground">
                {fulfillmentType === 'delivery' 
                  ? 'Your order will be delivered to your address.'
                  : 'Your order will be ready for pickup at the restaurant.'
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link to={`/orders/${orderId}`}>
            Track Your Order
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link to="/">
            Order Again
          </Link>
        </Button>
      </div>
    </div>
  );
}
