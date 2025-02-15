import { useState } from "react";
import { Box, Paper, Grid, Chip, Collapse, Tab, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import ProcessSectionSetting from "./ProcessSectionSetting";
import CodeBlock from "./CodeBlock";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DownloadIcon from "@mui/icons-material/Download";
import MedicationIcon from "@mui/icons-material/Medication";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  minHeight: "300px",
}));

// 單一檔案的展開區塊元件
const TransferSectionItem = ({ file, fileContent }) => {
  const [open, setOpen] = useState(true);
  // 控制分頁，預設為原始程式碼
  const [tabValue, setTabValue] = useState("original");

  const [convertedCode, setConvertedCode] = useState("");

  const handleChipClick = () => {
    setOpen(!open);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [active, setActive] = useState(1);

  return (
    <Box sx={{ mb: 2 }}>
      <Chip
        label={file.name}
        color={convertedCode !== "" ? "success" : "error"}
        onClick={handleChipClick}
        sx={{ cursor: "pointer", mb: 1 }}
      />
      <Collapse in={open}>
        <Box sx={{ flexGrow: 1, paddingY: "10px" }}>
          <Grid container columnSpacing={2}>
            <Grid item xs={3.5}>
              <Item sx={{ minHeight: "420px" }}>
                <ProcessSectionSetting
                  fileContent={fileContent}
                  setConvertedCode={setConvertedCode}
                  setTabValue={setTabValue}
                  active={active}
                  setActive={setActive}
                />
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

                    <Box
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateX(-50%) translateY(-40%)",
                      }}
                    ></Box>
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
                    {convertedCode !== "" ? (
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
                        <Box
                          sx={{
                            position: "absolute",
                            right: "20px",
                            top: "67px",
                          }}
                        >
                          {active === 2 && (
                            <MedicationIcon
                              sx={{ cursor: "pointer", marginX: "5px" }}
                            />
                          )}

                          <DownloadIcon
                            sx={{ cursor: "pointer", marginX: "5px" }}
                          />
                        </Box>
                        <CodeBlock code={convertedCode} language="python" />
                      </Box>
                    ) : (
                      <Skeleton animation="wave" height={340} />
                    )}
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
