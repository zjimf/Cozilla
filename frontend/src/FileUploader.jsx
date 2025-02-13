import { useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const FileUploader = ({ files, setFiles }) => {
  // 使用 useState 儲存上傳的檔案陣列
  // 使用 useRef 取得隱藏的 <input> 元件參考
  const inputRef = useRef(null);

  /**
   * 當使用者選擇檔案時觸發
   * 將 FileList 轉換成陣列存入 state
   */
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  /**
   * 點擊上傳按鈕時觸發隱藏的 input 點擊事件
   */
  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  /**
   * 格式化檔案大小，依據大小自動換算單位
   * @param {number} size 檔案大小（位元組）
   */
  const formatSize = (size) => {
    if (size < 1024) {
      return size + " B";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    }
  };

  return (
    <Box>
      {/* 隱藏的檔案上傳 input，允許上傳任意檔案且多選 */}
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {/* 上傳檔案按鈕 */}
      <Button variant="contained" onClick={handleUploadClick}>
        上傳檔案
      </Button>
      {/* 顯示上傳檔案資訊 */}
      <Box mt={2}>
        {files?.length > 0 ? (
          <List>
            {files?.map((file, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`檔名：${file.name}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        大小：{formatSize(file.size)}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        修改時間：{new Date(file.lastModified).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">尚未上傳檔案</Typography>
        )}
      </Box>
    </Box>
  );
};

export default FileUploader;
