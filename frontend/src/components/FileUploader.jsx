// src/components/FileUploader.js
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
      // 合併新上傳的檔案，不覆蓋舊檔案
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
    accept: {
      "application/javascript": [".js"],
      "text/x-python": [".py"],
      "text/x-java-source": [".java"],
      "text/x-c++src": [".cpp"],
    },
    // 允許的檔案類型
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
    <div
      {...getRootProps()}
      style={{ border: "2px solid gray", padding: "20px", cursor: "pointer" }}
    >
      <input {...getInputProps()} />
      <p>Drag and drop or click to upload code files ( .py, .java)</p>
      <Box>
        {files.length > 0 && (
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete && onDelete(file.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`File: ${file.name}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Size：{formatSize(file.size)}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Last modified time：
                        {new Date(file.lastModified).toLocaleString("en-US")}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </div>
  );
};

export default FileUploader;
