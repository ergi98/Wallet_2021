// Icons
import {
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";

interface PropsInterface {
  value: boolean;
  onClick: () => void;
}
function ToggleVisibility(props: PropsInterface) {
  return (
    <>
      {props.value ? (
        <VisibilityOffOutlined
          sx={{ color: "#9e9e9e", fontSize: "18px" }}
          className="cursor-pointer"
          onClick={props.onClick}
        />
      ) : (
        <RemoveRedEyeOutlined
          sx={{ color: "#9e9e9e", fontSize: "18px" }}
          className="cursor-pointer"
          onClick={props.onClick}
        />
      )}
    </>
  );
}

export default ToggleVisibility;
