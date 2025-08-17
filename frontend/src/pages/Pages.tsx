import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';

interface Page {
  id: string;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  seoTitle: string;
  seoUrl: string;
  seoDescription: string;
  showInFooter: boolean;
}

const Pages: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: '1',
      title: 'Return and Exchange Policy',
      content: 'Returns are allowed within 3 days of receiving the order, but not after, to preserve product quality and shelf life. Exchanges are allowed within 7 days of receiving the order. All shipping and delivery fees will be deducted, including costs for delivery to the customer and return to the store, as these are for shipping companies.',
      status: 'active',
      seoTitle: 'Return and Exchange Policy',
      seoUrl: 'return-and-exchange-policy',
      seoDescription: 'Our return and exchange policy outlines the conditions for returns and exchanges of products purchased from our store.',
      showInFooter: true
    },
    {
      id: '2',
      title: 'Terms and Conditions',
      content: 'By using our services, you agree to these terms and conditions. We reserve the right to modify these terms at any time. Your continued use of our services constitutes acceptance of any changes.',
      status: 'active',
      seoTitle: 'Terms and Conditions',
      seoUrl: 'terms-and-conditions',
      seoDescription: 'Read our terms and conditions to understand the rules and guidelines for using our services.',
      showInFooter: true
    },
    {
      id: '3',
      title: 'Privacy Policy',
      content: 'We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information. We do not sell or share your personal data with third parties without your consent.',
      status: 'active',
      seoTitle: 'Privacy Policy',
      seoUrl: 'privacy-policy',
      seoDescription: 'Learn about how we collect, use, and protect your personal information in accordance with our privacy policy.',
      showInFooter: true
    }
  ]);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showNewPageModal, setShowNewPageModal] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    seoTitle: '',
    seoUrl: '',
    seoDescription: '',
    showInFooter: false
  });
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'AR'>('EN');
  const summernoteRef = useRef<any>(null);

  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
    setEditForm({
      title: page.title,
      content: page.content,
      seoTitle: page.seoTitle,
      seoUrl: page.seoUrl,
      seoDescription: page.seoDescription,
      showInFooter: page.showInFooter
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPage(null);
    setEditForm({ title: '', content: '', seoTitle: '', seoUrl: '', seoDescription: '', showInFooter: false });
    setSelectedLanguage('EN');
  };

  const handleNewPageClick = () => {
    setShowNewPageModal(true);
    setEditForm({ title: '', content: '', seoTitle: '', seoUrl: '', seoDescription: '', showInFooter: false });
    setSelectedLanguage('EN');
  };

  const handleCloseNewPageModal = () => {
    setShowNewPageModal(false);
    setEditForm({ title: '', content: '', seoTitle: '', seoUrl: '', seoDescription: '', showInFooter: false });
    setSelectedLanguage('EN');
  };

  const handleSaveEdit = () => {
    console.log('Saving page edit:', selectedPage?.id, editForm);
    handleCloseEditModal();
  };

  const handleSaveNewPage = () => {
    console.log('Creating new page:', editForm);
    // Here you would typically save the new page to your backend
    // For now, we'll just close the modal
    handleCloseNewPageModal();
  };

  const handleStatusToggle = (pageId: string) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === pageId 
          ? { ...page, status: page.status === 'active' ? 'inactive' : 'active' }
          : page
      )
    );
  };

  const handleDeletePage = (pageId: string) => {
    console.log('Delete page:', pageId);
  };

  const handleCopyPageLink = (page: Page) => {
    const pageUrl = `https://example.com/${page.seoUrl}`;
    navigator.clipboard.writeText(pageUrl).then(() => {
      // You could add a toast notification here
      console.log('Page link copied to clipboard:', pageUrl);
    }).catch(err => {
      console.error('Failed to copy page link:', err);
    });
  };

  // Initialize Summernote when modal opens
  useEffect(() => {
    if ((showEditModal && selectedPage) || showNewPageModal) {
      // Wait for DOM to be ready
      setTimeout(() => {
        if (typeof $ !== 'undefined' && $.fn.summernote) {
          $('.summernote').summernote({
            height: 300,
            toolbar: [
              ['style', ['style']],
              ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
              ['fontname', ['fontname']],
              ['fontsize', ['fontsize']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['height', ['height']],
              ['table', ['table']],
              ['insert', ['link', 'picture', 'video']],
              ['view', ['fullscreen', 'codeview', 'help']],
              ['misc', ['undo', 'redo']]
            ],
            icons: {
              magic: 'ti ti-wand fs-xl',
              bold: 'ti ti-bold fs-xl',
              underline: 'ti ti-underline fs-xl',
              eraser: 'ti ti-eraser fs-xl',
              italic: 'ti ti-italic fs-xl',
              strikethrough: 'ti ti-strikethrough fs-xl',
              fontname: 'ti ti-font fs-xl',
              fontsize: 'ti ti-text-size fs-xl',
              color: 'ti ti-color-swatch fs-xl',
              font: 'ti ti-typography fs-xl',
              menuCheck: 'ti ti-check fs-xl',
              unorderedlist: 'ti ti-list fs-xl',
              orderedlist: 'ti ti-list-numbers fs-xl',
              align: 'ti ti-align-left fs-xl',
              alignLeft: 'ti ti-align-left fs-xl',
              alignCenter: 'ti ti-align-center fs-xl',
              alignRight: 'ti ti-align-right fs-xl',
              alignJustify: 'ti ti-align-justified fs-xl',
              alignIndent: 'ti ti-indent-increase fs-xl',
              alignOutdent: 'ti ti-indent-decrease fs-xl',
              table: 'ti ti-table fs-xl',
              link: 'ti ti-link fs-xl',
              picture: 'ti ti-photo fs-xl',
              video: 'ti ti-video fs-xl',
              arrowsAlt: 'ti ti-arrows-maximize fs-xl',
              code: 'ti ti-code fs-xl',
              question: 'ti ti-help-circle fs-xl',
              outdent: 'ti ti-indent-decrease fs-xl',
              indent: 'ti ti-indent-increase fs-xl',
              undo: 'ti ti-arrow-back-up fs-xl',
              redo: 'ti ti-arrow-forward-up fs-xl',
              subscript: 'ti ti-subscript fs-xl',
              superscript: 'ti ti-superscript fs-xl'
            },
            callbacks: {
              onInit: function() {
                $('.note-editor .note-btn').each(function() {
                  this.classList.add('btn-light');
                  this.classList.remove('btn-outline-secondary');
                });
              },
              onChange: function(contents: string) {
                setEditForm(prev => ({ ...prev, content: contents }));
              }
            }
          });
        }
      }, 100);
    }
  }, [showEditModal, selectedPage, showNewPageModal]);

  // Cleanup Summernote when modal closes
  useEffect(() => {
    if (!showEditModal && !showNewPageModal) {
      if (typeof $ !== 'undefined' && $.fn.summernote) {
        $('.summernote').summernote('destroy');
      }
    }
  }, [showEditModal, showNewPageModal]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">PAGES</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">Pages</li>
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
                                 <h5 className="card-title mb-0 fs-4">Informational Pages ({pages.length} pages)</h5>
              </div>
                             <button 
                 type="button" 
                 className="btn btn-primary"
                 style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                 onClick={handleNewPageClick}
               >
                 <i className="ti ti-plus me-2"></i>
                 New Page
               </button>
            </div>

            {/* Pages List */}
            <div className="card-body p-0">
              {pages.map((page, index) => (
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
                               Edit Page
                             </button>
                           </li>
                           <li>
                             <button 
                               className="dropdown-item" 
                               onClick={() => handleCopyPageLink(page)}
                             >
                               <i className="ti ti-copy me-2"></i>
                               Copy Page Link
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
              ))}
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
              <div className="modal-dialog modal-dialog-centered modal-lg">
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
                                 <div className="modal-body">
                   {/* Language Selector */}
                   <div className="row mb-3">
                     <div className="col-md-2">
                       <label className="form-label">Language</label>
                       <select 
                         className="form-select"
                         value={selectedLanguage}
                         onChange={(e) => setSelectedLanguage(e.target.value as 'EN' | 'AR')}
                       >
                         <option value="EN">EN</option>
                         <option value="AR">AR</option>
                       </select>
                     </div>
                     <div className="col-md-10">
                       <label className="form-label">Page Title</label>
                       <div className="input-group">
                         <input 
                           type="text" 
                           className="form-control" 
                           placeholder="Page Title"
                           value={editForm.title}
                           onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                         />
                         <button className="btn btn-outline-secondary" type="button">
                           <i className="ti ti-link"></i>
                         </button>
                       </div>
                     </div>
                   </div>

                                     {/* Content Rich Text Editor */}
                   <div className="mb-4">
                     <label className="form-label">Content</label>
                     <div 
                       className="summernote"
                       dangerouslySetInnerHTML={{ __html: editForm.content }}
                     ></div>
                   </div>

                   {/* Show in Footer Toggle */}
                   <div className="mb-4">
                     <div className="form-check">
                       <input 
                         className="form-check-input" 
                         type="checkbox" 
                         id="showInFooter"
                         checked={editForm.showInFooter}
                         onChange={(e) => setEditForm({ ...editForm, showInFooter: e.target.checked })}
                       />
                       <label className="form-check-label" htmlFor="showInFooter">
                         Display page link at the bottom of the site
                       </label>
                     </div>
                     <small className="text-muted">
                       The page link will be hidden from the bottom of the site when this option is disabled.
                     </small>
                   </div>

                                       {/* SEO Enhancements */}
                    <div className="bg-light p-3 rounded">
                      <h6 className="fw-semibold mb-3">SEO Enhancements</h6>
                   
                                       {/* Page Title */}
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Page Title</label>
                      </div>
                      <div className="col-md-9">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Page Title"
                            value={editForm.seoTitle}
                            onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                          />
                          <button className="btn btn-outline-secondary" type="button">
                            <i className="ti ti-file-text"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                                       {/* SEO Page URL */}
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">SEO Page URL</label>
                      </div>
                      <div className="col-md-9">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="seo-page-url"
                            value={editForm.seoUrl}
                            onChange={(e) => setEditForm({ ...editForm, seoUrl: e.target.value })}
                          />
                          <button className="btn btn-outline-secondary" type="button">
                            <i className="ti ti-link"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                                       {/* Page Description */}
                    <div className="row mb-4">
                      <div className="col-md-3">
                        <label className="form-label">Page Description</label>
                      </div>
                      <div className="col-md-9">
                        <div className="input-group">
                          <textarea 
                            className="form-control" 
                            rows={3}
                            placeholder="Page Description"
                            value={editForm.seoDescription}
                            onChange={(e) => setEditForm({ ...editForm, seoDescription: e.target.value })}
                          ></textarea>
                          <button className="btn btn-outline-secondary" type="button">
                            <i className="ti ti-file-text"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                   {/* Preview Section */}
                   <div className="border rounded p-3 bg-light">
                     <h6 className="fw-semibold mb-2">Preview</h6>
                     <div>
                       <h5 className="text-primary mb-1">{editForm.seoTitle || 'Page Title'}</h5>
                       <p className="text-success mb-1">https://example.com/{editForm.seoUrl || 'page-url'}</p>
                       <p className="text-muted mb-0">
                         {editForm.seoDescription || 'Page description will appear here...'}
                       </p>
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
                     Delete Page
                   </button>
                   <button 
                     type="button" 
                     className="btn btn-primary"
                     style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                     onClick={handleSaveEdit}
                   >
                     Save Changes
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
             <div className="modal-dialog modal-dialog-centered modal-lg">
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
                 <div className="modal-body">
                   {/* Language Selector */}
                   <div className="row mb-3">
                     <div className="col-md-2">
                       <label className="form-label">Language</label>
                       <select 
                         className="form-select"
                         value={selectedLanguage}
                         onChange={(e) => setSelectedLanguage(e.target.value as 'EN' | 'AR')}
                       >
                         <option value="EN">EN</option>
                         <option value="AR">AR</option>
                       </select>
                     </div>
                     <div className="col-md-10">
                       <label className="form-label">Page Title</label>
                       <div className="input-group">
                         <input 
                           type="text" 
                           className="form-control" 
                           placeholder="Page Title"
                           value={editForm.title}
                           onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                         />
                         <button className="btn btn-outline-secondary" type="button">
                           <i className="ti ti-link"></i>
                         </button>
                       </div>
                     </div>
                   </div>

                   {/* Content Rich Text Editor */}
                   <div className="mb-4">
                     <label className="form-label">Content</label>
                     <div 
                       className="summernote"
                       dangerouslySetInnerHTML={{ __html: editForm.content }}
                     ></div>
                   </div>

                   {/* Show in Footer Toggle */}
                   <div className="mb-4">
                     <div className="form-check">
                       <input 
                         className="form-check-input" 
                         type="checkbox" 
                         id="showInFooterNew"
                         checked={editForm.showInFooter}
                         onChange={(e) => setEditForm({ ...editForm, showInFooter: e.target.checked })}
                       />
                       <label className="form-check-label" htmlFor="showInFooterNew">
                         Display page link at the bottom of the site
                       </label>
                     </div>
                     <small className="text-muted">
                       The page link will be hidden from the bottom of the site when this option is disabled.
                     </small>
                   </div>

                   {/* SEO Enhancements */}
                   <div className="bg-light p-3 rounded">
                     <h6 className="fw-semibold mb-3">SEO Enhancements</h6>
                    
                     {/* Page Title */}
                     <div className="row mb-3">
                       <div className="col-md-3">
                         <label className="form-label">Page Title</label>
                       </div>
                       <div className="col-md-9">
                         <div className="input-group">
                           <input 
                             type="text" 
                             className="form-control" 
                             placeholder="Page Title"
                             value={editForm.seoTitle}
                             onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                           />
                           <button className="btn btn-outline-secondary" type="button">
                             <i className="ti ti-file-text"></i>
                           </button>
                         </div>
                       </div>
                     </div>

                     {/* SEO Page URL */}
                     <div className="row mb-3">
                       <div className="col-md-3">
                         <label className="form-label">SEO Page URL</label>
                       </div>
                       <div className="col-md-9">
                         <div className="input-group">
                           <input 
                             type="text" 
                             className="form-control" 
                             placeholder="seo-page-url"
                             value={editForm.seoUrl}
                             onChange={(e) => setEditForm({ ...editForm, seoUrl: e.target.value })}
                           />
                           <button className="btn btn-outline-secondary" type="button">
                             <i className="ti ti-link"></i>
                           </button>
                         </div>
                       </div>
                     </div>

                     {/* Page Description */}
                     <div className="row mb-4">
                       <div className="col-md-3">
                         <label className="form-label">Page Description</label>
                       </div>
                       <div className="col-md-9">
                         <div className="input-group">
                           <textarea 
                             className="form-control" 
                             rows={3}
                             placeholder="Page Description"
                             value={editForm.seoDescription}
                             onChange={(e) => setEditForm({ ...editForm, seoDescription: e.target.value })}
                           ></textarea>
                           <button className="btn btn-outline-secondary" type="button">
                             <i className="ti ti-file-text"></i>
                           </button>
                         </div>
                       </div>
                     </div>

                     {/* Preview Section */}
                     <div className="border rounded p-3 bg-light">
                       <h6 className="fw-semibold mb-2">Preview</h6>
                       <div>
                         <h5 className="text-primary mb-1">{editForm.seoTitle || 'Page Title'}</h5>
                         <p className="text-success mb-1">https://example.com/{editForm.seoUrl || 'page-url'}</p>
                         <p className="text-muted mb-0">
                           {editForm.seoDescription || 'Page description will appear here...'}
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="modal-footer">
                   <button 
                     type="button" 
                     className="btn btn-secondary"
                     onClick={handleCloseNewPageModal}
                   >
                     Cancel
                   </button>
                   <button 
                     type="button" 
                     className="btn btn-primary"
                     style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                     onClick={handleSaveNewPage}
                   >
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
