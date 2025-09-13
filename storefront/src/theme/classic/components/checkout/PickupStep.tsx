import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useFulfillmentStore } from '../../stores/fulfillmentStore';

interface PickupStepProps {
  onSubmit: () => void;
}

export function PickupStep({ onSubmit }: PickupStepProps) {
  const { selectedBranch, getEstimatedTime } = useFulfillmentStore();
  const estimatedTime = getEstimatedTime();

  if (!selectedBranch) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pickup location selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Pickup Location</h3>
        <p className="text-muted-foreground">
          Your order will be ready for pickup at the selected location
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {selectedBranch.name}
            <Badge variant="secondary">Pickup</Badge>
          </CardTitle>
          <CardDescription className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {selectedBranch.address}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            {selectedBranch.phone}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Estimated pickup time: {estimatedTime}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Pickup Instructions:</strong> Please arrive at the restaurant and inform the staff 
              that you're picking up an order. Have your order confirmation ready.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onSubmit} className="w-full" size="lg">
        Continue to Payment
      </Button>
    </div>
  );
}
