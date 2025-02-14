const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const { exec } = require("child_process");
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

router.use(bodyParser.json());

async function deployToCloudRun(){
  try {
    const conn = new Client();
    const sshConfig = {
      host: 'GCE_VM_EXTERNAL_IP',
      port: 22,
      username: 'your-username',
      privateKey: fs.readFileSync('/path/to/your/private/key')
    };
    await new Promise((resolve, reject) => {
      conn.on('ready', () => {
        console.log('SSH 連線成功');
        conn.exec(`gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2 && kubectl apply -f /path/to/generated_yaml.yaml`, (err, stream) => {
          if (err) reject(err);
          stream.on('close', (code, signal) => {
            console.log('GKE 憑證取得並已部署');
            conn.end();
            resolve();
          }).on('data', (data) => {
            console.log('STDOUT: ' + data);
          }).stderr.on('data', (data) => {
            reject('STDERR: ' + data);
          });
        });
      }).connect(sshConfig);
    });
    console.log("開始執行 Cloud Run 部署...");
    const deployOutput = await execPromise(`gcloud run deploy cloudrun-app --image us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app --platform managed --region us-central1 --allow-unauthenticated`);
    console.log("Cloud Run 部署完成！", deployOutput);
    return deployOutput;
  } catch (error) {
    console.error("Fail to deploy error:", error.message);
    throw new Error("部署失敗" + (error.cmd ? `於指令: ${error.cmd}` : ''));
  }
}
// // 部署至 Google Cloud Run 的函式
// async function deployToCloudRun() {
//   try {
//     // 讀 yaml
//     const yamlPath = path.join(__dirname, 'generated_yaml.yaml');
//     // const yamlContent = fs.readFileSync(yamlPath, 'utf8');  // 直接讀取本地 YAML 檔案

//     console.log("取得 GKE 憑證...");
//     await execPromise(`gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2`);
//     console.log("取得 GKE 憑證成功");

//     console.log("啟動 GKE Node Pool...");
//     await execPromise(`gcloud container clusters resize default-pool --size=1 --zone us-central1-a --project tsmccareerhack2025-tsid-grp2 --quiet`);

//     console.log("配置 Docker 授權...");
//     await execPromise(`gcloud auth configure-docker us-central1-docker.pkg.dev`);

//     console.log("設置 KUBECONFIG...");
//     process.env.KUBECONFIG = path.join(require('os').homedir(), '.kube', 'config');

//     console.log("開始執行 kubectl apply...");
//     await execPromise(`kubectl apply -f ${yamlPath}`);
//     console.log("Kubernetes 資源已部署成功！");

//     console.log("推送 Docker 映像...");
//     await execPromise(`docker build -t us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app . && docker push us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app`);

//     console.log("開始執行 Cloud Run 部署...");
//     const deployOutput = await execPromise(
//       `ggcloud run deploy cloudrun-app --image us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app --platform managed --region us-central1 --allow-unauthenticated`
//     );

//     console.log("Cloud Run 部署完成！", deployOutput);
//     return deployOutput;
//   } catch (error) {
//     console.error(
//       "Fail to deploy error:",
//       error.response?.data || error.message
//     );
//     throw new Error("部署失敗");
//   }
// }

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