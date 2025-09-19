import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTenant } from '../../../hooks/useTenant';
import { useFulfillmentStore } from '../stores/fulfillmentStore';

interface DeliveryLocationProps {
  onLocationSelect?: () => void;
  currentLocation?: string;
}

export function DeliveryLocation({ onLocationSelect, currentLocation: propCurrentLocation }: DeliveryLocationProps) {
  const navigate = useNavigate();
  const tenant = useTenant();
  const { selectedOption, selectedBranch } = useFulfillmentStore();
  const [currentLocation, setCurrentLocation] = useState<string | null>(propCurrentLocation || 'Capital');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Update current location when prop changes
    if (propCurrentLocation) {
      setCurrentLocation(propCurrentLocation);
    }
  }, [propCurrentLocation]);

  useEffect(() => {
    // Update location based on selected branch from fulfillment store
    if (selectedBranch) {
      setCurrentLocation(selectedBranch.name);
    } else if (!propCurrentLocation) {
      // Simulate location detection only if no prop is provided and no branch selected
      const detectLocation = async () => {
        setIsDetecting(true);
        
        // Simulate API call delay
        setTimeout(() => {
          // For demo purposes, we'll set a default location
          // In a real app, you would use the Geolocation API or a location service
          setCurrentLocation('Capital');
          setIsDetecting(false);
        }, 1000);
      };

      detectLocation();
    }
  }, [propCurrentLocation, selectedBranch]);

  const handleLocationClick = () => {
    if (onLocationSelect) {
      onLocationSelect();
    } else {
      // Navigate to location selection page
      navigate(`/${tenant}/location-selection`);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <Button
          variant="ghost"
          className="w-full justify-start p-0 h-auto hover:bg-gray-50 focus:outline-none focus:ring-0"
          onClick={handleLocationClick}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              {selectedOption?.type === 'pickup' ? 'Pick up from' : 'Deliver to'}
            </span>
            <MapPin className="h-4 w-4 text-red-500 fill-current [&>circle]:fill-white" />
            {isDetecting ? (
              <span className="text-sm text-gray-500">Detecting location...</span>
            ) : currentLocation ? (
              <span className="text-sm font-medium text-gray-900">{currentLocation}</span>
            ) : (
              <span className="text-sm text-gray-500">
                {selectedOption?.type === 'pickup' ? 'Select pickup location' : 'Select delivery location'}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
          </div>
        </Button>
      </div>
    </div>
  );
}
