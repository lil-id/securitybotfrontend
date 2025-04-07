# ✨ Morning Star (Monsta) Frontend

This is the frontend application for the **Morning Star (Monsta)** project, built with **React** and **Vite**. The application provides a user-friendly interface for monitoring Wazuh alerts, and viewing alert summaries.

## 🧭 Features

- **📊 Dashboard**: View detailed Wazuh alerts for specific IP addresses.
- **📋 Alerts Summary**: Summarized view of triggered alerts grouped by IP address.
- **🔍 Search Functionality**: Search alerts by IP address.
- **🔒 Authentication**: Secure access with token-based authentication.

## 🛠️ Tech Stack

- **⚛️ React**: Frontend library for building user interfaces.
- **⚡ Vite**: Fast build tool for modern web projects.
- **🎨 Tailwind CSS**: Utility-first CSS framework for styling.
- **📡 Axios**: HTTP client for API requests.
- **🛣️ React Router**: For navigation and routing.

## 🚀 Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/securitybotfrontend.git
   ```
   `cd securitybotfrontend`
2. Install dependencies:
   `npm install`

3. Create a .env file in the root directory and configure the following environment variables:

   `VITE_API_URL=http://localhost:3001`

4. Start the development server:
   `npm run dev`

5. Open the application in your browser at http://localhost:5173.

## 📜 Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for - production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint to check for code issues.

## 📂 Folder Structure
```
securitybotfrontend/
├── public/                # Static assets
├── src/
│   ├── components/        # React components (Dashboard, Summary, etc.)
│   ├── styles/            # Global styles
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind CSS configuration
├── .env                   # Environment variables
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## 🌐 API Endpoints
The application communicates with the backend through the following API endpoints:

- GET `/api/v1/wazuh/alerts/:ip`: Fetch alerts for a specific IP address.
- GET `/api/v1/wazuh/alerts/summary`: Fetch summarized alerts grouped by IP address.

## 🤝 Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:
`git checkout -b feature-name`
3. Make your changes and commit them:
`git commit -m "Add feature-name"`
4. Push to your branch:
`git push origin feature-name`
5. Open a pull request.

## 📜 License
This project is licensed under the MIT License.

- 🙏 Acknowledgments
- ⚛️ React
- ⚡ Vite
- 🎨 Tailwind CSS
- 📡 Axios
- 🛣️ React Router
