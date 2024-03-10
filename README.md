Node.js Backend with Express and Firebase Authentication

This repository contains a Node.js backend application built using Express.js and JWT Authentication with Firebase Database. The backend provides secure endpoints for user authentication and authorization using JSON Web Tokens (JWT).

Features
User registration: Allows users to register using email and password.
User authentication: Provides endpoints for user login and logout.
JSON Web Tokens (JWT): Implements JWT for secure authentication and authorization.
Firebase Integration: Utilizes Firebase database for user data management.
Prerequisites
Before running this application, you need to have the following installed:

Node.js
npm (Node Package Manager)
Firebase Admin SDK credentials (service account JSON file)

Installation
Clone this repository to your local machine:

git clone https://github.com/yourusername/your-repo.git
Navigate into the project directory:

cd your-repo
Install dependencies using npm:

npm install
Place your Firebase Admin SDK service account JSON file in the config directory.

Configure Firebase settings in config/firebase.js.

Usage
Start the server:

npm start
The server should now be running at http://localhost:3001.

You can use tools like Postman or curl to interact with the endpoints.
