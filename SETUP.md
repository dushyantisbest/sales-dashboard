# Sales Dashboard Setup Guide

## Quick Setup Instructions

### Option 1: Local MongoDB Setup (Recommended)

1. **Start MongoDB locally:**

   ```bash
   # Create data directory (if it doesn't exist)
   mkdir -p C:\data\db

   # Start MongoDB
   mongod --dbpath "C:\data\db" --port 27017
   ```

2. **In a new terminal, populate the database:**

   ```bash
   npm run sample-data
   ```

3. **Start the application:**

   ```bash
   npm start
   ```

4. **Access the dashboard:**
   Open your browser and go to: `http://localhost:3000`

### Option 2: MongoDB Atlas (Cloud Database)

If you prefer to use MongoDB Atlas (free cloud database):

1. **Sign up for MongoDB Atlas:**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster
   - Get your connection string

2. **Update your .env file:**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salesData?retryWrites=true&w=majority
   ```

3. **Populate the database:**

   ```bash
   npm run sample-data
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

## Troubleshooting

### MongoDB Connection Issues

If you get connection errors:

1. **Check if MongoDB is running:**

   ```bash
   netstat -ano | findstr :27017
   ```

2. **Start MongoDB as a Windows service:**

   ```bash
   net start MongoDB
   ```

3. **Or start manually:**
   ```bash
   mongod --dbpath "C:\data\db" --port 27017
   ```

### Port Already in Use

If port 3000 is already in use:

1. **Change the port in .env:**

   ```env
   PORT=3001
   ```

2. **Or kill the process using port 3000:**
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

## Sample Data

The application comes with sample data based on your actual sales records:

**Products:**

- 143 Poshan
- 138 KeetHar
- 123 FasalKavach
- 121 BhuRakshak
- 117 FasalKavach
- 117 Poshan+
- 117 KeetHar
- 117 KeetNashak+

**Areas:**

- Takhatpur
- Bhatapara
- Mungeli

**Vendors:**

- ABC Agency
- GK Agency
- KR Krishi Kendra
- KR Kendra

**Transport:**

- Rishabh Transport
- MP Transways
- Mahaveer Transport

## Features Available

- 📊 Interactive dashboard with charts
- 🔍 Filter by area, product, and transport
- 📝 Add, edit, and delete sales records
- 💰 Payment status tracking
- 📱 Responsive design

## Support

If you encounter any issues, please check:

1. MongoDB is running and accessible
2. All dependencies are installed (`npm install`)
3. Environment variables are set correctly
4. Port 3000 is available
