const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.use("/transferCode", require("./routes/transferCode"));
app.use("/buildEnv", require("./routes/buildEnv"));
app.use("/deployCode", require("./routes/deployCode"));
app.use("/testCode", require("./routes/testCode"));
app.use("/fixCode", require("./routes/fixCode"));
app.use("/improvePerf", require("./routes/improvePerf"));
app.use("/buildReport", require("./routes/buildReport"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
