# 🤖 AI-Powered Document Orchestrator

An intelligent MERN stack application that extracts structured data from uploaded documents using **Groq AI** (Llama 3.3), triggers automated **n8n workflows**, and sends formatted **email alerts** to recipients — all in one seamless pipeline.

<img width="1366" height="3041" alt="screencapture-ai-powered-document-orchestrator-vercel-app-2026-03-20-20_21_50" src="https://github.com/user-attachments/assets/9d2457e4-067b-4ec5-b2f0-989dadac5681" />

---

## 🚀 How It Works

### Four-Step Pipeline

```
Step 1: Upload Document (PDF/TXT)
        ↓
Step 2: Groq AI extracts 5-8 key-value pairs based on user's query
        ↓
Step 3: User enters recipient email and triggers n8n workflow
        ↓
Step 4: n8n generates analytical email & sends via Gmail
```

### Data Flow

```
React Frontend
    ↓ (uploads file + query)
Express Backend
    ↓ (parses PDF, calls Groq AI)
Returns structured JSON
    ↓ (user inputs email)
HTTP POST to n8n Webhook
    ↓ (n8n calls Groq , drafts & sends email)
Gmail Sends Email Alert
    ↓ (returns results to frontend)
Display: Status, Answer, Email Preview
```

---

## 🗂️ Project Structure

```
AI-Powered Document Orchestrator/
├── backend/                          # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── uploadController.js   # PDF parsing & AI extraction
│   │   │   └── emailController.js    # n8n webhook integration
│   │   ├── services/
│   │   │   └── aiService.js          # Groq AI API calls
│   │   ├── routes/
│   │   │   └── index.js              # API route definitions
│   │   └── models/                   # (Mongoose - optional)
│   ├── uploads/                      # Temporary file storage
│   ├── .env                          # Environment variables (DO NOT COMMIT)
│   ├── .env.example                  # Template for .env
│   ├── index.js                      # Server entry point
│   └── package.json
│
├── frontend/                         # React 19 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx            # Page title & description
│   │   │   ├── UploadSection.jsx     # Step 1: File & query input
│   │   │   ├── StructuredDataViewer.jsx  # Step 2: Display extracted data
│   │   │   ├── SendEmailSection.jsx  # Step 3: Email trigger
│   │   │   └── AutomationResults.jsx # Step 4: Results display
│   │   ├── api/
│   │   │   └── apiService.js         # Axios HTTP client
│   │   ├── App.jsx                   # Main app orchestrator
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── .env                          # Frontend env vars (DO NOT COMMIT)
│   ├── .env.example                  # Template for .env
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   └── package.json
│
├── n8n-example-workflow.json          # n8n workflow JSON export 
├── n8n-workflow.md                    # Documentation for n8n workflow setup
└── README.md                          # This file

```

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 | Interactive UI with fast build |
| **Backend** | Node.js, Express 5, Multer 2 | REST API with file upload handling |
| **AI Extraction** | Groq API (Llama 3.3 70B) | Fast structured data extraction |
| **Email Automation** | n8n (Cloud-hosted) | Workflow orchestration & Gmail integration |
| **File Parsing** | pdf-parse | Extract text from PDF documents |
| **HTTP Client** | Axios | Backend ↔ Frontend ↔ n8n communication |

---

