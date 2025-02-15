import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import ProcessSectionRenderContent from "./ProcessSectionRenderContent";

const ProcessSectionSetting = ({
  fileContent,
  setConvertedCode,
  setTabValue,
  active,
  setActive,
  setReportRawText,
}) => {
  const handleClick = (button) => {
    setActive(button);
  };

  return (
    <Box>
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button
          onClick={() => handleClick(1)}
          sx={{
            backgroundColor: active === 1 ? "primary.main" : "grey.300",
            color: active === 1 ? "white" : "black",
            "&:hover": {
              backgroundColor: active === 1 ? "primary.dark" : "grey.400",
            },
          }}
        >
          Convert
        </Button>
        <Button
          onClick={() => handleClick(2)}
          sx={{
            backgroundColor: active === 2 ? "primary.main" : "grey.300",
            color: active === 2 ? "white" : "black",
            "&:hover": {
              backgroundColor: active === 2 ? "primary.dark" : "grey.400",
            },
          }}
        >
          Optimize
        </Button>
        <Button
          onClick={() => handleClick(3)}
          sx={{
            backgroundColor: active === 3 ? "primary.main" : "grey.300",
            color: active === 3 ? "white" : "black",
            "&:hover": {
              backgroundColor: active === 3 ? "primary.dark" : "grey.400",
            },
          }}
        >
          Debug
        </Button>
      </ButtonGroup>

      <Box
        sx={{
          mt: 2,
          p: 2,
          minHeight: "200px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Stack spacing={5} direction="column">
          <ProcessSectionRenderContent
            fileContent={fileContent}
            setConvertedCode={setConvertedCode}
            active={active}
            currentStep={1}
            setTabValue={setTabValue}
            setReportRawText={setReportRawText}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default ProcessSectionSetting;
