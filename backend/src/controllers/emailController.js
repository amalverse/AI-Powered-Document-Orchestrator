import axios from 'axios';

export const sendEmailAlert = async (req, res) => {
  try {
    // Extract email address and document data from the request
    const { email, structuredData, text, query } = req.body;

    if (!email || !structuredData) {
      return res.status(400).json({ error: 'Email and structured data are required' });
    }

    // Send all the document context to the n8n webhook for processing
    // The n8n workflow will generate an email and send it
    const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
      email,
      json: structuredData,
      text,
      query,
    });

    // Return the full response from n8n (includes email body, status, and analysis)
    res.json({ status: 'Webhook processed successfully', n8nResponse: n8nResponse.data });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'An error occurred while sending the email.' });
  }
};
