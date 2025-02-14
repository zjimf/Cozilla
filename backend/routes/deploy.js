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
    const getCred = await execPromise(`gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2`);
    console.log("取得 GKE 憑證成功:\n", getCred);

    console.log("執行 kubectl apply...");
    const kubectlApply = await execPromise(`kubectl apply -f ${yamlPath}`);
    console.log("Kubernetes 資源已部署成功！\n", kubectlApply);

    return kubectlApply;
  } catch (error) {
    console.error("部署失敗:", error);
    throw new Error("部署失敗" + (error.cmd ? `於指令: ${error.cmd}` : ''));
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
    res.json({ message: "Kubernetes 部署成功", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
