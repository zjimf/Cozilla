import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

/**
 * 根據複雜度字串建立對應的數學函式
 * 若複雜度為 "O(n^2)"，則回傳 n => n*n；若為 "O(n)"，則回傳 n => n
 */
const getComplexityFunction = (complexity) => {
  if (complexity.includes("n^2")) return (n) => n * n;
  if (complexity.includes("n")) return (n) => n;
  return () => 0;
};

const ReportModal = ({ open, onClose, reportData }) => {
  // 計算時間複雜度函式
  const originalTimeFunc = getComplexityFunction(reportData.sourceTime);
  const convertedTimeFunc = getComplexityFunction(reportData.convertedTime);

  // 依據 n 從 1 到 5 計算時間複雜度的數值
  const timeChartData = [];
  for (let n = 1; n <= 5; n++) {
    timeChartData.push({
      n: n, // X 軸為 n 值
      Original: originalTimeFunc(n),
      Optimized: convertedTimeFunc(n),
    });
  }

  const spaceValueMapping = (complexity) => {
    if (complexity.includes("n^2")) return 100;
    if (complexity.includes("n")) return 50;
    return 0;
  };
  const spaceChartData = [
    {
      name: "Space Complexity",
      Original: spaceValueMapping(reportData.sourceSpace),
      Optimized: spaceValueMapping(reportData.convertedSpace),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Program conversion analysis report</DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Time complexity
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeChartData}>
              <XAxis
              // dataKey="n"
              // label={{ value: "n", position: "insideBottom", offset: -5 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Original"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="Optimized"
                stroke="#82ca9d"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <Box mt={2}>
            <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
              {reportData.timeCaption}
            </Typography>
          </Box>
        </Box>

        {/* 空間複雜度區塊 (合併在一起的群組柱狀圖) */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Space Complexity
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={spaceChartData}>
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Original" fill="#82ca9d" />
              <Bar dataKey="Optimized" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <Box mt={2}>
            <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
              {reportData.spaceCaption}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
