@echo off
echo Setting up MongoDB for Sales Dashboard...
echo.

echo Creating data directory...
if not exist "C:\data\db" mkdir "C:\data\db"

echo Starting MongoDB...
echo Please wait while MongoDB starts...
start /B mongod --dbpath "C:\data\db" --port 27017

echo Waiting for MongoDB to start...
timeout /t 5 /nobreak > nul

echo MongoDB should now be running on localhost:27017
echo.
echo You can now run the following commands:
echo 1. npm run sample-data    (to populate with sample data)
echo 2. npm start             (to start the application)
echo.
pause
