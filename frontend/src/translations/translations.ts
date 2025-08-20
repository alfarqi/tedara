export interface Translations {
  dashboard: {
    title: string;
    subtitle: string;
  };
  stats: {
    totalRevenue: string;
    totalOrders: string;
    totalCustomers: string;
    totalProducts: string;
  };
  recentActivity: {
    title: string;
    newOrder: string;
    paymentReceived: string;
    customerRegistered: string;
    productAdded: string;
  };
  quickActions: {
    title: string;
    addProduct: string;
    createOrder: string;
    addCustomer: string;
    generateReport: string;
  };
  recentOrders: {
    title: string;
    orderId: string;
    customer: string;
    product: string;
    amount: string;
    status: string;
  };
  navigation: {
    dashboard: string;
    ecommerce: string;
    orders: string;
    customers: string;
    products: string;
    analytics: string;
    reports: string;
    settings: string;
  };
  common: {
    search: string;
    notifications: string;
    messages: string;
    profile: string;
    settings: string;
    logout: string;
  };
}

export const translations: Record<'en' | 'ar', Translations> = {
  en: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Welcome to your dashboard',
    },
    stats: {
      totalRevenue: 'Total Revenue',
      totalOrders: 'Total Orders',
      totalCustomers: 'Total Customers',
      totalProducts: 'Total Products',
    },
    recentActivity: {
      title: 'Recent Activity',
      newOrder: 'New order received',
      paymentReceived: 'Payment received',
      customerRegistered: 'New customer registered',
      productAdded: 'New product added',
    },
    quickActions: {
      title: 'Quick Actions',
      addProduct: 'Add Product',
      createOrder: 'Create Order',
      addCustomer: 'Add Customer',
      generateReport: 'Generate Report',
    },
    recentOrders: {
      title: 'Recent Orders',
      orderId: 'Order ID',
      customer: 'Customer',
      product: 'Product',
      amount: 'Amount',
      status: 'Status',
    },
    navigation: {
      dashboard: 'Dashboard',
      ecommerce: 'E-Commerce',
      orders: 'Orders',
      customers: 'Customers',
      products: 'Products',
      analytics: 'Analytics',
      reports: 'Reports',
      settings: 'Settings',
    },
    common: {
      search: 'Search',
      notifications: 'Notifications',
      messages: 'Messages',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
  },
  ar: {
    dashboard: {
      title: 'لوحة التحكم',
      subtitle: 'مرحباً بك في لوحة التحكم',
    },
    stats: {
      totalRevenue: 'إجمالي الإيرادات',
      totalOrders: 'إجمالي الطلبات',
      totalCustomers: 'إجمالي العملاء',
      totalProducts: 'إجمالي المنتجات',
    },
    recentActivity: {
      title: 'النشاط الأخير',
      newOrder: 'طلب جديد تم استلامه',
      paymentReceived: 'تم استلام الدفع',
      customerRegistered: 'عميل جديد مسجل',
      productAdded: 'منتج جديد تم إضافته',
    },
    quickActions: {
      title: 'إجراءات سريعة',
      addProduct: 'إضافة منتج',
      createOrder: 'إنشاء طلب',
      addCustomer: 'إضافة عميل',
      generateReport: 'إنشاء تقرير',
    },
    recentOrders: {
      title: 'الطلبات الأخيرة',
      orderId: 'رقم الطلب',
      customer: 'العميل',
      product: 'المنتج',
      amount: 'المبلغ',
      status: 'الحالة',
    },
    navigation: {
      dashboard: 'لوحة التحكم',
      ecommerce: 'التجارة الإلكترونية',
      orders: 'الطلبات',
      customers: 'العملاء',
      products: 'المنتجات',
      analytics: 'التحليلات',
      reports: 'التقارير',
      settings: 'الإعدادات',
    },
    common: {
      search: 'بحث',
      notifications: 'الإشعارات',
      messages: 'الرسائل',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
    },
  },
};






