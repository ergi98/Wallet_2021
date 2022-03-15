// Router
import { useNavigate } from "react-router-dom";

// Icons
import { ChevronLeftOutlined } from "@mui/icons-material";

// MUI
import { Button, Grid, Stack, Typography } from "@mui/material";

interface PropsInterface {
  step: number;
  title: string;
  subtitle?: string;
  paragraph?: string;
}

function ExplainSection(props: PropsInterface) {
  const navigate = useNavigate();
  const navigateToLogin = () => navigate("/login");

  return (
    <Grid
      className="p-6 bg-gradient-to-b from-blue-900 to-blue-600"
      xs={12}
      md={6}
      item
    >
      <Stack justifyContent="space-between" className="h-full text-gray-50">
        <div>
          <div>
            <span>{props.step}</span>
            <span>&nbsp;/&nbsp;{3}</span>
          </div>
          <Typography className="text-gray-300" variant="subtitle1">
            {props.subtitle}
          </Typography>
          <Typography variant="h5">{props.title}</Typography>
        </div>
        <Typography paragraph>
          <span
            dangerouslySetInnerHTML={{
              __html: props.paragraph ?? "",
            }}
          />
        </Typography>
        <Button
          onClick={navigateToLogin}
          startIcon={<ChevronLeftOutlined />}
          variant="text"
          sx={{
            color: "white",
            fontSize: "12px",
            width: "fit-content",
          }}
        >
          Already have an account?
        </Button>
      </Stack>
    </Grid>
  );
}

export default ExplainSection;
