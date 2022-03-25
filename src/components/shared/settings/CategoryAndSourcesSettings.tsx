import { ChangeEvent, useState } from "react";

// MUI
import {
  Radio,
  Stack,
  SvgIcon,
  FormLabel,
  IconButton,
  RadioGroup,
  Typography,
  FormControl,
  FormControlLabel,
} from "@mui/material";

// Icons
import { RiSortAsc, RiSortDesc } from "react-icons/ri";

// Components
import ValidationHint from "../../general/ValidationHint";

const options = [
  {
    direction: true,
    value: "frequency",
    label: "Frequency",
  },
  {
    direction: true,
    value: "amount",
    label: "Amount Spent",
  },
  {
    direction: false,
    value: "intelligent",
    label: "Intelligent Sort *",
  },
];

let entries = [
  {
    key: "categories",
    label: "By default sort <strong>categories</strong> by:",
  },
  {
    key: "sources",
    label: "By default sort <strong>sources</strong> by:",
  },
];

function CategoryAndSourcesSettings() {
  const [categorySort, setCategorySort] = useState({
    direction: "dsc",
    type: "",
  });
  const [sourcesSort, setSourcesSort] = useState({
    direction: "dsc",
    type: "",
  });

  function handleCategoryChange(event: ChangeEvent<HTMLInputElement>) {
    setCategorySort((prev) => {
      return {
        ...prev,
        type: event.target.value,
      };
    });
  }

  function handleSourceChange(event: ChangeEvent<HTMLInputElement>) {
    setSourcesSort((prev) => {
      return {
        ...prev,
        type: event.target.value,
      };
    });
  }

  function toggleCategoryDirection() {
    setCategorySort((prev) => {
      return {
        ...prev,
        direction: prev.direction === "dsc" ? "asc" : "dsc",
      };
    });
  }

  function toggleSourceDirection() {
    setSourcesSort((prev) => {
      return {
        ...prev,
        direction: prev.direction === "dsc" ? "asc" : "dsc",
      };
    });
  }

  return (
    <Stack className=" text-slate-900">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography className="text-blue-900" variant="subtitle1">
          Category and Sources
        </Typography>
        <span className="text-neutral-400">
          <ValidationHint
            content={
              <div className=" max-w-[200px] text-sm">
                With intelligent sort we monitor your spending/earning habits
                and sort categories/sources based on what you are most likely to
                choose at any given time of day.
              </div>
            }
          />
        </span>
      </Stack>
      {entries.map((entry) => (
        <div key={entry.key} className="pl-1 pt-3">
          <FormControl className="w-full">
            <FormLabel
              id={`radio-buttons-group-label-${entry.key}`}
              sx={{ color: "inherit", "&.Mui-focused": { color: "inherit" } }}
            >
              <span
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: entry.label }}
              />
            </FormLabel>
            <RadioGroup
              className="px-3"
              value={
                entry.key === "categories"
                  ? categorySort.type
                  : sourcesSort.type
              }
              onChange={
                entry.key === "categories"
                  ? handleCategoryChange
                  : handleSourceChange
              }
              name={`radio-buttons-group-${entry.key}`}
              aria-labelledby={`radio-buttons-group-label-${entry.key}`}
            >
              {options.map((option) => [
                <Stack
                  key={option.value}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormControlLabel
                    value={option.value}
                    control={<Radio size="small" />}
                    label={<span className="text-sm">{option.label}</span>}
                  />
                  {entry.key === "categories"
                    ? option.direction && (
                        <div
                          className={` transition-all duration-500 ${
                            categorySort.type === option.value
                              ? "scale-100"
                              : "scale-0 opacity-0"
                          }`}
                        >
                          <IconButton onClick={toggleCategoryDirection}>
                            <SvgIcon className="scale-[65%]">
                              {categorySort.direction === "asc" ? (
                                <RiSortAsc />
                              ) : (
                                <RiSortDesc />
                              )}
                            </SvgIcon>
                          </IconButton>
                        </div>
                      )
                    : option.direction && (
                        <div
                          className={` transition-all duration-500 ${
                            sourcesSort.type === option.value
                              ? "scale-100"
                              : "scale-0 opacity-0"
                          }`}
                        >
                          <IconButton onClick={toggleSourceDirection}>
                            <SvgIcon className="scale-[65%]">
                              {sourcesSort.direction === "asc" ? (
                                <RiSortAsc />
                              ) : (
                                <RiSortDesc />
                              )}
                            </SvgIcon>
                          </IconButton>
                        </div>
                      )}
                </Stack>,
              ])}
            </RadioGroup>
          </FormControl>
        </div>
      ))}
    </Stack>
  );
}

export default CategoryAndSourcesSettings;
