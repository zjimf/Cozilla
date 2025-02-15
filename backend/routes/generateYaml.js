const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config(); // 讀取環境變數
router.use(bodyParser.json());

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
 * Step1. 判讀程式碼是 Python 還是 Java
 */
async function detectLanguage(code_snippet) {
  try {
    const accessToken = await getAccessToken();

    // 讀入 prompt
    // const prompt = `使用者: ${userMessage}\nAI: `;
    const prompt = `"Analyze the provided code and determine whether it is written in Python or Java.\n"
    "Return only the JSON object, without Markdown or code block formatting.\n"
    "- Output format: JSON\n"
    "- Fields:\n"
    "  * language: Specify 'python' or 'java'.\n"
    "  * confidence: Provide a confidence score (e.g., 0.95).\n\n"
    "Code snippet:\n${code_snippet}"`;

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
    let output =
      response.data.candidates[0]?.content?.parts[0]?.text || "no response";
    output = output.replace(/```json|```/g, ""); // 清除多餘的 Markdown 符號
    confidence = JSON.parse(output).confidence;
    language = JSON.parse(output).language;
    // FIXME：信任值很低時還要相信這個結果嗎？
    return language;
  } catch (error) {
    console.error(
      "Call Gemini API in detectLanguage error:",
      error.response?.data || error.message
    );
    throw new Error("GCP Gemini API 呼叫失敗");
  }
}

/**
 * Step2. 偵測適合的執行版本（判斷使用的 Python 或 Java 版本）
 */
async function detectVersion(code_snippet) {
  try {
    const accessToken = await getAccessToken();

    // 設定使用者輸入的訊息
    const prompt = `"Analyze the provided {language} code and determine the most suitable runtime version.\n"
    "- For Python: Provide a version number such as '3.8', '3.9', etc.\n"
    "- For Java: Provide a version number such as '8', '11', '17', or '21'.\n"
    "- Output format: Provide only the version number.\n\n"
    "Code snippet:\n${code_snippet}"`;

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
    let output =
      response.data.candidates[0]?.content?.parts[0]?.text || "無回應";

    return output;
  } catch (error) {
    console.error(
      "Call Gemini API in detectVersion error:",
      error.response?.data || error.message
    );
    throw new Error("GCP Gemini API 呼叫失敗");
  }
}

/**
 * Step3. 生成 Kubernetes YAML 配置
 */
async function generateK8sYaml(language, version, code_snippet) {
  try {
    const accessToken = await getAccessToken();

    // 設定使用者輸入的訊息
    const prompt = `"Generate a Kubernetes YAML configuration for the provided ${language} code.\n"
    "- Runtime: Use ${language} version ${version}.\n"
    "- Include appropriate resource limits.\n"
    "- Add liveness and readiness probes for health checks.\n"
    "- Use the file name as the container name.\n"
    "- Output format: Provide the full Kubernetes YAML configuration.\n\n"
    "Code snippet:\n${code_snippet}"`;

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
    let output =
      response.data.candidates[0]?.content?.parts[0]?.text || "無回應";
    let yamlOutput = output.replace(/.*?```yaml|```[\s\S]*/g, "").trim(); // 僅保留 YAML 內容
    // confidence = JSON.parse(output).confidence
    // language = JSON.parse(output).language

    // 寫入檔案
    const path = require('path');
    const yamlPath = path.join(__dirname, '.././generated_yaml/deploy.yaml');
    fs.writeFileSync(yamlPath, yamlContent);  // 將 YAML 內容寫入檔案
x``
    return yamlOutput;
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
  console.log(req);
  const { code_snippet } = req.body;

  if (!code_snippet) {
    return res
      .status(400)
      .json({ error: "Do not include code snippet in req.body" });
  } else {
    try {
      // Step1. 偵測 code_snippet 語言
      const language = await detectLanguage(code_snippet);
      console.log(
        `=========== detectLanguage success!!===========\n detected Language: ${language}`
      );

      // Step2. 偵測 code_snippet 版本
      const version = await detectVersion(code_snippet);
      console.log(
        `=========== detectVersion success!!===========\n detected Version: ${version}`
      );

      // Step3. 生成 yaml 檔案
      const yaml = await generateK8sYaml(language, version, code_snippet);
      console.log(
        `=========== generateK8sYaml success!!===========\n generateK8sYaml: ${yaml}`
      );
      res.json({ message: "generateK8sYaml success!!", response: yaml });
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  }
});

module.exports = router;
