import { useState } from "react";
import { Stack, Typography, Button, Box } from "@mui/material";
import LanguageSelector from "./LanguageSelector.jsx";
import LLMSelector from "./LLMSelector.jsx";

const ProcessSectionRenderContent = ({ active }) => {
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [sourceVersion, setSourceVersion] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [targetVersion, setTargetVersion] = useState("");
  const [llmModal, setLlmModal] = useState("");

  // 檢查是否所有必要欄位都有填寫
  const canGo =
    sourceLanguage &&
    sourceVersion &&
    llmModal &&
    (active === 2 || (targetLanguage && targetVersion));

  const handleGo = () => {
    // 在此可以處理下一步的邏輯，例如傳遞參數到下一個區塊或進行 API 呼叫
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Typography gutterBottom sx={{ fontWeight: "bold" }}>
        原始程式
      </Typography>
      <LanguageSelector
        language={sourceLanguage}
        setLanguage={setSourceLanguage}
        version={sourceVersion}
        setVersion={setSourceVersion}
      />
      {active !== 2 && (
        <>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            欲轉換程式
          </Typography>
          <LanguageSelector
            language={targetLanguage}
            setLanguage={setTargetLanguage}
            version={targetVersion}
            setVersion={setTargetVersion}
          />
        </>
      )}
      <Typography gutterBottom sx={{ fontWeight: "bold" }}>
        欲選用 LLM
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <LLMSelector llmModal={llmModal} setLlmModal={setLlmModal} />
        <Button
          variant="contained"
          onClick={handleGo}
          disabled={!canGo}
          sx={{ width: "80px", height: "40px" }}
        >
          Go
        </Button>
      </Box>
    </Stack>
  );
};

export default ProcessSectionRenderContent;
