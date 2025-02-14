import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const languageData = {
  java: {
    label: "Java",
    versions: ["2", "7", "8", "9", "11", "17"],
  },
  python: {
    label: "Python",
    versions: [
      "2.0",
      "2.1",
      "2.2",
      "2.3",
      "2.4",
      "2.5",
      "2.6",
      "2.7",
      "3.0",
      "3.1",
      "3.2",
      "3.3",
      "3.4",
      "3.5",
      "3.6",
      "3.7",
      "3.8",
      "3.9",
      "3.10",
      "3.11",
      "3.12",
      "3.13",
    ],
  },
};

const LanguageSelector = ({ language, setLanguage, version, setVersion }) => {
  const [versionOptions, setVersionOptions] = useState([]);

  useEffect(() => {
    if (languageData[language]) {
      setVersionOptions(languageData[language].versions);
      setVersion(languageData[language].versions[0] || "");
    } else {
      setVersionOptions([]);
      setVersion("");
    }
  }, [language, setVersion]);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <FormControl variant="outlined" sx={{ width: "150px" }}>
        <InputLabel id="language-label">Language</InputLabel>
        <Select
          labelId="language-label"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          label="Language"
        >
          {Object.entries(languageData).map(([key, data]) => (
            <MenuItem key={key} value={key}>
              {data.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        sx={{ width: "150px" }}
        disabled={!language}
      >
        <InputLabel
          id="version-label"
          sx={{ color: !language ? "grey.500" : "inherit" }}
        >
          Version
        </InputLabel>
        <Select
          labelId="version-label"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          label="Version"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: !language ? "grey.400" : "primary.main",
            },
            "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey.400",
            },
            "& .MuiSelect-select": {
              color: !language ? "grey.500" : "inherit",
            },
          }}
        >
          {versionOptions.map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
