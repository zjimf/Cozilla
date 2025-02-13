const express = require("express");
const router = express.Router();

// POST /transferCode
router.post("/", (req, res) => {
  const { source_code, converted_code } = req.body;
  let output = "";

  res.json({ message: "...", output });
});

module.exports = router;
