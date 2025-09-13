import { createContext, useContext, type ReactNode } from 'react';

interface CheckoutContextType {
  handlePlaceOrder: () => void;
  canProceedToPayment: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children, handlePlaceOrder, canProceedToPayment }: {
  children: ReactNode;
  handlePlaceOrder: () => void;
  canProceedToPayment: boolean;
}) {
  return (
    <CheckoutContext.Provider value={{ handlePlaceOrder, canProceedToPayment }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  }
  return context;
}
