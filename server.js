require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- Database Connection ---
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/salesData";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// --- Mongoose Schema & Model (Updated based on Excel) ---
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

// --- Routes ---

// Main Dashboard (Read)
app.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.query.area && req.query.area !== "all") {
      query.area = req.query.area;
    }
    if (req.query.product && req.query.product !== "all") {
      query.productOrdered = req.query.product;
    }
    if (req.query.transport && req.query.transport !== "all") {
      query.transport = req.query.transport;
    }
    if (req.query.paymentStatus && req.query.paymentStatus !== "all") {
      query.paymentStatus = req.query.paymentStatus;
    }

    // Date range filtering
    if (req.query.startDate && req.query.startDate !== "") {
      query.orderDispatchDate = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate && req.query.endDate !== "") {
      if (query.orderDispatchDate) {
        query.orderDispatchDate.$lte = new Date(req.query.endDate);
      } else {
        query.orderDispatchDate = { $lte: new Date(req.query.endDate) };
      }
    }

    const sales = await Sale.find(query).sort({ orderDispatchDate: -1 });
    const allSalesForFilters = await Sale.find({}); // Get all for populating filters

    // Automatically update overdue payments
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    for (let sale of sales) {
      if (sale.paymentStatus === "Due" && sale.dueDate) {
        const dueDate = new Date(sale.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          // Update the payment status to overdue
          await Sale.findByIdAndUpdate(sale._id, { paymentStatus: "Overdue" });
          sale.paymentStatus = "Overdue";
        }
      }
    }

    // Calculate metrics from the filtered data
    const totalRevenue = sales.reduce(
      (sum, item) => sum + item.totalBillAmount,
      0
    );
    const totalProductsSold = sales.reduce(
      (sum, item) => sum + item.qtyOrdered,
      0
    );
    const uniqueVendors = new Set(sales.map((item) => item.vendorName)).size;
    const uniqueAreasCovered = new Set(sales.map((item) => item.area)).size;

    // Calculate overdue days for each sale

    sales.forEach((sale) => {
      if (sale.paymentStatus === "Overdue" && sale.dueDate) {
        const dueDate = new Date(sale.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = today - dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        sale.overdueDays = diffDays;
      } else {
        sale.overdueDays = 0;
      }
    });

    // Data for charts
    const salesByArea = sales.reduce((acc, item) => {
      acc[item.area] = (acc[item.area] || 0) + item.qtyOrdered;
      return acc;
    }, {});

    const vendorsByArea = sales.reduce((acc, item) => {
      if (!acc[item.area]) acc[item.area] = new Set();
      acc[item.area].add(item.vendorName);
      return acc;
    }, {});
    const vendorsByAreaCount = Object.keys(vendorsByArea).reduce(
      (acc, area) => {
        acc[area] = vendorsByArea[area].size;
        return acc;
      },
      {}
    );

    // Data for filters
    const areas = [...new Set(allSalesForFilters.map((item) => item.area))];
    const products = [
      ...new Set(allSalesForFilters.map((item) => item.productOrdered)),
    ];
    const transports = [
      ...new Set(allSalesForFilters.map((item) => item.transport)),
    ];

    res.render("dashboard", {
      sales: sales,
      totalRevenue,
      totalProductsSold,
      uniqueVendors,
      uniqueAreasCovered,
      salesByArea: salesByArea,
      vendorsByArea: vendorsByAreaCount,
      areas,
      products,
      transports,
      currentFilters: req.query,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Show Add Sale Form
app.get("/add", async (req, res) => {
  try {
    // Get all unique products from existing sales
    const allSales = await Sale.find({});
    const products = [...new Set(allSales.map((item) => item.productOrdered))];

    res.render("add-edit-sale", {
      title: "Add New Sale",
      action: "/add",
      sale: null,
      products: products,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Add New Sale (Create)
app.post("/add", async (req, res) => {
  try {
    const newSale = new Sale({
      orderDispatchDate: req.body.orderDispatchDate,
      vendorName: req.body.vendorName,
      contact: req.body.contact,
      area: req.body.area,
      transport: req.body.transport,
      productOrdered: req.body.productOrdered,
      qtyOrdered: req.body.qtyOrdered,
      totalBillAmount: req.body.totalBillAmount,
      dueDate: req.body.dueDate,
      paymentStatus: req.body.paymentStatus,
    });
    await newSale.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error adding sale");
  }
});

// Show Edit Sale Form
app.get("/edit/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).send("Sale not found");

    // Get all unique products from existing sales
    const allSales = await Sale.find({});
    const products = [...new Set(allSales.map((item) => item.productOrdered))];

    res.render("add-edit-sale", {
      title: "Edit Sale",
      action: `/edit/${sale._id}`,
      sale: sale,
      products: products,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update Sale (Update)
app.post("/edit/:id", async (req, res) => {
  try {
    // Find the sale and update it with the new data from the form
    await Sale.findByIdAndUpdate(req.params.id, {
      orderDispatchDate: req.body.orderDispatchDate,
      vendorName: req.body.vendorName,
      contact: req.body.contact,
      area: req.body.area,
      transport: req.body.transport,
      productOrdered: req.body.productOrdered,
      qtyOrdered: req.body.qtyOrdered,
      totalBillAmount: req.body.totalBillAmount,
      dueDate: req.body.dueDate,
      paymentStatus: req.body.paymentStatus,
    });
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error updating sale");
  }
});

// Delete Sale (Delete)
app.post("/delete/:id", async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting sale");
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
