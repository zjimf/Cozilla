import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const FileUploader = ({ files, setFiles, setFileContents, onDelete }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // 將新檔案合併進現有檔案
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const fileContent = event.target.result;
          setFileContents((prevContents) => ({
            ...prevContents,
            [file.name]: fileContent,
          }));
        };

        reader.readAsText(file);
      });
    },
    [setFiles, setFileContents]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".js,.py,.java,.cpp,.txt", // 允許的文件類型
  });

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
    <>
      <div
        {...getRootProps()}
        style={{
          background: "#f2f2f2",
          padding: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input {...getInputProps()} />
        <p>拖放或點擊上傳程式碼檔案 (.js, .py, .java, .cpp, .txt)</p>
      </div>
      {files.length > 0 && (
        <Box
          sx={{
            background: "#f2f2f2",
            maxHeight: "200px",
            overflowY: "auto",
            padding: "10px",
            position: "relative",
          }}
        >
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete(file.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
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
        </Box>
      )}
    </>
  );
};

export default FileUploader;
