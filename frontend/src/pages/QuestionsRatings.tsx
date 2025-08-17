import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

interface QuestionRating {
  id: string;
  timestamp: string;
  type: 'question' | 'rating';
  category: string;
  userType: string;
  content: string;
  status: 'published' | 'unpublished';
  rating?: number;
  userName: string;
  userEmail: string;
}

const QuestionsRatings: React.FC = () => {
  const [questionsRatings] = useState<QuestionRating[]>([
    {
      id: '1',
      timestamp: '2 hours ago',
      type: 'question',
      category: 'Return & Exchange Policy',
      userType: 'Visitor',
      content: 'I created a new account but it says my phone number is already registered. How can I resolve this?',
      status: 'published',
      userName: 'John Smith',
      userEmail: 'john.smith@email.com'
    },
    {
      id: '2',
      timestamp: '1 day ago',
      type: 'question',
      category: 'Account Management',
      userType: 'Customer',
      content: 'I cannot find my account details. Can you help me recover my account?',
      status: 'unpublished',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.j@email.com'
    },
    {
      id: '3',
      timestamp: '3 days ago',
      type: 'rating',
      category: 'Product Quality',
      userType: 'Customer',
      content: 'Excellent products and fast delivery service. Highly recommended!',
      status: 'published',
      rating: 5,
      userName: 'Mike Wilson',
      userEmail: 'mike.w@email.com'
    },
    {
      id: '4',
      timestamp: '1 week ago',
      type: 'question',
      category: 'Shipping & Delivery',
      userType: 'Visitor',
      content: 'How long does shipping take to reach my location?',
      status: 'published',
      userName: 'Emily Davis',
      userEmail: 'emily.d@email.com'
    },
    {
      id: '5',
      timestamp: '2 weeks ago',
      type: 'rating',
      category: 'Customer Service',
      userType: 'Customer',
      content: 'Great customer support team. They helped me resolve my issue quickly.',
      status: 'published',
      rating: 4,
      userName: 'David Brown',
      userEmail: 'david.b@email.com'
    },
    {
      id: '6',
      timestamp: '3 weeks ago',
      type: 'question',
      category: 'Payment Methods',
      userType: 'Visitor',
      content: 'What payment methods do you accept for international orders?',
      status: 'unpublished',
      userName: 'Lisa Anderson',
      userEmail: 'lisa.a@email.com'
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<QuestionRating | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const filteredItems = questionsRatings.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = (id: string) => {
    console.log('Delete item:', id);
  };

  const handleStatusChange = (id: string, newStatus: 'published' | 'unpublished') => {
    console.log('Change status:', id, newStatus);
  };

  const handleReply = (id: string) => {
    console.log('Reply to:', id);
  };

  const handleItemClick = (item: QuestionRating) => {
    setSelectedItem(item);
    setShowDetailModal(true);
    setReplyText('');
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
    setReplyText('');
  };

  const handleSubmitReply = () => {
    if (replyText.trim() && selectedItem) {
      console.log('Reply submitted for:', selectedItem.id, 'Reply:', replyText);
      // Here you would typically send the reply to your backend
      setReplyText('');
      setShowDetailModal(false);
      setSelectedItem(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <span className="badge bg-success">Published</span>
      : <span className="badge bg-secondary">Unpublished</span>;
  };

  const getTypeIcon = (type: string) => {
    return type === 'question' 
      ? <i className="ti ti-help-circle text-primary"></i>
      : <i className="ti ti-star text-warning"></i>;
  };

  const getTypeLabel = (type: string) => {
    return type === 'question' ? 'Question' : 'Rating';
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`ti ti-star${i < rating ? '-filled' : ''} ${i < rating ? 'text-warning' : 'text-muted'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
                 <div className="flex-grow-1">
           <h4 className="fs-sm text-uppercase fw-bold m-0">QUESTIONS & RATINGS</h4>
         </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">Questions & Ratings</li>
          </ol>
        </div>
      </div>

             {/* Stats Cards */}
               <div className="row px-4 mb-0">
                   <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold fs-sm text-muted">Total Questions</h6>
                    <h4 className="mb-0 fw-bold fs-2">{questionsRatings.filter(q => q.type === 'question').length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-sm" style={{ width: '48px', height: '48px' }}>
                      <div className="avatar-title bg-info bg-opacity-10 text-info rounded-circle" style={{ width: '100%', height: '100%' }}>
                        <i className="ti ti-message-question fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
                   <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold fs-sm text-muted">Total Ratings</h6>
                    <h4 className="mb-0 fw-bold fs-2">{questionsRatings.filter(q => q.type === 'rating').length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-sm" style={{ width: '48px', height: '48px' }}>
                      <div className="avatar-title bg-warning bg-opacity-10 text-warning rounded-circle" style={{ width: '100%', height: '100%' }}>
                        <i className="ti ti-stars fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
                   <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold fs-sm text-muted">Published</h6>
                    <h4 className="mb-0 fw-bold fs-2">{questionsRatings.filter(q => q.status === 'published').length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-sm" style={{ width: '48px', height: '48px' }}>
                      <div className="avatar-title bg-success bg-opacity-10 text-success rounded-circle" style={{ width: '100%', height: '100%' }}>
                        <i className="ti ti-eye fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
                   <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold fs-sm text-muted">Pending</h6>
                    <h4 className="mb-0 fw-bold fs-2">{questionsRatings.filter(q => q.status === 'unpublished').length}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-sm" style={{ width: '48px', height: '48px' }}>
                      <div className="avatar-title bg-warning bg-opacity-10 text-warning rounded-circle" style={{ width: '100%', height: '100%' }}>
                        <i className="ti ti-hourglass fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
       </div>

      {/* Main Content */}
      <div className="row px-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            {/* Card Header */}
            <div className="card-header border-light justify-content-between">
                             <h5 className="card-title mb-0 fs-5">Questions & Ratings Management</h5>
              <div className="d-flex align-items-center gap-2">
                <div className="app-search">
                  <input 
                    type="search" 
                    className="form-control" 
                    placeholder="Search questions, ratings, or users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="ti ti-search app-search-icon text-muted"></i>
                </div>

                <div className="app-search">
                  <select 
                    className="form-select form-control"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="question">Questions Only</option>
                    <option value="rating">Ratings Only</option>
                  </select>
                  <i className="ti ti-filter app-search-icon text-muted"></i>
                </div>

                <button 
                  type="button" 
                  className="btn btn-secondary"
                >
                  <i className="ti ti-download me-2"></i>
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
                <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                  <tr className="text-uppercase fs-xxs">
                    <th className="ps-3" style={{ width: '1%' }}>
                      <input 
                        className="form-check-input form-check-input-light fs-14 mt-0" 
                        type="checkbox" 
                        id="select-all-items"
                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                                         <th>Type</th>
                     <th>Customer</th>
                     <th>Category</th>
                     <th>Content</th>
                     <th>Rating</th>
                     <th>Status</th>
                     <th>Date</th>
                    <th style={{ width: '1%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-3">
                        <input 
                          className="form-check-input form-check-input-light fs-14 item-check mt-0" 
                          type="checkbox" 
                          value={item.id}
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        />
                      </td>
                                             <td>
                         <div 
                           className="d-flex align-items-center gap-2 cursor-pointer" 
                           style={{ cursor: 'pointer' }}
                           onClick={() => handleItemClick(item)}
                         >
                           {getTypeIcon(item.type)}
                           <span className="fw-semibold fs-base">{getTypeLabel(item.type)}</span>
                         </div>
                       </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm me-3">
                            <div className="avatar-title bg-primary bg-opacity-10 text-primary rounded-circle">
                              <i className="ti ti-user fs-sm"></i>
                            </div>
                          </div>
                          <div>
                                                         <h5 className="text-nowrap fs-base mb-0 lh-base">{item.userName}</h5>
                                                         <p className="text-muted fs-xs mb-0">{item.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
                          {item.category}
                        </span>
                      </td>
                                             <td>
                         <div 
                           style={{ maxWidth: '300px', cursor: 'pointer' }}
                           onClick={() => handleItemClick(item)}
                         >
                           <h5 className="fs-sm mb-0 fw-medium" title={item.content}>
                             {item.content}
                           </h5>
                         </div>
                       </td>
                      <td>
                        {item.type === 'rating' && item.rating ? (
                          renderStars(item.rating)
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(item.status)}
                      </td>
                      <td>
                                                 <span className="text-muted">{item.timestamp}</span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleReply(item.id)}
                              >
                                <i className="ti ti-message-circle me-2"></i>
                                Reply
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleStatusChange(item.id, item.status === 'published' ? 'unpublished' : 'published')}
                              >
                                <i className={`ti ti-${item.status === 'published' ? 'eye-off' : 'check'} me-2`}></i>
                                {item.status === 'published' ? 'Unpublish' : 'Publish'}
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger" 
                                onClick={() => handleDelete(item.id)}
                              >
                                <i className="ti ti-trash me-2"></i>
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card Footer */}
            <div className="card-footer border-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                                     <p className="text-muted mb-0 fs-sm">
                     Showing {filteredItems.length} of {questionsRatings.length} items
                   </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">Rows per page:</span>
                  <select 
                    className="form-select form-select-sm" 
                    style={{ width: 'auto' }}
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-secondary">Previous</button>
                    <button className="btn btn-sm btn-primary">1</button>
                    <button className="btn btn-sm btn-outline-secondary">2</button>
                    <button className="btn btn-sm btn-outline-secondary">3</button>
                    <button className="btn btn-sm btn-outline-secondary">Next</button>
                  </div>
                </div>
              </div>
            </div>
                     </div>
         </div>
       </div>

       {/* Detail Modal */}
       {showDetailModal && selectedItem && (
         <>
           {/* Backdrop */}
           <div 
             className="modal-backdrop fade show" 
             style={{ zIndex: 1054 }}
             onClick={handleCloseModal}
           ></div>
           
           {/* Modal */}
           <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
             <div className="modal-dialog modal-dialog-centered modal-lg">
             <div className="modal-content">
               <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                 <h5 className="modal-title">
                   <div className="d-flex align-items-center gap-2">
                     {getTypeIcon(selectedItem.type)}
                     <span>{getTypeLabel(selectedItem.type)} Details</span>
                   </div>
                 </h5>
                 <button 
                   type="button" 
                   className="btn-close btn-close-white" 
                   onClick={handleCloseModal}
                 ></button>
               </div>
               <div className="modal-body">
                 {/* Customer Information */}
                 <div className="row mb-4">
                   <div className="col-md-6">
                     <h6 className="fw-semibold mb-2">Customer Information</h6>
                     <div className="d-flex align-items-center mb-2">
                       <div className="avatar avatar-sm me-3">
                         <div className="avatar-title bg-primary bg-opacity-10 text-primary rounded-circle">
                           <i className="ti ti-user fs-sm"></i>
                         </div>
                       </div>
                       <div>
                         <p className="mb-0 fw-semibold">{selectedItem.userName}</p>
                         <small className="text-muted">{selectedItem.userEmail}</small>
                       </div>
                     </div>
                     <p className="mb-0">
                       <span className="text-muted">User Type:</span> {selectedItem.userType}
                     </p>
                   </div>
                   <div className="col-md-6">
                     <h6 className="fw-semibold mb-2">Details</h6>
                     <p className="mb-1">
                       <span className="text-muted">Category:</span> 
                       <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 ms-2">
                         {selectedItem.category}
                       </span>
                     </p>
                     <p className="mb-1">
                       <span className="text-muted">Status:</span> {getStatusBadge(selectedItem.status)}
                     </p>
                     <p className="mb-0">
                       <span className="text-muted">Date:</span> {selectedItem.timestamp}
                     </p>
                   </div>
                 </div>

                 {/* Rating Stars (if applicable) */}
                 {selectedItem.type === 'rating' && selectedItem.rating && (
                   <div className="mb-4">
                     <h6 className="fw-semibold mb-2">Rating</h6>
                     <div className="d-flex align-items-center">
                       {renderStars(selectedItem.rating)}
                       <span className="ms-2 text-muted">({selectedItem.rating}/5 stars)</span>
                     </div>
                   </div>
                 )}

                 {/* Full Content */}
                 <div className="mb-4">
                   <h6 className="fw-semibold mb-2">Content</h6>
                   <div className="p-3 bg-light rounded">
                     <p className="mb-0">{selectedItem.content}</p>
                   </div>
                 </div>

                 {/* Reply Section */}
                 <div>
                   <h6 className="fw-semibold mb-2">Reply</h6>
                   <textarea
                     className="form-control"
                     rows={4}
                     placeholder="Write your reply here..."
                     value={replyText}
                     onChange={(e) => setReplyText(e.target.value)}
                   ></textarea>
                 </div>
               </div>
               <div className="modal-footer">
                 <button 
                   type="button" 
                   className="btn btn-secondary"
                   onClick={handleCloseModal}
                 >
                   Close
                 </button>
                 <button 
                   type="button" 
                   className="btn btn-primary"
                   onClick={handleSubmitReply}
                   disabled={!replyText.trim()}
                 >
                   <i className="ti ti-send me-2"></i>
                   Send Reply
                 </button>
                                </div>
               </div>
             </div>
           </div>
         </>
       )}
     </Layout>
   );
 };

export default QuestionsRatings;
