const express = require("express");
const router = express.Router();

// POST /transferCode
router.post("/", (req, res) => {
  const {
    source_language,
    target_language,
    source_version,
    target_version,
    source_code,
    selected_LLM,
  } = req.body;
  let output = "";

  res.json({ message: "...", output });
});

module.exports = router;
