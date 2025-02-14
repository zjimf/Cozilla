const express = require("express");
const router = express.Router();
const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config(); // 讀取環境變數

// Google Cloud Vertex AI API 設定
const PROJECT_ID = "tsmccareerhack2025-tsid-grp2"; // GCP 專案 ID
const MODEL_ENDPOINT = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.5-pro-002:generateContent`;

/**
 * 取得 Google Cloud API 的 Access Token
 */
async function getAccessToken() {
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });

  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  return accessTokenResponse.token;
}

/**
 * 呼叫 Gemini API 進行對話
 */
async function chatWithGemini(userMessage) {
  try {
    const accessToken = await getAccessToken();

    // 設定使用者輸入的訊息
    const prompt = `使用者: ${userMessage}\nAI: `;

    // 發送請求至 Vertex AI Gemini API
    const response = await axios.post(
      MODEL_ENDPOINT,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }], // Google Gemini API 的內容格式
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 取得 LLM 產生的回應
    const output =
      response.data.candidates[0]?.content?.parts[0]?.text || "無回應";

    return output;
  } catch (error) {
    console.error(
      "呼叫 Gemini API 時發生錯誤:",
      error.response?.data || error.message
    );
    throw new Error("GCP Gemini API 呼叫失敗");
  }
}

// **API 路由 - 與 Gemini LLM 進行對話**
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "請提供 message 來與 LLM 對話" });
  }

  try {
    const output = await chatWithGemini(message);
    res.json({ message: "對話成功", response: output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
