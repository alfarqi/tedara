

interface Transaction {
  id: string;
  transactionNumber: string;
  order: string;
  date: string;
  time: string;
  amount: string;
  status: 'paid' | 'failed' | 'pending';
  paymentMethod: {
    type: string;
    icon: string;
    lastDigits: string;
  };
}

const TransactionsTable: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      transactionNumber: '#TR-3468',
      order: '#ORD-1003 - Smart Watch',
      date: '27 Apr 2025',
      time: '02:15 PM',
      amount: '$89.99',
      status: 'paid',
      paymentMethod: {
        type: 'Mastercard',
        icon: '/assets/images/cards/mastercard.svg',
        lastDigits: '1123'
      }
    },
    {
      id: '2',
      transactionNumber: '#TR-3469',
      order: '#ORD-1004 - Gaming Mouse',
      date: '26 Apr 2025',
      time: '09:42 AM',
      amount: '$24.99',
      status: 'failed',
      paymentMethod: {
        type: 'Visa',
        icon: '/assets/images/cards/visa.svg',
        lastDigits: '3490'
      }
    },
    {
      id: '3',
      transactionNumber: '#TR-3470',
      order: '#ORD-1005 - Fitness Tracker Band',
      date: '25 Apr 2025',
      time: '11:10 AM',
      amount: '$34.95',
      status: 'paid',
      paymentMethod: {
        type: 'American Express',
        icon: '/assets/images/cards/american-express.svg',
        lastDigits: '8765'
      }
    },
    {
      id: '4',
      transactionNumber: '#TR-3471',
      order: '#ORD-1006 - Wireless Keyboard',
      date: '24 Apr 2025',
      time: '08:58 PM',
      amount: '$59.00',
      status: 'pending',
      paymentMethod: {
        type: 'Mastercard',
        icon: '/assets/images/cards/mastercard.svg',
        lastDigits: '5566'
      }
    },
    {
      id: '5',
      transactionNumber: '#TR-3472',
      order: '#ORD-1007 - Portable Charger',
      date: '23 Apr 2025',
      time: '05:37 PM',
      amount: '$45.80',
      status: 'paid',
      paymentMethod: {
        type: 'Visa',
        icon: '/assets/images/cards/visa.svg',
        lastDigits: '9012'
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-soft-success fs-xxs"><i className="ti ti-point-filled"></i> Paid</span>;
      case 'failed':
        return <span className="badge badge-soft-danger fs-xxs"><i className="ti ti-point-filled"></i> Failed</span>;
      case 'pending':
        return <span className="badge badge-soft-warning fs-xxs"><i className="ti ti-point-filled"></i> Pending</span>;
      default:
        return <span className="badge badge-soft-secondary fs-xxs"><i className="ti ti-point-filled"></i> Unknown</span>;
    }
  };

  return (
    <div className="card">
      <div className="card-header justify-content-between align-items-center">
        <h5 className="card-title">Transactions Worldwide</h5>
        <div className="card-action">
          <a href="#!" className="card-action-item" data-action="card-toggle"><i className="ti ti-chevron-up"></i></a>
          <a href="#!" className="card-action-item" data-action="card-refresh"><i className="ti ti-refresh"></i></a>
          <a href="#!" className="card-action-item" data-action="card-close"><i className="ti ti-x"></i></a>
        </div>
      </div>
      <div className="card-body pt-2">
        <div className="row align-items-center">
          <div className="col-xl-6">
            <div className="table-responsive">
              <table className="table table-custom table-nowrap table-hover table-centered mb-0">
                <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                  <tr className="text-uppercase fs-xxs">
                    <th className="text-muted">Tran. No.</th>
                    <th className="text-muted">Order</th>
                    <th className="text-muted">Date</th>
                    <th className="text-muted">Amount</th>
                    <th className="text-muted">Status</th>
                    <th className="text-muted">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <a href="#!" className="link-reset fw-semibold">{transaction.transactionNumber}</a>
                      </td>
                      <td>{transaction.order}</td>
                      <td>
                        {transaction.date} <small className="text-muted">{transaction.time}</small>
                      </td>
                      <td className="fw-semibold">{transaction.amount}</td>
                      <td>{getStatusBadge(transaction.status)}</td>
                      <td>
                        <img src={transaction.paymentMethod.icon} alt="" className="me-2" height="28" />
                        xxxx {transaction.paymentMethod.lastDigits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-3">
              <a href="#!" className="link-reset text-decoration-underline fw-semibold link-offset-3">
                View All Transactions <i className="ti ti-send-2"></i>
              </a>
            </div>
          </div>
          <div className="col-xl-6">
            <div id="map_1" className="w-100 mt-4 mt-xl-0" style={{ height: '297px' }}>
              {/* Map will be rendered by JavaScript */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