## 🔧 Quick Start

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org))
- **Groq API Key** ([Sign up](https://console.groq.com))
- **n8n Cloud Account** ([Sign up](https://app.n8n.cloud))
- **Gmail Account** (for email sending via n8n)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "AI-Powered Document Orchestrator"

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
GROQ_API_KEY=your_groq_api_key_here
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/document-orchestrator
PORT=5000
```

Get your Groq API key: https://console.groq.com/keys

**Frontend** (`frontend/.env`):
```bash
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

### 4. Setup n8n Workflow

1. Go to your [n8n Cloud Dashboard](https://app.n8n.cloud)
2. Create a new **Workflow**
3. Add nodes:
   - **Webhook Trigger** (POST method)
   - **AI Agent** (Call Groq  for analysis & email drafting)
   - **IF Node** (Check conditional logic)
   - **Gmail** (Send email)
   - **Respond to Webhook** (Return results)
4. **Activate** the workflow (toggle to ON)
5. Copy the **Webhook URL** and paste it in `backend/.env` as `N8N_WEBHOOK_URL`

---

## 📡 API Endpoints

### Backend Routes

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/upload` | `file` (PDF/TXT), `query` (string) | `{ structuredData: Array, text: string }` |
| `POST` | `/api/send-email` | `email`, `structuredData`, `text`, `query` | `{ status: string, n8nResponse: object }` |

### Example Request

**Upload Document**:
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@invoice.pdf" \
  -F "query=Extract invoice amount and due date"
```

---

## 📄 Supported File Types

- ✅ `.pdf` — Parsed using `pdf-parse` library
- ✅ `.txt` — Read as plain text

**Max file size**: No strict limit (configure in Multer if needed)

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)

1. Push code to GitHub
2. Connect repo to Vercel/Netlify
3. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
4. Deploy!

### Backend (Render)

1. Push code to GitHub
2. Create new **Web Service** on Render
3. Set environment variables:
   ```
   GROQ_API_KEY=your_key
   N8N_WEBHOOK_URL=your_webhook_url
   PORT=5000
   ```
4. Set start command: `node index.js`
5. Deploy!

---

## 🔒 Security

⚠️ **Important**: Never commit `.env` files to Git!

✅ `.env` files are in `.gitignore`
✅ Always regenerate API keys if accidentally exposed
✅ Use environment-specific URLs for dev/staging/production

---

## 📊 Features

✅ **PDF & Text File Upload** — Drag & drop support  
✅ **AI-Powered Extraction** — Groq Llama 3.3 for fast, accurate data extraction  
✅ **Structured JSON Output** — 5-8 key-value pairs ranked by relevance  
✅ **n8n Integration** — Webhook-based email automation  
✅ **Gmail Alerts** — Automatic email drafting and sending  
✅ **Real-time UI Updates** — React state management for instant feedback  
✅ **Error Handling** — Comprehensive error messages for debugging  
✅ **Responsive Design** — Mobile-friendly Tailwind CSS layout  

---

## 🐛 Troubleshooting

### "No file uploaded" Error
- Ensure you selected a file before clicking "Process Document"
- Check that the file is `.pdf` or `.txt`

### "AI processing failed" Error
- Verify `GROQ_API_KEY` is correct in `backend/.env`
- Check Groq API status at https://console.groq.com
- Ensure document text is not empty

### "Webhook processed failed" Error
- Verify n8n workflow is **activated** (toggle ON)
- Check `N8N_WEBHOOK_URL` is correct
- Ensure n8n instance is running in production mode

### Frontend not connecting to backend
- Check `VITE_API_BASE_URL` in `frontend/.env`
- Verify backend is running on `http://localhost:5000`
- Check for CORS errors in browser console

### PDF parsing errors
- Some PDFs with images or scanned content may fail
- Try converting to text first or use a different PDF
- Check console for specific `pdf-parse` error messages

---

## 📖 Learning Resources

- [n8n Documentation](https://docs.n8n.io)
- [Groq API Docs](https://console.groq.com/docs)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)

---

## 🧑‍💻 Author

Built by **Amal Kishor**

---

## 📝 License

This project is part of an educational course assignment.

---

## ✨ Next Steps

- [ ] Add database persistence (MongoDB Atlas)
- [ ] Implement user authentication
- [ ] Add document history/archive
- [ ] Create admin dashboard
- [ ] Add support for `.docx`, `.xlsx` files
- [ ] Implement batch file processing
- [ ] Add email template customization
