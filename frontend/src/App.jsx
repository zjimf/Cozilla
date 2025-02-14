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
  const [fileContents, setFileContents] = useState({}); // 儲存檔案名稱與內容

  // 刪除檔案：從 files 與 fileContents 中移除對應檔案
  const handleDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setFileContents((prevContents) => {
      const newContents = { ...prevContents };
      delete newContents[fileName];
      return newContents;
    });
  };

  /**
   * 當使用者點擊「傳送到後端」按鈕時，會建立 payload 並發送檔案內容（也可同時上傳檔案）
   */
  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("請先上傳檔案再傳送！");
      return;
    }

    // 若有需要上傳檔案本身，可用 FormData 方式；這裡僅示範上傳檔案內容
    const payload = { fileContents };

    try {
      const response = await fetch("http://your-backend-url/upload", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
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
          padding: "16px",
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            檔案上傳
          </Typography>
          {/* 傳入 onDelete 方法 */}
          <FileUploader
            files={files}
            setFiles={setFiles}
            setFileContents={setFileContents}
            onDelete={handleDelete}
          />

          {/* 顯示已上傳的程式碼內容，每個檔案旁都提供刪除按鈕 */}
          <Typography variant="h5" sx={{ marginTop: "20px" }}>
            已上傳的程式碼內容：
          </Typography>
          <Box
            sx={{
              overflowY: "auto",
              overflowX: "auto",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {Object.entries(fileContents).map(([fileName, content]) => (
              <Box
                key={fileName}
                sx={{
                  backgroundColor: "#ffffff",
                  marginX: "10px",
                  padding: "10px",
                  position: "relative",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {fileName}
                </Typography>
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {content}
                </pre>
              </Box>
            ))}
          </Box>
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
