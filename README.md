# 🚗 Vehicle Rental System – Backend Server
A scalable and secure Car Rental Management REST API built with Node.js, Express, TypeScript, and PostgreSQL.

This system allows customers to rent vehicles and admins to manage vehicles, bookings, and users efficiently.

## 📌 Project Overview
The Vehicle Rental System is a backend application designed to manage:

- User authentication & authorization
- Vehicle inventory
- Booking operations
- Admin management controls
- Secure and scalable API architecture

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)

---

## ✨ Features
👤 Authentication & Authorization

- User Registration
- Login with JWT Authentication
- Password hashing using bcrypt
- Role-based access:
   - Admin
   - Customer
- Protected routes middleware
---

## 🚘 Vehicle Management
Admin can:
- Add new vehicles
- Update vehicle details
- Delete vehicles
- Mark vehicle availability
- View all vehicles
---

## 📅 Booking Management
Customer can:
- Create booking
- Cancel booking
- View own bookings
  
Admin can:
- View all bookings
- Update booking status
   - active
   - returned
   - cancelled
- Mark vehicle as returned
- Prevent double booking logic

---

## 📡 API Endpoints
Auth:
- **POST**  `api/v1/auth/signup`
- **POST**  `api/v1/auth/signin`

Users:
- **GET**  `api/v1/users`
- **PUT**  `api/v1/users/:userId`
- **DELETE**  `api/v1/users/:userId`

Vehicles:
- **POST**  `api/v1/vehicles`
- **GET**  `api/v1/vehicles`
- **GET**  `api/v1/vehicles/:vehicleId`
- **PUT**  `api/v1/vehicles/:vehicleId`
- **DELETE**  `api/v1/vehicles/:vehicleId`

Bookings:
- **POST**  `api/v1/bookings`
- **GET**  `api/v1/bookings`
- **PUT**  `api/v1/bookings/:bookingId`

---

## User Credentials
Admin: 
```
 User Email: habib@gmail.com
 User Password: 12345
```
  
Customer: 
```
 User Email: rahim@gmail.com
 User Password: 12345
```

**Live Link**: https://l2-assignment02.vercel.app<br>
**Github Repo Link**: https://github.com/ALHriday/car_rental_management_server<br>


## 👨‍💻 Author
### Alauddin Hriday
Passionate Full Stack Developer<br>
Focused on scalable backend architecture & clean code.