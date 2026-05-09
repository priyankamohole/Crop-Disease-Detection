# CropCare AI - Crop Disease Detection

CropCare AI is a full-stack web application designed to help farmers and researchers identify crop diseases from images. Using machine learning, it provides accurate predictions and generates detailed health reports.

## 🚀 Features

- **AI-Powered Analysis**: Detects diseases in crops (e.g., Potato) using deep learning models (TensorFlow).
- **Comprehensive Reports**: Generates downloadable PDF reports with diagnosis and treatment recommendations.
- **Modern UI**: Fast and responsive interface built with React, Vite, and Tailwind CSS.
- **Scalable Backend**: Robust API built with FastAPI and SQLAlchemy.

## 🛠️ Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Machine Learning**: [TensorFlow](https://www.tensorflow.org/), NumPy, Scikit-learn
- **Database**: SQLAlchemy (SQLite/PostgreSQL compatible)
- **Reporting**: ReportLab
- **Server**: Uvicorn

### Frontend
- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Lucide React
- **PDF Generation**: jsPDF

## 📂 Project Structure

```text
.
├── Crop-Backend/          # FastAPI application
├── Crop_Frontend/         # React frontend application
├── dataset/               # Dataset for model training
├── env/                   # Root virtual environment (if used)
└── README.md              # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Crop-Backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Crop_Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License.
