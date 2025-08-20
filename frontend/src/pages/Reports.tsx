import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

interface SalesReport {
  id: string;
  date: string;
  orders: number;
  refunds: number;
  avgRevenuePerOrder: string;
  tax: string;
  revenue: string;
  balance: string;
}

interface ProductReport {
  id: string;
  productName: string;
  sku: string;
  price: string;
  rating: number;
  reviews: number;
  views: string;
  orders: number;
  conversion: string;
  image: string;
}

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'most-requested' | 'visits' | 'customers' | 'products' | 'sales'>('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('All');

  const [salesReports] = useState<SalesReport[]>([
    {
      id: '1',
      date: '10 July, 2025',
      orders: 68,
      refunds: 4,
      avgRevenuePerOrder: '$18.60',
      tax: '$25.78',
      revenue: '$612.70',
      balance: '$6625.46'
    },
    {
      id: '2',
      date: '09 July, 2025',
      orders: 85,
      refunds: 1,
      avgRevenuePerOrder: '$22.10',
      tax: '$31.85',
      revenue: '$786.35',
      balance: '$6012.76'
    },
    {
      id: '3',
      date: '08 July, 2025',
      orders: 61,
      refunds: 3,
      avgRevenuePerOrder: '$17.40',
      tax: '$23.67',
      revenue: '$531.10',
      balance: '$5226.41'
    },
    {
      id: '4',
      date: '07 July, 2025',
      orders: 79,
      refunds: 2,
      avgRevenuePerOrder: '$20.65',
      tax: '$29.45',
      revenue: '$726.80',
      balance: '$4695.31'
    },
    {
      id: '5',
      date: '06 July, 2025',
      orders: 53,
      refunds: 6,
      avgRevenuePerOrder: '$15.10',
      tax: '$20.89',
      revenue: '$400.55',
      balance: '$3968.51'
    },
    {
      id: '6',
      date: '05 July, 2025',
      orders: 91,
      refunds: 4,
      avgRevenuePerOrder: '$22.50',
      tax: '$32.90',
      revenue: '$851.30',
      balance: '$3567.96'
    },
    {
      id: '7',
      date: '04 July, 2025',
      orders: 47,
      refunds: 5,
      avgRevenuePerOrder: '$16.25',
      tax: '$22.05',
      revenue: '$382.47',
      balance: '$2716.66'
    },
    {
      id: '8',
      date: '03 July, 2025',
      orders: 82,
      refunds: 1,
      avgRevenuePerOrder: '$21.03',
      tax: '$31.11',
      revenue: '$792.65',
      balance: '$2334.19'
    }
  ]);

  const [productReports] = useState<ProductReport[]>([
    {
      id: '1',
      productName: 'Smart Fitness Watch',
      sku: 'FW-54201',
      price: '$129.99',
      rating: 4,
      reviews: 54,
      views: '45.2k',
      orders: 820,
      conversion: '7.3%',
      image: '/assets/images/products/2.png'
    },
    {
      id: '2',
      productName: 'Portable Bluetooth Speaker',
      sku: 'BS-20894',
      price: '$79.50',
      rating: 3,
      reviews: 31,
      views: '28.9k',
      orders: 410,
      conversion: '5.8%',
      image: '/assets/images/products/3.png'
    },
    {
      id: '3',
      productName: 'Gaming Mouse',
      sku: 'GM-77215',
      price: '$49.99',
      rating: 4,
      reviews: 67,
      views: '22.4k',
      orders: 340,
      conversion: '6.4%',
      image: '/assets/images/products/4.png'
    },
    {
      id: '4',
      productName: 'Noise Cancelling Headphones',
      sku: 'NC-88321',
      price: '$199.00',
      rating: 5,
      reviews: 128,
      views: '60.1k',
      orders: 1500,
      conversion: '9.8%',
      image: '/assets/images/products/5.png'
    },
    {
      id: '5',
      productName: '4K Action Camera',
      sku: 'AC-90763',
      price: '$249.99',
      rating: 4,
      reviews: 94,
      views: '18.9k',
      orders: 610,
      conversion: '6.0%',
      image: '/assets/images/products/6.png'
    },
    {
      id: '6',
      productName: 'Wireless Charger Pad',
      sku: 'WC-23815',
      price: '$39.95',
      rating: 3,
      reviews: 41,
      views: '12.3k',
      orders: 220,
      conversion: '4.1%',
      image: '/assets/images/products/7.png'
    },
    {
      id: '7',
      productName: 'Mechanical Keyboard',
      sku: 'MK-48519',
      price: '$89.00',
      rating: 4,
      reviews: 77,
      views: '30.5k',
      orders: 540,
      conversion: '7.2%',
      image: '/assets/images/products/8.png'
    },
    {
      id: '8',
      productName: 'Drone with Camera',
      sku: 'DR-61208',
      price: '$399.00',
      rating: 5,
      reviews: 189,
      views: '75.9k',
      orders: 1900,
      conversion: '10.2%',
      image: '/assets/images/products/9.png'
    }
  ]);

  const filteredSalesReports = salesReports.filter(report => {
    const matchesSearch = report.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.revenue.includes(searchTerm) ||
                         report.balance.includes(searchTerm);
    return matchesSearch;
  });

  const filteredProductReports = productReports.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.price.includes(searchTerm);
    return matchesSearch;
  });

  const handleExportReport = () => {
    // Handle export functionality
    console.log('Exporting report...');
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">REPORTS</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">Reports</li>
          </ol>
        </div>
      </div>

                           {/* Tab Navigation */}
                 <div className="row px-4 mb-0">
          <div className="col-12">
            <div className="card">
              <div className="card-body p-3">
                                                  <div className="d-flex align-items-center justify-content-between mb-3">
                   <h5 className="mb-0 fw-semibold">Report Type</h5>
                   <div className="d-flex align-items-center gap-1">
                     <button className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '32px', height: '32px', padding: '0' }}>
                       <i className="ti ti-chevron-left fs-sm"></i>
                     </button>
                     <button className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '32px', height: '32px', padding: '0' }}>
                       <i className="ti ti-chevron-right fs-sm"></i>
                     </button>
                   </div>
                 </div>
                                   <div className="d-flex align-items-center gap-2 flex-wrap">
                   
                   <button
                     className={`btn ${activeTab === 'sales' ? 'active' : ''}`}
                     onClick={() => setActiveTab('sales')}
                                          style={{
                        border: activeTab === 'sales' ? '2px solid #6f42c1' : '1px solid #e9ecef',
                        backgroundColor: activeTab === 'sales' ? '#6f42c1' : '#ffffff',
                        color: activeTab === 'sales' ? '#ffffff' : '#6c757d',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        minWidth: '140px',
                        transition: 'all 0.3s ease'
                      }}
                   >
                                          <i className="ti ti-shopping-cart me-2 fs-4"></i>
                      Sales
                   </button>
                   
                   <button
                     className={`btn ${activeTab === 'most-requested' ? 'active' : ''}`}
                     onClick={() => setActiveTab('most-requested')}
                                          style={{
                                                 border: activeTab === 'most-requested' ? '2px solid #6f42c1' : '1px solid #e9ecef',
                         backgroundColor: activeTab === 'most-requested' ? '#6f42c1' : '#ffffff',
                         color: activeTab === 'most-requested' ? '#ffffff' : '#6c757d',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        minWidth: '140px',
                        transition: 'all 0.3s ease'
                      }}
                   >
                                          <i className="ti ti-shirt me-2 fs-4"></i>
                      Most Requested
                   </button>
                   
                   <button
                     className={`btn ${activeTab === 'visits' ? 'active' : ''}`}
                     onClick={() => setActiveTab('visits')}
                                          style={{
                                                 border: activeTab === 'visits' ? '2px solid #6f42c1' : '1px solid #e9ecef',
                         backgroundColor: activeTab === 'visits' ? '#6f42c1' : '#ffffff',
                         color: activeTab === 'visits' ? '#ffffff' : '#6c757d',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        minWidth: '140px',
                        transition: 'all 0.3s ease'
                      }}
                   >
                                          <i className="ti ti-link me-2 fs-4"></i>
                      Visits
                   </button>
                   
                   <button
                     className={`btn ${activeTab === 'customers' ? 'active' : ''}`}
                     onClick={() => setActiveTab('customers')}
                                          style={{
                                                 border: activeTab === 'customers' ? '2px solid #6f42c1' : '1px solid #e9ecef',
                         backgroundColor: activeTab === 'customers' ? '#6f42c1' : '#ffffff',
                         color: activeTab === 'customers' ? '#ffffff' : '#6c757d',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        minWidth: '140px',
                        transition: 'all 0.3s ease'
                      }}
                   >
                                          <i className="ti ti-users me-2 fs-4"></i>
                      Customers
                   </button>
                   
                   <button
                     className={`btn ${activeTab === 'products' ? 'active' : ''}`}
                     onClick={() => setActiveTab('products')}
                                          style={{
                                                 border: activeTab === 'products' ? '2px solid #6f42c1' : '1px solid #e9ecef',
                         backgroundColor: activeTab === 'products' ? '#6f42c1' : '#ffffff',
                         color: activeTab === 'products' ? '#ffffff' : '#6c757d',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        minWidth: '140px',
                        transition: 'all 0.3s ease'
                      }}
                   >
                                          <i className="ti ti-package me-2 fs-4"></i>
                      Products
                   </button>
                                      </div>
              </div>
            </div>
          </div>
        </div>

               {/* Reports Content */}
        <div className="row px-4">
          <div className="col-12">
           <div className="card">
                         <div className="card-header border-light justify-content-between">
               <h5 className="card-title mb-0">
                 {activeTab === 'sales' ? 'Sales Reports - 2025' : 
                  activeTab === 'products' ? 'Product Views Report' :
                  activeTab === 'customers' ? 'Customer Reports' :
                  activeTab === 'visits' ? 'Visit Reports' :
                  'Most Requested Reports'}
               </h5>
               <div className="d-flex align-items-center gap-2">
                 <div className="app-search">
                   <input 
                     type="search" 
                     className="form-control" 
                     placeholder={activeTab === 'sales' ? "Search reports..." : "Search products..."}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   <i className="ti ti-search app-search-icon text-muted"></i>
                 </div>

                 {activeTab === 'sales' && (
                   <div className="app-search">
                     <input 
                       type="text" 
                       style={{ minWidth: '250px' }} 
                       className="form-control" 
                       placeholder="Select date range"
                       value={dateRange}
                       onChange={(e) => setDateRange(e.target.value)}
                     />
                     <i className="ti ti-calendar app-search-icon text-muted"></i>
                   </div>
                 )}

                 {activeTab === 'products' && (
                   <div className="app-search">
                     <select 
                       className="form-select form-control"
                       value={performanceFilter}
                       onChange={(e) => setPerformanceFilter(e.target.value)}
                     >
                       <option value="All">Sales Performance</option>
                       <option value="1000+">Top Selling</option>
                       <option value="1-1000">Low Selling</option>
                       <option value="0">No Sales</option>
                     </select>
                     <i className="ti ti-trending-up app-search-icon text-muted"></i>
                   </div>
                 )}

                 <button 
                   type="button" 
                   className="btn btn-secondary"
                   onClick={handleExportReport}
                 >
                   <i className="ti ti-download me-2"></i>
                   Export Report
                 </button>
               </div>
             </div>

                         <div className="card-body">
               {activeTab === 'sales' ? (
                 /* Sales Reports Content */
                 <div className="py-4">
                   <div className="d-flex align-items-center justify-content-between mb-4">
                     <div className="d-flex align-items-center">
                       <i className="ti ti-chart-line fs-1 text-primary me-3"></i>
                       <div>
                         <h4 className="mb-1">Sales Analytics Chart</h4>
                         <p className="text-muted mb-0">Interactive chart showing sales performance over time</p>
                       </div>
                     </div>
                     <div className="d-flex gap-2">
                       <button className="btn btn-sm btn-outline-primary">Daily</button>
                       <button className="btn btn-sm btn-primary">Weekly</button>
                       <button className="btn btn-sm btn-outline-primary">Monthly</button>
                     </div>
                   </div>
                   
                   {/* Simple Chart Visualization */}
                   <div className="bg-light rounded p-4" style={{ height: '300px' }}>
                     <div className="d-flex align-items-end justify-content-between h-100" style={{ gap: '8px' }}>
                       {filteredSalesReports.slice(0, 7).map((report) => {
                         const height = (parseFloat(report.revenue.replace('$', '').replace(',', '')) / 1000) * 100;
                         return (
                           <div key={report.id} className="flex-grow-1 d-flex flex-column align-items-center">
                             <div 
                               className="bg-primary rounded-top" 
                               style={{ 
                                 width: '100%', 
                                 height: `${Math.max(height, 20)}px`,
                                 minHeight: '20px',
                                 transition: 'all 0.3s ease'
                               }}
                             ></div>
                             <div className="mt-2 text-center">
                               <small className="text-muted d-block">{report.revenue}</small>
                               <small className="text-muted">{report.date.split(',')[0]}</small>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                   
                   {/* Chart Legend */}
                   <div className="d-flex justify-content-center mt-3">
                     <div className="d-flex align-items-center gap-3">
                       <div className="d-flex align-items-center gap-2">
                         <div className="bg-primary rounded" style={{ width: '12px', height: '12px' }}></div>
                         <small className="text-muted">Revenue</small>
                       </div>
                       <div className="d-flex align-items-center gap-2">
                         <div className="bg-success rounded" style={{ width: '12px', height: '12px' }}></div>
                         <small className="text-muted">Orders</small>
                       </div>
                       <div className="d-flex align-items-center gap-2">
                         <div className="bg-warning rounded" style={{ width: '12px', height: '12px' }}></div>
                         <small className="text-muted">Refunds</small>
                       </div>
                     </div>
                   </div>
                 </div>
               ) : activeTab === 'products' ? (
                 /* Product Reports Content */
                 <div className="py-4">
                   <div className="d-flex align-items-center justify-content-between mb-4">
                     <div className="d-flex align-items-center">
                       <i className="ti ti-eye fs-1 text-primary me-3"></i>
                       <div>
                         <h4 className="mb-1">Product Views Analytics</h4>
                         <p className="text-muted mb-0">Product performance and conversion metrics</p>
                       </div>
                     </div>
                     <div className="d-flex gap-2">
                       <button className="btn btn-sm btn-outline-primary">Views</button>
                       <button className="btn btn-sm btn-primary">Orders</button>
                       <button className="btn btn-sm btn-outline-primary">Conversion</button>
                     </div>
                   </div>
                   
                                       {/* Product Performance Chart */}
                    <div className="bg-light rounded p-4" style={{ height: '300px' }}>
                      <div className="position-relative h-100">
                        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                          <defs>
                                                         <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                               <stop offset="0%" style={{ stopColor: '#6f42c1', stopOpacity: 1 }} />
                               <stop offset="100%" style={{ stopColor: '#5a32a3', stopOpacity: 1 }} />
                             </linearGradient>
                          </defs>
                          
                          {/* Grid lines */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <line
                              key={i}
                              x1="0"
                              y1={60 + i * 40}
                              x2="100%"
                              y2={60 + i * 40}
                              stroke="#e9ecef"
                              strokeWidth="1"
                              strokeDasharray="5,5"
                            />
                          ))}
                          
                          {/* Line chart */}
                          <polyline
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="3"
                            points={filteredProductReports.slice(0, 6).map((product, index) => {
                              const views = parseInt(product.views.replace('k', '000').replace('.', ''));
                              const y = 240 - (views / 80000) * 160;
                              const x = (index / 5) * 90 + 5;
                              return `${x}%,${y}`;
                            }).join(' ')}
                          />
                          
                          {/* Data points */}
                          {filteredProductReports.slice(0, 6).map((product, index) => {
                            const views = parseInt(product.views.replace('k', '000').replace('.', ''));
                            const y = 240 - (views / 80000) * 160;
                            const x = (index / 5) * 90 + 5;
                            return (
                              <circle
                                key={product.id}
                                cx={`${x}%`}
                                cy={y}
                                                                 r="6"
                                 fill="#6f42c1"
                                 stroke="#ffffff"
                                strokeWidth="2"
                              />
                            );
                          })}
                        </svg>
                        
                        {/* Labels */}
                        <div className="position-relative h-100 d-flex align-items-end justify-content-between" style={{ paddingBottom: '20px' }}>
                          {filteredProductReports.slice(0, 6).map((product) => (
                            <div key={product.id} className="text-center" style={{ width: '16%' }}>
                              <small className="text-muted d-block">{product.views}</small>
                              <small className="text-muted">{product.productName.split(' ')[0]}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                   
                                       {/* Chart Legend */}
                    <div className="d-flex justify-content-center mt-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                                                     <div className="rounded" style={{ 
                             width: '12px', 
                             height: '12px',
                             background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)'
                           }}></div>
                          <small className="text-muted">Views</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary rounded" style={{ width: '12px', height: '12px' }}></div>
                          <small className="text-muted">Orders</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-warning rounded" style={{ width: '12px', height: '12px' }}></div>
                          <small className="text-muted">Conversion Rate</small>
                        </div>
                      </div>
                    </div>
                 </div>
               ) : (
                 /* Other Tabs Content - Empty State */
                 <div className="py-5 text-center">
                   <div className="d-flex align-items-center justify-content-center mb-4">
                     <i className="ti ti-chart-heartbeat fs-1 text-muted me-3"></i>
                     <div>
                                                <h4 className="mb-1">No Sufficient Data</h4>
                       <p className="text-muted mb-0">No sufficient data available for this report</p>
                     </div>
                   </div>
                   <div className="bg-light rounded p-4" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div className="text-center">
                       <i className="ti ti-chart-area fs-2 text-muted mb-2"></i>
                       <p className="text-muted mb-0">Chart visualization would be rendered here</p>
                     </div>
                   </div>
                 </div>
               )}
             </div>

                         <div className="table-responsive">
               {activeTab === 'sales' ? (
                 /* Sales Reports Table */
                 <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
                   <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                     <tr className="text-uppercase fs-xxs">
                       <th className="ps-3" style={{ width: '1%' }}>
                         <input 
                           className="form-check-input form-check-input-light fs-14 mt-0" 
                           type="checkbox" 
                           id="select-all-reports"
                         />
                       </th>
                       <th>Date</th>
                       <th>Orders</th>
                       <th>Refunds</th>
                       <th>Avg. Revenue per Order</th>
                       <th>Tax</th>
                       <th>Revenue</th>
                       <th>Balance</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredSalesReports.map((report) => (
                       <tr key={report.id}>
                         <td className="ps-3">
                           <input 
                             className="form-check-input form-check-input-light fs-14 product-item-check mt-0" 
                             type="checkbox" 
                             value={report.id}
                           />
                         </td>
                         <td>{report.date}</td>
                         <td>{report.orders}</td>
                         <td>{report.refunds}</td>
                         <td>{report.avgRevenuePerOrder}</td>
                         <td>{report.tax}</td>
                         <td className="fw-semibold text-success">{report.revenue}</td>
                         <td className="fw-semibold">{report.balance}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               ) : activeTab === 'products' ? (
                 /* Product Reports Table */
                 <table className="table table-custom table-centered table-select table-hover w-100 mb-0">
                   <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                     <tr className="text-uppercase fs-xxs">
                       <th className="ps-3" style={{ width: '1%' }}>
                         <input 
                           className="form-check-input form-check-input-light fs-14 mt-0" 
                           type="checkbox" 
                           id="select-all-products"
                         />
                       </th>
                       <th>Product</th>
                       <th>SKU</th>
                       <th>Price</th>
                       <th>Rating</th>
                       <th>Views</th>
                       <th>Orders</th>
                       <th>Conversion</th>
                       <th style={{ width: '1%' }}>Report</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredProductReports.map((product) => (
                       <tr key={product.id}>
                         <td className="ps-3">
                           <input 
                             className="form-check-input form-check-input-light fs-14 product-item-check mt-0" 
                             type="checkbox" 
                             value={product.id}
                           />
                         </td>
                         <td>
                           <div className="d-flex align-items-center">
                             <div className="avatar-md me-3">
                               <img src={product.image} alt="Product" className="img-fluid rounded" />
                             </div>
                             <div>
                               <h5 className="mb-0">
                                 <a href="#" className="link-reset">{product.productName}</a>
                               </h5>
                             </div>
                           </div>
                         </td>
                         <td>{product.sku}</td>
                         <td>{product.price}</td>
                         <td>
                           <span className="text-warning">
                             {[...Array(5)].map((_, i) => (
                               <span key={i} className={`ti ti-star${i < product.rating ? '-filled' : ''}`}></span>
                             ))}
                           </span>
                           <span className="ms-1">
                             <a href="#" className="link-reset fw-semibold">({product.reviews})</a>
                           </span>
                         </td>
                         <td>{product.views}</td>
                         <td>{product.orders}</td>
                         <td>{product.conversion}</td>
                         <td>
                           <div className="bg-light rounded" style={{ width: '60px', height: '30px' }}></div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               ) : (
                 /* Empty Table for Other Tabs */
                 <div className="text-center py-5">
                   <i className="ti ti-table fs-1 text-muted mb-3"></i>
                   <h5 className="text-muted">No data available</h5>
                   <p className="text-muted mb-0">Table data will appear here when available</p>
                 </div>
               )}
             </div>

                         <div className="card-footer border-0">
               <div className="d-flex justify-content-between align-items-center">
                 <div>
                   <p className="text-muted mb-0">
                     {activeTab === 'sales' ? (
                       `Showing ${filteredSalesReports.length} of ${salesReports.length} reports`
                     ) : activeTab === 'products' ? (
                       `Showing ${filteredProductReports.length} of ${productReports.length} products`
                     ) : (
                       'No data available'
                     )}
                   </p>
                 </div>
                 <div className="d-flex gap-2">
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
    </Layout>
  );
};

export default Reports;
