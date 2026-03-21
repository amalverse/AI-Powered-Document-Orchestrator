import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import routes from './src/routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the frontend can make requests to this backend
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// Mount all API routes at /api prefix (e.g., POST /api/upload)
app.use('/api', routes);

// Start the Express server and log the URL
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});