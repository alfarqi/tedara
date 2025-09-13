import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, Check, ChevronDown, ChevronUp, Truck, Store } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface LocationItem {
  id: string;
  name: string;
  area: string;
}

interface Location {
  id: string;
  name: string;
  region: string;
  items: LocationItem[];
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  featured?: boolean;
}

const locations: Location[] = [
  { 
    id: '1', 
    name: 'Capital', 
    region: 'Manama',
    items: [
      { id: '1-1', name: 'Manama Center', area: 'Downtown Manama' },
      { id: '1-2', name: 'Adliya', area: 'Adliya District' },
      { id: '1-3', name: 'Juffair', area: 'Juffair Area' },
      { id: '1-4', name: 'Seef', area: 'Seef District' },
    ]
  },
  { 
    id: '2', 
    name: 'Southern', 
    region: 'Riffa',
    items: [
      { id: '2-1', name: 'Riffa', area: 'Riffa City' },
      { id: '2-2', name: 'Isa Town', area: 'Isa Town' },
      { id: '2-3', name: 'Sitra', area: 'Sitra Island' },
      { id: '2-4', name: 'Arad', area: 'Arad District' },
    ]
  },
  { 
    id: '3', 
    name: 'Northern', 
    region: 'Muharraq',
    items: [
      { id: '3-1', name: 'Muharraq', area: 'Muharraq City' },
      { id: '3-2', name: 'Arad', area: 'Arad Area' },
      { id: '3-3', name: 'Hidd', area: 'Hidd District' },
      { id: '3-4', name: 'Galali', area: 'Galali Area' },
    ]
  },
  { 
    id: '4', 
    name: 'Muharraq', 
    region: 'Muharraq Island',
    items: [
      { id: '4-1', name: 'Muharraq Island', area: 'Main Island' },
      { id: '4-2', name: 'Arad Bay', area: 'Arad Bay Area' },
      { id: '4-3', name: 'Hidd Port', area: 'Hidd Port Area' },
      { id: '4-4', name: 'Galali Beach', area: 'Galali Beach Area' },
    ]
  },
];

const branches: Branch[] = [
  {
    id: '1',
    name: 'Manama Main Branch',
    address: '123 King Faisal Highway, Manama',
    phone: '+973 1234 5678',
    hours: '9:00 AM - 11:00 PM',
    featured: true
  },
  {
    id: '2',
    name: 'Riffa Branch',
    address: '456 Riffa Avenue, Riffa',
    phone: '+973 2345 6789',
    hours: '9:00 AM - 11:00 PM',
    featured: true
  },
  {
    id: '3',
    name: 'Muharraq Branch',
    address: '789 Muharraq Street, Muharraq',
    phone: '+973 3456 7890',
    hours: '9:00 AM - 11:00 PM'
  },
  {
    id: '4',
    name: 'Seef Mall Branch',
    address: 'Seef Mall, Seef District',
    phone: '+973 4567 8901',
    hours: '10:00 AM - 12:00 AM'
  },
  {
    id: '5',
    name: 'City Centre Branch',
    address: 'City Centre Bahrain, Manama',
    phone: '+973 5678 9012',
    hours: '10:00 AM - 12:00 AM'
  }
];

export function LocationSelection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.area.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccordionToggle = (locationId: string) => {
    const newExpanded = new Set(expandedAccordions);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedAccordions(newExpanded);
  };

  const handleLocationItemSelect = (locationItem: LocationItem) => {
    setSelectedLocation(locationItem);
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  const handleConfirmLocation = () => {
    const isDelivery = fulfillmentType === 'delivery';
    const hasSelection = isDelivery ? selectedLocation : selectedBranch;
    
    if (hasSelection) {
      // In a real app, you would save the selected location/branch to state/context
      console.log('Selected:', isDelivery ? selectedLocation : selectedBranch);
      
      // Check if we came from checkout or home page
      const fromCheckout = window.location.pathname.includes('checkout') || 
                          document.referrer.includes('checkout');
      
      const selectionData = {
        type: fulfillmentType,
        location: isDelivery ? selectedLocation?.name : selectedBranch?.name,
        details: isDelivery ? selectedLocation : selectedBranch
      };
      
      if (fromCheckout) {
        // Navigate back to checkout with the selected location/branch
        navigate('/checkout', { 
          state: selectionData
        });
      } else {
        // Navigate back to home page with the selected location/branch
        navigate('/', { 
          state: selectionData
        });
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
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
              <h1 className="text-lg font-semibold text-gray-900">Select Location</h1>
              <p className="text-sm text-gray-500">Choose your delivery area</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Delivery/Pickup Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex space-x-2">
              <Button
                variant={fulfillmentType === 'delivery' ? 'default' : 'outline'}
                onClick={() => setFulfillmentType('delivery')}
                className="flex-1 h-12 rounded-xl"
              >
                <Truck className="h-4 w-4 mr-2" />
                Delivery
              </Button>
              <Button
                variant={fulfillmentType === 'pickup' ? 'default' : 'outline'}
                onClick={() => setFulfillmentType('pickup')}
                className="flex-1 h-12 rounded-xl"
              >
                <Store className="h-4 w-4 mr-2" />
                Pickup
              </Button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={fulfillmentType === 'delivery' ? "Search locations..." : "Search branches..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content based on fulfillment type */}
        {fulfillmentType === 'delivery' ? (
          /* Locations List */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Available Locations</h3>
              <p className="text-sm text-gray-500">Select your delivery area</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredLocations.map((location) => {
                const isExpanded = expandedAccordions.has(location.id);
                return (
                  <div key={location.id}>
                    {/* Accordion Header */}
                    <button
                      onClick={() => handleAccordionToggle(location.id)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.region}</div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="bg-gray-50 border-t border-gray-100">
                        {location.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleLocationItemSelect(item)}
                            className={`w-full p-4 pl-16 text-left hover:bg-gray-100 transition-colors ${
                              selectedLocation?.id === item.id ? 'bg-purple-50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.area}</div>
                              </div>
                              {selectedLocation?.id === item.id && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Branches List */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Available Branches</h3>
              <p className="text-sm text-gray-500">Select your pickup location</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredBranches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleBranchSelect(branch)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedBranch?.id === branch.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Store className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold text-gray-900">{branch.name}</div>
                          {branch.featured && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{branch.address}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {branch.phone} • {branch.hours}
                        </div>
                      </div>
                    </div>
                    {selectedBranch?.id === branch.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Summary */}
        {(selectedLocation || selectedBranch) && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                {fulfillmentType === 'delivery' ? (
                  <MapPin className="h-5 w-5 text-purple-600" />
                ) : (
                  <Store className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-purple-900">
                  Selected {fulfillmentType === 'delivery' ? 'Location' : 'Branch'}
                </div>
                <div className="text-sm text-purple-700">
                  {fulfillmentType === 'delivery' 
                    ? `${selectedLocation?.name}, ${selectedLocation?.area}`
                    : selectedBranch?.name
                  }
                </div>
                {fulfillmentType === 'pickup' && selectedBranch && (
                  <div className="text-xs text-purple-600 mt-1">
                    {selectedBranch.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar with Done Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="px-4 py-3">
          <Button
            onClick={handleConfirmLocation}
            disabled={fulfillmentType === 'delivery' ? !selectedLocation : !selectedBranch}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
