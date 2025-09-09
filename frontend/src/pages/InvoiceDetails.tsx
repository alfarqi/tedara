import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { orderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

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
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed' | 'Refunded';
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
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showError, showSuccess } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadOrderData();
      generateQRCode();
    }
  }, [id]);

  const generateQRCode = async () => {
    try {
      const currentUrl = window.location.href;
      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
        width: 80,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const loadOrderData = async () => {
    try {
      setLoading(true);
      if (!id) {
        showError('Error', 'Invalid invoice ID');
        return;
      }
      
      // Try to load with token if available, otherwise load without authentication
      let response;
      if (token) {
        response = await orderService.getOrder(parseInt(id), token);
      } else {
        // For public access, we'll need to create a public endpoint
        // For now, we'll show an error if no token is available
        showError('Error', 'Authentication required to view this invoice');
        return;
      }
      
      if (response.data) {
        const order = response.data;
        console.log('Order data for invoice:', order);
        
        // Convert order data to invoice format
        const invoiceData: Invoice = {
          id: order.id.toString(),
          invoiceNumber: `INV-${order.order_id}`,
          orderId: `#${order.order_id}`,
          date: new Date(order.created_at).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          dueDate: new Date(order.created_at).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          status: mapPaymentStatusToInvoiceStatus(String(order.payment_status || 'pending')),
          customer: {
            name: order.customer?.name || 'Unknown Customer',
            email: order.customer?.email || 'No email',
            phone: order.customer?.phone || 'No phone',
            address: order.shipping_address?.street || 'No address',
            city: order.shipping_address?.city || 'No city',
            country: order.shipping_address?.country || 'No country',
            zipCode: order.shipping_address?.postal_code || 'No postal code'
          },
          items: order.order_items?.map((item: any) => ({
            id: item.id?.toString() || '',
            product: item.product?.name || 'Unknown Product',
            description: `SKU: ${item.product?.sku || 'N/A'}`,
            quantity: item.quantity || 0,
            unitPrice: `$${Number(item.price || item.unit_price || 0).toFixed(2)}`,
            total: `$${Number(item.total || item.total_price || 0).toFixed(2)}`
          })) || [],
          subtotal: `$${Number(order.subtotal || 0).toFixed(2)}`,
          tax: `$${Number(order.tax || 0).toFixed(2)}`,
          shipping: order.shipping_cost > 0 ? `$${Number(order.shipping_cost).toFixed(2)}` : 'Free',
          total: `$${Number(order.total).toFixed(2)}`,
          paymentMethod: order.payment_method || 'Not specified',
          notes: order.notes || 'Thank you for your order!'
        };
        
        setInvoice(invoiceData);
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      showError('Error', 'Failed to load order data for invoice');
    } finally {
      setLoading(false);
    }
  };

  const mapPaymentStatusToInvoiceStatus = (paymentStatus: string): Invoice['status'] => {
    switch (paymentStatus) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      case 'refunded': return 'Refunded';
      default: return 'Pending';
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !invoice) return;
    
    try {
      setDownloading(true);
      
      // Create a temporary container for the invoice content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px'; // Fixed width for PDF
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px'; // Reduced font size for PDF
      
      // Clone the invoice content
      const invoiceContent = invoiceRef.current.cloneNode(true) as HTMLElement;
      
      // Remove action icons and other unnecessary elements
      const actionIcons = invoiceContent.querySelector('.btn-group');
      if (actionIcons) {
        actionIcons.remove();
      }
      
      // Clean up any Bootstrap classes and set full width
      invoiceContent.className = '';
      invoiceContent.style.width = '100%';
      invoiceContent.style.margin = '0';
      invoiceContent.style.padding = '0';
      
      // Ensure the inner content uses full width
      const innerContent = invoiceContent.querySelector('div[style*="maxWidth"]') as HTMLElement;
      if (innerContent) {
        innerContent.style.width = '100%';
        innerContent.style.maxWidth = 'none';
      }
      
      // Apply consistent font sizes for PDF
      const allElements = invoiceContent.querySelectorAll('*');
      allElements.forEach((element) => {
        const el = element as HTMLElement;
        if (el.tagName === 'H1' || el.tagName === 'H2') {
          el.style.fontSize = '18px';
          el.style.fontWeight = 'bold';
        } else if (el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6') {
          el.style.fontSize = '14px';
          el.style.fontWeight = 'bold';
        } else if (el.tagName === 'P') {
          el.style.fontSize = '12px';
        } else if (el.tagName === 'TD' || el.tagName === 'TH') {
          el.style.fontSize = '11px';
        } else if (el.tagName === 'SMALL') {
          el.style.fontSize = '10px';
        } else {
          el.style.fontSize = '12px';
        }
      });
      
      // Add to temp container
      tempContainer.appendChild(invoiceContent);
      document.body.appendChild(tempContainer);
      
      // Convert to canvas with full width
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempContainer.scrollHeight
      });
      
      // Remove temp container
      document.body.removeChild(tempContainer);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download PDF
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      
      showSuccess('Success', 'Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError('Error', 'Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

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
            <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/orders">Orders</Link></li>
            <li className="breadcrumb-item active">Invoice #{invoice.invoiceNumber}</li>
          </ol>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="row px-4 justify-content-center">
        <div className="col-12">
          <div className="d-flex justify-content-center" ref={invoiceRef}>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <div className="card">
                <div className="card-body">
                  {/* Action Icons - Top Right */}
                  <div className="d-flex justify-content-end mb-3">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        title="Download PDF"
                      >
                        <i className="ti ti-download me-1"></i>
                        {downloading ? 'Generating...' : 'Download'}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/orders/new?edit=${invoice.id}`)}
                        title="Edit Order"
                      >
                        <i className="ti ti-edit me-1"></i>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setShowShareModal(true)}
                        title="Share Invoice"
                      >
                        <i className="ti ti-share me-1"></i>
                        Share
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => navigate('/orders')}
                        title="Back to Orders"
                      >
                        <i className="ti ti-arrow-left me-1"></i>
                        Back
                      </button>
                    </div>
                  </div>

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
                        <span className={`badge ${getStatusBadgeClass(invoice.status)} fs-sm`}>
                          {invoice.status}
                        </span>
                      </div>
                      <h3 className="mb-1">Invoice #{invoice.invoiceNumber}</h3>
                    </div>
                  </div>

                  {/* Customer and Company Info */}
                  <div className="row mb-4">
                    <div className="col-6">
                      <h6 className="mb-3">FROM</h6>
                      <p className="mb-1 fw-semibold">Salmeen Electronics Store</p>
                      <p className="mb-1 text-muted">Riyadh, Saudi Arabia</p>
                      <p className="mb-1 text-muted">Phone: +966 58 777 8888</p>
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
                        <h6 className="mb-2">ORDER ID</h6>
                        <p className="mb-1 text-muted">{invoice.orderId}</p>
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

                  {/* QR Code and Invoice Summary */}
                  <div className="row">
                    <div className="col-md-2 col-lg-2">
                      {/* QR Code */}
                      <div className="text-center">
                        <div className="mb-2">
                          <small className="text-muted">Scan to view invoice online</small>
                        </div>
                        {qrCodeDataUrl ? (
                          <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            display: 'inline-block',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={qrCodeDataUrl} 
                              alt="Invoice QR Code" 
                              style={{ width: '100%', height: '100%' }}
                            />
                          </div>
                        ) : (
                          <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: '#f8f9fa', 
                            display: 'flex',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div className="spinner-border spinner-border-sm text-muted" role="status">
                              <span className="visually-hidden">Loading QR Code...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-5 col-lg-4 ms-auto">
                      {/* Invoice Summary */}
                      <div className="bg-light p-4 rounded border">
                        <h6 className="mb-3 text-muted fw-semibold">INVOICE SUMMARY</h6>
                        <div className="table-responsive">
                          <table className="table table-borderless mb-0">
                            <tbody>
                              <tr className="bg-white">
                                <td className="text-muted">Subtotal</td>
                                <td className="text-end fw-semibold">{invoice.subtotal}</td>
                              </tr>
                              <tr className="bg-light">
                                <td className="text-muted">Shipping</td>
                                <td className="text-end fw-semibold">{invoice.shipping}</td>
                              </tr>
                              <tr className="bg-white">
                                <td className="text-muted">Tax</td>
                                <td className="text-end fw-semibold">{invoice.tax}</td>
                              </tr>
                              <tr className="border-top bg-primary bg-opacity-10">
                                <td className="fw-bold fs-5">Total</td>
                                <td className="text-end fw-bold fs-5 text-primary">{invoice.total}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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
          </div>
          

        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 9998 }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 9999 }}>
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="ti ti-share me-2"></i>
                  Share Invoice
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowShareModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">
                  Share this public link with anyone to view the invoice without requiring login.
                </p>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={`${window.location.origin}/public/invoice/${invoice?.id}`}
                    readOnly
                    id="shareLink"
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => {
                      const shareLink = document.getElementById('shareLink') as HTMLInputElement;
                      if (shareLink) {
                        shareLink.select();
                        navigator.clipboard.writeText(shareLink.value);
                        setLinkCopied(true);
                        setTimeout(() => setLinkCopied(false), 3000); // Hide after 3 seconds
                      }
                    }}
                    title="Copy to clipboard"
                  >
                    <i className="ti ti-copy"></i>
                  </button>
                </div>
                {linkCopied && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="ti ti-check me-1"></i>
                      Link copied to clipboard!
                    </small>
                  </div>
                )}
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="ti ti-info-circle me-1"></i>
                    This link provides public access to view the invoice. Anyone with this link can view the invoice details.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 9997 }}></div>
        </div>
      )}
    </Layout>
  );
};

// Helper function to get status badge class
const getStatusBadgeClass = (status: Invoice['status']) => {
  switch (status) {
    case 'Paid': return 'bg-success';
    case 'Pending': return 'bg-warning text-dark';
    case 'Failed': return 'bg-danger';
    case 'Refunded': return 'bg-info';
    case 'Overdue': return 'bg-danger';
    default: return 'bg-secondary';
  }
};

export default InvoiceDetails;
