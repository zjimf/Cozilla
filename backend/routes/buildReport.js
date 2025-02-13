const express = require("express");
const router = express.Router();

// POST /buildReport
router.post("/", (req, res) => {
  const { source_code, converted_code } = req.body;

  res.json({ message: "..." });
});

module.exports = router;
