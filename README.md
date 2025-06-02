# Web Crawler Dashboard

A full-stack, responsive web application that crawls any given website, analyzes internal link structures, and visualizes crawl statistics with interactive dashboards and downloadable PDF reports. Built using React, Tailwind CSS, Node.js, MongoDB, and a custom recursive crawler.

---

## 🚀 Features

- 🔍 **URL Crawling**: Input a website and crawl its internal links recursively.
- 📊 **Link Statistics**: Displays total links, total hits, most visited pages.
- 📁 **Downloadable Reports**: Generate and download styled PDF reports of crawl data.
- 🧾 **History Page**: View crawl history grouped by base URLs.
- 📱 **Responsive Design**: Fully functional on desktop and mobile.
- 🔐 **Authentication**: Login and Signup pages with OAuth-ready structure.
- ⏹️ **Stop Crawl**: Interrupt crawling in real time.
- 📂 **MongoDB Storage**: Persists base URLs and crawl metadata.

---

## 🛠️ Tech Stack

| Frontend       | Backend       | Other         |
|----------------|----------------|----------------|
| React (Vite/CRA) | Node.js (Express) | MongoDB Atlas |
| Tailwind CSS   | REST API       | jsdom          |
| React-PDF      | Mongoose       | OAuth-ready    |
| LocalStorage   | CORS Config    | PDF Reports    |

---

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/9b1d95bf-259c-48db-8738-9c3fc29908bd)
![image](https://github.com/user-attachments/assets/5790b330-f2f7-4e4a-a1db-198697bb5463)
![image](https://github.com/user-attachments/assets/3ae74c7e-651e-48ae-935f-fb288d4b602e)

---


## 📦 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/web-crawler-dashboard.git
cd web-crawler-dashboard
2. Install Dependencies
bash
Copy
Edit

npm install

# Backend
cd ../backend
npm install
3. Environment Setup
Create a .env file in /backend/:

env
Copy
Edit
PORT=5000
MONGO_URI=your-mongodb-connection-url
4. Run the App
bash
Copy
Edit
# Start backend
cd backend
npm run dev

# Start frontend

npm start
App will be available at http://localhost:3000.

📝 Report Export Example
Users can download a visually styled PDF report with:

Most visited link

Total crawl stats

Insights on success/error status

Top 15 crawled links (with hit counts and status codes)

Generated using @react-pdf/renderer.

🔐 Authentication
Includes fully responsive Login and Signup pages

Ready to integrate with Google OAuth or backend session/JWT auth

Current version uses dummy form handlers

🧠 Design Decisions
Crawler runs recursively with domain restriction

MongoDB stores crawl data per base URL (not per individual link)

History is grouped by crawl sessions

Frontend separates logic into modular components



🧑‍💻 Author
Made with 💻 by Vishwanath

GitHub: @Vishwa5395

LinkedIn: (https://www.linkedin.com/in/vishwanath-tiwari-779528287/)
