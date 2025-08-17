import React from 'react';

interface ProductFilterProps {
  isFilterOpen: boolean;
  toggleFilter: (e?: React.MouseEvent) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ isFilterOpen, toggleFilter }) => {
  return (
    <>
      {/* Right Filter Pane */}
      <div className={`offcanvas offcanvas-end ${isFilterOpen ? 'show' : ''}`} tabIndex={-1} id="filterOffcanvas" aria-labelledby="filterOffcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="filterOffcanvasLabel">Filter Products</h5>
          <button type="button" className="btn-close" onClick={toggleFilter} aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="card h-100" data-simplebar>
            <div className="card-body p-0">
              {/* Search */}
              <div className="p-3 border-bottom border-dashed">
                <div className="app-search">
                  <input type="search" className="form-control" placeholder="Search product name..." />
                  <i data-lucide="search" className="app-search-icon text-muted"></i>
                </div>
              </div>

              {/* Categories */}
              <div className="p-3 border-bottom border-dashed">
                <div className="d-flex mb-2 justify-content-between align-items-center">
                  <h5 className="mb-0">Category:</h5>
                  <a href="javascript: void(0);" className="btn btn-link btn-sm px-0 fw-semibold">View All</a>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="cat-electronics" className="form-check-input" />
                    <label htmlFor="cat-electronics" className="form-check-label mb-0">Electronics</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">8</span></div>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="cat-computers" className="form-check-input" />
                    <label htmlFor="cat-computers" className="form-check-label mb-0">Computers</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">5</span></div>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="cat-home-office" className="form-check-input" />
                    <label htmlFor="cat-home-office" className="form-check-label mb-0">Home & Office</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">6</span></div>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="cat-accessories" className="form-check-input" />
                    <label htmlFor="cat-accessories" className="form-check-label mb-0">Accessories</label>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="cat-gaming" className="form-check-input" />
                    <label htmlFor="cat-gaming" className="form-check-label mb-0">Gaming</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">9</span></div>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="cat-mobile" className="form-check-input" />
                    <label htmlFor="cat-mobile" className="form-check-label mb-0">Mobile Phones</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">12</span></div>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="cat-appliances" className="form-check-input" />
                    <label htmlFor="cat-appliances" className="form-check-label mb-0">Appliances</label>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="p-3 border-bottom border-dashed">
                <div className="d-flex mb-2 justify-content-between align-items-center">
                  <h5 className="mb-0">Brands:</h5>
                  <a href="javascript: void(0);" className="btn btn-link btn-sm px-0 fw-semibold">View All</a>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="brand-apple" className="form-check-input" />
                    <label htmlFor="brand-apple" className="form-check-label mb-0">Apple</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">14</span></div>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="brand-samsung" className="form-check-input" />
                    <label htmlFor="brand-samsung" className="form-check-label mb-0">Samsung</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">20</span></div>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="brand-sony" className="form-check-input" />
                    <label htmlFor="brand-sony" className="form-check-label mb-0">Sony</label>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="brand-dell" className="form-check-input" />
                    <label htmlFor="brand-dell" className="form-check-label mb-0">Dell</label>
                  </div>
                  <div className="flex-shrink-0"><span className="badge text-bg-light">7</span></div>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted py-1">
                  <div className="form-check flex-grow-1">
                    <input type="checkbox" id="brand-hp" className="form-check-input" />
                    <label htmlFor="brand-hp" className="form-check-label mb-0">HP</label>
                  </div>
                </div>
              </div>

              {/* Price Filter */}
              <div className="p-3 border-bottom border-dashed">
                <h5 className="mb-3">Price:</h5>

                <div id="price-filter" data-slider-size="sm"></div>

                <div className="d-flex gap-2 align-items-center mt-3">
                  <div className="form-control form-control-sm text-center" id="price-filter-low"></div>
                  <span className="fw-semibold text-muted">to</span>
                  <div className="form-control form-control-sm text-center" id="price-filter-high"></div>
                </div>
              </div>

              {/* Ratings */}
              <div className="p-3">
                <div className="d-flex mb-3 justify-content-between align-items-center">
                  <h5 className="mb-0">Ratings:</h5>
                </div>

                <div className="form-check py-1">
                  <input className="form-check-input" type="checkbox" id="5-star-rating" />
                  <label htmlFor="5-star-rating" className="form-check-label d-block">
                    <span className="d-flex align-items-center">
                      <span className="flex-grow-1 d-inline-flex align-items-center">
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="text-muted ms-1">5 Stars & Up</span>
                      </span>
                      <span className="flex-shrink-0"><span className="badge text-bg-light">120</span></span>
                    </span>
                  </label>
                </div>

                <div className="form-check py-1">
                  <input className="form-check-input" type="checkbox" id="4-star-rating" />
                  <label htmlFor="4-star-rating" className="form-check-label d-block">
                    <span className="d-flex align-items-center">
                      <span className="flex-grow-1 d-inline-flex align-items-center">
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="text-muted ms-1">4 Stars & Up</span>
                      </span>
                      <span className="flex-shrink-0"><span className="badge text-bg-light">210</span></span>
                    </span>
                  </label>
                </div>

                <div className="form-check py-1">
                  <input className="form-check-input" type="checkbox" id="3-star-rating" />
                  <label htmlFor="3-star-rating" className="form-check-label d-block">
                    <span className="d-flex align-items-center">
                      <span className="flex-grow-1 d-inline-flex align-items-center">
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="text-muted ms-1">3 Stars & Up</span>
                      </span>
                      <span className="flex-shrink-0"><span className="badge text-bg-light">325</span></span>
                    </span>
                  </label>
                </div>

                <div className="form-check py-1">
                  <input className="form-check-input" type="checkbox" id="2-star-rating" />
                  <label htmlFor="2-star-rating" className="form-check-label d-block">
                    <span className="d-flex align-items-center">
                      <span className="flex-grow-1 d-inline-flex align-items-center">
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="text-muted ms-1">2 Stars & Up</span>
                      </span>
                      <span className="flex-shrink-0"><span className="badge text-bg-light">145</span></span>
                    </span>
                  </label>
                </div>

                <div className="form-check pt-1">
                  <input className="form-check-input" type="checkbox" id="1-star-rating" />
                  <label htmlFor="1-star-rating" className="form-check-label d-block">
                    <span className="d-flex align-items-center">
                      <span className="flex-grow-1 d-inline-flex align-items-center">
                        <span className="ti ti-star-filled text-warning"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="ti ti-star-filled text-muted"></span>
                        <span className="text-muted ms-1">1 Star & Up</span>
                      </span>
                      <span className="flex-shrink-0"><span className="badge text-bg-light">58</span></span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="p-3 border-top border-dashed">
                <div className="d-flex gap-2">
                  <button className="btn btn-primary flex-grow-1" onClick={toggleFilter}>
                    Apply Filters
                  </button>
                  <button className="btn btn-light" onClick={toggleFilter}>
                    Clear All
                  </button>
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
    </>
  );
};

export default ProductFilter;

