// Icons
import { LockOutlined, LockOpenOutlined } from "@mui/icons-material";

interface PropsInterface {
  value: boolean;
  onClick: () => void;
}
function ToggleVisibility(props: PropsInterface) {
  return (
    <>
      {props.value ? (
        <LockOpenOutlined
          sx={{ fontSize: "20px" }}
          className="cursor-pointer"
          onClick={props.onClick}
        />
      ) : (
        <LockOutlined
          sx={{ fontSize: "20px" }}
          className="cursor-pointer"
          onClick={props.onClick}
        />
      )}
    </>
  );
}

export default ToggleVisibility;
