
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
  DonutChartCard,
  OrdersChartCard,
  RecentOrdersTable,
  OnboardingProgressCard
} from '../components/dashboard';
import { useChartInitialization } from '../hooks/useChartInitialization';
import { useOnboardingProgress } from '../hooks/useOnboardingProgress';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStatistics, DashboardCardData } from '../types/dashboard';
import { useToast } from '../contexts/ToastContext';

const Dashboard: React.FC = () => {
  const { showError } = useToast();
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize charts after component mounts
  useChartInitialization();
  
  // Get onboarding progress
  const { 
    steps, 
    completedSteps, 
    totalSteps, 
    shouldShowOnboarding 
  } = useOnboardingProgress();

  // Load dashboard statistics
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await dashboardService.getStatistics(token || undefined);
      
      if (response.success) {
        console.log('📊 Dashboard API response:', response.data);
        setStatistics(response.data);
      } else {
        console.error('❌ API returned success: false');
        showError('Failed to load dashboard statistics', 'Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('❌ Error loading dashboard statistics:', error);
      showError('Error loading dashboard statistics', 'Error loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Convert statistics to card data
  const getCardData = (): DashboardCardData[] => {
    if (!statistics) return [];

    return [
      {
        title: "Total Sales",
        value: statistics.total_sales.formatted,
        subtitle: "",
        badge: { text: "Monthly", color: "success" },
        chartData: { 
          target: statistics.total_sales.current, 
          current: statistics.total_sales.current 
        },
        growth: {
          value: statistics.total_sales.growth,
          isPositive: statistics.total_sales.growth >= 0
        }
      },
      {
        title: "Total Orders",
        value: statistics.total_orders.formatted,
        subtitle: "",
        badge: { text: "Monthly", color: "primary" },
        chartData: { 
          target: statistics.total_orders.current, 
          current: statistics.total_orders.current 
        },
        growth: {
          value: statistics.total_orders.growth,
          isPositive: statistics.total_orders.growth >= 0
        }
      },
      {
        title: "New Customers",
        value: statistics.new_customers.formatted,
        subtitle: "",
        badge: { text: "Monthly", color: "info" },
        chartData: { 
          target: statistics.new_customers.current, 
          current: statistics.new_customers.current 
        },
        growth: {
          value: statistics.new_customers.growth,
          isPositive: statistics.new_customers.growth >= 0
        }
      },
      {
        title: "Revenue",
        value: statistics.revenue.formatted,
        subtitle: "",
        badge: { text: "Monthly", color: "warning" },
        chartData: { 
          target: statistics.revenue.current, 
          current: statistics.revenue.current 
        },
        growth: {
          value: statistics.revenue.growth,
          isPositive: statistics.revenue.growth >= 0
        }
      }
    ];
  };
  
  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Dashboard</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item">
              <a href="javascript: void(0);">Tedara</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </div>
      </div>

      {/* Onboarding Progress Card */}
      {shouldShowOnboarding && (
        <div className="row px-4">
          <div className="col-12">
            <OnboardingProgressCard 
              steps={steps}
              completedSteps={completedSteps}
              totalSteps={totalSteps}
            />
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1 px-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="col">
              <div className="card">
                <div className="card-header d-flex border-dashed justify-content-between align-items-center">
                  <div className="placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-3"></span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="placeholder-glow">
                      <span className="placeholder col-4"></span>
                    </div>
                    <div className="text-end">
                      <div className="placeholder-glow">
                        <span className="placeholder col-8"></span>
                      </div>
                      <div className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          getCardData().map((card, index) => (
            <div key={index} className="col">
              <DonutChartCard
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                badge={card.badge}
                chartData={card.chartData}
                growth={card.growth}
              />
            </div>
          ))
        )}
      </div>

      {/* Orders Chart Card */}
      <div className="row px-4">
        <div className="col-12">
          <OrdersChartCard title="Orders Statics" />
        </div>
      </div>

      {/* Recent Orders Row - Full Width */}
      <div className="row px-4">
        <div className="col-12">
          <RecentOrdersTable limit={10} />
        </div>
      </div>

      {/* Product Inventory Row - Hidden */}
      {/* <div className="row px-4">
        <div className="col-xxl-6">
          <ProductInventoryTable />
        </div>
        <div className="col-xxl-6">
          <RecentOrdersTable />
        </div>
      </div> */}

      {/* Transactions Row - Hidden */}
      {/* <div className="row px-4">
        <div className="col-12">
          <TransactionsTable />
        </div>
      </div> */}
    </Layout>
  );
};

export default Dashboard;
