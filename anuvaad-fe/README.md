# Anuvaad FE

Project Setup Guide: Anuvaad Web Application

Introduction
Welcome to the project setup guide for the Anuvaad Web Application. This document will walk you through the process of setting up the development environment and getting the application up and running on your local machine.

Prerequisites
Before you begin, ensure you have the following prerequisites installed on your system:
• Node.js (version 12.x or higher)
• npm (Node Package Manager) or Yarn
• Git

Installation Steps
Follow these steps to set up the Anuvaad Web Application on your local machine:

1. Clone the Repository:
git clone https://github.com/project-anuvaad/anuvaad.git

2. Navigate to the Project Directory:
cd anuvaad/anuvaad-fe/anuvaad-webapp-webapp

3. Install Dependencies:
npm install
or
yarn install

4. Environment Variables:
Create a .env file in the root directory of the project and configure the necessary environment variables. You can use the .env.example file as a reference.

5. Start the Development Server:
npm start
or
yarn start

6. Access the Application:
Once the development server is started, you can access the application by navigating to http://localhost:3000 in your web browser.

Additional Commands
• Build the Application:
npm run build
or
yarn build

• Run Tests:
npm test
or
yarn test