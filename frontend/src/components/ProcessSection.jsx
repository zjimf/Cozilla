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
import ReportModal from "./ReportModal";
import { parseReportText } from "../functions/parseReportText";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  minHeight: "300px",
}));

// 單一檔案的展開區塊元件
const TransferSectionItem = ({ file, fileContent }) => {
  const [openReport, setOpenReport] = useState(false);

  const [active, setActive] = useState(1);

  const [open, setOpen] = useState(true);

  const [tabValue, setTabValue] = useState("original");

  const [convertedCode, setConvertedCode] = useState("");

  const [reportRawText, setReportRawText] = useState("");

  const handleChipClick = () => {
    setOpen(!open);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownload = (name, fileContent) => {
    let fileExtension = "txt"; // 預設為 txt

    // 偵測是否為 Java 程式碼
    if (
      fileContent.includes("import java") ||
      fileContent.includes("public class") ||
      fileContent.includes("package ")
    ) {
      fileExtension = "java";
    }
    // 偵測是否為 Python 程式碼（這裡簡單檢查 def 或特定 import 語法）
    else if (
      fileContent.includes("def ") ||
      (fileContent.includes("import ") && fileContent.includes(":"))
    ) {
      fileExtension = "py";
    }

    // 建立 Blob 物件（這邊使用純文字格式）
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    // 產生一個指向 Blob 的 URL
    const url = URL.createObjectURL(blob);

    // 建立一個臨時的 <a> 標籤，並設定下載屬性
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}_converted.${fileExtension}`;
    // 將 <a> 標籤加入文件中，模擬點擊進行下載
    document.body.appendChild(a);
    a.click();
    // 下載後清除 <a> 標籤及釋放 URL 物件
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClickOpen = () => setOpenReport(true);

  const handleClose = () => setOpenReport(false);

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
                  setReportRawText={setReportRawText}
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
                            <>
                              <MedicationIcon
                                sx={{ cursor: "pointer", marginX: "5px" }}
                                onClick={handleClickOpen}
                              />
                              <ReportModal
                                open={openReport}
                                onClose={handleClose}
                                reportData={parseReportText(reportRawText)}
                              />
                            </>
                          )}

                          <DownloadIcon
                            sx={{ cursor: "pointer", marginX: "5px" }}
                            onClick={() =>
                              handleDownload(file.name, convertedCode)
                            }
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
