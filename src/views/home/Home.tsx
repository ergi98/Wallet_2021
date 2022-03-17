import {
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Icons
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";

// MUI
import { Button, Stack, Box } from "@mui/material";

// Navigation
import { Outlet } from "react-router-dom";

// Components
import TouchArea from "../../components/general/TouchArea";
import Transaction from "../../components/home/Transaction";

function HomeTransactions() {
  const slidingElementRef = useRef<HTMLDivElement>(null);
  const touchAreaRef = useRef<HTMLDivElement>(null);
  const transactionButtonsRef = useRef<HTMLDivElement>(null);
  const transactionListRef = useRef<HTMLDivElement>(null);

  const [slidingElementBottom, setSlidingElementBottom] = useState<number>(0);

  // Initial position of the sliding element
  const [initialPosition, setInitialPosition] = useState<number>(0);

  // Elements heights
  const [elementsHeight, setElementsHeight] = useState<number>(0);

  // Current mode of the sliding element
  const [activeMode, setActiveMode] = useState<string>(
    localStorage.getItem("mode") || "expanded"
  );
  const bottomPosition: string = useMemo(
    () => localStorage.getItem("bottomPosition") || "0px",
    []
  );
  const availableModes: Array<string> = useMemo(
    () => ["collapsed", "default", "expanded"],
    []
  );
  const transactionHeight: string = useMemo(
    () =>
      localStorage.getItem("transactionHeight") ||
      `${elementsHeight}px` ||
      "0px",
    [elementsHeight]
  );

  
  // Transactions
  const [transactions, setTransactions] = useState<Array<any>>([]);

  const setSliderElementPosition = useCallback(
    (mode: string, height: number): void => {
      let bottomPosition = "";
      switch (mode) {
        case "collapsed":
          bottomPosition = `${height}px`;
          break;
        case "default":
          let parentHeight =
            slidingElementRef.current!.parentElement!.clientHeight;
          bottomPosition = `-${parentHeight * 0.25}px`;
          break;
        case "expanded":
          bottomPosition = `0px`;
          break;
      }
      slidingElementRef.current!.style.bottom = bottomPosition;
      localStorage.setItem("bottomPosition", bottomPosition);
      return;
    },
    []
  );

  const setTransactionsHeight = useCallback(
    (elementHeight: number, bottom: string): void => {
      let parsedBottom = Math.abs(parseInt(bottom.split("px")[0]));
      transactionListRef.current!.style.height = `${
        -1 * elementHeight - parsedBottom - 10
      }px`;
      localStorage.setItem(
        "transactionHeight",
        `${-1 * elementHeight - parsedBottom - 10}px`
      );
      return;
    },
    []
  );

  useEffect(() => {
    let a: any = new Array(20).fill(1);
    setTransactions(a);
  }, []);

  useEffect(() => {
    function setElementHeights(
      sliderHeight: number,
      touchAreaHeight: number,
      buttonsHeight: number
    ): void {
      setElementsHeight(-1 * sliderHeight + touchAreaHeight + buttonsHeight);
    }
    if (
      slidingElementRef.current?.clientHeight &&
      touchAreaRef.current?.clientHeight &&
      transactionButtonsRef.current?.clientHeight
    )
      setElementHeights(
        slidingElementRef.current!.clientHeight,
        touchAreaRef.current!.clientHeight,
        transactionButtonsRef.current!.clientHeight
      );
  }, [
    slidingElementRef.current?.clientHeight,
    touchAreaRef.current?.clientHeight,
    transactionButtonsRef.current?.clientHeight,
  ]);

  useEffect(() => {
    function setSliderElementState(modes: Array<string>): void {
      let storedMode = localStorage.getItem("mode");
      if (storedMode && modes.includes(storedMode)) setActiveMode(storedMode);
    }
    setSliderElementState(availableModes);
  }, [availableModes]);

  useEffect(() => {
    if (!elementsHeight) return;
    setSliderElementPosition(activeMode, elementsHeight);
    return () => {
      localStorage.setItem("mode", activeMode);
    };
  }, [activeMode, elementsHeight, setSliderElementPosition]);

  useEffect(() => {
    if (slidingElementRef?.current?.style?.bottom == null) return;
    setTransactionsHeight(
      elementsHeight,
      slidingElementRef?.current?.style?.bottom
    );
  }, [
    elementsHeight,
    slidingElementRef?.current?.style?.bottom,
    setTransactionsHeight,
  ]);

  // Button Functions
  function goToAddExpense() {}

  function goToAddIncome() {}

  function setStartState(event: TouchEvent<HTMLDivElement>) {
    event.stopPropagation();
    slidingElementRef.current!.classList.remove("transition-all");
    setInitialPosition(event.touches[0].clientY);
    if (slidingElementRef && slidingElementRef.current) {
      let elementBottom = slidingElementRef.current.style.bottom || "0px";
      setSlidingElementBottom(parseInt(elementBottom.split("px")[0]));
    }
  }

  // Slide
  function slideParent(event: TouchEvent<HTMLDivElement>) {
    event.stopPropagation();
    let currentPosition = event.touches[0].clientY;
    let delta = initialPosition - currentPosition;
    let bottomValue = slidingElementBottom + delta;
    if (bottomValue <= elementsHeight) {
      slidingElementRef.current!.style.bottom = `${elementsHeight}}px`;
    } else if (bottomValue > 0) {
      slidingElementRef.current!.style.bottom = `0px`;
    } else {
      slidingElementRef.current!.style.bottom = `${bottomValue}px`;
    }
  }

  function setFinalState(event: TouchEvent<HTMLDivElement>) {
    slidingElementRef.current!.classList.add("transition-all");
    let delta =
      (event.changedTouches[0].clientY - initialPosition) / initialPosition;
    let percentDelta = delta * 100;
    let mode = "";
    // Making transactions smaller
    if (percentDelta > 0) {
      // Enough to trigger a change
      if (percentDelta < 70) {
        percentDelta > 30
          ? (mode = activeMode === "expanded" ? "default" : "collapsed")
          : (mode = activeMode);
      } else if (percentDelta >= 70 && activeMode === "expanded") {
        mode = "collapsed";
      }
    }
    // Making transactions bigger
    else if (percentDelta < 0) {
      if (percentDelta > -70) {
        percentDelta < -30
          ? (mode = activeMode === "collapsed" ? "default" : "expanded")
          : (mode = activeMode);
      } else if (percentDelta <= -70 && activeMode === "collapsed") {
        mode = "expanded";
      }
    }
    if (availableModes.includes(mode)) {
      mode === activeMode
        ? setSliderElementPosition(mode, elementsHeight)
        : setActiveMode(mode);
    }
  }

  return (
    <Box className="relative app-height overflow-hidden">
      <Outlet />
      <Box
        ref={slidingElementRef}
        style={{ bottom: bottomPosition }}
        className="bg-white bg-opacity-80 absolute w-full h-3/4 rounded-t-3xl overflow-hidden"
      >
        <TouchArea
          ref={touchAreaRef}
          onTouchStart={setStartState}
          onTouchMove={slideParent}
          onTouchEnd={setFinalState}
          className="rounded-t-3xl w-full h-8"
        />
        <Box className="px-3">
          <Stack
            className="pb-3"
            direction="row"
            ref={transactionButtonsRef}
            gap={2}
          >
            <Button
              sx={{ borderRadius: 20 }}
              variant="outlined"
              startIcon={<RemoveOutlined />}
              fullWidth
            >
              Expense
            </Button>
            <Button
              sx={{ borderRadius: 20 }}
              variant="contained"
              startIcon={<AddOutlined />}
              fullWidth
            >
              Income
            </Button>
          </Stack>
          <Box
            id="transactionsList"
            ref={transactionListRef}
            className="overflow-y-scroll overscroll-y-contain pr-3 -mr-3"
            style={{ height: transactionHeight }}
          >
            {transactions.length ? (
              transactions.map((_, index) => (
                <Transaction key={index} parentRef={transactionListRef} />
              ))
            ) : (
              <div className="mt-10 px-5 pb-5 text-center">
                <h3 className="uppercase font-bold tracking-wide">
                  No Transactions
                </h3>
                <p className="text-gray">
                  Seems like you have not registered any earning for today.
                </p>
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default HomeTransactions;
