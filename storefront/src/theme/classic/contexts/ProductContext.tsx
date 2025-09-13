import { createContext, useContext, useState, type ReactNode } from 'react';

interface ProductContextType {
  notes: string;
  setNotes: (notes: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState('');

  return (
    <ProductContext.Provider value={{ notes, setNotes }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}
