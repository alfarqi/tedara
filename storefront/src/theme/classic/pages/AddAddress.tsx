import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { GoogleMap } from '../components/GoogleMap';
import { geocodingService } from '../services/geocoding';
import { useCustomerAuth } from '../../../contexts/CustomerAuthContext';
import { useTenant } from '../../../hooks/useTenant';
import { 
  MapPin, 
  Home, 
  Building, 
  Navigation,
  ArrowLeft,
  Save,
  Search,
  Loader2
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
  const { customer, token } = useCustomerAuth();
  const tenant = useTenant();
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

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    navigate(`/${tenant}/addresses`);
  };

  const handleSave = async () => {
    if (!address.name || !address.address) {
      setError('Please fill in all required fields');
      return;
    }

    if (!customer || !token) {
      setError('Please log in to save addresses');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const addressData = {
        type: address.type || 'home',
        name: address.name,
        address: address.address,
        city: address.city || 'Manama',
        area: address.area || 'Capital',
        building: address.building || null,
        floor: address.floor || null,
        apartment: address.apartment || null,
        latitude: address.latitude || null,
        longitude: address.longitude || null,
        is_default: address.isDefault || false,
      };

      const url = isEditing 
        ? `http://localhost:8000/api/storefront/${tenant}/addresses/${editingAddress?.id}`
        : `http://localhost:8000/api/storefront/${tenant}/addresses`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to save addresses');
        }
        throw new Error('Failed to save address');
      }

      // Navigate back to addresses page
      navigate(`/${tenant}/addresses`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
      console.error('Error saving address:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setMapLocation({ lat, lng });
    setAddress({...address, latitude: lat, longitude: lng});
    
    // Get address from coordinates
    try {
      const result = await geocodingService.reverseGeocode(lat, lng);
      if (result) {
        setAddress(prev => ({
          ...prev,
          address: result.formatted_address,
          latitude: lat,
          longitude: lng
        }));
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
    }
  };

  const handleSearchAddress = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await geocodingService.searchAddresses(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching addresses:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setMapLocation({ lat: result.lat, lng: result.lng });
    setAddress(prev => ({
      ...prev,
      address: result.formatted_address,
      latitude: result.lat,
      longitude: result.lng
    }));
    setSearchQuery(result.formatted_address);
    setShowSearchResults(false);
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await geocodingService.getCurrentLocation();
      await handleMapClick(location.lat, location.lng);
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Unable to get your current location. Please make sure location services are enabled.');
    } finally {
      setIsGettingLocation(false);
    }
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
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Location</h3>
            
            {/* Address Search */}
            <div className="mb-4">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for an address..."
                  className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchAddress()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchAddress}
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-1 top-1 h-10 w-10 rounded-lg hover:bg-gray-100"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">{result.formatted_address}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Google Map */}
            <div className="relative bg-gray-100 rounded-xl h-64 mb-4 overflow-hidden">
              <GoogleMap
                center={mapLocation}
                zoom={15}
                onLocationSelect={handleMapClick}
                className="w-full h-full rounded-xl"
              />
            </div>

            {/* Map Controls */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 rounded-xl border-gray-300 hover:bg-gray-50"
                onClick={handleUseCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                Use Current Location
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 rounded-xl border-gray-300 hover:bg-gray-50"
                onClick={() => setShowSearchResults(!showSearchResults)}
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
                disabled={!address.name || !address.address || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Address')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
