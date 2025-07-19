# Feedback AI Platform

A MERN-based feedback form builder that allows admins to create forms, collect user responses, and download results in CSV format. Built with clean UI, secure login, and public access forms.

---

##  Demo Access (Hosted)

You can use the platform directly here:

- 🌐 **Frontend:** https://feedback-ai-platform.vercel.app  
- 🔧 **Backend API:** https://feedback-ai-platform.onrender.com

> **Admin login credentials**  
> 📧 Email: `testuser@local.com`  
> 🔐 Password: `test12345`

---

##  Features

- 👤 Admin registration and login (JWT secured)
- 🧾 Create feedback forms with MCQ and text questions
- 🌐 Public form sharing via URL
- 📥 CSV export of responses
- 🎯 Dashboard to view submitted responses

---

## 🛠 Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | React (Vite) + Tailwind CSS   |
| Backend     | Node.js + Express             |
| Database    | MongoDB + Mongoose            |
| Auth        | JWT, bcrypt.js                |
| CSV Export  | json2csv                      |

---

##  Setup Locally

### Clone the repo
git clone https://github.com/dikshantjiwani/feedback-ai-platform.git
cd feedback-ai-platform

###  Backend Setup

1. Navigate to the backend folder:
   cd server
2. npm install
3.Create a .env file inside server/ with the following content:
  MONGO_URI=mongodb+srv://sample:sample123@feedback.v8nryf7.mongodb.net/?retryWrites=true&w=majority&appName=feedback
  JWT_SECRET=your_jwt_secret_here  (example: 87055e741eb941d94fe48fb57127586d062d1cb233e3d56ca42a79fe32ea6c3dcb3806aa6a7762b1d62718192215c4c94cb85979da802cdaa47d50c06549c455)
  PORT=5000
4. Start the backend server:
  npm start  (The backend API will run at: http://localhost:5000)

### Frontend Setup

1. Navigate to the frontend folder:
   cd client
2. Install dependencies:
  npm install
3. Create a .env file inside client/ with the following:
  VITE_API_BASE_URL=http://localhost:5000/api
4. Start the frontend development server:
  npm run dev

**Open the app in your browser at: http://localhost:5173**
