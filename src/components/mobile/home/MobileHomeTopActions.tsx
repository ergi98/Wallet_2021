import { IconButton, Stack } from "@mui/material";
import React from "react";
import { RiArrowLeftRightLine, RiEqualizerLine } from "react-icons/ri";

interface PropsInterface {
  date: string;
  swapClick: () => void;
  changeDate: (a: string) => void;
}
function HomeTopActions(props: PropsInterface) {
  function openDateFilter() {}
  return (
    <Stack
      direction="row"
      className="px-1 pt-3 pb-6"
      justifyContent="space-between"
    >
      <IconButton onClick={openDateFilter} sx={{ fontSize: "20px" }}>
        <RiEqualizerLine className="text-neutral-50" />
      </IconButton>
      <IconButton onClick={() => props.swapClick()} sx={{ fontSize: "20px" }}>
        <RiArrowLeftRightLine className="text-neutral-50" />
      </IconButton>
    </Stack>
  );
}

export default HomeTopActions;
