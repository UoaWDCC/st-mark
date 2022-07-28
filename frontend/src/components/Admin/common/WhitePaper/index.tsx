import { Paper } from "@mui/material";
import { withStyles } from "@mui/styles";

// For when you miss the old Paper
const WhitePaper = withStyles({
  root: { backgroundColor: "white" },
})(Paper);

export default WhitePaper;
