import { Box, Typography } from "@mui/material";

const TimelineProgress = ({ currentStep, onNext, onReset }) => {
  const steps = [1, 2, 3, 4, 5];
  const details = ["Process", "Deploy", "Compile", "Test", "Success"];

  // 計算進度線的寬度：目前的步驟除以 (總步驟 - 1) 乘上 100%
  // 例如：若 currentStep = 1，寬度為 (1/4)*100 = 25%
  const progressWidth = `${(currentStep / (steps.length - 1)) * 100}%`;

  return (
    <Box sx={{ width: "120%", py: 4, textAlign: "center" }}>
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          position: "relative",
          mb: 4,
          height: 50,
        }}
      >
        {/* 底層的灰色線 */}
        <Box
          sx={{
            position: "absolute",
            top: "24%",
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: "grey.300",
            zIndex: 1,
          }}
        />

        {/* 進度動畫線：寬度根據 currentStep 變化，並加上 transition 動畫 */}
        <Box
          sx={{
            position: "absolute",
            top: "24%",
            left: 0,
            height: 2,
            backgroundColor: "primary.main",
            width: progressWidth,
            zIndex: 1.5, // 確保此線條顯示在灰色線上面
            transition: "width 0.3s ease", // 動畫效果：寬度平滑過渡
          }}
        />

        {/* 顯示各個步驟的圓點與文字 */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {steps.map((step, index) => {
            // 判斷此點是否已完成或為當前點
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            return (
              <Box key={index} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: isCompleted
                      ? "primary.main"
                      : isActive
                      ? "primary.light"
                      : "grey.300",
                    border: isActive ? "3px solid primary.main" : "none",
                    transition: "background-color 0.3s ease, border 0.3s ease",
                    margin: "0 auto",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {details[step - 1]}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default TimelineProgress;
