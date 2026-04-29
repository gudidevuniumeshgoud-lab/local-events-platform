# 📌 Local Events Platform

A full-stack web application that allows users to discover, create, and
manage local events. It includes secure authentication, event
management, and user interaction features powered by a RESTful backend.

------------------------------------------------------------------------

## 🚀 Overview

This project follows a client-server architecture: - Frontend handles
UI - Backend manages APIs and logic - MongoDB stores data

------------------------------------------------------------------------

## ✨ Features

-   User Authentication (Register & Login)
-   Create, Edit, Delete Events
-   Browse Events
-   Messaging System
-   Secure APIs using JWT

------------------------------------------------------------------------

## 🏗️ Tech Stack

Frontend: HTML, CSS, JavaScript\
Backend: Node.js, Express.js\
Database: MongoDB (Mongoose)

------------------------------------------------------------------------

## 📂 Project Structure

project-root/ backend/ → models, routes, controllers, middleware\
frontend/ → UI files\
.env → environment variables

------------------------------------------------------------------------

## ⚙️ Setup

1.  Clone repo\
2.  Install dependencies: npm install\
3.  Add .env file:

MONGO_URI=your_mongodb_connection_string\
JWT_SECRET=your_secret\
PORT=5000

4.  Run backend: npm start\
5.  Open frontend in browser

------------------------------------------------------------------------

## 🔗 API Endpoints

Auth: POST /api/auth/register\
POST /api/auth/login

Events: GET /api/events\
POST /api/events\
PUT /api/events/:id\
DELETE /api/events/:id

Messages: POST /api/messages\
GET /api/messages

------------------------------------------------------------------------

## 🔄 Working Flow

1.  User interacts with frontend\
2.  Request sent to backend\
3.  Backend processes logic\
4.  Database accessed\
5.  Response returned\
6.  UI updates

------------------------------------------------------------------------

## 🔐 Authentication

JWT-based authentication ensures secure access to protected routes.

------------------------------------------------------------------------

## 📌 Highlights

-   REST API architecture\
-   Secure authentication\
-   Modular backend design

------------------------------------------------------------------------

## 👨‍💻 Author

Gudidevuni Umesh
