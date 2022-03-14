import React, { ReactChild, useState } from "react";

// Icons
import { HelpOutline } from "@mui/icons-material";

// MUI
import { ClickAwayListener, Tooltip } from "@mui/material";

function ValidationHint({ content }: { content: ReactChild }) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
      <div>
        <Tooltip
          title={content}
          PopperProps={{
            disablePortal: true,
          }}
          onClose={() => setShowTooltip(true)}
          open={showTooltip}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <HelpOutline
            className="cursor-pointer"
            sx={{ color: "#9e9e9e", fontSize: "18px" }}
            onClick={() => setShowTooltip(!showTooltip)}
          />
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}

export default ValidationHint;
