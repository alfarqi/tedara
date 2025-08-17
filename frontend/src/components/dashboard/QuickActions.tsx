import { Plus, FileText, Users, Settings, BarChart3, Mail } from 'lucide-react';
import type { ReactNode } from 'react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: '1',
      title: 'Add New User',
      description: 'Create a new user account',
      icon: <Users size={20} />,
      href: '/users/create',
      color: '#1c84c6'
    },
    {
      id: '2',
      title: 'Create Report',
      description: 'Generate a new report',
      icon: <FileText size={20} />,
      href: '/reports/create',
      color: '#0acf97'
    },
    {
      id: '3',
      title: 'View Analytics',
      description: 'Check your analytics',
      icon: <BarChart3 size={20} />,
      href: '/analytics',
      color: '#f8ac59'
    },
    {
      id: '4',
      title: 'Send Message',
      description: 'Send a new message',
      icon: <Mail size={20} />,
      href: '/messages/compose',
      color: '#ed5565'
    },
    {
      id: '5',
      title: 'Settings',
      description: 'Manage your settings',
      icon: <Settings size={20} />,
      href: '/settings',
      color: '#23c6c8'
    },
    {
      id: '6',
      title: 'Add Product',
      description: 'Add a new product',
      icon: <Plus size={20} />,
      href: '/products/create',
      color: '#7b70ef'
    }
  ];

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Quick Actions</h5>
        <div className="row">
          {actions.map((action) => (
            <div key={action.id} className="col-md-6 col-lg-4 mb-3">
              <a 
                href={action.href} 
                className="quick-action-item d-block p-3 rounded border text-decoration-none"
                style={{ transition: 'all 0.2s ease' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="quick-action-icon rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      backgroundColor: `${action.color}15`, 
                      color: action.color,
                      width: '40px',
                      height: '40px'
                    }}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h6 className="mb-1 fs-sm">{action.title}</h6>
                    <p className="mb-0 text-muted fs-xs">{action.description}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
