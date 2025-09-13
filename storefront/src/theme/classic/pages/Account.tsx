import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  Edit
} from 'lucide-react';

export function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const menuItems = [
    {
      icon: User,
      title: 'Personal Information',
      description: 'Update your profile details',
      action: () => setIsEditing(true)
    },
    {
      icon: MapPin,
      title: 'Saved Addresses',
      description: 'Manage your delivery addresses',
      action: () => console.log('Navigate to addresses')
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      action: () => console.log('Navigate to payments')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure notification preferences',
      action: () => console.log('Navigate to notifications')
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your account security',
      action: () => console.log('Navigate to privacy')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => console.log('Navigate to help')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 space-y-4">

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{userInfo.name}</h2>
                <p className="text-sm text-gray-500">{userInfo.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 px-3 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            
            {isEditing && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <div className="text-sm font-medium mb-2 text-gray-700">Full Name</div>
                  <Input
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2 text-gray-700">Email</div>
                  <Input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2 text-gray-700">Phone</div>
                  <Input
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2 text-gray-700">Address</div>
                  <Input
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                    className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <Button 
                    onClick={handleSave} 
                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel} 
                    className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={item.action}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center space-x-4 text-red-600 cursor-pointer hover:bg-red-50 transition-colors rounded-xl">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Sign Out</h3>
                <p className="text-sm text-red-500">Sign out of your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
