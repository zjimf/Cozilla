import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const llm = {
  Models: [
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-2.0-pro-exp-02-05",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro-002",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-001",
    "gemini-1.0-pro-002",
    "gemini-1.0-pro-vision-001",
    "Meta Llama 3.2 90B Instruct",
    "Meta Llama 3 8B Instruct",
    "Meta Llama 3 70B Instruct",
    "Meta Llama 3 405B Instruct",
  ],
};

const LLMSelector = ({ llmModals, setLlmModal }) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <FormControl variant="outlined" sx={{ width: "225px" }}>
        <InputLabel id="models-label">Models</InputLabel>
        <Select
          labelId="models-label"
          value={llmModals}
          onChange={(e) => setLlmModal(e.target.value)}
          label="Models"
        >
          {llm.Models.map((model, index) => (
            <MenuItem key={index} value={model}>
              {model}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LLMSelector;
