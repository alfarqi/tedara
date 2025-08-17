import { Clock, User, FileText, ShoppingCart, MessageSquare } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user' | 'file' | 'order' | 'message';
  title: string;
  description: string;
  time: string;
  user?: string;
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'user',
      title: 'New user registered',
      description: 'John Doe has joined the platform',
      time: '2 minutes ago',
      user: 'John Doe'
    },
    {
      id: '2',
      type: 'order',
      title: 'New order received',
      description: 'Order #12345 has been placed',
      time: '5 minutes ago'
    },
    {
      id: '3',
      type: 'file',
      title: 'Document uploaded',
      description: 'Monthly report has been uploaded',
      time: '10 minutes ago',
      user: 'Sarah Wilson'
    },
    {
      id: '4',
      type: 'message',
      title: 'New message',
      description: 'You have a new message from support',
      time: '15 minutes ago'
    },
    {
      id: '5',
      type: 'user',
      title: 'Profile updated',
      description: 'User profile has been updated',
      time: '20 minutes ago',
      user: 'Mike Johnson'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User size={16} />;
      case 'file':
        return <FileText size={16} />;
      case 'order':
        return <ShoppingCart size={16} />;
      case 'message':
        return <MessageSquare size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-success';
      case 'file':
        return 'text-info';
      case 'order':
        return 'text-warning';
      case 'message':
        return 'text-primary';
      default:
        return 'text-muted';
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Recent Activity</h5>
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item d-flex align-items-start gap-3 py-2">
              <div className={`activity-icon ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-1 fs-sm">{activity.title}</h6>
                <p className="mb-1 text-muted fs-xs">{activity.description}</p>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted fs-xs">{activity.time}</span>
                  {activity.user && (
                    <>
                      <span className="text-muted">•</span>
                      <span className="text-muted fs-xs">{activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <a href="/activity" className="btn btn-outline-primary btn-sm">
            View All Activity
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
