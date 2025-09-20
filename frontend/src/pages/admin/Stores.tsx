import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { ASSETS } from '../../utils/assets';

const Stores: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Stores</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item"><a href="javascript: void(0);">Admin</a></li>
            <li className="breadcrumb-item active">Stores</li>
          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header border-light justify-content-between">
              <div className="d-flex gap-2">
                <div className="app-search">
                  <input type="search" className="form-control" placeholder="Search store..."/>
                  <i className="ti ti-search app-search-icon text-muted"></i>
                </div>
                <button className="btn btn-danger d-none">Delete</button>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="me-2 fw-semibold">Filter By:</span>

                {/* Status Filter */}
                <div className="app-search">
                  <select className="form-select form-control my-1 my-md-0">
                    <option value="All">Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <i className="ti ti-check app-search-icon text-muted"></i>
                </div>

                {/* Revenue Filter */}
                <div className="app-search">
                  <select className="form-select form-control my-1 my-md-0">
                    <option value="All">Revenue</option>
                    <option value="100k+">Top Revenue</option>
                    <option value="50k-100k">Medium Revenue</option>
                    <option value="0-50k">Low Revenue</option>
                  </select>
                  <i className="ti ti-dollar-sign app-search-icon text-muted"></i>
                </div>

                {/* Rating Filter */}
                <div className="app-search">
                  <select className="form-select form-control my-1 my-md-0">
                    <option value="All">Rating</option>
                    <option value="4-5">Top Rated</option>
                    <option value="3-4">Good Rated</option>
                    <option value="1-3">Low Rated</option>
                  </select>
                  <i className="ti ti-star app-search-icon text-muted"></i>
                </div>

                {/* Records Per Page */}
                <div>
                  <select className="form-select form-control my-1 my-md-0">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
                <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                  <tr className="text-uppercase fs-xxs">
                    <th className="ps-3" style={{width: '1%'}}>
                      <input className="form-check-input form-check-input-light fs-14 mt-0" type="checkbox" id="select-all-stores" value="option"/>
                    </th>
                    <th>Store</th>
                    <th>Owner</th>
                    <th>Products</th>
                    <th>Orders</th>
                    <th>Rating</th>
                    <th>Location</th>
                    <th>Revenue</th>
                    <th>Status</th>
                    <th style={{width: '1%'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Store Row 1 */}
                  <tr>
                    <td className="ps-3">
                      <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-md me-3">
                          <img src={ASSETS.SELLER_3} alt="Store" className="img-fluid rounded"/>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to="/admin/stores/details" className="link-reset">TechStore Pro</Link>
                          </h5>
                          <p className="text-muted mb-0 fs-xxs">Since 2020</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={ASSETS.USER_1} alt="Owner" className="avatar-sm rounded-circle me-2"/>
                        <span>John Smith</span>
                      </div>
                    </td>
                    <td>1,456</td>
                    <td>18,120</td>
                    <td>
                      <span className="text-warning">
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-half-filled"></i>
                      </span>
                      <span className="ms-1 fw-semibold">(4.5)</span>
                    </td>
                    <td>
                      <span className="badge p-1 text-bg-light fs-sm">
                        <img src={ASSETS.FLAG_US} alt="" className="rounded-circle me-1" height="12"/> US
                      </span>
                    </td>
                    <td>$92.5k</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to="/admin/stores/details"><i className="ti ti-eye me-2"></i>View</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/edit"><i className="ti ti-edit me-2"></i>Edit</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/suspend"><i className="ti ti-pause me-2"></i>Suspend</Link></li>
                          <li><hr className="dropdown-divider"/></li>
                          <li><Link className="dropdown-item text-danger" to="/admin/stores/delete"><i className="ti ti-trash me-2"></i>Delete</Link></li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* Store Row 2 */}
                  <tr>
                    <td className="ps-3">
                      <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-md me-3">
                          <img src={ASSETS.SELLER_4} alt="Store" className="img-fluid rounded"/>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to="/admin/stores/details" className="link-reset">Fashion Hub</Link>
                          </h5>
                          <p className="text-muted mb-0 fs-xxs">Since 2018</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={ASSETS.USER_2} alt="Owner" className="avatar-sm rounded-circle me-2"/>
                        <span>Sarah Johnson</span>
                      </div>
                    </td>
                    <td>2,378</td>
                    <td>25,892</td>
                    <td>
                      <span className="text-warning">
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star"></i>
                        <i className="ti ti-star"></i>
                      </span>
                      <span className="ms-1 fw-semibold">(3.0)</span>
                    </td>
                    <td>
                      <span className="badge p-1 text-bg-light fs-sm">
                        <img src={ASSETS.FLAG_GB} alt="" className="rounded-circle me-1" height="12"/> UK
                      </span>
                    </td>
                    <td>$145.7k</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to="/admin/stores/details"><i className="ti ti-eye me-2"></i>View</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/edit"><i className="ti ti-edit me-2"></i>Edit</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/suspend"><i className="ti ti-pause me-2"></i>Suspend</Link></li>
                          <li><hr className="dropdown-divider"/></li>
                          <li><Link className="dropdown-item text-danger" to="/admin/stores/delete"><i className="ti ti-trash me-2"></i>Delete</Link></li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* Store Row 3 */}
                  <tr>
                    <td className="ps-3">
                      <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-md me-3">
                          <img src={ASSETS.SELLER_5} alt="Store" className="img-fluid rounded"/>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to="/admin/stores/details" className="link-reset">Electronics Plus</Link>
                          </h5>
                          <p className="text-muted mb-0 fs-xxs">Since 2019</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={ASSETS.USER_3} alt="Owner" className="avatar-sm rounded-circle me-2"/>
                        <span>Mike Wilson</span>
                      </div>
                    </td>
                    <td>3,120</td>
                    <td>35,210</td>
                    <td>
                      <span className="text-warning">
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-half-filled"></i>
                        <i className="ti ti-star"></i>
                      </span>
                      <span className="ms-1 fw-semibold">(3.5)</span>
                    </td>
                    <td>
                      <span className="badge p-1 text-bg-light fs-sm">
                        <img src={ASSETS.FLAG_CA} alt="" className="rounded-circle me-1" height="12"/> CA
                      </span>
                    </td>
                    <td>$300.4k</td>
                    <td>
                      <span className="badge bg-warning">Suspended</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to="/admin/stores/details"><i className="ti ti-eye me-2"></i>View</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/edit"><i className="ti ti-edit me-2"></i>Edit</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/activate"><i className="ti ti-play me-2"></i>Activate</Link></li>
                          <li><hr className="dropdown-divider"/></li>
                          <li><Link className="dropdown-item text-danger" to="/admin/stores/delete"><i className="ti ti-trash me-2"></i>Delete</Link></li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* Store Row 4 */}
                  <tr>
                    <td className="ps-3">
                      <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-md me-3">
                          <img src={ASSETS.SELLER_6} alt="Store" className="img-fluid rounded"/>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to="/admin/stores/details" className="link-reset">Home & Garden</Link>
                          </h5>
                          <p className="text-muted mb-0 fs-xxs">Since 2017</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={ASSETS.USER_4} alt="Owner" className="avatar-sm rounded-circle me-2"/>
                        <span>Emily Davis</span>
                      </div>
                    </td>
                    <td>1,748</td>
                    <td>12,563</td>
                    <td>
                      <span className="text-warning">
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star"></i>
                        <i className="ti ti-star"></i>
                        <i className="ti ti-star"></i>
                      </span>
                      <span className="ms-1 fw-semibold">(2.0)</span>
                    </td>
                    <td>
                      <span className="badge p-1 text-bg-light fs-sm">
                        <img src={ASSETS.FLAG_AU} alt="" className="rounded-circle me-1" height="12"/> AU
                      </span>
                    </td>
                    <td>$78.9k</td>
                    <td>
                      <span className="badge bg-secondary">Inactive</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to="/admin/stores/details"><i className="ti ti-eye me-2"></i>View</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/edit"><i className="ti ti-edit me-2"></i>Edit</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/activate"><i className="ti ti-play me-2"></i>Activate</Link></li>
                          <li><hr className="dropdown-divider"/></li>
                          <li><Link className="dropdown-item text-danger" to="/admin/stores/delete"><i className="ti ti-trash me-2"></i>Delete</Link></li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* Store Row 5 */}
                  <tr>
                    <td className="ps-3">
                      <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-md me-3">
                          <img src={ASSETS.SELLER_7} alt="Store" className="img-fluid rounded"/>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to="/admin/stores/details" className="link-reset">Sports Gear</Link>
                          </h5>
                          <p className="text-muted mb-0 fs-xxs">Since 2021</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={ASSETS.USER_5} alt="Owner" className="avatar-sm rounded-circle me-2"/>
                        <span>David Brown</span>
                      </div>
                    </td>
                    <td>520</td>
                    <td>3,321</td>
                    <td>
                      <span className="text-warning">
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star"></i>
                        <i className="ti ti-star"></i>
                        <i className="ti ti-star"></i>
                      </span>
                      <span className="ms-1 fw-semibold">(2.0)</span>
                    </td>
                    <td>
                      <span className="badge p-1 text-bg-light fs-sm">
                        <img src={ASSETS.FLAG_DE} alt="" className="rounded-circle me-1" height="12"/> DE
                      </span>
                    </td>
                    <td>$56.2k</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to="/admin/stores/details"><i className="ti ti-eye me-2"></i>View</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/edit"><i className="ti ti-edit me-2"></i>Edit</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/suspend"><i className="ti ti-pause me-2"></i>Suspend</Link></li>
                          <li><hr className="dropdown-divider"/></li>
                          <li><Link className="dropdown-item text-danger" to="/admin/stores/delete"><i className="ti ti-trash me-2"></i>Delete</Link></li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  {/* Store Row 6 */}
                  <tr>
                    <td className="ps-3">
                      <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-md me-3">
                          <img src={ASSETS.SELLER_8} alt="Store" className="img-fluid rounded"/>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            <Link to="/admin/stores/details" className="link-reset">Beauty & Health</Link>
                          </h5>
                          <p className="text-muted mb-0 fs-xxs">Since 2016</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={ASSETS.USER_6} alt="Owner" className="avatar-sm rounded-circle me-2"/>
                        <span>Lisa Anderson</span>
                      </div>
                    </td>
                    <td>2,160</td>
                    <td>40,500</td>
                    <td>
                      <span className="text-warning">
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                      </span>
                      <span className="ms-1 fw-semibold">(5.0)</span>
                    </td>
                    <td>
                      <span className="badge p-1 text-bg-light fs-sm">
                        <img src={ASSETS.FLAG_FR} alt="" className="rounded-circle me-1" height="12"/> FR
                      </span>
                    </td>
                    <td>$600k</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to="/admin/stores/details"><i className="ti ti-eye me-2"></i>View</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/edit"><i className="ti ti-edit me-2"></i>Edit</Link></li>
                          <li><Link className="dropdown-item" to="/admin/stores/suspend"><i className="ti ti-pause me-2"></i>Suspend</Link></li>
                          <li><hr className="dropdown-divider"/></li>
                          <li><Link className="dropdown-item text-danger" to="/admin/stores/delete"><i className="ti ti-trash me-2"></i>Delete</Link></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card-footer border-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-0">Showing 1 to 6 of 6 entries</p>
                </div>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-light" disabled>Previous</button>
                  <button className="btn btn-sm btn-primary">1</button>
                  <button className="btn btn-sm btn-light" disabled>Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stores;
