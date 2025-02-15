// src/components/FileUploadSection.js
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileUploader from "./FileUploader";

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
        File upload
      </Typography>
      <FileUploader
        files={files}
        setFiles={setFiles}
        fileContents={fileContents}
        setFileContents={setFileContents}
        onDelete={onDelete}
      />
    </Box>
  );
};

export default FileUploadSection;
