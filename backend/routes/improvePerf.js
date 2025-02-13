const express = require("express");
const router = express.Router();

// POST /improvePerf
router.post("/", (req, res) => {
  const { converted_code } = req.body;

  res.json({ message: "..." });
});

module.exports = router;
