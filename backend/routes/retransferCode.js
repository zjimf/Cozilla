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
 * Call Gemini API to fix code errors
 */
async function retransferWithGemini(params) {
  try {
    const {
      source_language,
      source_code,
      target_language,
      converted_code,
      compile_error_details,
      test_output_differences,
      selected_LLM,
    } = params;

    const accessToken = await getAccessToken();
    // Dynamically set LLM model endpoint
    const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${selected_LLM}:generateContent`;

    // Construct Prompt
    let prompt = `
Please examine the following original ${source_language} code and the converted ${target_language} code along with the associated error messages, and make adjustments based on this information. The adjusted code must meet the following criteria:

1. It compiles successfully without any compilation errors.
2. It produces the same output as the original code for all test cases.
3. It maintains the original logic and functionality, with modifications made only to address errors.
4. It uses only the standard libraries and syntax of the target language and adheres to best practices.

Original ${source_language} code:
${source_code}

Converted ${target_language} code:
// BEGIN CODE
${converted_code}
// END CODE

Issues identified:
`;

    if (compile_error_details) {
      prompt += `- Compilation errors: ${compile_error_details}\n`;
    }
    if (test_output_differences) {
      prompt += `- Differences in test outputs: ${test_output_differences}\n`;
    }

    prompt += `
      Please analyze the above error information, identify the potential causes, and make the necessary adjustments to the converted \${target_language} code as a markdown code block. Additionally, outside of the markdown code block, display the following custom markers to indicate the start and end of the code:

      // BEGIN CODE

      [Your corrected code should be placed here as a markdown code block without any additional comment markers such as "# BEGIN CODE" or "# END CODE".]

      // END CODE

      Note: The custom markers must be separate from the code block and should not be included within it.
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
    let output =
      response.data.candidates[0]?.content?.parts[0]?.text || "No response";

    // Format output as JSON string for Postman compatibility
    output = JSON.stringify(output);

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
    converted_code,
    compile_error_details,
    test_output_differences,
    selected_LLM,
  } = req.body;

  // Validate required parameters
  if (
    !source_code ||
    !source_language ||
    !target_language ||
    !converted_code ||
    !selected_LLM
  ) {
    return res
      .status(400)
      .json({ error: "Please provide all required parameters" });
  }

  try {
    const output = await retransferWithGemini({
      source_language,
      source_code,
      target_language,
      converted_code,
      compile_error_details,
      test_output_differences,
      selected_LLM,
    });
    res.json({ message: "Code fixing successful", output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
