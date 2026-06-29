🚗 Parking Slot Finder
A Modern Smart Parking Management System
A complete MERN Stack solution for discovering, reserving, and managing parking spaces with secure payments, AI assistance, QR-based access, and comprehensive administrative controls.

<div align="center">
https://img.shields.io/badge/React-18-blue?logo=react&style=flat-square
https://img.shields.io/badge/Node.js-Express-green?logo=node.js&style=flat-square
https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb&style=flat-square
https://img.shields.io/badge/Payment-Razorpay-blue?style=flat-square
https://img.shields.io/badge/Email-Brevo-success?style=flat-square
https://img.shields.io/badge/AI-Google%2520Gemini-purple?style=flat-square
https://img.shields.io/badge/License-MIT-yellow?style=flat-square
https://img.shields.io/github/stars/Janhvi7105/parking-slot-finder?style=social
https://img.shields.io/github/forks/Janhvi7105/parking-slot-finder?style=social

</div>
📈 Project Highlights
<div align="center">
✅ MERN Stack	✅ JWT Authentication	✅ Razorpay Integration
✅ Google Gemini AI	✅ Interactive Maps	✅ QR Code Entry/Exit
✅ PDF Receipts	✅ Email Notifications	✅ Responsive UI
✅ Admin Dashboard	✅ Production Deployment	✅ Real-time Booking
</div>
🌐 Live Demo
Platform	Link
Live Application	parking-slot-finder-ruddy.vercel.app
GitHub Repository	github.com/Janhvi7105/parking-slot-finder
📸 Application Preview
🏠 Home Page
https://screenshots/home.png

👤 User Dashboard
https://screenshots/user-dashboard.png

🗺️ Search Parking
https://screenshots/search-parking.png

🤖 AI Assistant
https://screenshots/chatbot.png

👨‍💼 Admin Dashboard
https://screenshots/admin-dashboard.png

🅿️ Manage Parking
https://screenshots/manage-parking.png

📋 Reservations
https://screenshots/reservations.png

📖 Booking History
https://screenshots/booking-history.png

📖 Project Overview
Parking Slot Finder is a full-stack MERN application designed to revolutionize urban parking management. The platform enables users to discover nearby parking spaces, reserve them instantly, complete secure online payments, and access parking via QR-based verification—all within a seamless, intuitive interface.

The system also features a comprehensive Admin Dashboard for real-time management of parking slots, reservations, users, and parking operations, making it an all-in-one solution for modern parking infrastructure.

💡 This project demonstrates practical integration of real-world technologies, including payment gateways, AI assistance, interactive maps, PDF generation, QR codes, email automation, JWT authentication, and full-stack deployment.

🎯 Problem Statement & Solution
The Problem
Finding available parking in urban areas is frustrating, time-consuming, and often leads to traffic congestion and environmental pollution.

Our Solution
Parking Slot Finder provides a centralized digital platform where users can:

🔍 Search nearby parking locations in real-time

📱 Reserve parking slots instantly from any device

💳 Pay securely online with Razorpay

✅ Access parking using QR-based verification

📧 Receive PDF receipts and email confirmations

✨ Key Features
👤 User Features
Feature	Description
🔐 Authentication	Secure JWT-based registration, login, and profile management with password encryption (bcrypt)
🗺️ Smart Search	Interactive map view with nearby parking discovery and location-based search
🚗 Instant Booking	Reserve parking slots with vehicle type selection and real-time availability
💳 Secure Payments	Powered by Razorpay payment gateway with instant confirmation
📄 PDF Receipts	Auto-generated receipts with QR codes, booking details, and download option
📧 Email Notifications	Automated confirmations with PDF attachments via Brevo Email API
📱 QR Access	Unique QR codes for each booking enabling entry/exit verification
🤖 AI Assistant	Google Gemini-powered chatbot for parking queries and assistance
⭐ Feedback System	Rate and review parking experiences to help others
👨‍💼 Admin Features
Feature	Description
📊 Dashboard	Real-time statistics and analytics for parking operations
🅿️ Slot Management	Add, edit, and delete parking spaces with location mapping
📋 Reservation Control	View, confirm, or cancel user bookings
👥 User Management	Monitor and manage registered users
📱 QR Verification	Scan QR codes for entry/exit validation
⭐ Feedback Monitoring	Track and respond to user reviews and ratings
🔄 Application Workflow











