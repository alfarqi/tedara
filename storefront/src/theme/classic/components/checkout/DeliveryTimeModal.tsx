import { useState } from 'react';
import { Clock, Calendar, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface DeliveryTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTime: (time: string, type: 'now' | 'scheduled') => void;
}

export function DeliveryTimeModal({ isOpen, onClose, onSelectTime }: DeliveryTimeModalProps) {
  const [selectedType, setSelectedType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleNowClick = () => {
    onSelectTime('Now', 'now');
    onClose();
  };

  const handleScheduleClick = () => {
    if (scheduledDate && scheduledTime) {
      const scheduledDateTime = `${scheduledDate} at ${scheduledTime}`;
      onSelectTime(scheduledDateTime, 'scheduled');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 pb-20">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Select Delivery Time</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Now Option */}
          <div 
            className={`cursor-pointer transition-all duration-200 rounded-2xl border-2 p-4 ${
              selectedType === 'now' 
                ? 'border-purple-500 bg-purple-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => setSelectedType('now')}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'now' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'
              }`}>
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Deliver Now</h3>
                <p className="text-sm text-gray-500">Ready in 30-45 minutes</p>
              </div>
              {selectedType === 'now' && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Option */}
          <div 
            className={`cursor-pointer transition-all duration-200 rounded-2xl border-2 p-4 ${
              selectedType === 'scheduled' 
                ? 'border-purple-500 bg-purple-50 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => setSelectedType('scheduled')}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedType === 'scheduled' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-600'
              }`}>
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Schedule for Later</h3>
                <p className="text-sm text-gray-500">Choose your preferred time</p>
              </div>
              {selectedType === 'scheduled' && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Form */}
          {selectedType === 'scheduled' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Date</div>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Time</div>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 pb-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={selectedType === 'now' ? handleNowClick : handleScheduleClick}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
              disabled={selectedType === 'scheduled' && (!scheduledDate || !scheduledTime)}
            >
              {selectedType === 'now' ? 'Deliver Now' : 'Schedule Delivery'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
