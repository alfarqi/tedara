import { Link, useLocation } from 'react-router-dom';
import { Home, Package, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/',
      isActive: location.pathname === '/'
    },
    {
      label: 'Orders',
      icon: Package,
      path: '/orders',
      isActive: location.pathname.startsWith('/orders')
    },
    {
      label: 'My Account',
      icon: User,
      path: '/account',
      isActive: location.pathname.startsWith('/account')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors",
                item.isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1",
                item.isActive && "text-primary"
              )} />
              <span className={cn(
                "text-xs font-medium truncate",
                item.isActive && "text-primary"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
