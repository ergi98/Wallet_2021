import { useEffect, useRef, RefObject } from "react";

// MUI
import { Grid, Typography } from "@mui/material";

// Utilities
import { roundNumber } from "../../utilities/math-utilities";

// Components
import AmountDisplay from "../general/AmountDisplay";

interface TransactionProps {
  parentRef: RefObject<HTMLElement>;
}

function Transaction(props: TransactionProps) {
  const transactionRef = useRef(null);

  useEffect(() => {
    let options = {
      root: props.parentRef.current,
      rootMargin: "0px",
      threshold: [0.25, 0.5, 0.75, 1],
    };

    let observer = new IntersectionObserver(changeElementOpacity, options);

    transactionRef.current && observer.observe(transactionRef.current!);

    function changeElementOpacity(event: any) {
      if (event[0].boundingClientRect.y > event[0].rootBounds.y) {
        let opacity = roundNumber(event[0].intersectionRatio, 2);
        event[0].target.style.opacity = `${opacity}`;
      } else {
        event[0].target.style.opacity = 1;
      }
    }
  }, [props.parentRef]);

  return (
    <Grid
      container
      ref={transactionRef}
      className="w-full bg-white mb-3 p-2 rounded-lg text-icon max-h-28 h-24 overflow-hidden"
    >
      <Grid xs={9} item>
        <Grid className="h-full" columnSpacing={3} container>
          {/** Title */}
          <Grid item>
            <span>13:34&nbsp;-&nbsp;</span>
            <Typography component="span" variant="subtitle2">
              Short Description
            </Typography>
          </Grid>
          {/** Description */}
          <Grid item>
            <div className=" text-xs leading-tight">
              Long Description goes here and here and here and here
            </div>
          </Grid>
          {/* Transaction Type */}
          <Grid alignSelf="end" xs={3} item>
            <div className="text-[9px] uppercase border-[1px] w-fit px-1 rounded-lg border-red-500 text-red-500">
              Expense
            </div>
          </Grid>
          {/* Category */}
          <Grid alignSelf="end" xs={9} item>
            <div className="text-[9px] uppercase border-[1px] w-fit px-1 rounded-lg border-red-500 text-red-500">
              Category name goes here
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid alignSelf="center" xs={3} item>
        {/** Price */}
        <AmountDisplay
          amount={13400.23}
          className="truncate self-center"
          wholeClass="text-icon"
          decimalClass="text-icon text-xs"
        />
      </Grid>
    </Grid>
  );
}

export default Transaction;
