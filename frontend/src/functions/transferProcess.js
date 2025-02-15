import axios from "axios";
import { extractCode } from "../functions/extractCode.js";
import { formatCode } from "./formatCode.js";

export const transferProcess = async (active, data, setConvertedCode) => {
  try {
    if (active == 1) {
      //transfer
      const transferResponse = await axios.post(
        "http://localhost:8080/transferCode",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("transfer API 回傳：", transferResponse.data.output);
      const convertedCode = extractCode(transferResponse.data.output);

      // test
      data.converted_code = transferResponse.data.output;
      const responseTest = await axios.post(
        "http://localhost:8080/transferCode",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("test API 回傳：", responseTest.data);

      setConvertedCode(convertedCode);
    } else if (active == 2) {
      //improve
      const improveResponse = await axios.post(
        "http://localhost:8080/improvePerf",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("效能 API 回傳：", improveResponse.data.output);
      const convertedCode = extractCode(improveResponse.data.output);

      // test
      data.converted_code = improveResponse.data.output;
      const responseTest = await axios.post(
        "http://localhost:8080/testCode",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("test API 回傳：", responseTest.data);

      //report
      const report = await axios.post(
        "http://localhost:8080/buildReport",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("report API 回傳：", report.data);

      setConvertedCode(convertedCode);
    } else if (active == 3) {
      // debug
      const debugResponse = await axios.post(
        "http://localhost:8080/fixCode",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("debug API 回傳：", debugResponse.data.output);
      const convertedCode = extractCode(debugResponse.data.output);

      // test
      data.converted_code = debugResponse.data.output;
      const responseTest = await axios.post(
        "http://localhost:8080/testCode",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("test API 回傳：", responseTest.data);

      setConvertedCode(convertedCode);
    }
  } catch (error) {
    console.error("呼叫 API 時發生錯誤：", error);
    if (error.response) {
      console.error("錯誤詳細資訊：", error.response.data);
    }
  }
};
