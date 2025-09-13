import { Check, Clock, X } from 'lucide-react';
import { Badge } from '../components/ui/badge';

interface StatusTimelineProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  estimatedTime?: string;
}

const statusConfig = {
  pending: {
    label: 'Order Placed',
    description: 'Your order has been received',
    color: 'bg-yellow-500',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    description: 'Your order is being prepared',
    color: 'bg-blue-500',
    icon: Check,
  },
  preparing: {
    label: 'Preparing',
    description: 'Your food is being cooked',
    color: 'bg-orange-500',
    icon: Clock,
  },
  ready: {
    label: 'Ready',
    description: 'Your order is ready for pickup/delivery',
    color: 'bg-green-500',
    icon: Check,
  },
  delivered: {
    label: 'Delivered',
    description: 'Your order has been delivered',
    color: 'bg-green-600',
    icon: Check,
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Your order has been cancelled',
    color: 'bg-red-500',
    icon: X,
  },
};

export function StatusTimeline({ status, estimatedTime }: StatusTimelineProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold">{config.label}</h3>
            <Badge variant="outline">{status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{config.description}</p>
          {estimatedTime && status !== 'delivered' && status !== 'cancelled' && (
            <p className="text-xs text-muted-foreground mt-1">
              Estimated time: {estimatedTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
