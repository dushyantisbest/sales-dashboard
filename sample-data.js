const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/salesData";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected for sample data..."))
  .catch((err) => console.log(err));

// Sale Schema
const saleSchema = new mongoose.Schema({
  orderDispatchDate: { type: Date, required: true },
  vendorName: { type: String, required: true },
  contact: { type: String, required: false },
  area: { type: String, required: true },
  transport: { type: String, required: true },
  totalBillAmount: { type: Number, required: true },
  dueDate: { type: Date, required: false },
  productOrdered: { type: String, required: true },
  qtyOrdered: { type: Number, required: true },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Paid", "Due", "Overdue"],
    default: "Due",
  },
});

const Sale = mongoose.model("Sale", saleSchema);

// Sample data based on actual sales data
const sampleSales = [
  {
    orderDispatchDate: new Date('2025-01-10'),
    vendorName: 'ABC Agency',
    contact: '+91-9876543210',
    area: 'Takhatpur',
    transport: 'Rishabh Transport',
    totalBillAmount: 7000,
    dueDate: new Date('2025-02-24'),
    productOrdered: '143 Poshan',
    qtyOrdered: 20,
    paymentStatus: 'Due'
  },
  {
    orderDispatchDate: new Date('2025-01-15'),
    vendorName: 'GK Agency',
    contact: '+91-8765432109',
    area: 'Takhatpur',
    transport: 'Rishabh Transport',
    totalBillAmount: 4000,
    dueDate: new Date('2025-03-01'),
    productOrdered: '138 KeetHar',
    qtyOrdered: 10,
    paymentStatus: 'Due'
  },
  {
    orderDispatchDate: new Date('2025-01-30'),
    vendorName: 'KR Krishi Kendra',
    contact: '+91-7654321098',
    area: 'Bhatapara',
    transport: 'MP Transways',
    totalBillAmount: 15000,
    dueDate: new Date('2025-03-16'),
    productOrdered: '123 FasalKavach',
    qtyOrdered: 30,
    paymentStatus: 'Due'
  },
  {
    orderDispatchDate: new Date('2025-02-01'),
    vendorName: 'ABC Agency',
    contact: '+91-9876543210',
    area: 'Takhatpur',
    transport: 'Rishabh Transport',
    totalBillAmount: 3500,
    dueDate: new Date('2025-03-18'),
    productOrdered: '121 BhuRakshak',
    qtyOrdered: 10,
    paymentStatus: 'Due'
  },
  {
    orderDispatchDate: new Date('2025-02-05'),
    vendorName: 'KR Kendra',
    contact: '+91-6543210987',
    area: 'Mungeli',
    transport: 'Mahaveer Transport',
    totalBillAmount: 4000,
    dueDate: new Date('2025-03-22'),
    productOrdered: '117 FasalKavach',
    qtyOrdered: 10,
    paymentStatus: 'Due'
  },
  {
    orderDispatchDate: new Date('2025-02-05'),
    vendorName: 'KR Kendra',
    contact: '+91-6543210987',
    area: 'Mungeli',
    transport: 'Mahaveer Transport',
    totalBillAmount: 7000,
    dueDate: new Date('2025-03-22'),
    productOrdered: '117 Poshan+',
    qtyOrdered: 10,
    paymentStatus: 'Due'
  },
  {
    orderDispatchDate: new Date('2025-02-05'),
    vendorName: 'KR Kendra',
    contact: '+91-6543210987',
    area: 'Mungeli',
    transport: 'Mahaveer Transport',
    totalBillAmount: 14200,
    dueDate: new Date('2025-03-22'),
    productOrdered: '117 KeetHar',
    qtyOrdered: 20,
    paymentStatus: 'Due'
  },
  {
    orderDispatchDate: new Date('2025-02-05'),
    vendorName: 'KR Kendra',
    contact: '+91-6543210987',
    area: 'Mungeli',
    transport: 'Mahaveer Transport',
    totalBillAmount: 15750,
    dueDate: new Date('2025-03-22'),
    productOrdered: '117 KeetNashak+',
    qtyOrdered: 20,
    paymentStatus: 'Due'
  },
  // Additional sample data with different payment statuses
  {
    orderDispatchDate: new Date('2025-01-20'),
    vendorName: 'ABC Agency',
    contact: '+91-9876543210',
    area: 'Takhatpur',
    transport: 'Rishabh Transport',
    totalBillAmount: 8000,
    dueDate: new Date('2025-02-20'),
    productOrdered: '143 Poshan',
    qtyOrdered: 25,
    paymentStatus: 'Paid'
  },
  {
    orderDispatchDate: new Date('2025-01-25'),
    vendorName: 'GK Agency',
    contact: '+91-8765432109',
    area: 'Takhatpur',
    transport: 'Rishabh Transport',
    totalBillAmount: 6000,
    dueDate: new Date('2025-02-25'),
    productOrdered: '138 KeetHar',
    qtyOrdered: 15,
    paymentStatus: 'Overdue'
  },
  {
    orderDispatchDate: new Date('2025-02-10'),
    vendorName: 'KR Krishi Kendra',
    contact: '+91-7654321098',
    area: 'Bhatapara',
    transport: 'MP Transways',
    totalBillAmount: 12000,
    dueDate: new Date('2025-03-10'),
    productOrdered: '123 FasalKavach',
    qtyOrdered: 25,
    paymentStatus: 'Paid'
  },
  {
    orderDispatchDate: new Date('2025-02-15'),
    vendorName: 'ABC Agency',
    contact: '+91-9876543210',
    area: 'Takhatpur',
    transport: 'Rishabh Transport',
    totalBillAmount: 4500,
    dueDate: new Date('2025-03-15'),
    productOrdered: '121 BhuRakshak',
    qtyOrdered: 12,
    paymentStatus: 'Due'
  }
];

// Function to insert sample data
async function insertSampleData() {
  try {
    // Clear existing data
    await Sale.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample data
    const result = await Sale.insertMany(sampleSales);
    console.log(`Successfully inserted ${result.length} sample sales records`);

    // Display summary
    const totalRevenue = result.reduce((sum, sale) => sum + sale.totalBillAmount, 0);
    const totalProducts = result.reduce((sum, sale) => sum + sale.qtyOrdered, 0);
    const uniqueVendors = new Set(result.map(sale => sale.vendorName)).size;
    const uniqueAreas = new Set(result.map(sale => sale.area)).size;

    console.log('\n=== Sample Data Summary ===');
    console.log(`Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
    console.log(`Total Products Sold: ${totalProducts.toLocaleString()}`);
    console.log(`Unique Vendors: ${uniqueVendors}`);
    console.log(`Areas Covered: ${uniqueAreas}`);

    // Display product breakdown
    const productBreakdown = result.reduce((acc, sale) => {
      acc[sale.productOrdered] = (acc[sale.productOrdered] || 0) + sale.qtyOrdered;
      return acc;
    }, {});

    console.log('\n=== Product Breakdown ===');
    Object.entries(productBreakdown).forEach(([product, qty]) => {
      console.log(`${product}: ${qty} units`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed. You can now run the application!');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    mongoose.connection.close();
  }
}

// Run the script
insertSampleData();
