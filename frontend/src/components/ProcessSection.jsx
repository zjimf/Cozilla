import { useState } from "react";
import { Box, Paper, Grid, Chip, Collapse, Button, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import ProcessSectionSetting from "./ProcessSectionSetting";
import CodeBlock from "./CodeBlock";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TimelineProgress from "./TimelineProgress";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  minHeight: "300px",
}));

// 單一檔案的展開區塊元件
const TransferSectionItem = ({ file, fileContent, onBack }) => {
  const [open, setOpen] = useState(true);
  // 控制分頁，預設為原始程式碼
  const [tabValue, setTabValue] = useState("original");

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // 暫時使用與原始程式碼相同的轉換結果（後續可替換成真正轉換結果）
  const convertedCode = "converted \n" + fileContent;

  const handleChipClick = () => {
    console.info("You clicked the Chip for", file.name);
    setOpen(!open);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Chip
        label={file.name}
        color="error"
        onClick={handleChipClick}
        sx={{ cursor: "pointer", mb: 1 }}
      />
      <Collapse in={open}>
        <Box sx={{ flexGrow: 1, paddingY: "10px" }}>
          <Grid container columnSpacing={2}>
            <Grid item xs={3.5}>
              <Item sx={{ minHeight: "420px" }}>
                <ProcessSectionSetting />
              </Item>
            </Grid>
            <Grid item xs={8.5}>
              <Item sx={{ minHeight: "420px", position: "relative" }}>
                <TabContext value={tabValue}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TabList onChange={handleTabChange} aria-label="code tabs">
                      <Tab label="Original Code" value="original" />
                      <Tab label="Converted Code" value="converted" />
                    </TabList>
                    {/* TimelineProgress 放在右側，使用絕對定位 */}
                    <Box
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateX(-50%) translateY(-40%)",
                      }}
                    >
                      <TimelineProgress
                        currentStep={currentStep} // 這邊可根據實際進度傳遞數值
                        onNext={handleNext}
                      />
                    </Box>
                  </Box>
                  <TabPanel value="original" sx={{ p: 1 }}>
                    <Box
                      sx={{
                        textAlign: "left",
                        background: "#f7f7f7",
                        borderRadius: "4px",
                        maxHeight: "340px",
                        overflowY: "auto",
                        p: 1,
                      }}
                    >
                      <CodeBlock code={fileContent} language="python" />
                    </Box>
                  </TabPanel>
                  <TabPanel value="converted" sx={{ p: 1 }}>
                    <Box
                      sx={{
                        textAlign: "left",
                        background: "#f7f7f7",
                        borderRadius: "4px",
                        maxHeight: "340px",
                        overflowY: "auto",
                        p: 1,
                      }}
                    >
                      <CodeBlock code={convertedCode} language="python" />
                    </Box>
                  </TabPanel>
                </TabContext>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

const ProcessSection = ({ files, fileContents, onBack }) => {
  return (
    <Box>
      {files.map((file, index) => (
        <TransferSectionItem
          key={index}
          file={file}
          fileContent={fileContents[file.name]}
          onBack={onBack}
        />
      ))}
    </Box>
  );
};

export default ProcessSection;
