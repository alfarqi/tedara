import { Eye, Edit, Trash2 } from 'lucide-react';

interface TableData {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}

const DataTable: React.FC = () => {
  const tableData: TableData[] = [
    {
      id: '#12345',
      customer: 'John Doe',
      product: 'Premium Package',
      amount: '$299.00',
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: '#12346',
      customer: 'Sarah Wilson',
      product: 'Basic Plan',
      amount: '$99.00',
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: '#12347',
      customer: 'Mike Johnson',
      product: 'Enterprise Plan',
      amount: '$599.00',
      status: 'completed',
      date: '2024-01-13'
    },
    {
      id: '#12348',
      customer: 'Emily Davis',
      product: 'Starter Plan',
      amount: '$49.00',
      status: 'cancelled',
      date: '2024-01-12'
    },
    {
      id: '#12349',
      customer: 'David Brown',
      product: 'Premium Package',
      amount: '$299.00',
      status: 'completed',
      date: '2024-01-11'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge text-bg-success">Completed</span>;
      case 'pending':
        return <span className="badge text-bg-warning">Pending</span>;
      case 'cancelled':
        return <span className="badge text-bg-danger">Cancelled</span>;
      default:
        return <span className="badge text-bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Recent Orders</h5>
          <a href="/orders" className="btn btn-primary btn-sm">
            View All Orders
          </a>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="bg-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="fw-semibold">{row.id}</span>
                  </td>
                  <td>{row.customer}</td>
                  <td>{row.product}</td>
                  <td>
                    <span className="fw-semibold">{row.amount}</span>
                  </td>
                  <td>{getStatusBadge(row.status)}</td>
                  <td>{row.date}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-primary">
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
