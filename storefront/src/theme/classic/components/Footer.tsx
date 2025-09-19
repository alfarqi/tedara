import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  store?: {
    id: number;
    name: string;
    logo?: string;
    description?: string;
  } | null;
  theme?: {
    settings: {
      store_name?: string;
      logo_url?: string;
      store_slogan?: string;
      contact_email?: string;
      contact_phone?: string;
    };
  } | null;
}

export function Footer({ store, theme }: FooterProps) {
  // Get store information from props or fallback to theme settings
  const storeName = store?.name || theme?.settings?.store_name || '';
  const storeLogo = store?.logo || theme?.settings?.logo_url;
  const storeSlogan = theme?.settings?.store_slogan || '';
  const contactEmail = theme?.settings?.contact_email || '';
  const contactPhone = theme?.settings?.contact_phone || '';
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            {storeName && (
              <div className="flex items-center space-x-2">
                {storeLogo ? (
                  <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <img 
                      src={storeLogo} 
                      alt={storeName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {storeName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="font-bold text-xl">{storeName}</span>
              </div>
            )}
            {storeSlogan && (
              <p className="text-muted-foreground text-sm">
                {storeSlogan}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              {contactPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{contactPhone}</span>
                </div>
              )}
              {contactEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{contactEmail}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Bahrain</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold">Opening Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Mon - Thu: 10:00 AM - 11:00 PM</div>
                  <div className="text-muted-foreground">Fri - Sat: 10:00 AM - 12:00 AM</div>
                  <div className="text-muted-foreground">Sun: 10:00 AM - 11:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 {storeName || 'Store'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
