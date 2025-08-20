import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const StoreDetails: React.FC = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Store Details</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="javascript: void(0);">Tedara</a></li>
            <li className="breadcrumb-item"><a href="javascript: void(0);">Admin</a></li>
            <li className="breadcrumb-item"><Link to="/admin/stores">Stores</Link></li>
            <li className="breadcrumb-item active">Store Details</li>
          </ol>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Store Profile Card */}
        <div className="col-xl-4">
          <div className="card card-top-sticky">
            <div className="card-body pt-0">
              <article className="card card-out-of-container border-top-0">
                <div className="position-relative card-side-img overflow-hidden rounded-top" style={{height: '180px', backgroundImage: 'url(/assets/images/seller-profile.jpg)'}}>
                  <div className="p-4 card-img-overlay rounded-start-0 auth-overlay d-flex rounded-top align-items-center justify-content-center">
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body pt-0 position-relative" style={{marginTop: '-40px'}}>
                  <div className="d-flex justify-content-between align-items-center rounded border-light p-3 bg-light-subtle border">
                    <div className="d-flex justify-content-start align-items-center gap-3">
                      <div className="avatar avatar-xxl">
                        <img src="/assets/images/sellers/3.png" alt="store-avatar" className="img-fluid img-thumbnail rounded-circle"/>
                      </div>
                      <div>
                        <h4 className="text-nowrap fw-bold mb-1">TechStore Pro</h4>
                        <p className="text-muted mb-0">Since 2020</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-icon btn-dark" data-bs-toggle="dropdown">
                        <i className="ti ti-dots fs-24"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><Link className="dropdown-item" to="/admin/stores/edit">Edit Store</Link></li>
                        <li><Link className="dropdown-item" to="/admin/stores/suspend">Suspend Store</Link></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><Link className="dropdown-item text-danger" to="/admin/stores/delete">Delete Store</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </article>

              <div className="">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-user fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Owner: <span className="fw-semibold">John Smith</span></p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-briefcase fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Business Type: <span className="fw-semibold">E-commerce Electronics</span></p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-calendar-event fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Founded: <span className="fw-semibold">2020</span></p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-map-pin fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Location: <span className="fw-semibold">New York, USA</span></p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-mail fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Support: <a href="mailto:support@techstore.com" className="text-primary fw-semibold">support@techstore.com</a></p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-link fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Website: <a href="https://www.techstore.com" className="text-primary fw-semibold">www.techstore.com</a></p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-phone fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Phone: <span className="fw-semibold">+1 (555) 123-4567</span></p>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                    <i className="ti ti-shield-check fs-xl text-secondary"></i>
                  </div>
                  <p className="mb-0 fs-sm">Status: <span className="badge bg-success">Active</span></p>
                </div>
              </div>
            </div>

            <div className="card-body border-top border-dashed">
              <h5 className="mb-3">Contact Store Owner</h5>
              <form action="#">
                <div className="mb-3">
                  <textarea className="form-control" id="messageTextarea" rows={4} placeholder="Enter your message..."></textarea>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Store Overview and Products */}
        <div className="col-xl-8">
          {/* Store Overview */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Store Overview</h4>
            </div>

            <div className="card-body">
              <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1 align-items-center">
                <div className="col">
                  <div className="card border-0 bg-success bg-opacity-10">
                    <div className="card-body">
                      <h5 title="Number of Orders">Orders</h5>
                      <div className="d-flex align-items-center gap-2 my-3">
                        <div className="avatar-md flex-shrink-0">
                          <span className="avatar-title text-bg-success bg-opacity-90 rounded-circle fs-22">
                            <i className="ti ti-shopping-cart"></i>
                          </span>
                        </div>
                        <h3 className="mb-0">1,250</h3>
                      </div>
                      <p className="mb-0">
                        <span className="text-success"><i className="ti ti-point-filled"></i></span>
                        <span className="text-nowrap text-muted">Total Orders</span>
                        <span className="float-end"><b>18,120</b></span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="card border-0 bg-warning bg-opacity-10">
                    <div className="card-body">
                      <h5 title="Revenue Earned">Revenue</h5>
                      <div className="d-flex align-items-center gap-2 my-3">
                        <div className="avatar-md flex-shrink-0">
                          <span className="avatar-title text-bg-warning bg-opacity-90 rounded-circle fs-22">
                            <i className="ti ti-currency-dollar"></i>
                          </span>
                        </div>
                        <h3 className="mb-0">$92.5k</h3>
                      </div>
                      <p className="mb-0">
                        <span className="text-primary"><i className="ti ti-point-filled"></i></span>
                        <span className="text-nowrap text-muted">Total Revenue</span>
                        <span className="float-end"><b>$1.2M</b></span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="card border-0 bg-info bg-opacity-10">
                    <div className="card-body">
                      <h5 title="Store Ratings">Ratings</h5>
                      <div className="d-flex align-items-center gap-2 my-3">
                        <div className="avatar-md flex-shrink-0">
                          <span className="avatar-title text-bg-info bg-opacity-90 rounded-circle fs-22">
                            <i className="ti ti-star"></i>
                          </span>
                        </div>
                        <h3 className="mb-0">4.5</h3>
                      </div>
                      <p className="mb-0">
                        <span className="text-info"><i className="ti ti-point-filled"></i></span>
                        <span className="text-nowrap text-muted">Average Rating</span>
                        <span className="float-end"><b>2.5k Reviews</b></span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="card border-0 bg-secondary bg-opacity-10">
                    <div className="card-body">
                      <h5 title="Total Products">Products</h5>
                      <div className="d-flex align-items-center gap-2 my-3">
                        <div className="avatar-md flex-shrink-0">
                          <span className="avatar-title text-bg-secondary bg-opacity-90 rounded-circle fs-22">
                            <i className="ti ti-box"></i>
                          </span>
                        </div>
                        <h3 className="mb-0">1,456</h3>
                      </div>
                      <p className="mb-0">
                        <span className="text-secondary"><i className="ti ti-point-filled"></i></span>
                        <span className="text-nowrap text-muted">Total Products</span>
                        <span className="float-end"><b>2.1k Variants</b></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Products */}
          <h4 className="my-4">Store Products</h4>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header border-light justify-content-between">
                  <div className="d-flex gap-2">
                    <div className="app-search">
                      <input type="search" className="form-control" placeholder="Search product name..."/>
                      <i className="ti ti-search app-search-icon text-muted"></i>
                    </div>
                    <button className="btn btn-danger d-none">Delete</button>
                  </div>

                  <div className="d-flex gap-1">
                    {/* Records Per Page */}
                    <div>
                      <select className="form-select form-control my-1 my-md-0">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                      </select>
                    </div>

                    <Link to="/admin/products/add" className="btn btn-danger ms-1">
                      <i className="ti ti-plus fs-sm me-2"></i> Add Product
                    </Link>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
                    <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                      <tr className="text-uppercase fs-xxs">
                        <th className="ps-3" style={{width: '1%'}}>
                          <input className="form-check-input form-check-input-light fs-14 mt-0" type="checkbox" id="select-all-products" value="option"/>
                        </th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Orders</th>
                        <th>Status</th>
                        <th className="text-center" style={{width: '1%'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Product Row 1 */}
                      <tr>
                        <td className="ps-3">
                          <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-md me-3">
                              <img src="/assets/images/products/1.png" alt="Product" className="img-fluid rounded"/>
                            </div>
                            <div>
                              <h5 className="mb-0">
                                <Link to="/admin/products/details" className="link-reset">Gaming Laptop Pro</Link>
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td>Computers</td>
                        <td>
                          <h5 className="fs-base mb-0 fw-medium">15</h5>
                        </td>
                        <td>$1,299.00</td>
                        <td>45</td>
                        <td><span className="badge badge-soft-success fs-xxs">Published</span></td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <Link to="/admin/products/details" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-eye fs-lg"></i></Link>
                            <Link to="/admin/products/edit" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-edit fs-lg"></i></Link>
                            <Link to="#" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-trash fs-lg"></i></Link>
                          </div>
                        </td>
                      </tr>

                      {/* Product Row 2 */}
                      <tr>
                        <td className="ps-3">
                          <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-md me-3">
                              <img src="/assets/images/products/2.png" alt="Product" className="img-fluid rounded"/>
                            </div>
                            <div>
                              <h5 className="mb-0">
                                <Link to="/admin/products/details" className="link-reset">Wireless Headphones</Link>
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td>Audio</td>
                        <td>
                          <h5 className="fs-base mb-0 fw-medium">78</h5>
                        </td>
                        <td>$149.95</td>
                        <td>210</td>
                        <td><span className="badge badge-soft-success fs-xxs">Published</span></td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <Link to="/admin/products/details" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-eye fs-lg"></i></Link>
                            <Link to="/admin/products/edit" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-edit fs-lg"></i></Link>
                            <Link to="#" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-trash fs-lg"></i></Link>
                          </div>
                        </td>
                      </tr>

                      {/* Product Row 3 */}
                      <tr>
                        <td className="ps-3">
                          <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-md me-3">
                              <img src="/assets/images/products/3.png" alt="Product" className="img-fluid rounded"/>
                            </div>
                            <div>
                              <h5 className="mb-0">
                                <Link to="/admin/products/details" className="link-reset">Smart Watch Series 5</Link>
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td>Wearables</td>
                        <td>
                          <h5 className="fs-base mb-0 fw-medium">120</h5>
                        </td>
                        <td>$299.00</td>
                        <td>231</td>
                        <td><span className="badge badge-soft-success fs-xxs">Published</span></td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <Link to="/admin/products/details" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-eye fs-lg"></i></Link>
                            <Link to="/admin/products/edit" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-edit fs-lg"></i></Link>
                            <Link to="#" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-trash fs-lg"></i></Link>
                          </div>
                        </td>
                      </tr>

                      {/* Product Row 4 */}
                      <tr>
                        <td className="ps-3">
                          <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-md me-3">
                              <img src="/assets/images/products/4.png" alt="Product" className="img-fluid rounded"/>
                            </div>
                            <div>
                              <h5 className="mb-0">
                                <Link to="/admin/products/details" className="link-reset">4K Gaming Monitor</Link>
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td>Monitors</td>
                        <td>
                          <h5 className="fs-base mb-0 fw-medium">24</h5>
                        </td>
                        <td>$499.00</td>
                        <td>198</td>
                        <td><span className="badge badge-soft-warning fs-xxs">Pending</span></td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <Link to="/admin/products/details" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-eye fs-lg"></i></Link>
                            <Link to="/admin/products/edit" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-edit fs-lg"></i></Link>
                            <Link to="#" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-trash fs-lg"></i></Link>
                          </div>
                        </td>
                      </tr>

                      {/* Product Row 5 */}
                      <tr>
                        <td className="ps-3">
                          <input className="form-check-input form-check-input-light fs-14 product-item-check mt-0" type="checkbox" value="option"/>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-md me-3">
                              <img src="/assets/images/products/5.png" alt="Product" className="img-fluid rounded"/>
                            </div>
                            <div>
                              <h5 className="mb-0">
                                <Link to="/admin/products/details" className="link-reset">Mechanical Keyboard</Link>
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td>Accessories</td>
                        <td>
                          <h5 className="fs-base mb-0 fw-medium">120</h5>
                        </td>
                        <td>$89.99</td>
                        <td>243</td>
                        <td><span className="badge badge-soft-success fs-xxs">Published</span></td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <Link to="/admin/products/details" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-eye fs-lg"></i></Link>
                            <Link to="/admin/products/edit" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-edit fs-lg"></i></Link>
                            <Link to="#" className="btn btn-light btn-icon btn-sm rounded-circle"><i className="ti ti-trash fs-lg"></i></Link>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card-footer border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-0">Showing 1 to 5 of 5 entries</p>
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
        </div>
      </div>
    </Layout>
  );
};

export default StoreDetails;
