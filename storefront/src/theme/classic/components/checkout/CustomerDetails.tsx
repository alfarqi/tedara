import { User, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/button';

interface CustomerDetailsProps {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  onEditDetails: () => void;
}

export function CustomerDetails({ customerInfo, onEditDetails }: CustomerDetailsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Customer Details</h3>
            <p className="text-sm text-gray-500">Your contact information</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {/* Name */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Name</p>
            <p className="text-gray-900 font-medium">{customerInfo.name}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Phone className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Phone</p>
            <p className="text-gray-900 font-medium">{customerInfo.phone}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Mail className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Email</p>
            <p className="text-gray-900 font-medium">{customerInfo.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <Button 
          variant="outline" 
          onClick={onEditDetails}
          className="w-full h-12 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          Edit Details
        </Button>
      </div>
    </div>
  );
}
