import { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FileUploader from "./FileUploader";

const App = () => {
  const [files, setFiles] = useState([]);

  /**
   * 當使用者點擊「傳送到後端」按鈕時，會建立 FormData 並發送檔案
   */
  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("請先上傳檔案再傳送！");
      return;
    }

    // 建立 FormData 物件
    const formData = new FormData();
    // 將每個檔案加入 FormData，假設後端的欄位名稱為 "files"
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // 請依照你的後端 API 調整 URL 與其他參數
      const response = await fetch("http://your-backend-url/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("後端回傳結果:", result);
      alert("上傳成功！");
    } catch (error) {
      console.error("上傳錯誤:", error);
      alert("上傳失敗，請檢查後端服務是否正常。");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          minWidth: "90vw",
          minHeight: "90vh",
          boxShadow:
            "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
          borderRadius: "10px",
          padding: "16px", // 加上 padding 避免內容過於貼邊
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            檔案上傳
          </Typography>
          {/* 引入檔案上傳元件 */}
          <FileUploader files={files} setFiles={setFiles} />
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={handleSubmit}>
            Next
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default App;
