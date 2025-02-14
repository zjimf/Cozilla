const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.use("/transferCode", require("./routes/transferCode"));
app.use("/deploy", require("./routes/deploy"));
app.use("/generateYaml", require("./routes/generateYaml"));
app.use("/testCode", require("./routes/testCode"));
app.use("/retransferCode", require("./routes/retransferCode"));
app.use("/fixCode", require("./routes/fixCode"));
app.use("/improvePerf", require("./routes/improvePerf"));
app.use("/buildReport", require("./routes/buildReport"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
