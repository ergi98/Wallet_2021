// MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

// Icons
import { CloseOutlined, Delete, Edit } from "@mui/icons-material";

// Interface
import { TransactionInterface } from "./transactions-interface";

// Utilities
import { formatDate } from "../../utilities/date-utilities";

// Components
import Map from "../general/Map";
import AmountDisplay from "../general/AmountDisplay";

interface PropsInterface {
  show: boolean;
  transaction: TransactionInterface | null;
  onClose: (a: boolean, b: TransactionInterface | null) => void;
}

function TransactionDetailsDialog(props: PropsInterface) {
  const handleClose = () => props.onClose(false, null);
  return (
    <Dialog
      className="px-env"
      fullScreen
      open={props.show}
      onClose={handleClose}
    >
      <div className="pt-env"></div>
      <Stack
        direction="row"
        alignItems="center"
        className="p-3 w-full"
        justifyContent="space-between"
      >
        <Typography
          className="text-slate-900 text-ellipsis overflow-hidden whitespace-nowrap"
          variant="h6"
        >
          Transaction Details
        </Typography>
        <IconButton size="small" onClick={handleClose} aria-label="close">
          <CloseOutlined sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
      <DialogContent sx={{ padding: "2px 14px" }}>
        <Grid className="pb-12" rowSpacing={1} container>
          {props.transaction?.location && (
            <Grid xs={12} item>
              <Map
              zoom={17}
                className="w-full h-36 rounded-lg border-2"
                location={props.transaction.location}
              />
            </Grid>
          )}
          <Grid xs={12} item>
            <Divider className="py-2">
              <span className="uppercase text-gray-400 text-xs">Amount</span>
            </Divider>
          </Grid>
          {/* Amount */}
          <Grid className="text-center" xs={12} item>
            <AmountDisplay
              className="self-center text-slate-900"
              currency={props.transaction?.currency ?? ""}
              amount={props.transaction?.amount ?? 0}
            />
          </Grid>
          {/* Currency Rate */}
          {props.transaction?.currencyRate !== 1 && (
            <Grid className="text-gray-600" xs={5} item>
              Currency Rate
            </Grid>
          )}
          {props.transaction?.currencyRate !== 1 && (
            <Grid className="break-all text-slate-900" xs={7} item>
              {props.transaction?.currencyRate}
            </Grid>
          )}
          <Grid xs={12} item>
            <Divider className="py-2">
              <span className="uppercase text-gray-400 text-xs">Time</span>
            </Divider>
          </Grid>
          {/* Date & Time */}
          <Grid className="text-gray-600" xs={5} item>
            Date
          </Grid>
          <Grid className="break-all text-slate-900" xs={7} item>
            {formatDate(props.transaction?.date ?? "", "long")}
          </Grid>
          <Grid xs={12} item>
            <Divider className="py-2">
              <span className="uppercase text-gray-400 text-xs">Specifics</span>
            </Divider>
          </Grid>
          {/* Type */}
          <Grid className="text-gray-600" xs={5} item>
            Type
          </Grid>
          <Grid className="break-all text-slate-900" xs={7} item>
            <span className="capitalize">{props.transaction?.type}</span>
          </Grid>
          {/* Source || Category */}
          <Grid className="text-gray-600" xs={5} item>
            {props.transaction?.type === "expense" ? "Category" : "Source"}
          </Grid>
          <Grid className="break-all text-slate-900" xs={7} item>
            {props.transaction?.source || props.transaction?.category}
          </Grid>
          {/* Portfolio */}
          <Grid className="text-gray-600" xs={5} item>
            Portfolio
          </Grid>
          <Grid className="break-all text-slate-900" xs={7} item>
            {props.transaction?.portfolio}
          </Grid>
          <Grid xs={12} item>
            <Divider className="py-2">
              <span className="uppercase text-gray-400 text-xs">
                Information
              </span>
            </Divider>
          </Grid>
          {/* Title */}
          <Grid className="text-gray-600" xs={5} item>
            Title
          </Grid>
          <Grid className="break-all text-slate-900" xs={7} item>
            {props.transaction?.title}
          </Grid>
          {/* Description */}
          {props.transaction?.description && (
            <Grid className="text-gray-600" xs={5} item>
              Description
            </Grid>
          )}
          {props.transaction?.description && (
            <Grid className="break-all text-slate-900" xs={7} item>
              {props.transaction?.description}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Delete />} color="error" fullWidth>
          Remove
        </Button>
        <Button
          startIcon={<Edit />}
          variant="contained"
          disableElevation
          fullWidth
        >
          Edit
        </Button>
      </DialogActions>
      <div className="pb-env"></div>
    </Dialog>
  );
}

export default TransactionDetailsDialog;
