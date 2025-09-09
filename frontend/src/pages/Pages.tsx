import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PageSkeleton from '../components/common/PageSkeleton';
import { pageService } from '../services/pageService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import type { Page, CreatePageRequest, PageFilters } from '../types/page';

const Pages: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const { user, token, isAuthenticated } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [noStore, setNoStore] = useState(false);
  const [filters, setFilters] = useState<PageFilters>({
    per_page: 15,
    page: 1
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showNewPageModal, setShowNewPageModal] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editForm, setEditForm] = useState<CreatePageRequest>({
    title: '',
    content: '',
    seo_title: '',
    seo_url: '',
    seo_description: '',
    show_in_footer: false,
    language: 'EN'
  });
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'AR'>('EN');

  // Load pages on component mount
  useEffect(() => {
    if (isAuthenticated && token) {
      loadPages();
    } else {
      setLoading(false);
    }
  }, [filters, isAuthenticated, token]);

  const loadPages = async () => {
    if (!isAuthenticated || !token) {
      console.log('❌ User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Loading pages...');
      const response = await pageService.getPages(filters, token);
      console.log('📄 Pages response:', response);

      setPages(response.data);
      setPagination({
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total
      });
    } catch (error: any) {
      console.error('❌ Error loading pages:', error);
      
      // Check if it's a "no store found" error
      if (error.message && error.message.includes('No store found')) {
        setNoStore(true);
        showError('Store Required', 'You need to create a store first before managing pages. Please go to the store setup.');
      } else {
        showError('Failed to load pages', 'Failed to load pages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
    setEditForm({
      title: page.title,
      content: page.content,
      seo_title: page.seo_title,
      seo_url: page.seo_url,
      seo_description: page.seo_description,
      show_in_footer: page.show_in_footer,
      language: page.language
    });
    setSelectedLanguage(page.language);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPage(null);
    setEditForm({ 
      title: '', 
      content: '', 
      seo_title: '', 
      seo_url: '', 
      seo_description: '', 
      show_in_footer: false,
      language: 'EN'
    });
    setSelectedLanguage('EN');
  };

  const handleNewPageClick = () => {
    setShowNewPageModal(true);
    setEditForm({ 
      title: '', 
      content: '', 
      seo_title: '', 
      seo_url: '', 
      seo_description: '', 
      show_in_footer: false,
      language: 'EN'
    });
    setSelectedLanguage('EN');
  };

  const handleCloseNewPageModal = () => {
    setShowNewPageModal(false);
    setEditForm({ 
      title: '', 
      content: '', 
      seo_title: '', 
      seo_url: '', 
      seo_description: '', 
      show_in_footer: false,
      language: 'EN'
    });
    setSelectedLanguage('EN');
  };

  const handleSaveEdit = async () => {
    if (!selectedPage || !token) return;

    try {
      const response = await pageService.updatePage(selectedPage.id, editForm, token);
      
      if (response.success) {
        showSuccess('Page updated successfully', 'Page updated successfully');
        loadPages(); // Reload pages
        handleCloseEditModal();
      } else {
        showError('Failed to update page', response.message || 'Failed to update page');
      }
    } catch (error) {
      console.error('❌ Error updating page:', error);
      showError('Failed to update page', 'Failed to update page');
    }
  };

  const handleSaveNewPage = async () => {
    if (!token) return;

    try {
      const response = await pageService.createPage(editForm, token);
      
      if (response.success) {
        showSuccess('Page created successfully', 'Page created successfully');
        loadPages(); // Reload pages
        handleCloseNewPageModal();
      } else {
        showError('Failed to create page', response.message || 'Failed to create page');
      }
    } catch (error) {
      console.error('❌ Error creating page:', error);
      showError('Failed to create page', 'Failed to create page');
    }
  };

  const handleStatusToggle = async (pageId: number) => {
    if (!token) return;

    try {
      const response = await pageService.togglePageStatus(pageId, token);
      
      if (response.success) {
        showSuccess('Page status updated successfully', 'Page status updated successfully');
        loadPages(); // Reload pages
      } else {
        showError('Failed to update page status', response.message || 'Failed to update page status');
      }
    } catch (error) {
      console.error('❌ Error toggling page status:', error);
      showError('Failed to update page status', 'Failed to update page status');
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (!window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    if (!token) return;

    try {
      const response = await pageService.deletePage(pageId, token);
      
      if (response.success) {
        showSuccess('Page deleted successfully', 'Page deleted successfully');
        loadPages(); // Reload pages
      } else {
        showError('Failed to delete page', response.message || 'Failed to delete page');
      }
    } catch (error) {
      console.error('❌ Error deleting page:', error);
      showError('Failed to delete page', 'Failed to delete page');
    }
  };

  const handleCopyPageLink = (page: Page) => {
    const pageUrl = `https://example.com/${page.seo_url}`;
    navigator.clipboard.writeText(pageUrl).then(() => {
      showSuccess('Page link copied to clipboard', 'Page link copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy page link:', err);
      showError('Failed to copy page link', 'Failed to copy page link');
    });
  };

  // Auto-generate SEO URL when title changes
  const handleTitleChange = (title: string) => {
    const seoUrl = pageService.generateSeoUrl(title);
    setEditForm(prev => ({
      ...prev,
      title,
      seo_title: prev.seo_title || title,
      seo_url: seoUrl
    }));
  };

  // Initialize Quill Snow Editor when modal opens
  useEffect(() => {
    if ((showEditModal && selectedPage) || showNewPageModal) {
      // Wait for DOM to be ready
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).Quill) {
          const Quill = (window as any).Quill;
          
          // Destroy existing editor if it exists
          const existingEditor = document.querySelector('.ql-editor');
          if (existingEditor) {
            const quillInstance = Quill.find(existingEditor);
            if (quillInstance) {
              quillInstance.destroy();
            }
          }

          // Initialize new Quill editor
          const quill = new Quill('#snow-editor', {
            theme: 'snow',
            placeholder: 'Start typing your page content here...',
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }],
                ['link', 'image', 'video']
              ]
            }
          });

          // Set initial content if editing existing page
          if (showEditModal && selectedPage && editForm.content) {
            quill.root.innerHTML = editForm.content;
          }

          // Listen for text changes
          quill.on('text-change', function() {
            const content = quill.root.innerHTML;
            setEditForm(prev => ({ ...prev, content: content }));
          });
        }
      }, 100);
    }
  }, [showEditModal, selectedPage, showNewPageModal, editForm.content]);

  // Cleanup Quill when modal closes
  useEffect(() => {
    if (!showEditModal && !showNewPageModal) {
      if (typeof window !== 'undefined' && (window as any).Quill) {
        const Quill = (window as any).Quill;
        const existingEditor = document.querySelector('.ql-editor');
        if (existingEditor) {
          const quillInstance = Quill.find(existingEditor);
          if (quillInstance) {
            quillInstance.destroy();
          }
        }
      }
    }
  }, [showEditModal, showNewPageModal]);

  // Show authentication required message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">CONTENT PAGES</h4>
          </div>
        </div>
        <div className="row px-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <i className="ti ti-lock fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">Authentication Required</h5>
                <p className="text-muted">Please log in to access the content pages management.</p>
                <a href="/auth" className="btn btn-primary">
                  <i className="ti ti-login me-2"></i>
                  Go to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show store required message if user doesn't have a store
  if (noStore) {
    return (
      <Layout>
        <div className="page-title-head d-flex align-items-center">
          <div className="flex-grow-1">
            <h4 className="fs-sm text-uppercase fw-bold m-0">CONTENT PAGES</h4>
          </div>
        </div>
        <div className="row px-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <i className="ti ti-building-store fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">Store Required</h5>
                <p className="text-muted">You need to create a store first before managing content pages.</p>
                <p className="text-muted mb-4">Please set up your store to start creating and managing pages.</p>
                <a href="/onboarding" className="btn btn-primary">
                  <i className="ti ti-building-store me-2"></i>
                  Create Store
                </a>
              </div>
            </div>
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
          <h4 className="fs-sm text-uppercase fw-bold m-0">CONTENT PAGES</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">Content Pages</li>
          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="row px-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            {/* Card Header */}
            <div className="card-header border-light justify-content-between">
              <div className="d-flex align-items-center">
                <i className="ti ti-files fs-4 me-2" style={{ color: '#6f42c1' }}></i>
                <h5 className="card-title mb-0 fs-4">Content Pages ({pages.length} pages)</h5>
              </div>
              <button 
                type="button" 
                className="btn btn-primary"
                style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                onClick={handleNewPageClick}
              >
                <i className="ti ti-plus me-2"></i>
                Create New Page
              </button>
            </div>

            {/* Pages List */}
            <div className="card-body p-0">
              {loading ? (
                <PageSkeleton type="list" count={5} />
              ) : pages.length === 0 ? (
                <div className="text-center p-4">
                  <i className="ti ti-files fs-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No pages found</h5>
                  <p className="text-muted">Create your first content page to get started.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleNewPageClick}
                  >
                    <i className="ti ti-plus me-2"></i>
                    Create Your First Page
                  </button>
                </div>
              ) : (
                pages.map((page) => (
                  <div key={page.id}>
                    <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                      <div className="flex-grow-1">
                        <h5 
                          className="mb-0 text-primary cursor-pointer"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePageClick(page)}
                        >
                          {page.title}
                        </h5>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        {/* Status Toggle */}
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id={`status-${page.id}`}
                            checked={page.status === 'active'}
                            onChange={() => handleStatusToggle(page.id)}
                            style={{ 
                              backgroundColor: page.status === 'active' ? '#6f42c1' : '#6c757d',
                              borderColor: page.status === 'active' ? '#6f42c1' : '#6c757d',
                              width: '2.5rem',
                              height: '1.5rem'
                            }}
                          />
                        </div>
                      
                        {/* Options Menu */}
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
                                onClick={() => handlePageClick(page)}
                              >
                                <i className="ti ti-edit me-2"></i>
                                Edit Content
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleCopyPageLink(page)}
                              >
                                <i className="ti ti-copy me-2"></i>
                                Copy Page URL
                              </button>
                            </li>
                            
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger" 
                                onClick={() => handleDeletePage(page.id)}
                              >
                                <i className="ti ti-trash me-2"></i>
                                Delete Page
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Page Modal */}
      {showEditModal && selectedPage && (
        <>
          {/* Backdrop */}
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1054 }}
            onClick={handleCloseEditModal}
          ></div>
          
          {/* Modal */}
          <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title">
                    <i className="ti ti-edit me-2"></i>
                    Edit Page
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseEditModal}
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <div className="row g-0">
                    {/* Left Column - Main Content */}
                    <div className="col-lg-8 p-4">
                      {/* Language Selector */}
                      <div className="mb-3">
                        <label className="form-label">Language</label>
                        <select 
                          className="form-select"
                          value={selectedLanguage}
                          onChange={(e) => {
                            setSelectedLanguage(e.target.value as 'EN' | 'AR');
                            setEditForm(prev => ({ ...prev, language: e.target.value as 'EN' | 'AR' }));
                          }}
                        >
                          <option value="EN">English</option>
                          <option value="AR">العربية</option>
                        </select>
                      </div>

                      {/* Page Title */}
                      <div className="mb-3">
                        <label className="form-label">Page Title</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Enter page title"
                          value={editForm.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                        />
                      </div>

                      {/* Content Rich Text Editor */}
                      <div className="mb-4">
                        <label className="form-label">Content</label>
                        <div 
                          id="snow-editor"
                          style={{ minHeight: '260px' }}
                        ></div>
                      </div>

                      {/* Show in Footer Toggle */}
                      <div className="mb-4">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="showInFooter"
                            checked={editForm.show_in_footer}
                            onChange={(e) => setEditForm({ ...editForm, show_in_footer: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="showInFooter">
                            Display page link at the bottom of the site
                          </label>
                        </div>
                        <small className="text-muted">
                          The page link will be hidden from the bottom of the site when this option is disabled.
                        </small>
                      </div>
                    </div>

                    {/* Right Column - SEO Settings */}
                    <div className="col-lg-4 bg-light p-4">
                      {/* SEO Enhancements */}
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-3">
                          <i className="ti ti-seo me-2"></i>
                          SEO Enhancements
                        </h6>
                        
                        {/* SEO Page Title */}
                        <div className="mb-3">
                          <label className="form-label">SEO Page Title</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="SEO title for search engines"
                            value={editForm.seo_title}
                            onChange={(e) => setEditForm({ ...editForm, seo_title: e.target.value })}
                          />
                        </div>

                        {/* SEO Page URL */}
                        <div className="mb-3">
                          <label className="form-label">SEO Page URL</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="page-url-slug"
                            value={editForm.seo_url}
                            onChange={(e) => setEditForm({ ...editForm, seo_url: e.target.value })}
                          />
                          <small className="text-muted">
                            Full URL: https://yourstore.com/{editForm.seo_url || 'page-url'}
                          </small>
                        </div>

                        {/* SEO Page Description */}
                        <div className="mb-4">
                          <label className="form-label">SEO Page Description</label>
                          <textarea 
                            className="form-control" 
                            rows={3}
                            placeholder="Brief description for search engines (max 160 characters)"
                            value={editForm.seo_description}
                            onChange={(e) => setEditForm({ ...editForm, seo_description: e.target.value })}
                          ></textarea>
                        </div>
                      </div>

                      {/* Preview Section */}
                      <div className="border rounded p-3 bg-white">
                        <h6 className="fw-semibold mb-2">
                          <i className="ti ti-eye me-2"></i>
                          Preview
                        </h6>
                        <div>
                          <h5 className="text-primary mb-1">{editForm.seo_title || 'Your page title will appear here'}</h5>
                          <p className="text-success mb-1">https://yourstore.com/{editForm.seo_url || 'page-url'}</p>
                          <p className="text-muted mb-0">
                            {editForm.seo_description || 'Your meta description will appear here...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => handleDeletePage(selectedPage.id)}
                  >
                    <i className="ti ti-trash me-2"></i>
                    Delete Page
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleSaveEdit}
                  >
                    <i className="ti ti-check me-2"></i>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Page Modal */}
      {showNewPageModal && (
        <>
          {/* Backdrop */}
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1054 }}
            onClick={handleCloseNewPageModal}
          ></div>
          
          {/* Modal */}
          <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <h5 className="modal-title">
                    <i className="ti ti-plus me-2"></i>
                    Create New Page
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseNewPageModal}
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <div className="row g-0">
                    {/* Left Column - Main Content */}
                    <div className="col-lg-8 p-4">
                      {/* Language Selector */}
                      <div className="mb-3">
                        <label className="form-label">Language</label>
                        <select 
                          className="form-select"
                          value={selectedLanguage}
                          onChange={(e) => {
                            setSelectedLanguage(e.target.value as 'EN' | 'AR');
                            setEditForm(prev => ({ ...prev, language: e.target.value as 'EN' | 'AR' }));
                          }}
                        >
                          <option value="EN">English</option>
                          <option value="AR">العربية</option>
                        </select>
                      </div>

                      {/* Page Title */}
                      <div className="mb-3">
                        <label className="form-label">Page Title</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Enter page title"
                          value={editForm.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                        />
                      </div>

                      {/* Content Rich Text Editor */}
                      <div className="mb-4">
                        <label className="form-label">Content</label>
                        <div 
                          id="snow-editor"
                          style={{ minHeight: '260px' }}
                        ></div>
                      </div>

                      {/* Show in Footer Toggle */}
                      <div className="mb-4">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="showInFooterNew"
                            checked={editForm.show_in_footer}
                            onChange={(e) => setEditForm({ ...editForm, show_in_footer: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="showInFooterNew">
                            Display page link at the bottom of the site
                          </label>
                        </div>
                        <small className="text-muted">
                          The page link will be hidden from the bottom of the site when this option is disabled.
                        </small>
                      </div>
                    </div>

                    {/* Right Column - SEO Settings */}
                    <div className="col-lg-4 bg-light p-4">
                      {/* SEO Enhancements */}
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-3">
                          <i className="ti ti-seo me-2"></i>
                          SEO Enhancements
                        </h6>
                        
                        {/* SEO Page Title */}
                        <div className="mb-3">
                          <label className="form-label">SEO Page Title</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="SEO title for search engines"
                            value={editForm.seo_title}
                            onChange={(e) => setEditForm({ ...editForm, seo_title: e.target.value })}
                          />
                        </div>

                        {/* SEO Page URL */}
                        <div className="mb-3">
                          <label className="form-label">SEO Page URL</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="page-url-slug"
                            value={editForm.seo_url}
                            onChange={(e) => setEditForm({ ...editForm, seo_url: e.target.value })}
                          />
                          <small className="text-muted">
                            Full URL: https://yourstore.com/{editForm.seo_url || 'page-url'}
                          </small>
                        </div>

                        {/* SEO Page Description */}
                        <div className="mb-4">
                          <label className="form-label">SEO Page Description</label>
                          <textarea 
                            className="form-control" 
                            rows={3}
                            placeholder="Brief description for search engines (max 160 characters)"
                            value={editForm.seo_description}
                            onChange={(e) => setEditForm({ ...editForm, seo_description: e.target.value })}
                          ></textarea>
                        </div>
                      </div>

                      {/* Preview Section */}
                      <div className="border rounded p-3 bg-white">
                        <h6 className="fw-semibold mb-2">
                          <i className="ti ti-eye me-2"></i>
                          Preview
                        </h6>
                        <div>
                          <h5 className="text-primary mb-1">{editForm.seo_title || 'Your page title will appear here'}</h5>
                          <p className="text-success mb-1">https://yourstore.com/{editForm.seo_url || 'page-url'}</p>
                          <p className="text-muted mb-0">
                            {editForm.seo_description || 'Your meta description will appear here...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={handleCloseNewPageModal}
                  >
                    <i className="ti ti-x me-2"></i>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleSaveNewPage}
                  >
                    <i className="ti ti-plus me-2"></i>
                    Create Page
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

export default Pages;