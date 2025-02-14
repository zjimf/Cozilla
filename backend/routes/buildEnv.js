const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

router.use(bodyParser.json());

async function deployToCloudRun() {
  try {
    const yamlPath = path.join(__dirname, 'generated_yaml.yaml');

    console.log("取得 GKE 憑證...");
    await execPromise(`gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2`);
    console.log("取得 GKE 憑證成功");

    console.log("啟動 GKE Node Pool...");
    await execPromise(`gcloud container clusters resize default-pool --size=1 --zone us-central1-a --project tsmccareerhack2025-tsid-grp2 --quiet`);

    console.log("配置 Docker 授權...");
    await execPromise(`gcloud auth configure-docker us-central1-docker.pkg.dev`);

    console.log("執行 kubectl apply...");
    await execPromise(`kubectl apply -f ${yamlPath}`);
    console.log("Kubernetes 資源已部署成功！");

    console.log("推送 Docker 映像...");
    await execPromise(`docker build -t us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app . && docker push us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app`);

    console.log("執行 Cloud Run 部署...");
    const deployOutput = await execPromise(`gcloud run deploy cloudrun-app --image us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app --platform managed --region us-central1 --allow-unauthenticated`);

    console.log("Cloud Run 部署完成！", deployOutput);
    return deployOutput;
  } catch (error) {
    console.error("Fail to deploy error:", error.message);
    throw new Error("部署失敗" + (error.cmd ? `於指令: ${error.cmd}` : ''));
  }
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject({ cmd: command, message: error.message });
      else if (stderr) reject({ cmd: command, message: stderr });
      else resolve(stdout);
    });
  });
}

router.post("/", async (req, res) => {
  try {
    const result = await deployToCloudRun();
    res.json({ message: "部署成功", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
