import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Layout from '../components/layout/Layout';
import PageSkeleton from '../components/common/PageSkeleton';
import { useToast } from '../contexts/ToastContext';
import { reportService } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext';
import type { 
  SalesReport, 
  ProductReport, 
  CustomerReport, 
  VisitReport, 
  TrendingProduct 
} from '../services/reportService';



const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'most-requested' | 'visits' | 'customers' | 'products' | 'sales'>('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('All');
  
  // Data states
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [salesSummary, setSalesSummary] = useState<any>(null);
  const [productReports, setProductReports] = useState<ProductReport[]>([]);
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>([]);
  const [visitReports, setVisitReports] = useState<VisitReport[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);

  const { showSuccess, showError } = useToast();
  const { token } = useAuth();

  // Load data when tab changes
  useEffect(() => {
    if (token) {
      loadTabData();
    }
  }, [activeTab, token, performanceFilter]);

  const loadTabData = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'sales':
          await loadSalesReports();
          break;
        case 'products':
          await loadProductReports();
          break;
        case 'customers':
          await loadCustomerReports();
          break;
        case 'visits':
          await loadVisitReports();
          break;
        case 'most-requested':
          await loadTrendingProducts();
          break;
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
      showError('Error', 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const loadSalesReports = async () => {
    try {
      setSalesLoading(true);
      const response = await reportService.getSalesReports(undefined, undefined, token);
      setSalesReports(response.daily_stats);
      setSalesSummary(response.summary);
    } catch (error) {
      console.error('Error loading sales reports:', error);
      showError('Error', 'Failed to load sales reports');
    } finally {
      setSalesLoading(false);
    }
  };

  const loadProductReports = async () => {
    try {
      setProductsLoading(true);
      const response = await reportService.getProductReports(performanceFilter, token);
      setProductReports(response.products);
    } catch (error) {
      console.error('Error loading product reports:', error);
      showError('Error', 'Failed to load product reports');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCustomerReports = async () => {
    try {
      setCustomersLoading(true);
      const response = await reportService.getCustomerReports(token);
      setCustomerReports(response.customers);
    } catch (error) {
      console.error('Error loading customer reports:', error);
      showError('Error', 'Failed to load customer reports');
    } finally {
      setCustomersLoading(false);
    }
  };

  const loadVisitReports = async () => {
    try {
      setVisitsLoading(true);
      const response = await reportService.getVisitReports(token);
      setVisitReports(response.visits);
    } catch (error) {
      console.error('Error loading visit reports:', error);
      showError('Error', 'Failed to load visit reports');
    } finally {
      setVisitsLoading(false);
    }
  };

  const loadTrendingProducts = async () => {
    try {
      setTrendingLoading(true);
      const response = await reportService.getTrendingProducts(token);
      setTrendingProducts(response.trending_products);
    } catch (error) {
      console.error('Error loading trending products:', error);
      showError('Error', 'Failed to load trending products');
    } finally {
      setTrendingLoading(false);
    }
  };


    




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

  const handleExportReport = async () => {
    try {
      let downloadUrl: string;
      
      switch (activeTab) {
        case 'sales':
          downloadUrl = await reportService.exportReport('orders', { 
            from_date: dateRange.split(' - ')[0], 
            to_date: dateRange.split(' - ')[1] 
          }, token);
          break;
        case 'products':
          downloadUrl = await reportService.exportReport('products', { 
            performance_filter: performanceFilter 
          }, token);
          break;
        case 'customers':
          downloadUrl = await reportService.exportReport('customers', undefined, token);
          break;
        default:
          showError('Error', 'Export not available for this report type');
          return;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('Success', 'Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      showError('Error', 'Failed to export report');
    }
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
                   {salesLoading ? (
                     <PageSkeleton type="card" count={1} />
                   ) : (
                     <>
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
                       

                       
                       {/* ApexCharts Column Chart with Rotated Labels & Annotations */}
                       <div className="card">
                         <div className="card-header">
                           <h4 className="card-title">Orders Trend Chart</h4>
                         </div>
                         <div className="card-body">
                           <div dir="ltr">
                         {filteredSalesReports.length > 0 ? (
                           <div className="apex-charts">
                             <ReactApexChart
                             options={{
                               chart: {
                                 height: 350,
                                 type: 'bar',
                                 toolbar: { show: false }
                               },
                               plotOptions: {
                                 bar: {
                                   columnWidth: '50%',
                                   borderRadius: 10
                                 }
                               },
                               dataLabels: { enabled: false },
                               stroke: { width: 2 },
                               colors: ['#1ab394'], // Primary color (teal)
                               series: [{
                                 name: 'Orders',
                                 data: filteredSalesReports.slice(0, 7).map(report => parseInt(report.orders) || 0)
                               }],
                               grid: {
                                 borderColor: '#e9ecef',
                                 padding: { top: 0, right: -2, bottom: -35, left: 10 },
                                 row: {
                                   colors: ['transparent', 'transparent'],
                                   opacity: 0.2
                                 }
                               },
                               xaxis: {
                                 labels: { rotate: -45 },
                                 categories: filteredSalesReports.slice(0, 7).map(report => report.date.split(',')[0])
                               },
                               yaxis: {
                                 title: {
                                   text: 'Orders Count',
                                   style: { fontSize: '14px', fontWeight: 500 }
                                 },
                                 labels: { offsetX: -10 }
                               },
                               fill: {
                                 type: 'gradient',
                                 gradient: {
                                   shade: 'light',
                                   type: 'horizontal',
                                   shadeIntensity: 0.25,
                                   gradientToColors: undefined,
                                   inverseColors: true,
                                   opacityFrom: 0.85,
                                   opacityTo: 0.85,
                                   stops: [50, 0, 100]
                                 }
                               },
                               tooltip: {
                                 y: {
                                   formatter: function(value) {
                                     return value + ' orders';
                                   }
                                 }
                               },
                               annotations: {
                                 points: filteredSalesReports.slice(0, 7).map((report, index) => {
                                   const ordersCount = parseInt(report.orders) || 0;
                                   // Add annotation for highest order count
                                   if (ordersCount === Math.max(...filteredSalesReports.slice(0, 7).map(r => parseInt(r.orders) || 0))) {
                                     return {
                                       x: report.date.split(',')[0],
                                       y: ordersCount,
                                       seriesIndex: 0,
                                       label: {
                                         borderColor: '#1c84c6',
                                         offsetY: 0,
                                         style: {
                                           color: '#fff',
                                           background: '#1c84c6'
                                         },
                                         text: 'Peak Orders'
                                       }
                                     };
                                   }
                                   return null;
                                 }).filter(Boolean)
                               }
                             }}
                             series={[{
                               name: 'Orders',
                               data: filteredSalesReports.slice(0, 7).map(report => parseInt(report.orders) || 0)
                             }]}
                                                            type="bar"
                               height={350}
                             />
                             </div>
                           ) : (
                           <div className="d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
                             <div className="text-center text-muted">
                               <i className="ti ti-chart-bar fs-1 mb-3"></i>
                               <p>No sales data available for the selected period</p>
                             </div>
                           </div>
                         )}
                           </div>
                         </div>
                       </div>
                       
                       {/* Chart Legend */}
                       <div className="d-flex justify-content-center mt-3">
                         <div className="d-flex align-items-center gap-3">
                           <div className="d-flex align-items-center gap-2">
                             <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#1ab394' }}></div>
                             <small className="text-muted">Orders Count</small>
                           </div>
                         </div>
                       </div>
                     </>
                   )}
                 </div>
               ) : activeTab === 'products' ? (
                 /* Product Reports Content */
                 <div className="py-4">
                   {productsLoading ? (
                     <PageSkeleton type="card" count={1} />
                   ) : (
                     <>
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
                         {filteredProductReports.length > 0 ? (
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
                         ) : (
                           <div className="d-flex align-items-center justify-content-center h-100">
                             <div className="text-center text-muted">
                               <i className="ti ti-eye fs-1 mb-3"></i>
                               <p>No product data available</p>
                             </div>
                           </div>
                         )}
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
                     </>
                   )}
                 </div>
               ) : activeTab === 'customers' ? (
                 /* Customer Reports Content */
                 <div className="py-4">
                   {customersLoading ? (
                     <PageSkeleton type="card" count={1} />
                   ) : (
                     <div className="text-center py-5">
                       <div className="d-flex align-items-center justify-content-center mb-4">
                         <i className="ti ti-users fs-1 text-primary me-3"></i>
                         <div>
                           <h4 className="mb-1">Customer Analytics</h4>
                           <p className="text-muted mb-0">Customer performance and behavior insights</p>
                         </div>
                       </div>
                       <div className="bg-light rounded p-4" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div className="text-center">
                           <i className="ti ti-chart-pie fs-2 text-muted mb-2"></i>
                           <p className="text-muted mb-0">Customer analytics visualization would be rendered here</p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               ) : activeTab === 'visits' ? (
                 /* Visit Reports Content */
                 <div className="py-4">
                   {visitsLoading ? (
                     <PageSkeleton type="card" count={1} />
                   ) : (
                     <div className="text-center py-5">
                       <div className="d-flex align-items-center justify-content-center mb-4">
                         <i className="ti ti-link fs-1 text-primary me-3"></i>
                         <div>
                           <h4 className="mb-1">Visit Analytics</h4>
                           <p className="text-muted mb-0">Website traffic and visitor behavior insights</p>
                         </div>
                       </div>
                       <div className="bg-light rounded p-4" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div className="text-center">
                           <i className="ti ti-chart-line fs-2 text-muted mb-2"></i>
                           <p className="text-muted mb-0">Visit analytics visualization would be rendered here</p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               ) : activeTab === 'most-requested' ? (
                 /* Most Requested Reports Content */
                 <div className="py-4">
                   {trendingLoading ? (
                     <PageSkeleton type="card" count={1} />
                   ) : (
                     <div className="text-center py-5">
                       <div className="d-flex align-items-center justify-content-center mb-4">
                         <i className="ti ti-shirt fs-1 text-primary me-3"></i>
                         <div>
                           <h4 className="mb-1">Trending Products</h4>
                           <p className="text-muted mb-0">Most requested and popular products analysis</p>
                         </div>
                       </div>
                       <div className="bg-light rounded p-4" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div className="text-center">
                           <i className="ti ti-trending-up fs-2 text-muted mb-2"></i>
                           <p className="text-muted mb-0">Trending products visualization would be rendered here</p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               ) : (
                 /* Default Empty State */
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
                 salesLoading ? (
                   <PageSkeleton type="table" count={5} />
                 ) : (
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
                       {filteredSalesReports.length > 0 ? (
                         filteredSalesReports.map((report) => (
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
                         ))
                       ) : (
                         <tr>
                           <td colSpan={8} className="text-center py-4 text-muted">
                             No sales data available
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 )
                              ) : activeTab === 'products' ? (
                 /* Product Reports Table */
                 productsLoading ? (
                   <PageSkeleton type="table" count={5} />
                 ) : (
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
                       {filteredProductReports.length > 0 ? (
                         filteredProductReports.map((product) => (
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
                           ))
                         ) : (
                           <tr>
                             <td colSpan={9} className="text-center py-4 text-muted">
                               No product data available
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   )
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
                       `Showing ${filteredSalesReports.length} of ${salesReports.length} sales reports`
                     ) : activeTab === 'products' ? (
                       `Showing ${filteredProductReports.length} of ${productReports.length} products`
                     ) : activeTab === 'customers' ? (
                       `Showing ${customerReports.length} customers`
                     ) : activeTab === 'visits' ? (
                       `Showing ${visitReports.length} visit records`
                     ) : activeTab === 'most-requested' ? (
                       `Showing ${trendingProducts.length} trending products`
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
