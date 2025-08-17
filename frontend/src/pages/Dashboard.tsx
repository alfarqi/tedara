
import Layout from '../components/layout/Layout';
import {
  DonutChartCard,
  OrdersChartCard,
  ProductInventoryTable,
  RecentOrdersTable,
  TransactionsTable
} from '../components/dashboard';
import { useChartInitialization } from '../hooks/useChartInitialization';

const Dashboard: React.FC = () => {
  // Initialize charts after component mounts
  useChartInitialization();
  
  return (
    <Layout>
      {/* Page Header */}
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4 className="fs-sm text-uppercase fw-bold m-0">Dashboard 2</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0">
            <li className="breadcrumb-item">
              <a href="javascript: void(0);">Inspinia</a>
            </li>
            <li className="breadcrumb-item active">Dashboard 2</li>
          </ol>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1 px-4">
        {/* Total Sales Widget */}
        <div className="col">
          <DonutChartCard
            title="Total Sales"
            value="$250K"
            subtitle="Monthly Total Sales"
            badge={{ text: "Monthly", color: "success" }}
            chartData={{ target: 250, current: 0 }}
          />
        </div>

        {/* Total Orders Widget */}
        <div className="col">
          <DonutChartCard
            title="Total Orders"
            value="180"
            subtitle="Monthly Total Orders"
            badge={{ text: "Monthly", color: "primary" }}
            chartData={{ target: 180, current: 0 }}
          />
        </div>

        {/* New Customers Widget */}
        <div className="col">
          <DonutChartCard
            title="New Customers"
            value="50,895"
            subtitle="Monthly New Customers"
            badge={{ text: "Monthly", color: "info" }}
            chartData={{ target: 50895, current: 0 }}
          />
        </div>

        {/* Monthly Revenue Widget */}
        <div className="col">
          <DonutChartCard
            title="Revenue"
            value="$50.33K"
            subtitle="Monthly Revenue"
            badge={{ text: "Monthly", color: "warning" }}
            chartData={{ target: 50.33, current: 0 }}
          />
        </div>
      </div>

      {/* Orders Chart Card */}
      <div className="row px-4">
        <div className="col-12">
          <OrdersChartCard title="Orders Statics" />
        </div>
      </div>

      {/* Tables Row */}
      <div className="row px-4">
        <div className="col-xxl-6">
          <ProductInventoryTable />
        </div>
        <div className="col-xxl-6">
          <RecentOrdersTable />
        </div>
      </div>

      {/* Transactions Row */}
      <div className="row px-4">
        <div className="col-12">
          <TransactionsTable />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
