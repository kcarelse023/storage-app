📦 Storage Rental App
A serverless web application for renting storage units. Built with a React frontend and powered by AWS services for scalable, secure, and low-maintenance backend infrastructure.

🚀 Features
- Admins can:

 - Create and manage storage units

- Users can:

 - Browse and rent available storage units

🛠 Tech Stack
Frontend
- React with Vite

Hosted as a static site via AWS CloudFront

Backend
- AWS Lambda for serverless business logic

- AWS DynamoDB (NoSQL) for storage unit and user data

- AWS Cognito for authentication (admin & user roles)

- AWS S3 for file storage (e.g. images of storage units)

🌐 Deployment
- This project is fully hosted on Amazon Web Services using a serverless architecture.

📁 Project Structure (High-Level)

- /frontend       → React + Vite app (static site)
- /backend        → Lambda functions (API logic)
- /infrastructure → IaC / deployment scripts (optional)
- /README.md
🧪 Getting Started
Clone the repo:

git clone https://github.com/yourusername/storage-rental-app.git
Install frontend dependencies:

cd frontend
npm install
Start the dev server:

npm run dev
⚠️ To run backend locally or deploy, ensure you have AWS CLI set up and configured with appropriate permissions.

📌 Notes
Make sure to configure Cognito with correct user roles (admin, user)

Storage units and user info are stored in DynamoDB

All API calls from the frontend are handled through API Gateway + Lambda
