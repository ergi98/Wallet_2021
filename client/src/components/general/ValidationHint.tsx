import React, { ReactChild, useState } from "react";

// Icons
import { HelpOutline } from "@mui/icons-material";

// MUI
import { ClickAwayListener, Tooltip } from "@mui/material";

interface PropsInterface {
  content: ReactChild;
  placement?: any;
}

function ValidationHint(props: PropsInterface) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
      <div>
        <Tooltip
          title={props.content}
          PopperProps={{
            placement: props.placement ?? "bottom-start",
            disablePortal: true,
          }}
          onClose={() => setShowTooltip(true)}
          open={showTooltip}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          arrow
        >
          <HelpOutline
            className="cursor-pointer"
            sx={{ fontSize: "20px" }}
            onClick={() => setShowTooltip(!showTooltip)}
          />
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

export default ValidationHint;
