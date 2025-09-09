import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PageSkeleton from '../components/common/PageSkeleton';
import { questionRatingService } from '../services/questionRatingService';
import type { QuestionRating, QuestionRatingStatistics, QuestionRatingFilters, CreateReplyRequest, Reply } from '../types/questionRating';
import { useToast } from '../contexts/ToastContext';

const QuestionsRatings: React.FC = () => {
  const { showError, showSuccess } = useToast();
  
  const [questionsRatings, setQuestionsRatings] = useState<QuestionRating[]>([]);
  const [statistics, setStatistics] = useState<QuestionRatingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<QuestionRatingFilters>({
    per_page: 15,
    page: 1
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'question' | 'rating' | 'store-rating' | 'product-rating' | 'shipping-rating' | 'blog'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'unpublished'>('all');
  const [selectedStarRating, setSelectedStarRating] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [repliedStatus, setRepliedStatus] = useState<{replied: boolean, notReplied: boolean}>({replied: false, notReplied: false});
  const [replyContent, setReplyContent] = useState('');
  const [openReplyForms, setOpenReplyForms] = useState<{[key: number]: boolean}>({});
  const [replies, setReplies] = useState<{[key: number]: Reply[]}>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    type: true,
    publishing: true,
    reply: true,
    stars: true,
    date: true,
    products: true
  });

  // Load data on component mount and when filters change
  useEffect(() => {
    loadQuestionsRatings();
    loadStatistics();
  }, [filters]);

  // Load replies for each question/rating
  useEffect(() => {
    questionsRatings.forEach(item => {
      loadReplies(item.id);
    });
  }, [questionsRatings]);


  const loadQuestionsRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await questionRatingService.getQuestionsRatings(filters, token || undefined);
      
      if (response.success) {
        setQuestionsRatings(response.data);
        setPagination(response.pagination);
      } else {
        showError('Failed to load questions and ratings', 'Failed to load questions and ratings');
      }
    } catch (error) {
      console.error('Error loading questions and ratings:', error);
      showError('Error loading questions and ratings', 'Error loading questions and ratings');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await questionRatingService.getStatistics(token || undefined);
      
      if (response.success && response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleSearch = () => {
    const newFilters = {
      search: searchTerm || undefined,
      type: selectedType !== 'all' ? selectedType : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      rating: selectedStarRating && selectedStarRating !== '' ? selectedStarRating : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      product_id: selectedProduct && selectedProduct !== 'all' ? selectedProduct : undefined,
      has_reply: repliedStatus.replied && !repliedStatus.notReplied ? true : 
                 !repliedStatus.replied && repliedStatus.notReplied ? false : undefined,
      page: 1
    };
    
    
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };


  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };


  const handleStatusUpdate = async (id: number, status: 'published' | 'unpublished') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await questionRatingService.updateQuestionRating(id, { status }, token || undefined);
      
      if (response.success) {
        showSuccess('Status Updated', `Item ${status} successfully`);
        loadQuestionsRatings();
        loadStatistics();
      } else {
        showError('Failed to update status', 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Error updating status', 'Error updating status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await questionRatingService.deleteQuestionRating(id, token || undefined);
      
      if (response.success) {
        showSuccess('Item Deleted', 'Item deleted successfully');
        loadQuestionsRatings();
        loadStatistics();
      } else {
        showError('Failed to delete item', 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('Error deleting item', 'Error deleting item');
    }
  };




  const toggleFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleReplyForm = (reviewId: number) => {
    setOpenReplyForms(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
    // Clear reply content when opening/closing
    setReplyContent('');
  };

  const loadReplies = async (questionRatingId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await questionRatingService.getReplies(questionRatingId, token || undefined);
      
      if (response.success && response.data) {
        setReplies(prev => ({
          ...prev,
          [questionRatingId]: response.data || []
        }));
      }
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const handleAddReply = async (questionRatingId: number) => {
    if (!replyContent.trim()) {
      showError('Invalid Reply', 'Please enter a reply');
      return;
    }

    if (replyContent.trim().length < 10) {
      showError('Reply Too Short', 'Reply must be at least 10 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const replyData: CreateReplyRequest = {
        content: replyContent.trim(),
        question_rating_id: questionRatingId,
        status: 'published'
      };

      const response = await questionRatingService.createReply(replyData, token || undefined);
      
      if (response.success) {
        showSuccess('Reply Added', 'Your reply has been added successfully');
        setReplyContent('');
        // Close the reply form
        setOpenReplyForms(prev => ({
          ...prev,
          [questionRatingId]: false
        }));
        // Reload replies for this specific question/rating
        loadReplies(questionRatingId);
      } else {
        showError('Failed to add reply', 'Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      showError('Error adding reply', 'Error adding reply');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: 'question' | 'rating') => {
    return type === 'question' ? 'ti ti-help-circle' : 'ti ti-star';
  };


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
          <i 
            key={i} 
        className={`ti ti-star${i < rating ? '' : '-off'} ${i < rating ? 'text-warning' : 'text-muted'}`}
          ></i>
    ));
  };

  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
                 <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">Questions & Ratings</h4>
         </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
            <li className="breadcrumb-item active">Questions & Ratings</li>
          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="row px-4">
        <div className="col-12">
          {/* Filter Button */}
          <div className="d-flex justify-content-end align-items-center mb-4">
          <button 
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2" 
            onClick={toggleFilter}
          >
            <i className="ti ti-filter"></i>
            <span>Filter</span>
          </button>
        </div>

        {/* Questions & Ratings List */}
            <div className="card">
          <div className="card-body">
            {loading ? (
              <PageSkeleton type="list" count={5} />
            ) : questionsRatings.length === 0 ? (
              <div className="text-center py-4">
                <i className="ti ti-inbox fs-48 text-muted"></i>
                <h5 className="mt-3 text-muted">No questions or ratings found</h5>
                <p className="text-muted">Try adjusting your search criteria or check back later.</p>
                    </div>
            ) : (
              <>
            {/* Average Rating Display */}
            {statistics && (
              <div className="mb-4">
                <div className="card bg-light border-0">
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <i className="ti ti-star fs-24 text-warning me-2"></i>
                          <span className="fs-18 fw-bold text-muted">Average Rating</span>
                  </div>
                        <h3 className="mb-0 fw-bold text-primary">{statistics.average_rating.toFixed(1)}/5.0</h3>
                </div>
              </div>
            </div>
          </div>
                  </div>
            )}

            {/* Cards Layout */}
            <div className="row g-3">
              {questionsRatings.map((item) => (
                <div key={item.id} className="col-12">
                  <div className="card border">
                    {/* Header Section */}
                    <div className="card-header bg-light border-0 p-3" style={{ width: '100%' }}>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-secondary text-white">
                            {item.product ? item.product.name : 'General'}
                          </span>
                          <span className={`badge bg-light text-dark border ${item.type === 'question' ? 'text-primary' : 'text-warning'}`}>
                            <i className={`${getTypeIcon(item.type)} me-1`}></i>
                            {item.type === 'question' ? 'Question' : 'Rating'}
                          </span>
                        </div>
                        <small className="text-muted fw-medium">{formatDate(item.created_at)}</small>
                    </div>
                  </div>
                    <div className="card-body p-3">


                      {/* User Info and Content Section */}
                      <div className="mb-3">
                        {/* User Avatar and Name */}
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="flex-shrink-0">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                              <i className="ti ti-user text-white fs-5"></i>
              </div>
            </div>
                  <div className="flex-grow-1">
                            <h5 className="mb-0 fw-semibold text-dark">
                              {item.user ? item.user.name : 'Guest'}
                            </h5>
                            {item.type === 'rating' && item.rating && (
                              <div className="mt-1">
                                {renderStars(item.rating)}
                  </div>
                            )}
                      </div>
                    </div>

                        {/* Comment Content */}
                        <div>
                          <p className="mb-0" style={{ fontSize: '13px' }}>
                            {item.content}
                          </p>
                  </div>
                </div>

                {/* Replies Section */}
                {replies[item.id] && replies[item.id].length > 0 && (
                  <div className="mt-3">
                    {replies[item.id].map((reply, index) => (
                      <div key={reply.id || index} className="d-flex align-items-start gap-2 mb-2">
                        <i className="ti ti-arrow-back text-muted mt-1" style={{ fontSize: '12px' }}></i>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-medium" style={{ fontSize: '12px' }}>Reply:</span>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              {formatDate(reply.created_at)}
                            </small>
                          </div>
                          <p className="mb-0" style={{ fontSize: '13px' }}>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                      {/* Bottom Actions */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <i className="ti ti-trash"></i>
                          </button>
              </div>
                        
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => toggleReplyForm(item.id)}
                            title="Reply"
                          >
                            <i className="ti ti-arrow-left me-1"></i>
                            Reply
                          </button>
                          
                          <button 
                            className={`btn btn-sm ${item.status === 'published' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                            onClick={() => handleStatusUpdate(item.id, item.status === 'published' ? 'unpublished' : 'published')}
                            title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {item.status === 'published' ? (
                              <>
                                <i className="ti ti-x me-1"></i>
                                Unpublished
                              </>
                            ) : (
                              <>
                                <i className="ti ti-check me-1"></i>
                                Published
                              </>
                            )}
                          </button>
            </div>
          </div>
                  
                  </div>
                     {/* Reply Form Bottom Section */}
                  {openReplyForms[item.id] && (
                    <div className="bg-light p-3" style={{ width: '100%' }}>
                      <div className="mb-2">
                        <textarea
                          className="form-control form-control-sm"
                          rows={2}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Type your reply here..."
                          style={{ fontSize: '13px' }}
                        />
                        <small className="text-muted" style={{ fontSize: '11px' }}>
                          {replyContent.length}/10 characters minimum
                        </small>
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          onClick={() => handleAddReply(item.id)}
                          disabled={replyContent.trim().length < 10}
                          style={{ fontSize: '12px', padding: '2px 8px' }}
                        >
                          <i className="ti ti-send me-1"></i>
                          Send
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => toggleReplyForm(item.id)}
                          style={{ fontSize: '12px', padding: '2px 8px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                    </div>
                  
               
                </div>
              ))}
                </div>
                
                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">
                      Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
              </div>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <li key={page} className={`page-item ${pagination.current_page === page ? 'active' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          );
                        })}
                        <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
            </div>
                )}
              </>
            )}
          </div>
       </div>


      {/* Filter Side Modal */}
      <div className={`offcanvas offcanvas-end ${isFilterOpen ? 'show' : ''}`} tabIndex={-1} id="filterOffcanvas" aria-labelledby="filterOffcanvasLabel" style={{ width: '400px' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="filterOffcanvasLabel">
            <i className="ti ti-filter me-2"></i>
            Sort Questions & Reviews by
          </h5>
          <button type="button" className="btn-close" onClick={toggleFilter} aria-label="Close"></button>
                </div>
        <div className="offcanvas-body" style={{ width: '100%' }}>
          <div className="card h-100 border-0" data-simplebar style={{ width: '100%' }}>
            <div className="card-body p-0" style={{ width: '100%' }}>
              {/* Type Filter */}
              <div className="border-bottom border-dashed" style={{ width: '100%' }}>
                <div 
                  className="p-3 d-flex justify-content-between align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleSection('type')}
                >
                  <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>Type</h6>
                  <i className={`ti ti-chevron-${expandedSections.type ? 'up' : 'down'}`}></i>
                  </div>
                {expandedSections.type && (
                  <div className="px-3 pb-3">
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="typeFilter" 
                        id="type-all" 
                        checked={selectedType === 'all'}
                        onChange={() => setSelectedType('all')}
                      />
                      <label htmlFor="type-all" className="form-check-label">All</label>
                </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="typeFilter" 
                        id="type-store-rating" 
                        checked={selectedType === 'store-rating'}
                        onChange={() => setSelectedType('store-rating')}
                      />
                      <label htmlFor="type-store-rating" className="form-check-label">Store Rating</label>
              </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="typeFilter" 
                        id="type-product-rating" 
                        checked={selectedType === 'product-rating'}
                        onChange={() => setSelectedType('product-rating')}
                      />
                      <label htmlFor="type-product-rating" className="form-check-label">Product Rating</label>
            </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="typeFilter" 
                        id="type-shipping-rating" 
                        checked={selectedType === 'shipping-rating'}
                        onChange={() => setSelectedType('shipping-rating')}
                      />
                      <label htmlFor="type-shipping-rating" className="form-check-label">Shipping Companies Rating</label>
                     </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="typeFilter" 
                        id="type-question" 
                        checked={selectedType === 'question'}
                        onChange={() => setSelectedType('question')}
                      />
                      <label htmlFor="type-question" className="form-check-label">Questions</label>
         </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="typeFilter" 
                        id="type-blog" 
                        checked={selectedType === 'blog'}
                        onChange={() => setSelectedType('blog')}
                      />
                      <label htmlFor="type-blog" className="form-check-label">Blog</label>
                    </div>
                  </div>
                )}
       </div>

              {/* Publishing Status */}
              <div className="border-bottom border-dashed" style={{ width: '100%' }}>
                <div 
                  className="p-3 d-flex justify-content-between align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleSection('publishing')}
                >
                  <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>Publishing</h6>
                  <i className={`ti ti-chevron-${expandedSections.publishing ? 'up' : 'down'}`}></i>
                </div>
                {expandedSections.publishing && (
                  <div className="px-3 pb-3">
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="published" 
                        checked={selectedStatus === 'published'}
                        onChange={() => setSelectedStatus(selectedStatus === 'published' ? 'all' : 'published')}
                      />
                      <label htmlFor="published" className="form-check-label">Published</label>
                    </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="unpublished" 
                        checked={selectedStatus === 'unpublished'}
                        onChange={() => setSelectedStatus(selectedStatus === 'unpublished' ? 'all' : 'unpublished')}
                      />
                      <label htmlFor="unpublished" className="form-check-label">Unpublished</label>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Status */}
              <div className="border-bottom border-dashed" style={{ width: '100%' }}>
                <div 
                  className="p-3 d-flex justify-content-between align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleSection('reply')}
                >
                  <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>Reply</h6>
                  <i className={`ti ti-chevron-${expandedSections.reply ? 'up' : 'down'}`}></i>
                   </div>
                {expandedSections.reply && (
                  <div className="px-3 pb-3">
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="replied" 
                        checked={repliedStatus.replied}
                        onChange={(e) => setRepliedStatus(prev => ({...prev, replied: e.target.checked}))}
                      />
                      <label htmlFor="replied" className="form-check-label">Replied</label>
               </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="not-replied" 
                        checked={repliedStatus.notReplied}
                        onChange={(e) => setRepliedStatus(prev => ({...prev, notReplied: e.target.checked}))}
                      />
                      <label htmlFor="not-replied" className="form-check-label">Not Replied</label>
                         </div>
                       </div>
                )}
                       </div>

              {/* Star Rating */}
              <div className="border-bottom border-dashed" style={{ width: '100%' }}>
                <div 
                  className="p-3 d-flex justify-content-between align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleSection('stars')}
                >
                  <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>Number of Stars</h6>
                  <i className={`ti ti-chevron-${expandedSections.stars ? 'up' : 'down'}`}></i>
                     </div>
                {expandedSections.stars && (
                  <div className="px-3 pb-3">
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="starRating" 
                        id="all-stars" 
                        checked={selectedStarRating === ''}
                        onChange={() => setSelectedStarRating('')}
                      />
                      <label htmlFor="all-stars" className="form-check-label">
                        All Stars
                      </label>
                    </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="starRating" 
                        id="5-stars" 
                        checked={selectedStarRating === '5'}
                        onChange={() => setSelectedStarRating('5')}
                      />
                      <label htmlFor="5-stars" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-flex align-items-center me-2">
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                        </span>
                        <span>5 Stars</span>
                      </label>
                   </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="starRating" 
                        id="4-stars" 
                        checked={selectedStarRating === '4'}
                        onChange={() => setSelectedStarRating('4')}
                      />
                      <label htmlFor="4-stars" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-flex align-items-center me-2">
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star text-muted"></i>
                       </span>
                        <span>4 Stars</span>
                      </label>
                   </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="starRating" 
                        id="3-stars" 
                        checked={selectedStarRating === '3'}
                        onChange={() => setSelectedStarRating('3')}
                      />
                      <label htmlFor="3-stars" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-flex align-items-center me-2">
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star text-muted"></i>
                          <i className="ti ti-star text-muted"></i>
                        </span>
                        <span>3 Stars</span>
                      </label>
                 </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="starRating" 
                        id="2-stars" 
                        checked={selectedStarRating === '2'}
                        onChange={() => setSelectedStarRating('2')}
                      />
                      <label htmlFor="2-stars" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-flex align-items-center me-2">
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star text-muted"></i>
                          <i className="ti ti-star text-muted"></i>
                          <i className="ti ti-star text-muted"></i>
                        </span>
                        <span>2 Stars</span>
                      </label>
                    </div>
                    <div className="form-check py-1">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="starRating" 
                        id="1-star" 
                        checked={selectedStarRating === '1'}
                        onChange={() => setSelectedStarRating('1')}
                      />
                      <label htmlFor="1-star" className="form-check-label d-flex align-items-center">
                        <span className="d-inline-flex align-items-center me-2">
                          <i className="ti ti-star-filled text-warning"></i>
                          <i className="ti ti-star text-muted"></i>
                          <i className="ti ti-star text-muted"></i>
                          <i className="ti ti-star text-muted"></i>
                          <i className="ti ti-star text-muted"></i>
                        </span>
                        <span>1 Star</span>
                      </label>
                     </div>
                   </div>
                 )}
              </div>

              {/* Date Filter */}
              <div className="border-bottom border-dashed" style={{ width: '100%' }}>
                <div 
                  className="p-3 d-flex justify-content-between align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleSection('date')}
                >
                  <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>Date</h6>
                  <i className={`ti ti-chevron-${expandedSections.date ? 'up' : 'down'}`}></i>
                   </div>
                {expandedSections.date && (
                  <div className="px-3 pb-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label small">From</label>
                        <input 
                          type="date" 
                          className="form-control form-control-sm" 
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small">To</label>
                        <input 
                          type="date" 
                          className="form-control form-control-sm" 
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Products Filter */}
              <div className="border-bottom border-dashed" style={{ width: '100%' }}>
                <div 
                  className="p-3 d-flex justify-content-between align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleSection('products')}
                >
                  <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>Products</h6>
                  <i className={`ti ti-chevron-${expandedSections.products ? 'up' : 'down'}`}></i>
                </div>
                {expandedSections.products && (
                  <div className="px-3 pb-3">
                    <select 
                      className="form-select form-select-sm"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select Products</option>
                      <option value="all">All Products</option>
                      <option value="product1">Product 1</option>
                      <option value="product2">Product 2</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Filter Actions */}
              <div className="p-3">
                <div className="d-grid gap-2">
                  <button className="btn btn-success" onClick={handleSearch}>
                    Show Results
                  </button>
                  <button className="btn btn-light" onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedStatus('all');
                    setSelectedStarRating('');
                    setDateFrom('');
                    setDateTo('');
                    setSelectedProduct('');
                    setRepliedStatus({replied: false, notReplied: false});
                    setFilters({ 
                      per_page: 15, 
                      page: 1,
                      search: undefined,
                      type: undefined,
                      status: undefined,
                      rating: undefined,
                      date_from: undefined,
                      date_to: undefined,
                      product_id: undefined,
                      has_reply: undefined
                    });
                  }}>
                    Reset
                  </button>
                                </div>
               </div>
             </div>
           </div>
        </div>
      </div>
        </div>
      </div>

      {/* Backdrop for filter */}
      {isFilterOpen && (
        <div className="offcanvas-backdrop fade show" onClick={toggleFilter}></div>
      )}
    </Layout>
   );
 };

export default QuestionsRatings;