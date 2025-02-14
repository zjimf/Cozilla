// src/components/FileUploadSection.js
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileUploader from "./FileUploader";
import CodeBlock from "./CodeBlock";

const FileUploadSection = ({
  files,
  setFiles,
  fileContents,
  setFileContents,
  onDelete,
}) => {
  return (
    <Box>
      <Typography gutterBottom variant="h5" component="div">
        檔案上傳
      </Typography>
      <FileUploader
        files={files}
        setFiles={setFiles}
        setFileContents={setFileContents}
        onDelete={onDelete}
      />

      {/* <Typography variant="h5" sx={{ margin: "20px 0 10px 0" }}>
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
          flexDirection: "column",
        }}
      >
        {Object.entries(fileContents).map(([fileName, content]) => (
          <Box
            key={fileName}
            sx={{
              backgroundColor: "#ffffff",
              marginX: "10px",
              padding: "10px",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {fileName}
            </Typography>
            <CodeBlock code={content} language="python" />
          </Box>
        ))}
      </Box> */}
    </Box>
  );
};

export default FileUploadSection;
