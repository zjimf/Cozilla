// src/components/ReviewSection.js
import { Box, Typography, Button } from "@mui/material";

const TransferSection = ({ files, fileContents, onBack, onProcess }) => {
  return (
    <Box>
      <Typography variant="h5" component="div">
        下一個區塊
      </Typography>
      <Typography variant="body1">這裡接收到以下參數：</Typography>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {JSON.stringify({ files, fileContents }, null, 2)}
      </pre>
      <Box sx={{ marginTop: "20px" }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ marginRight: "10px" }}
        >
          返回
        </Button>
        <Button variant="outlined" onClick={onProcess}>
          處理資料
        </Button>
      </Box>
    </Box>
  );
};

export default TransferSection;
