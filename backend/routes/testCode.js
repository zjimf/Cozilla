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
      converted_code,
      selected_LLM,
    } = params;

    const accessToken = await getAccessToken();
    // Dynamically set LLM model endpoint
    const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${selected_LLM}:generateContent`;

    // Construct Prompt
    const prompt = `
    Original version code: ${source_code}
    Execution environment: ${source_language} ${source_version}

    Converted version code: ${converted_code}
    Execution environment: ${target_language} ${target_version}

    Please generate the test process according to the following requirements:

    1. Generate Test Data
    - Please create three distinct and comprehensive sets of test data to verify whether the outputs of the two code versions are consistent in their respective environments.

    2. Execute and Compare Results
    - For each set of test data, display the content of the test data.
    - Execute the original version code and the converted version code respectively, and compare their outputs.
    - If the outputs are consistent, display "Test results are consistent".
    - If the outputs are inconsistent, please list the specific discrepancies under that test data.

    3. Please present the test data in the following format:
    Enclose the final output within the following custom markers:
    - Output Start Marker: // BEGIN CODE
    - Output End Marker: // END CODE
    Test Data Type 1:
    Test Data Value 1:
    Original Version Test Result:
    Converted Version Test Result:
    Conclusion:

    Test Data Type 2:
    Test Data Value 2:
    Original Version Test Result:
    Converted Version Test Result:
    Conclusion:

    Test Data Type 3:
    Test Data Value 3:
    Original Version Test Result:
    Converted Version Test Result:
    Conclusion:
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
      target_language,
      source_version,
      target_version,
      source_code,
      converted_code,
      selected_LLM,
  } = req.body;

  // Validate required parameters
  if (!source_code || !converted_code || !selected_LLM) {
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
      converted_code,
      selected_LLM,
    });
    res.json({ message: "Code conversion successful", output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;

