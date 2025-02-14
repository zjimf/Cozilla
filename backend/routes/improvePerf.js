const express = require("express");
const router = express.Router();
const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config(); // Load environment variables

const path = require("path");


// GCP Project ID
const PROJECT_ID = "tsmccareerhack2025-tsid-grp2";

/**
 * Get Google Cloud API Access Token
 */
async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: path.join(__dirname, "./key.json"), // 確保路徑正確
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  console.log(auth)
  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  return accessTokenResponse.token;
}

/**
 * Call Gemini API to perform code conversion
 */
async function convertCodeWithGemini(params) {
  try {
    const {
      source_language,
      source_version,
      source_code,
      selected_LLM,
    } = params;


    const accessToken = await getAccessToken();

    // Dynamically set LLM model endpoint
    const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${selected_LLM}:generateContent`;

    // Construct Prompt
    const prompt = `
    ${source_language} ${source_version} code: ${source_code}
    Please help optimize the code to meet at least one of the following conditions:
    1. Improve memory usage.
    2. Improve execution time.
    If possible, optimize for both. 
    If not, prioritize optimizing one of the conditions.
    
    Enclose the final output code within the following custom markers:
       - Code Start Marker: \`// BEGIN CODE\`
       - Code End Marker: \`// END CODE\`
    `;

    // Send request to Vertex AI Gemini API
    const response = await axios.post(
      MODEL_ENDPOINT,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Retrieve LLM-generated converted code
    const output =
      response.data.candidates[0]?.content?.parts[0]?.text || "No response";

    return output;
  } catch (error) {
    console.error("Error calling  API:", error.response?.data || error.message);
    throw new Error("GCP API call failed");
  }
}

// **API Route - Convert Code**
router.post("/", async (req, res) => {
  const {
    source_language,
    source_version,
    source_code,
    selected_LLM,
  } = req.body;

  // Validate required parameters
  if (!source_code || !source_language || !selected_LLM) {
    return res
      .status(400)
      .json({ error: "Please provide all required parameters" });
  }

  try {
    const output = await convertCodeWithGemini({
      source_language,
      source_version,
      source_code,
      selected_LLM,
    });
    res.json({ message: "Code conversion successful", output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
