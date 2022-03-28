import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";

let defaultOptions: Array<DefaultOption> = [
  {
    value: true,
    key: "date",
    label: "Use today's date as default",
  },
  {
    value: false,
    key: "location",
    label: "Use current location as default",
  },
];

let sortOptions: Array<any> = [
  {
    value: "title",
    label: "Sort by title",
  },
  {
    value: "amount",
    label: "Sort by amount",
  },
  {
    value: "date",
    label: "Sort by date",
  },
];

interface SortInterface {
  direction: string;
  type: string;
}

interface DefaultsInterface {
  date: boolean;
  location: boolean;
}

interface DefaultOption {
  value: boolean;
  label: string;
  key: keyof DefaultsInterface;
}

function TransactionsSettings() {
  const [transactionsSort, setTransactionsSort] = useState<SortInterface>({
    direction: "dsc",
    type: "",
  });

  const [transactionDefaults, setTransactionDefaults] =
    useState<DefaultsInterface>({
      date: true,
      location: true,
    });

  function handleSortByChange(event: ChangeEvent<HTMLInputElement>) {
    setTransactionsSort((prev) => {
      return {
        ...prev,
        type: event.target.value,
      };
    });
  }

  function handleDirectionChange() {
    setTransactionsSort((prev) => {
      return {
        ...prev,
        direction: prev.direction === "dsc" ? "asc" : "dsc",
      };
    });
  }

  function handleDefaultsChange(
    event: ChangeEvent<HTMLInputElement>,
    key: string
  ) {
    console.log(event, key);
    setTransactionDefaults((prev) => {
      return {
        ...prev,
        [key]: event.target.checked,
      };
    });
  }

  return (
    <Stack className="text-slate-900">
      <Typography className="text-blue-900" variant="subtitle1">
        Transactions
      </Typography>
      {/* Default values */}
      <div className="pl-1 pt-3">
        <FormControl>
          <FormLabel
            sx={{ color: "inherit", "&.Mui-focused": { color: "inherit" } }}
          >
            <span className="text-sm">When creating a transaction</span>
          </FormLabel>
          <FormGroup className="pl-3">
            {defaultOptions.map((option) => (
              <FormControlLabel
                key={option.key}
                value={option.value}
                control={
                  <Checkbox
                    size="small"
                    checked={transactionDefaults[option.key]}
                    onChange={(event) =>
                      handleDefaultsChange(event, option.key)
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={<span className="text-sm">{option.label}</span>}
              />
            ))}
          </FormGroup>
        </FormControl>
      </div>
      {/* Sorting */}
      <div className="pl-1 pt-3">
        <FormControl className="w-full">
          <FormLabel
            id="radio-buttons-group-label-transactions"
            sx={{ color: "inherit", "&.Mui-focused": { color: "inherit" } }}
          >
            <span className="text-sm">When viewing transactions</span>
          </FormLabel>
          <RadioGroup
            className="px-3"
            value={transactionsSort.type}
            onChange={handleSortByChange}
            name="radio-buttons-group-transactions"
            aria-labelledby="radio-buttons-group-label-transactions"
          >
            {sortOptions.map((option) => (
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
                <div
                  className={` transition-all duration-500 ${
                    transactionsSort.type === option.value
                      ? "scale-100"
                      : "scale-0 opacity-0"
                  }`}
                >
                  <IconButton onClick={handleDirectionChange}>
                    <SvgIcon className="scale-[65%]">
                      {transactionsSort.direction === "asc" ? (
                        <RiSortAsc />
                      ) : (
                        <RiSortDesc />
                      )}
                    </SvgIcon>
                  </IconButton>
                </div>
              </Stack>
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </Stack>
  );
}

export default TransactionsSettings;
