🚗 Parking Slot Finder
📌 Description

Parking Slot Finder is a full-stack web application that allows users to search, book, and pay for parking slots easily.
It is built using the MERN stack and includes both user and admin functionalities.

🧑‍💻 Features
👤 User
Search parking slots
View parking locations
Select vehicle type (2W / 4W / Bus)
Choose booking time
Add extra services
Make payment using Razorpay
View booking history
🛠️ Admin
Manage users
Add / edit / delete parking slots
View bookings
Confirm / cancel bookings
View feedback
💳 Payment System
Razorpay integration
Order creation
Payment verification using HMAC SHA256
Booking stored after successful payment
🧠 Concepts Used
JWT Authentication
REST APIs
Role-based access (User/Admin)
Dynamic pricing
Payment security
🛠️ Tech Stack
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Payment: Razorpay
Maps: Leaflet
📂 Project Structure

backend/
frontend/
└── src/
├── pages/
├── components/

⚙️ How to Run
Backend
Go to backend folder
Run:
npm install
npm start
Frontend
Go to frontend folder
Run:
npm install
npm start
🔐 Environment Variables

Create .env in backend:

PORT=5000
MONGO_URI=your_mongo_url
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
JWT_SECRET=your_secret

📌 Note
Razorpay is used in test mode
Data is stored in MongoDB
Project runs on localhost
👩‍💻 Author

Janhvi Ghuikar