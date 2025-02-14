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
    keyFile: path.join(__dirname, "./key.json"), // Ensure correct path
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  return accessTokenResponse.token;
}

/**
 * Call Gemini API to fix code errors
 */
async function fixCodeWithGemini(params) {
  try {
    const {
      source_language,
      source_code,
      target_language,
      compile_error_details,
      selected_LLM,
    } = params;

    const accessToken = await getAccessToken();
    const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${selected_LLM}:generateContent`;

    // Construct Prompt
    let prompt = `
Analyze the following ${source_language} code and correct any compilation or runtime errors to ensure it executes successfully. The corrected version should follow these guidelines:

1. The fixed code should be fully functional and free from compilation errors.
2. It should maintain the original intent and logic of the provided code.
3. The corrected code must use only standard libraries and follow best coding practices of ${target_language}.

Original ${source_language} Code:
${source_code}

`;

    if (compile_error_details) {
      prompt += `Identified Compilation Errors: ${compile_error_details}\n`;
    }

    prompt += `
Please analyze and fix the errors. The final output should be the corrected ${target_language} code, enclosed between the following markers:
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

    // Retrieve LLM-generated corrected code
    const output =
      response.data.candidates[0]?.content?.parts[0]?.text || "No response";

    return output;
  } catch (error) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw new Error("GCP API call failed");
  }
}

// **API Route - Fix Code**
router.post("/", async (req, res) => {
  const {
    source_language,
    source_code,
    target_language,
    compile_error_details,
    selected_LLM,
  } = req.body;

  // Validate required parameters
  if (!source_code || !source_language || !target_language || !selected_LLM) {
    return res
      .status(400)
      .json({ error: "Please provide all required parameters" });
  }

  try {
    const output = await fixCodeWithGemini({
      source_language,
      source_code,
      target_language,
      compile_error_details,
      selected_LLM,
    });
    res.json({ message: "Code fixing successful", output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
