import { Stack } from "@mui/material";
import React, { ForwardedRef, TouchEvent } from "react";

interface TouchAreaProps {
  className?: string;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
  id?: string;
}

const TouchArea = React.forwardRef(
  (props: TouchAreaProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Stack
      ref={ref}
      id={props.id || "touch-area"}
      onTouchStart={props.onTouchStart}
      onTouchMove={props.onTouchMove}
      onTouchEnd={props.onTouchEnd}
      className={`${props.className} bg-transparent flex items-center justify-center`}
    >
      <div className=" bg-gray-500 h-1 w-3/12 rounded-full"></div>
    </Stack>
  )
);

export default TouchArea;
