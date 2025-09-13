import { MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface DeliveryMapProps {
  address: string;
  onEditAddress: () => void;
}

export function DeliveryMap({ address }: DeliveryMapProps) {
  const navigate = useNavigate();

  const handleEditAddress = () => {
    navigate('/location-selection');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Delivery Location</h3>
            <p className="text-sm text-gray-500">Confirm your delivery address</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Map Placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl flex items-center justify-center border border-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-blue-100/20"></div>
          <div className="text-center relative z-10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
              <Navigation className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-700 font-medium">Interactive Map</p>
            <p className="text-gray-500 text-sm">Location services enabled</p>
          </div>
        </div>

        {/* Address Display */}
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <p className="font-semibold text-gray-900 text-sm">Delivery Address</p>
              </div>
              <p className="text-gray-700 leading-relaxed">{address}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleEditAddress}
              className="ml-3 h-8 px-3 rounded-lg border-gray-300 hover:bg-gray-100"
            >
              Select Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
