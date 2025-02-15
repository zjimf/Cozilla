const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

router.use(bodyParser.json());

async function deployToCloudRun() {
    try {
    //   console.log("🔹 連接至 GCP VM...");
    //   await execPromise(`gcloud compute ssh tsid_user06_tsmc_hackathon_cloud@gce-instance --zone us-central1-a --tunnel-through-iap`);
    //   console.log("✔️ 成功: 連接至 GCP VM");

      console.log("🔹 取得 GKE 憑證...");
      await execPromise(`gcloud compute ssh tsid_user06_tsmc_hackathon_cloud@gce-instance --zone us-central1-a --tunnel-through-iap --quiet--command "gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2"`);
      console.log("✔️ 成功: 取得 GKE 憑證");

      console.log("🔹 執行 kubectl apply...");
      await execPromise(`gcloud compute ssh tsid_user06_tsmc_hackathon_cloud@gce-instance --zone us-central1-a --tunnel-through-iap --quiet--command "kubectl apply -f /home/tsid_user06_tsmc_hackathon_cloud/Cozilla/backend/routes/generated_yaml.yaml"`);
      console.log("✔️ 成功: 執行 kubectl apply");
  
      console.log("🔹 推送 Docker 映像...");
      await execPromise(`gcloud compute ssh tsid_user06_tsmc_hackathon_cloud@gce-instance --zone us-central1-a --tunnel-through-iap --quiet--command "gcloud builds submit --tag us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app"`);
      console.log("✔️ 成功: 推送 Docker 映像");

      console.log("🔹 部署至 Cloud Run...");
      await execPromise(`gcloud compute ssh tsid_user06_tsmc_hackathon_cloud@gce-instance --zone us-central1-a --tunnel-through-iap --quiet--command "gcloud run deploy cloudrun-app --image us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app --platform managed --region us-central1 --allow-unauthenticated"`);
      console.log("✔️ 成功: 部署至 Cloud Run");
  
      console.log("✅ 部署成功！");
      return { result: true, message: "" };
    // console.log("🔹 透過 SSH 連接 GCP VM 並執行所有指令...");
    // await execPromise(`gcloud compute ssh tsid_user06_tsmc_hackathon_cloud@gce-instance --zone us-central1-a --tunnel-through-iap --command "
    //   gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2 &&
    //   kubectl apply -f /home/tsid_user06_tsmc_hackathon_cloud/Cozilla/backend/routes/generated_yaml.yaml &&
    //   gcloud builds submit --tag us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app &&
    //   gcloud run deploy cloudrun-app --image us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app --platform managed --region us-central1 --allow-unauthenticated"
    // `);

    // console.log("✅ 部署成功！");
    // return { result: true, message: "" };
    } catch (error) {
      console.error("部署失敗:", error);
      return { result: false, message: `部署失敗於: ${error.cmd}` };
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
    const result = await deployToCloudRun();
    res.json(result);
  } catch (err) {
    res.status(500).json({ result: false, message: err.message });
  }
});

module.exports = router;
