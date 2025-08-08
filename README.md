# Sales Dashboard

A comprehensive sales and vendor analysis dashboard built with Node.js, Express, MongoDB, and EJS.

## Features

- 📊 **Interactive Dashboard** with key metrics and charts
- 📈 **Data Visualization** using Chart.js
- 🔍 **Advanced Filtering** by area, product, and transport
- 📝 **CRUD Operations** for sales records
- 💰 **Payment Status Tracking** (Paid, Due, Overdue)
- 📱 **Responsive Design** for all devices
- 🎨 **Modern UI** with clean styling

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** (comes with Node.js)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sales-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env` (if available)
   - Or create a `.env` file with the following variables:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/salesData
   NODE_ENV=development
   ```

4. **Start MongoDB**

   - If using local MongoDB:

     ```bash
     # On Windows
     net start MongoDB

     # On macOS/Linux
     sudo systemctl start mongod
     ```

   - Or use MongoDB Atlas (cloud service)

5. **Run the application**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and go to: `http://localhost:3000`

## Project Structure

```
sales-dashboard/
├── public/
│   └── css/
│       └── style.css          # Main stylesheet
├── views/
│   ├── dashboard.ejs          # Main dashboard view
│   └── add-edit-sale.ejs      # Add/Edit sale form
├── server.js                  # Main server file
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## Database Schema

The application uses MongoDB with the following schema:

```javascript
{
  orderDispatchDate: Date,     // When the order was dispatched
  vendorName: String,          // Name of the vendor
  contact: String,             // Vendor contact information
  area: String,                // Geographic area
  transport: String,           // Transportation method
  productOrdered: String,      // Product name
  qtyOrdered: Number,          // Quantity ordered
  totalBillAmount: Number,     // Total bill amount in INR
  dueDate: Date,               // Payment due date
  paymentStatus: String        // Paid, Due, or Overdue
}
```

## API Endpoints

- `GET /` - Main dashboard with filters
- `GET /add` - Show add sale form
- `POST /add` - Create new sale
- `GET /edit/:id` - Show edit sale form
- `POST /edit/:id` - Update existing sale
- `POST /delete/:id` - Delete sale

## Features in Detail

### Dashboard Metrics

- Total Bill Amount
- Total Products Sold
- Total Unique Vendors
- Areas Covered

### Charts

- **Products Sold by Area**: Bar chart showing quantity sold per area
- **Vendors by Area**: Doughnut chart showing vendor distribution

### Filtering

- Filter by Area
- Filter by Product
- Filter by Transport
- Reset filters option

### Data Management

- Add new sales records
- Edit existing records
- Delete records with confirmation
- Payment status tracking

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **Styling**: Custom CSS with CSS Grid and Flexbox

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

**Dushyant Kumar** - iAvenue Labs

## Support

For support and questions, please contact the development team.
