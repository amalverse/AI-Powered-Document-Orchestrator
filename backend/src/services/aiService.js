import axios from 'axios';

export const extractStructuredData = async (text, query) => {
  // Keep text under 25,000 characters to avoid hitting Groq's token limits
  // If text is longer, we truncate it and add a note that it was cut off
  const truncatedText = text.length > 25000 ? text.substring(0, 25000) + '... [TRUNCATED]' : text;

  const prompt = `You are a precise document analysis assistant. Your task is to analyze the provided document text and extract the most relevant information based on the user's query.

User Query: "${query}"

Document Text:
${truncatedText}

Instructions:
- Identify and extract between 5 and 8 key-value pairs that are MOST relevant to the user's query.
- Each pair should have a concise, descriptive key and a clear, factual value pulled directly from the document.
- Rank the pairs by relevance to the query (most relevant first).
- Do NOT include generic or unrelated information.
- Respond ONLY with a valid raw JSON array. No markdown, no explanation, no extra text.

Required output format (strict JSON array):
[
  { "key": "Descriptive Field Name", "value": "Extracted value from document" },
  { "key": "Another Field Name", "value": "Another extracted value" }
]`;

  try {
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let structuredData = groqResponse.data.choices[0].message.content || '';

    try {
      // Sometimes the AI wraps JSON in markdown code blocks, so strip them out
      const cleanJson = structuredData.replace(/```json/g, '').replace(/```/g, '').trim();
      structuredData = JSON.parse(cleanJson);
    } catch {
      // If JSON parsing fails, return the raw response string instead
      // The frontend will handle displaying it
    }

    return structuredData;
  } catch (error) {
    console.error('Groq AI Processing Error:', error.response?.data || error.message);
    throw new Error('Groq AI processing failed');
  }
};
