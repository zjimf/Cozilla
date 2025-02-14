const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

router.use(bodyParser.json());

// 部署至 Google Cloud Run 的函式
async function deployToCloudRun(yamlContent) {
  try {
    const yamlPath = path.join(__dirname, 'generated_yaml.yaml');
    fs.writeFileSync(yamlPath, yamlContent);  // 將 YAML 內容寫入檔案

    console.log("開始執行 kubectl apply...");
    await execPromise(`kubectl apply -f ${yamlPath}`);
    console.log("Kubernetes 資源已部署成功！");

    console.log("開始執行 Cloud Run 部署...");
    const deployOutput = await execPromise(
      `gcloud run deploy cloudrun-app --image gcr.io/tsmccareerhack2025-tsid-grp2/cloudrun-app --platform managed --region us-central1 --allow-unauthenticated`
    );

    console.log("Cloud Run 部署完成！", deployOutput);
    return deployOutput;
  } catch (error) {
    console.error(
      "Deploy fail error:",
      error.response?.data || error.message
    );
    throw new Error("部署失敗");
  }
}

// 將 exec 包裝為 Promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

// API 路由
router.post("/", async (req, res) => {
  const { yamlContent } = req.body;
  if (!yamlContent) {
    return res.status(400).json({ error: "請提供 YAML 內容" });
  }
  try {
    const result = await deployToCloudRun(yamlContent);
    res.json({ message: "部署成功", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;