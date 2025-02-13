const express = require("express");
const router = express.Router();

// POST /buildEnv
router.post("/", (req, res) => {
  const { converted_code, selected_LLM } = req.body;

  res.json({ message: "..." });
});

module.exports = router;
