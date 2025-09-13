import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building, 
  Navigation,
  Check
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
}

export function Addresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Home',
      address: '123 Main Street',
      city: 'Manama',
      area: 'Capital',
      building: 'Building A',
      floor: '2nd Floor',
      apartment: 'Apt 201',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'Office',
      address: '456 Business District',
      city: 'Manama',
      area: 'Capital',
      building: 'Office Tower B',
      floor: '10th Floor',
      apartment: 'Suite 1001',
      isDefault: false
    }
  ]);


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

  const getAddressTypeColor = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return 'bg-blue-100 text-blue-600';
      case 'work':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddNew = () => {
    navigate('/add-address');
  };

  const handleEdit = (address: Address) => {
    navigate('/add-address', { state: { address } });
  };


  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 space-y-4">
        {/* Add New Address Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <Button
              onClick={handleAddNew}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Address</span>
            </Button>
          </div>
        </div>


        {/* Saved Addresses List */}
        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAddressTypeColor(address.type)}`}>
                      {getAddressIcon(address.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{address.name}</h3>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getAddressTypeColor(address.type)}`}>
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(address)}
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(address.id)}
                      className="h-8 w-8 rounded-full hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <div>{address.address}</div>
                      {address.building && <div>Building: {address.building}</div>}
                      {address.floor && <div>Floor: {address.floor}</div>}
                      {address.apartment && <div>Apartment: {address.apartment}</div>}
                      <div>{address.area}, {address.city}</div>
                    </div>
                  </div>
                </div>

                {!address.isDefault && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      onClick={() => handleSetDefault(address.id)}
                      className="w-full h-10 rounded-xl border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Set as Default</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 text-center">
              <Navigation className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
              <p className="text-gray-500 mb-6">Add your first address to get started</p>
              <Button
                onClick={handleAddNew}
                className="bg-primary hover:bg-primary/90"
              >
                Add Address
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
