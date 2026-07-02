// Mock data for development — remove when backend is connected

export const mockSummary = {
  todayRevenue: 4580.00,
  totalSales: 247,
  totalProducts: 84,
  totalRevenue: 98450.75,
}

export const mockToday = {
  totalRevenue: 4580.00,
  totalSales: 24,
  averageOrderValue: 190.83,
}

export const mockLowStock = [
  { id: 1, name: 'Wireless Charger',    categoryName: 'Electronics', stockQuantity: 3 },
  { id: 2, name: 'USB-C Cable 2m',      categoryName: 'Accessories', stockQuantity: 5 },
  { id: 3, name: 'iPhone 15 Case',      categoryName: 'Accessories', stockQuantity: 2 },
  { id: 4, name: 'Laptop Stand',        categoryName: 'Electronics', stockQuantity: 4 },
]

export const mockSales = [
  { id: 1, receiptNumber: 'RCP-20260621-001', saleDate: '2026-06-21T09:15:00', paymentMethod: 'CASH',         total: 345.00 },
  { id: 2, receiptNumber: 'RCP-20260621-002', saleDate: '2026-06-21T10:32:00', paymentMethod: 'MOBILE_MONEY', total: 124.50 },
  { id: 3, receiptNumber: 'RCP-20260621-003', saleDate: '2026-06-21T11:05:00', paymentMethod: 'CARD',         total: 890.00 },
  { id: 4, receiptNumber: 'RCP-20260621-004', saleDate: '2026-06-21T12:18:00', paymentMethod: 'CASH',         total: 67.50  },
  { id: 5, receiptNumber: 'RCP-20260621-005', saleDate: '2026-06-21T13:44:00', paymentMethod: 'MOBILE_MONEY', total: 210.00 },
]

export const mockProducts = [
  { id: 1,  name: 'Wireless Charger',    price: 249.99, stockQuantity: 3,  sku: 'CHG-001',  categoryId: 1, categoryName: 'Electronics' },
  { id: 2,  name: 'USB-C Cable 2m',      price: 45.00,  stockQuantity: 5,  sku: 'CBL-002',  categoryId: 2, categoryName: 'Accessories' },
  { id: 3,  name: 'iPhone 15 Case',      price: 89.99,  stockQuantity: 2,  sku: 'ACC-IP15', categoryId: 2, categoryName: 'Accessories' },
  { id: 4,  name: 'Bluetooth Speaker',   price: 350.00, stockQuantity: 18, sku: 'SPK-003',  categoryId: 1, categoryName: 'Electronics' },
  { id: 5,  name: 'Laptop Stand',        price: 175.00, stockQuantity: 4,  sku: 'STD-004',  categoryId: 1, categoryName: 'Electronics' },
  { id: 6,  name: 'Screen Wipes (Pack)', price: 25.00,  stockQuantity: 60, sku: 'CLN-005',  categoryId: 3, categoryName: 'Consumables' },
  { id: 7,  name: 'HDMI Cable 1.5m',     price: 55.00,  stockQuantity: 32, sku: 'CBL-HDMI', categoryId: 2, categoryName: 'Accessories' },
  { id: 8,  name: 'Power Bank 20000mAh', price: 420.00, stockQuantity: 11, sku: 'PWR-020',  categoryId: 1, categoryName: 'Electronics' },
  { id: 9,  name: 'Keyboard (Wireless)', price: 320.00, stockQuantity: 7,  sku: 'KBD-WL',   categoryId: 1, categoryName: 'Electronics' },
  { id: 10, name: 'Mouse Pad XL',        price: 65.00,  stockQuantity: 22, sku: 'PAD-XL',   categoryId: 2, categoryName: 'Accessories' },
]

export const mockCategories = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', productCount: 5 },
  { id: 2, name: 'Accessories', description: 'Cables, cases and peripherals',  productCount: 4 },
  { id: 3, name: 'Consumables', description: 'Cleaning and office supplies',   productCount: 1 },
  { id: 4, name: 'Software',    description: 'Licenses and digital products',  productCount: 0 },
]

export const mockDailyReport = {
  date: '2026-06-21',
  totalSales: 24,
  totalRevenue: 4580.00,
  averageOrderValue: 190.83,
  topProducts: [
    { productId: 4, productName: 'Bluetooth Speaker',   quantity: 8 },
    { productId: 8, productName: 'Power Bank 20000mAh', quantity: 5 },
    { productId: 1, productName: 'Wireless Charger',    quantity: 4 },
    { productId: 9, productName: 'Keyboard (Wireless)', quantity: 3 },
  ],
  hourlyBreakdown: [
    { hour: '08:00', revenue: 345  },
    { hour: '09:00', revenue: 520  },
    { hour: '10:00', revenue: 890  },
    { hour: '11:00', revenue: 670  },
    { hour: '12:00', revenue: 430  },
    { hour: '13:00', revenue: 780  },
    { hour: '14:00', revenue: 945  },
  ],
}
