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
      converted_code,
    } = params;


    const accessToken = await getAccessToken();

    // Dynamically set LLM model endpoint
    const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${selected_LLM}:generateContent`;

    // Construct Prompt
    const prompt = `
    ${source_code} is the original source code.
    ${converted_code} is the optimized code.
    Please provide an explanation of the improvements in memory usage and execution time.
    Please generate the output content according to the following rules:
    1. Output only the time complexity value of the original source code, without any additional text or explanation:
        - Prepend the value with // SOURCE_CODE_TIME_BEGIN
        - Append the value with // SOURCE_CODE_TIME_END
    2. Output only the time complexity value of the optimized code, without any additional text or explanation:
        - Prepend the value with // CONVERTED_CODE_TIME_BEGIN
        - Append the value with // CONVERTED_CODE_TIME_END
    3. Provide a short text summary of the time complexity values of the original and optimized code, including detailed reasoning and explanations regarding the factors and algorithmic choices that lead to these time complexities. Enclose this text with:
        - A prefix marker: // TIME_CAPTION_BEGIN
        - A suffix marker: // TIME_CAPTION_END
    4. Output only the space complexity value of the original source code, without any additional text or explanation:
        - Prepend the value with // SOURCE_CODE_SPACE_BEGIN
        - Append the value with // SOURCE_CODE_SPACE_END
    5. Output only the space complexity value of the optimized code, without any additional text or explanation:
        - Prepend the value with // CONVERTED_CODE_SPACE_BEGIN
        - Append the value with // CONVERTED_CODE_SPACE_END
    6. Provide a short text summary of the space complexity values of the original and optimized code, including detailed reasoning and explanations regarding the improvements or trade-offs in memory usage, data structures used, or algorithmic design that lead to these space complexities. Enclose this text with:
        - A prefix marker: // SPACE_CAPTION_BEGIN
        - A suffix marker: // SPACE_CAPTION_END
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
    converted_code,
  } = req.body;

  // Validate required parameters
  if (!source_code || !source_language || !selected_LLM || !converted_code) {
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
        converted_code,
    });
    res.json({ message: "Code conversion successful", output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;

