# 🤖 AI-Powered Document Orchestrator

An intelligent MERN stack application that extracts structured data from uploaded documents using **Groq AI** (Llama 3.3), triggers automated **n8n workflows**, and sends formatted **email alerts** to recipients — all in one seamless pipeline.

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

## 🚀 How It Works & Project Workflow

### Architecture Overview

1. **Frontend**: React 19, Vite, Tailwind CSS (User Interface)
2. **Backend**: Node.js, Express, Multer, pdf-parse (API & File Processing)
3. **AI Layer**: Groq API using Llama 3.3 70B (Data Extraction & Analysis)
4. **Automation**: n8n Webhook & Node logic (Email construction and delivery via Gmail)

### Step 1: Document Upload & Parsing

**Objective**: The user uploads a file and gives a specific analysis query. The backend processes the upload and extracts the raw text.

1. **User Action (Frontend)**: 
   - The user selects a document (`.txt` or `.pdf`) and writes a query (e.g., "Extract invoice total and due date").
   - `UploadSection.jsx` triggers a `multipart/form-data` POST request to the backend `/api/upload`.
2. **File Handling (Backend - `routes/index.js` & `multer`)**:
   - The `multer` middleware receives the file and temporarily saves it to the `backend/uploads/` directory.
   - The request is then routed to `uploadController.js`.
3. **Text Extraction (Backend - `uploadController.js`)**:
   - For `.txt` files, the application reads the file directly using Node.js `fs`.
   - For `.pdf` files, the application uses the `pdf-parse` library to extract raw text from the file buffer.
   - Unsupported file types throw an error. The temporary file is queued for deletion.

### Step 2: AI Data Extraction

**Objective**: The raw text and query are sent to Groq AI to extract a structured JSON array of key-value pairs.

1. **AI Processing (`aiService.js`)**:
   - To avoid Groq AI token limits, the raw text is truncated to 25,000 characters if necessary.
   - A strict prompt is built, containing the document text, the user query, and instructions to return a valid JSON array of 5 to 8 key-value pairs ranked by relevance.
   - An HTTP POST request is sent to `https://api.groq.com/openai/v1/chat/completions` using the Llama 3.3 model.
2. **Data cleanup (`aiService.js`)**:
   - The AI response is stripped of potential markdown blocks (e.g., ` ```json `) and parsed into native JavaScript objects.
3. **Response & Cleanup (`uploadController.js`)**:
   - The original file in the `uploads/` folder is permanently deleted (`fs.unlinkSync`).
   - The structured JSON and the raw text are sent back to the React frontend.
4. **Data Rendering (`StructuredDataViewer.jsx`)**:
   - The frontend receives the data and presents it neatly inside a structured UI table.

### Step 3: Triggering Automation (n8n Webhook)

**Objective**: The user provides an email address to send the analysis results and triggers the n8n automation process.

1. **User Action (Frontend - `SendEmailSection.jsx`)**:
   - The user inputs an email address and clicks "Send Email Alert".
   - A POST request is fired to the backend `/api/send-email` containing the recipient email, the AI-extracted structured data, the raw text, and the original query.
2. **Backend Proxy (`emailController.js`)**:
   - The backend validates the payload constraints.
   - It forwards the data by sending a POST request directly to the custom `N8N_WEBHOOK_URL` defined in the environment variables.

### Step 4: The n8n Workflow & Email Delivery

**Objective**: The n8n workflow receives the payload, structures an email using AI, and delivers it via Gmail.

1. **Webhook Trigger Node (n8n)**:
   - Catches the inbound POST request from the Node.js backend.
2. **Groq AI Drafting Node (n8n)**:
   - The workflow takes the original query and context data, passing it to an AI Node (Llama 3.3).
   - The prompt instructs the AI to generate a detailed analytical message and a drafted HTML `email_body`.
3. **Conditional Logic Node (n8n)**:
   - Evaluates if the `email` key in the payload is populated.
4. **Gmail Node (n8n)**:
   - If an email exists, n8n connects to Gmail (using OAuth2 credentials) to send the drafted `email_body` directly to the recipient's inbox.
5. **Webhook Response Node (n8n)**:
   - The flow resolves by responding back to the original backend HTTP request (`emailController.js`), packaging the success status and the final analysis.

### Step 5: Finalizing the UI state

1. **Frontend Rendering (`AutomationResults.jsx` & `App.jsx`)**:
   - The frontend receives the nested n8n response forwarded by the backend.
   - `App.jsx` updates its state (`emailStatus`, `finalAnswer`, and `emailBody`).
   - The user interface conditionally displays the "Automation Results," confirming execution details, the resulting AI answer, and a preview of the email sent.

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
