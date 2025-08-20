import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

interface InvoiceItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  items: InvoiceItem[];
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  paymentMethod: string;
  notes: string;
}

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Sample invoice data matching reference
  const sampleInvoice: Invoice = {
    id: '1',
    invoiceNumber: 'INS-0120001',
    orderId: '#WB20100',
    date: '20 Apr 2025',
    dueDate: '05 May 2025',
    status: 'Pending',
    customer: {
      name: 'Daniel Moore',
      email: 'daniel.moore@email.com',
      phone: '310-555-1022',
      address: '790 Westwood Blvd',
      city: 'Los Angeles',
      country: 'CA',
      zipCode: '90024'
    },
    items: [
      {
        id: '1',
        product: 'Figma Design System',
        description: 'Desktop & Mobile UI Kit',
        quantity: 1,
        unitPrice: '$350.00',
        total: '$350.00'
      },
      {
        id: '2',
        product: 'Node.js API Development',
        description: 'User auth, dashboard APIs',
        quantity: 12,
        unitPrice: '$50.00',
        total: '$600.00'
      },
      {
        id: '3',
        product: 'Bootstrap UI Setup',
        description: 'Homepage, blog layout',
        quantity: 1,
        unitPrice: '$220.00',
        total: '$220.00'
      },
      {
        id: '4',
        product: 'Firebase Setup',
        description: 'Hosting & config',
        quantity: 1,
        unitPrice: '$100.00',
        total: '$100.00'
      }
    ],
    subtotal: '$1,270.00',
    tax: '$84.42',
    shipping: 'Free',
    total: '$1,290.92',
    paymentMethod: 'Credit Card',
    notes: 'Please make payment within 10 days. For any billing inquiries, contact billing@alinadesignco.com.'
  };

  useEffect(() => {
    // In a real app, you would fetch invoice data by ID
    setInvoice(sampleInvoice);
  }, [id]);



  if (!invoice) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="text-center">
            <h4>Invoice not found</h4>
            <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Invoice Details</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><Link to="/">Inspinia</Link></li>
            <li className="breadcrumb-item"><Link to="/orders">Invoices</Link></li>
            <li className="breadcrumb-item active">Invoice Details</li>
          </ol>
        </div>
      </div>

                                                       {/* Invoice Content */}
         <div className="row px-4 justify-content-center">
           <div className="col-xxl-10">
             <div className="row">
               <div className="col-lg-8">
                 <div className="card">
                   <div className="card-body">
                     {/* Invoice Header with Logo and Status */}
                     <div className="row mb-4">
                       <div className="col-6">
                         <div className="d-flex align-items-center">
                           <div style={{ 
                             width: '120px', 
                             height: '40px', 
                             backgroundColor: '#28a745', 
                             color: 'white',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             fontWeight: 'bold',
                             fontSize: '18px'
                           }}>
                             INSPINIA
                           </div>
                         </div>
                       </div>
                       <div className="col-6 text-end">
                         <div className="mb-2">
                           <span className="badge bg-warning text-dark fs-sm">
                             {invoice.status}
                           </span>
                         </div>
                         <h2 className="mb-1">Invoice #{invoice.invoiceNumber}</h2>
                       </div>
                     </div>

                     {/* Customer and Company Info */}
                     <div className="row mb-4">
                       <div className="col-6">
                         <h6 className="mb-3">FROM</h6>
                         <p className="mb-1 fw-semibold">Alina Thompson</p>
                         <p className="mb-1 text-muted">88 Crescent Ave,</p>
                         <p className="mb-1 text-muted">Boston, MA - 02125</p>
                         <p className="mb-1 text-muted">Phone: 617-452-0099</p>
                         <div className="mt-3">
                           <h6 className="mb-2">INVOICE DATE</h6>
                           <p className="mb-1 text-muted">{invoice.date}</p>
                         </div>
                       </div>
                       <div className="col-6">
                         <h6 className="mb-3">TO</h6>
                         <p className="mb-1 fw-semibold">{invoice.customer.name}</p>
                         <p className="mb-1 text-muted">{invoice.customer.address},</p>
                         <p className="mb-1 text-muted">{invoice.customer.city}, {invoice.customer.country} - {invoice.customer.zipCode}</p>
                         <p className="mb-1 text-muted">Phone: {invoice.customer.phone}</p>
                         <div className="mt-3">
                           <h6 className="mb-2">DUE DATE</h6>
                           <p className="mb-1 text-muted">{invoice.dueDate}</p>
                         </div>
                       </div>
                     </div>

                     {/* Invoice Items Table */}
                     <div className="table-responsive mb-4">
                       <table className="table table-bordered">
                         <thead className="bg-light">
                           <tr>
                             <th>#</th>
                             <th>Product Details</th>
                             <th>Qty</th>
                             <th>Unit Price</th>
                             <th>Total</th>
                           </tr>
                         </thead>
                         <tbody>
                           {invoice.items.map((item, index) => (
                             <tr key={item.id}>
                               <td>{String(index + 1).padStart(2, '0')}</td>
                               <td>
                                 <strong>{item.product}</strong> ({item.description})
                               </td>
                               <td>{item.quantity}</td>
                               <td>{item.unitPrice}</td>
                               <td>{item.total}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>

                     {/* QR Code */}
                     <div className="text-end mb-4">
                       <div style={{ 
                         width: '80px', 
                         height: '80px', 
                         backgroundColor: '#000', 
                         display: 'inline-block',
                         border: '1px solid #000'
                       }}>
                         <div style={{
                           width: '100%',
                           height: '100%',
                           backgroundImage: 'radial-gradient(circle at 25% 25%, #fff 2px, transparent 2px), radial-gradient(circle at 75% 25%, #fff 2px, transparent 2px), radial-gradient(circle at 25% 75%, #fff 2px, transparent 2px), radial-gradient(circle at 75% 75%, #fff 2px, transparent 2px)',
                           backgroundSize: '20px 20px'
                         }}></div>
                       </div>
                     </div>

                                          {/* Invoice Summary */}
                      <div className="row">
                        <div className="col-6">
                          <div className="table-responsive">
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td>Subtotal</td>
                                  <td className="text-end">{invoice.subtotal}</td>
                                </tr>
                                <tr>
                                  <td>Shipping</td>
                                  <td className="text-end">Free</td>
                                </tr>
                                <tr>
                                  <td>Discount (5%)</td>
                                  <td className="text-end text-danger">- $63.50</td>
                                </tr>
                                <tr>
                                  <td>Tax (7%)</td>
                                  <td className="text-end">{invoice.tax}</td>
                                </tr>
                                <tr>
                                  <td><strong>Total</strong></td>
                                  <td className="text-end"><strong>{invoice.total}</strong></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="bg-light p-3 rounded">
                            <p className="text-muted mb-0">
                              <strong>Note:</strong> {invoice.notes}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Thank You and Signature */}
                      <div className="row mt-4">
                        <div className="col-12">
                          <p className="text-muted mb-3">Thank you for your business!</p>
                          <div className="d-flex align-items-center">
                            <div style={{
                              width: '120px',
                              height: '60px',
                              borderBottom: '2px solid #000',
                              marginRight: '10px'
                            }}></div>
                            <div>
                              <p className="text-muted mb-0 fs-sm">Authorized Signature</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Copyright */}
                      <div className="row mt-4">
                        <div className="col-12">
                          <p className="text-muted fs-sm mb-0">© 2014 - 2025 Inspinia By WebAppLayers</p>
                        </div>
                      </div>
                   </div>
                 </div>
               </div>
               
                              {/* Action Buttons Sidebar - Fixed Position */}
                <div className="col-lg-4">
                  <div className="card" style={{ position: 'sticky', top: '20px' }}>
                    <div className="card-body">
                      <h6 className="mb-3">Actions</h6>
                      <div className="d-grid gap-2">
                        <button className="btn btn-success">
                          <i className="ti ti-download me-2"></i>Download
                        </button>
                        <button className="btn btn-danger">
                          <i className="ti ti-send me-2"></i>Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
           </div>
         </div>
    </Layout>
  );
};

export default InvoiceDetails;
