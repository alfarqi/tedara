import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/theme/classic/components/ui/toaster';
import { getTheme } from '@/theme/registry';
import { ErrorBoundary } from '@/theme/classic/components/ErrorBoundary';

// Get the classic theme components
const classicTheme = getTheme('classic');
const Layout = classicTheme.Layout;
const Home = classicTheme.pages.home;
const Product = classicTheme.pages.product;
const Cart = classicTheme.pages.cart;
const Checkout = classicTheme.pages.checkout;
const LocationSelection = classicTheme.pages.locationSelection;
const Orders = classicTheme.pages.orders;
const Account = classicTheme.pages.account;
const Addresses = classicTheme.pages.addresses;
const AddAddress = classicTheme.pages.addAddress;
const Category = classicTheme.pages.category;
const Order = classicTheme.pages.order;
const Contact = classicTheme.pages.contact;

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="category/:categorySlug" element={<Category />} />
              <Route path="product/:categorySlug/:productSlug" element={<Product />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="location-selection" element={<LocationSelection />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:orderId" element={<Order />} />
              <Route path="account" element={<Account />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="add-address" element={<AddAddress />} />
              <Route path="contact" element={<Contact />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;