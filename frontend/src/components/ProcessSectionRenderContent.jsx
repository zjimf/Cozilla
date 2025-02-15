import { useState } from "react";
import { Stack, Typography, Button, Box } from "@mui/material";
import LanguageSelector from "./LanguageSelector.jsx";
import LLMSelector from "./LLMSelector.jsx";
import axios from "axios";
import { extractCode } from "../functions/extractCode.js";
import { transferProcess } from "../functions/transferProcess.js";

const ProcessSectionRenderContent = ({
  fileContent,
  setConvertedCode,
  active,
  setTabValue,
}) => {
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [sourceVersion, setSourceVersion] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [targetVersion, setTargetVersion] = useState("");
  const [llmModal, setLlmModal] = useState("");

  const canGo =
    sourceLanguage &&
    sourceVersion &&
    llmModal &&
    (active !== 1 || (targetLanguage && targetVersion));

  const handleGo = async () => {
    setTabValue("converted");
    const requestDataTransfer = {
      source_language: sourceLanguage,
      target_language: targetLanguage,
      source_version: sourceVersion,
      target_version: targetVersion,
      source_code: fileContent,
      selected_LLM: llmModal,
    };
    const requestDataOptimize = {
      source_language: sourceLanguage,
      source_version: sourceVersion,
      source_code: fileContent,
      selected_LLM: llmModal,
    };
    const requestDataDebug = {
      source_language: sourceLanguage,
      source_version: sourceVersion,
      source_code: fileContent,
      selected_LLM: llmModal,
    };

    let endPoint;
    let data;

    if (active == 1) {
      transferProcess(active, requestDataTransfer, setConvertedCode);
    } else if (active == 2) {
      transferProcess(active, requestDataOptimize, setConvertedCode);
    } else if (active == 3) {
      transferProcess(active, requestDataDebug, setConvertedCode);
    }

    try {
      const response = await axios.post(endPoint, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const convertedCode = extractCode(response.data.output);
      setConvertedCode(convertedCode);
    } catch (error) {
      console.error("API 呼叫錯誤：", error);
      if (error.response) {
        console.error("錯誤詳細資訊：", error.response.data);
      }
    }
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
      {active === 1 && (
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
          sx={{ width: "80px", height: "40px", marginRight: "10px" }}
        >
          Go
        </Button>
      </Box>
    </Stack>
  );
};

export default ProcessSectionRenderContent;
