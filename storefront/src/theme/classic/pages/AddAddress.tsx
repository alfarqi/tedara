import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  MapPin, 
  Home, 
  Building, 
  Navigation,
  ArrowLeft,
  Save
} from 'lucide-react';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  area: string;
  building?: string;
  floor?: string;
  apartment?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export function AddAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingAddress = location.state?.address as Address | null;
  const isEditing = !!editingAddress;

  const [address, setAddress] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    address: '',
    city: 'Manama',
    area: 'Capital',
    building: '',
    floor: '',
    apartment: '',
    isDefault: false,
    latitude: 26.0667,
    longitude: 50.5577,
    ...editingAddress
  });

  const [mapLocation, setMapLocation] = useState({
    lat: address.latitude || 26.0667,
    lng: address.longitude || 50.5577
  });

  const getAddressIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'work':
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const handleBack = () => {
    navigate('/addresses');
  };

  const handleSave = () => {
    if (!address.name || !address.address) return;

    // Here you would typically save to backend
    console.log('Saving address:', address);
    
    // Navigate back to addresses page
    navigate('/addresses');
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMapLocation({ lat, lng });
    setAddress({...address, latitude: lat, longitude: lng});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Address' : 'Add New Address'}
              </h1>
              <p className="text-sm text-gray-500">Set your location on the map</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Location</h3>
            
            {/* Map Placeholder */}
            <div className="relative bg-gray-100 rounded-xl h-64 mb-4 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Interactive Map</p>
                  <p className="text-gray-400 text-xs">Click to set location</p>
                </div>
              </div>
              
              {/* Map Pin */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => handleMapClick(mapLocation.lat, mapLocation.lng)}
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 rounded-xl border-gray-300 hover:bg-gray-50"
                onClick={() => handleMapClick(26.0667, 50.5577)}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 rounded-xl border-gray-300 hover:bg-gray-50"
                onClick={() => handleMapClick(26.0667, 50.5577)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Search Address
              </Button>
            </div>
          </div>
        </div>

        {/* Address Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
            
            <div className="space-y-4">
              {/* Address Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Address Type</label>
                <div className="flex space-x-2">
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={address.type === type ? 'default' : 'outline'}
                      onClick={() => setAddress({...address, type})}
                      className={`flex-1 h-10 rounded-xl ${
                        address.type === type 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {getAddressIcon(type)}
                      <span className="ml-2 capitalize">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Address Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Address Name</label>
                <Input
                  value={address.name || ''}
                  onChange={(e) => setAddress({...address, name: e.target.value})}
                  placeholder="e.g., Home, Office, etc."
                  className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Street Address</label>
                <Textarea
                  value={address.address || ''}
                  onChange={(e) => setAddress({...address, address: e.target.value})}
                  placeholder="Enter your street address"
                  className="min-h-[80px] rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Building Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Building</label>
                  <Input
                    value={address.building || ''}
                    onChange={(e) => setAddress({...address, building: e.target.value})}
                    placeholder="Building name/number"
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Floor</label>
                  <Input
                    value={address.floor || ''}
                    onChange={(e) => setAddress({...address, floor: e.target.value})}
                    placeholder="Floor number"
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Apartment */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Apartment/Unit</label>
                <Input
                  value={address.apartment || ''}
                  onChange={(e) => setAddress({...address, apartment: e.target.value})}
                  placeholder="Apartment or unit number"
                  className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* City and Area */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                  <Input
                    value={address.city || ''}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    placeholder="City"
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Area</label>
                  <Input
                    value={address.area || ''}
                    onChange={(e) => setAddress({...address, area: e.target.value})}
                    placeholder="Area"
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Default Address */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={address.isDefault || false}
                  onChange={(e) => setAddress({...address, isDefault: e.target.checked})}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for fixed bottom buttons */}
        <div className="h-20"></div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
          <div className="px-4 py-3">
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
                disabled={!address.name || !address.address}
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Add Address'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
