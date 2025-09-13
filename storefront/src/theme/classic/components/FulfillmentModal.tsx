import { useState } from 'react';
import { MapPin, Clock, Truck, Store } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useFulfillmentStore } from '../stores/fulfillmentStore';
import type { Branch } from '../types';
import branchesData from '../data/branches.json';

interface FulfillmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FulfillmentModal({ isOpen, onClose }: FulfillmentModalProps) {
  const [branches] = useState<Branch[]>(branchesData);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  
  const { setFulfillmentOption, setBranch } = useFulfillmentStore();

  const handleConfirm = () => {
    if (selectedBranch) {
      setBranch(selectedBranch);
      setFulfillmentOption({
        type: fulfillmentType,
        branchId: selectedBranch.id,
        branch: selectedBranch,
        estimatedTime: fulfillmentType === 'delivery' 
          ? selectedBranch.estimatedDeliveryTime 
          : selectedBranch.estimatedPickupTime,
        fee: fulfillmentType === 'delivery' ? selectedBranch.deliveryFee : 0,
      });
      onClose();
    }
  };

  const featuredBranches = branches.filter(branch => branch.featured);
  const otherBranches = branches.filter(branch => !branch.featured);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Choose Your Fulfillment Option</DialogTitle>
          <DialogDescription>
            Select how you'd like to receive your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Fulfillment Type Selection */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              variant={fulfillmentType === 'delivery' ? 'default' : 'outline'}
              onClick={() => setFulfillmentType('delivery')}
              className="flex-1"
            >
              <Truck className="h-4 w-4 mr-2" />
              Delivery
            </Button>
            <Button
              variant={fulfillmentType === 'pickup' ? 'default' : 'outline'}
              onClick={() => setFulfillmentType('pickup')}
              className="flex-1"
            >
              <Store className="h-4 w-4 mr-2" />
              Pickup
            </Button>
          </div>

          {/* Featured Branches */}
          {featuredBranches.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Featured Locations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredBranches.map((branch) => (
                  <Card 
                    key={branch.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBranch?.id === branch.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{branch.name}</CardTitle>
                        <Badge variant="secondary">Featured</Badge>
                      </div>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {branch.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {fulfillmentType === 'delivery' 
                              ? `Delivery: ${branch.estimatedDeliveryTime}`
                              : `Pickup: ${branch.estimatedPickupTime}`
                            }
                          </span>
                        </div>
                        {fulfillmentType === 'delivery' && (
                          <div className="text-muted-foreground">
                            Delivery Fee: {branch.deliveryFee} BD
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          Min. Order: {branch.minimumOrder} BD
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other Branches */}
          {otherBranches.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Other Locations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherBranches.map((branch) => (
                  <Card 
                    key={branch.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBranch?.id === branch.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {branch.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {fulfillmentType === 'delivery' 
                              ? `Delivery: ${branch.estimatedDeliveryTime}`
                              : `Pickup: ${branch.estimatedPickupTime}`
                            }
                          </span>
                        </div>
                        {fulfillmentType === 'delivery' && (
                          <div className="text-muted-foreground">
                            Delivery Fee: {branch.deliveryFee} BD
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          Min. Order: {branch.minimumOrder} BD
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleConfirm}
              disabled={!selectedBranch}
              className="px-8"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