🛠️ Technology Stack
Frontend
Technology	Purpose
React.js	UI library for building interactive interfaces
Leaflet	Interactive map rendering and location display
Axios	HTTP client for API communication
React Router	Client-side routing and navigation
CSS3	Custom styling with responsive design
Backend
Technology	Purpose
Node.js + Express.js	Server-side framework and API development
MongoDB Atlas	Cloud-based NoSQL database
JWT + bcryptjs	Authentication and password security
Razorpay	Payment gateway integration
Google Gemini AI	Intelligent chatbot assistance
PDFKit	PDF receipt generation
QRCode	QR code generation for bookings
Brevo Email API	Automated email notifications
Multer	File upload handling
DevOps & Deployment
Service	Purpose
Vercel	Frontend hosting and deployment
Render	Backend hosting and API deployment
MongoDB Atlas	Database hosting and management
Environment Variables	Secure configuration management
🏗️ Architecture Overview
text
parking-slot-finder/
│
├── backend/
│   ├── config/          # Environment configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication & validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   └── server.js        # Application entry point
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application views
│   │   ├── services/    # API services
│   │   └── App.js       # Root component
│
├── screenshots/         # Application previews
├── README.md            # Documentation
└── package.json         # Dependencies
📦 Installation Guide
Prerequisites
Node.js (v14+)

MongoDB Atlas Account

Razorpay Account

Brevo Account

Google Gemini API Key

1. Clone the Repository
bash
git clone https://github.com/Janhvi7105/parking-slot-finder.git
cd parking-slot-finder
2. Backend Setup
bash
cd backend
npm install
Create .env file in the backend directory:

env
PORT=5000
MONGO_URI=YOUR_MONGO_URI
JWT_SECRET=YOUR_SECRET
RAZORPAY_KEY_ID=YOUR_KEY
RAZORPAY_KEY_SECRET=YOUR_SECRET
BREVO_API_KEY=YOUR_API_KEY
EMAIL_FROM=YOUR_EMAIL
GEMINI_API_KEY=YOUR_API_KEY
Run the backend:

bash
npm run dev
3. Frontend Setup
bash
cd frontend
npm install
npm start
The application will be available at http://localhost:3000

🚀 Deployment Guide
Service	Platform	Resource
Frontend	Vercel	vercel.com
Backend	Render	render.com
Database	MongoDB Atlas	mongodb.com
Payments	Razorpay	razorpay.com
Email	Brevo	brevo.com
AI	Google Gemini	ai.google.dev
📌 Learning Outcomes
This project demonstrates proficiency in:

✅ MERN Stack Development — Full-stack application architecture

✅ REST API Development — Structured endpoint design and implementation

✅ MongoDB Integration — Database schema design and CRUD operations

✅ JWT Authentication — Secure user authentication and authorization

✅ Payment Gateway Integration — Razorpay payment processing

✅ AI Integration — Google Gemini chatbot implementation

✅ QR Code Generation — Unique QR codes for verification

✅ PDF Generation — Automated receipt creation

✅ Email Automation — Brevo API for notifications

✅ Interactive Maps — Leaflet for location-based services

✅ Admin Dashboard Development — Real-time monitoring and management

✅ Responsive UI Design — Mobile-first approach

✅ Environment Management — Secure configuration handling

✅ Full-Stack Deployment — Vercel + Render + MongoDB Atlas

🚀 Future Enhancements
Feature	Description
🗺️ Live Availability	Real-time slot availability monitoring
📍 GPS Navigation	Turn-by-turn navigation to parking spots
📱 Mobile App	Native iOS/Android application
🏢 Multi-Level Support	Support for multi-story parking complexes
🤖 AI Recommendations	Smart parking suggestions based on patterns
💎 Subscription Plans	Premium membership options
📈 Analytics Dashboard	Advanced analytics and insights
🔔 Push Notifications	Real-time alerts and reminders
🌙 Dark Mode	Enhanced visual experience
🎯 Conclusion
Parking Slot Finder successfully demonstrates the implementation of a complete smart parking reservation system by integrating:

🔐 Secure authentication with JWT

💳 Payment processing with Razorpay

📱 QR-based verification for access control

🤖 AI-powered assistance with Google Gemini

🗺️ Interactive maps with Leaflet

📄 PDF generation for receipts

📧 Email automation with Brevo

👨‍💼 Comprehensive admin dashboard

This project serves as a practical demonstration of integrating multiple real-world technologies into a scalable, production-ready MERN stack application.