import { Box, Paper, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import ProcessSectionSetting from "./ProcessSectionSetting";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  minHeight: "300px",
}));

const TransferSection = ({ files, fileContents, onBack }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container columnSpacing={2}>
        <Grid item xs={4}>
          <Item>
            <ProcessSectionSetting />
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>original Code</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransferSection;
