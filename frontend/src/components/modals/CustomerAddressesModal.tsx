import React, { useState, useEffect } from 'react';
import { customerService, type CustomerAddress } from '../../services/customerService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface CustomerAddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
}

const CustomerAddressesModal: React.FC<CustomerAddressesModalProps> = ({
  isOpen,
  onClose,
  customerId,
  customerName,
}) => {
  const { token } = useAuth();
  const { showError } = useToast();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [compactView, setCompactView] = useState(true);

  useEffect(() => {
    if (isOpen && customerId && token) {
      fetchAddresses();
    }
  }, [isOpen, customerId, token]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomerAddresses(customerId, token);
      if (response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching customer addresses:', error);
      showError('Error', 'Failed to load customer addresses');
    } finally {
      setLoading(false);
    }
  };

  const getAddressIcon = (type: CustomerAddress['type']) => {
    switch (type) {
      case 'home':
        return <i className="ti ti-home fs-6 text-primary"></i>;
      case 'work':
        return <i className="ti ti-building fs-6 text-success"></i>;
      default:
        return <i className="ti ti-map-pin fs-6 text-info"></i>;
    }
  };

  const getAddressTypeColor = (type: CustomerAddress['type']) => {
    switch (type) {
      case 'home':
        return 'bg-primary bg-opacity-10 text-primary';
      case 'work':
        return 'bg-success bg-opacity-10 text-success';
      default:
        return 'bg-info bg-opacity-10 text-info';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxHeight: '80vh' }}>
        <div className="modal-content" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
            <h5 className="modal-title">
              <i className="ti ti-map-pin me-2"></i>
              Addresses for {customerName}
              <span className="badge bg-light text-dark ms-2 fs-xs">
                {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
              </span>
            </h5>
            <div className="d-flex align-items-center gap-2">
              {addresses.length > 2 && (
                <button
                  type="button"
                  className={`btn btn-sm ${compactView ? 'btn-outline-light' : 'btn-light'}`}
                  onClick={() => setCompactView(!compactView)}
                  title={compactView ? 'Show detailed view' : 'Show compact view'}
                >
                  <i className={`ti ${compactView ? 'ti-layout-grid' : 'ti-layout-list'}`}></i>
                </button>
              )}
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
              ></button>
            </div>
          </div>
          
          <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-4">
                <i className="ti ti-map-pin-off fs-1 text-muted mb-3"></i>
                <h6 className="text-muted">No addresses found</h6>
                <p className="text-muted">This customer hasn't added any addresses yet.</p>
              </div>
            ) : compactView && addresses.length > 3 ? (
              // Ultra compact view for many addresses
              <div className="row g-1">
                {addresses.map((address) => (
                  <div key={address.id} className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <div className={`p-1 rounded ${getAddressTypeColor(address.type)}`} style={{ width: '20px', height: '20px' }}>
                              <div className="d-flex align-items-center justify-content-center h-100">
                                {getAddressIcon(address.type)}
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2">
                                <h6 className="mb-0 fw-semibold fs-sm">{address.name}</h6>
                                <span className={`badge ${getAddressTypeColor(address.type)} fs-xxs`}>
                                  {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                                </span>
                                {address.is_default && (
                                  <span className="badge bg-primary fs-xxs">
                                    <i className="ti ti-star me-1"></i>
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="mb-0 text-muted fs-xs">
                                <i className="ti ti-map-pin me-1"></i>
                                {address.address}
                                {address.building && `, ${address.building}`}
                                {address.floor && `, Floor ${address.floor}`}
                                {address.apartment && `, Apt ${address.apartment}`}
                                <br />
                                {address.area}, {address.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Regular compact view
              <div className="row g-2">
                {addresses.map((address) => (
                  <div key={address.id} className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <div className={`p-1 rounded ${getAddressTypeColor(address.type)}`} style={{ width: '24px', height: '24px' }}>
                              <div className="d-flex align-items-center justify-content-center h-100">
                                {getAddressIcon(address.type)}
                              </div>
                            </div>
                            <div>
                              <h6 className="mb-0 fw-semibold fs-sm">{address.name}</h6>
                              <span className={`badge ${getAddressTypeColor(address.type)} fs-xxs`}>
                                {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {address.is_default && (
                            <span className="badge bg-primary fs-xxs">
                              <i className="ti ti-star me-1"></i>
                              Default
                            </span>
                          )}
                        </div>

                        <div className="mb-2">
                          <div className="d-flex align-items-start gap-2">
                            <i className="ti ti-map-pin text-muted mt-1 fs-sm"></i>
                            <div className="flex-grow-1">
                              <p className="mb-1 fw-medium fs-sm">{address.address}</p>
                              <div className="d-flex flex-wrap gap-2">
                                {address.building && (
                                  <span className="text-muted fs-xs">Building: {address.building}</span>
                                )}
                                {address.floor && (
                                  <span className="text-muted fs-xs">Floor: {address.floor}</span>
                                )}
                                {address.apartment && (
                                  <span className="text-muted fs-xs">Apt: {address.apartment}</span>
                                )}
                              </div>
                              <p className="mb-0 text-muted fs-xs">{address.area}, {address.city}</p>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            {address.latitude && address.longitude && (
                              <div className="d-flex align-items-center gap-1">
                                <i className="ti ti-navigation text-muted fs-xs"></i>
                                <span className="text-muted fs-xs">
                                  {parseFloat(address.latitude?.toString() || '0').toFixed(4)}, {parseFloat(address.longitude?.toString() || '0').toFixed(4)}
                                </span>
                              </div>
                            )}
                            <small className="text-muted fs-xs">
                              {new Date(address.created_at).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </small>
                          </div>
                          
                          {address.is_default && (
                            <span className="badge bg-primary bg-opacity-10 text-primary fs-xxs">
                              <i className="ti ti-check me-1"></i>
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAddressesModal;
