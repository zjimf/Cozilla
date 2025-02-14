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
      target_language,
      source_version,
      target_version,
      source_code,
      selected_LLM,
    } = params;

    const accessToken = await getAccessToken();
    // Dynamically set LLM model endpoint
    const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${selected_LLM}:generateContent`;

    // Construct Prompt
    const prompt = `
Please convert the following ${source_language} code into ${target_language} code.
(Target version: ${target_version}; Source version: ${source_version}. If version conversion is not required, ignore version information.)

Please follow these guidelines:
1. Maintain the original logic and functionality of the code. The converted code should have the same output and behavior as the original.
2. Preserve all core structures in the original code (such as loops, conditionals, and exception handling).
3. Use only the standard libraries and syntax of the target language; do not introduce additional libraries or tools.
4. If version conversion is involved, avoid using features or syntax that are unsupported in the target version. Provide an alternative implementation for features available only in ${target_version} or later.
5. Follow best practices and coding styles for the target language (e.g., Pythonic style for Python, conventional Java coding conventions).
6. If there are syntax or functional differences that cannot be directly translated, suggest reasonable alternatives or equivalent implementations.
7. Enclose the final output code within the following custom markers:
<<<<<<< HEAD
   - Code Start Marker: // BEGIN CODE
   - Code End Marker: // END CODE
=======
   - Code Start Marker: \`// BEGIN CODE\`
   - Code End Marker: \`// END CODE\`
   
>>>>>>> 42d3657bbab1552a5efafd180636ed77a0747a5c

Original ${source_language} code:
${source_code}

Please provide the equivalent ${target_language} code:
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
    let output =
      response.data.candidates[0]?.content?.parts[0]?.text || "No response";

    // Format output as a JSON string for Postman compatibility
    output = JSON.stringify(output);

    return output;
  } catch (error) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw new Error("GCP API call failed");
  }
}

// **API Route - Convert Code**
router.post("/", async (req, res) => {
  const {
    source_language,
    target_language,
    source_version,
    target_version,
    source_code,
    selected_LLM,
  } = req.body;

  // Validate required parameters
  if (!source_code || !source_language || !target_language || !selected_LLM) {
    return res
      .status(400)
      .json({ error: "Please provide all required parameters" });
  }

  try {
    const output = await convertCodeWithGemini({
      source_language,
      target_language,
      source_version,
      target_version,
      source_code,
      selected_LLM,
    });
    res.json({ message: "Code conversion successful", output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
