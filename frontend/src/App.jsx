import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import FileUploadSection from "./components/FileUploadSection";
import ProcessSection from "./components/ProcessSection";

const App = () => {
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState({}); // 儲存檔案名稱與內容
  const [step, setStep] = useState(0); // 0：上傳區塊，1：下一個區塊

  // 切換到下一個區塊
  const handleNext = () => {
    setStep(1);
  };

  // 返回上一區塊
  const handleBack = () => {
    setStep(0);
  };

  const handleDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setFileContents((prevContents) => {
      const newContents = { ...prevContents };
      delete newContents[fileName];
      return newContents;
    });
  };

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "90vw",
          height: "90vh",
          boxShadow:
            "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
          borderRadius: "10px",
          padding: "16px",
          overflow: "auto",
        }}
      >
        <CardContent>
          {/* 上傳區塊 */}
          <Slide direction="right" in={step === 0} mountOnEnter unmountOnExit>
            <Box>
              <FileUploadSection
                files={files}
                setFiles={setFiles}
                fileContents={fileContents}
                setFileContents={setFileContents}
                onDelete={handleDelete}
              />
            </Box>
          </Slide>

          {/* 下一個區塊 */}
          <Slide direction="left" in={step === 1} mountOnEnter unmountOnExit>
            <Box>
              <ProcessSection
                files={files}
                fileContents={fileContents}
                onBack={handleBack}
              />
            </Box>
          </Slide>
        </CardContent>

        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* 在上傳區塊顯示 Next 按鈕 */}
          {step === 0 && (
            <Button
              variant="outlined"
              onClick={handleNext}
              disabled={files.length === 0}
            >
              Next
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default App;
