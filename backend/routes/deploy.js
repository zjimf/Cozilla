const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

router.use(bodyParser.json());

async function deployToKubernetes() {
  try {
    const yamlPath = path.join(__dirname, 'generated_yaml.yaml');

    console.log("取得 GKE 憑證...");
    await execPromise(`gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2`);
    console.log("取得 GKE 憑證成功");

    console.log("執行 kubectl apply...");
    const kubectlApply = await execPromise(`kubectl apply -f ${yamlPath}`);
    console.log("Kubernetes 資源已部署成功！");

    return { result: true, message: "" };
  } catch (error) {
    console.error("部署失敗:", error);
    let errorMessage = "";
    if (error.cmd.includes("get-credentials")) errorMessage = "獲取憑證失敗";
    else if (error.cmd.includes("kubectl apply")) errorMessage = "部署環境失敗";
    else errorMessage = "編譯失敗";

    return { result: false, message: errorMessage };
  }
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      console.log(`執行命令: ${command}`);
      if (error) reject({ cmd: command, message: error.message });
      else resolve(stdout + (stderr ? `\n警告: ${stderr}` : ''));
    });
  });
}

router.post("/", async (req, res) => {
  try {
    const result = await deployToKubernetes();
    res.json(result);
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
});

module.exports = router;
