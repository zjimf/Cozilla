const express = require("express");
const router = express.Router();

// POST /deployCode
router.post("/", (req, res) => {
  const { converted_code, yaml } = req.body;

  res.json({ message: "..." });
});

module.exports = router;
