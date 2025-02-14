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
 * Call Gemini API to fix code errors if any.
 * If the code runs successfully, output the original code.
 */
async function fixCodeWithGemini(params) {
  try {
    const { source_language, source_version, source_code, selected_LLM } =
      params;

    // Construct Prompt with source version info
    let prompt = `
Analyze the following ${source_language} code (Version: ${source_version}) and determine if it contains any compilation or runtime errors.
If the code executes successfully without errors, output the original code unchanged.
However, if errors are detected, provide a corrected version of the code that is fully functional and free of errors.
The corrected code must adhere to the following guidelines:

1. Preserve the original intent and logic of the provided code.
2. Use only standard libraries and follow best coding practices for ${source_language}.
3. Ensure that the final code is free from any compilation or runtime errors and executes successfully.

In your corrected code, please include inline comments to indicate what changes were made and why.

Original ${source_language} Code (Version: ${source_version}):
${source_code}
`;

    prompt += `
Please output the final ${source_language} code (either the original if no errors, or the corrected version if errors are present) as a markdown code block.
Additionally, outside of the markdown code block, display the following custom markers to indicate the start and end of the code:

// BEGIN CODE

[Your markdown code block here]

// END CODE

Note: The custom markers should be separate from the markdown code block and should not be included within it.
`;

    // Send request to Vertex AI Gemini API
    const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${selected_LLM}:generateContent`;
    const accessToken = await getAccessToken();

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

    // Retrieve LLM-generated output
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
  const { source_language, source_version, source_code, selected_LLM } =
    req.body;

  // Validate required parameters
  if (!source_code || !source_language || !source_version || !selected_LLM) {
    return res
      .status(400)
      .json({ error: "Please provide all required parameters" });
  }

  try {
    const output = await fixCodeWithGemini({
      source_language,
      source_version,
      source_code,
      selected_LLM,
    });
    res.json({ message: "Code fixing successful", output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
