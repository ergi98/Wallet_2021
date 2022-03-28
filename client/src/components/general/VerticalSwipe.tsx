import {
  useRef,
  ReactNode,
  TouchEvent,
  useCallback,
  useLayoutEffect,
} from "react";

// Custom Hooks
import useLocalContext from "../../custom_hooks/useLocalContext";

// Components
import TouchArea from "./TouchArea";

interface PropsInterface {
  children?: ReactNode;
  position?: string;
  dimensions?: string;
  background?: string;
  styling?: string;
  minHeight: number;
  context: string;
}

enum MODES {
  COLLAPSED = "collapsed",
  EXPANDED = "expanded",
}

function VerticalSwipe(props: PropsInterface) {
  const verticalSwiper = useRef<HTMLDivElement>(null);
  const touchArea = useRef<HTMLDivElement>(null);

  const [localContext, persistContext] = useLocalContext(
    props.context,
    MODES.EXPANDED
  );

  // The height of the component that can be hidden
  let hidableHeight: number = 0;
  let bottomPosition: number = 0;
  let userTouchYPosition: number = 0;
  let activeMode: MODES = MODES.EXPANDED;

  useLayoutEffect(() => {
    activeMode = localContext;
    snapToPosition(localContext);
    return () => {
      persistContext(props.context, activeMode);
    };
  }, []);

  function registerTouchStart(event: TouchEvent<HTMLDivElement>) {
    verticalSwiper.current!.classList.remove("transition-all");
    userTouchYPosition = event.touches[0].clientY;
    bottomPosition = parseInt(
      verticalSwiper.current!.style.bottom.split("px")[0] || "0"
    );
  }

  function registerTouchMove(event: TouchEvent<HTMLDivElement>) {
    let currentPosition = event.touches[0].clientY;
    let delta = userTouchYPosition - currentPosition;
    let newBottom = bottomPosition + delta;
    let newBottomStyles = `${newBottom}px`;

    !hidableHeight && (hidableHeight = calculateHidableHeight());

    // Do not go below a minimum height and do not float up in the sky
    if (newBottom < 0 && -1 * newBottom >= hidableHeight)
      newBottomStyles = `-${hidableHeight}px`;
    else if (newBottom > 0) newBottomStyles = `0px`;

    verticalSwiper.current!.style.bottom = newBottomStyles;
  }

  function registerTouchEnd(event: TouchEvent<HTMLDivElement>) {
    let mode = activeMode;
    /**
     * When expanding delta is positive
     * When collapsing delta is negative
     */
    let delta = userTouchYPosition - event.changedTouches[0].clientY;
    verticalSwiper.current!.classList.add("transition-all");
    /**
     * Since start position is larger than the end position
     * it means that the delta is positive
     * and that the slider is getting scrolled down
     */
    if (delta > userTouchYPosition * 0.5) {
      mode = MODES.EXPANDED;
    } else if (delta < -1 * userTouchYPosition * 1.5) {
      mode = MODES.COLLAPSED;
    }
    activeMode !== mode && (activeMode = mode);
    snapToPosition(mode);
  }

  const snapToPosition = useCallback((mode) => {
    let bottomPosition = "";
    switch (mode) {
      case MODES.COLLAPSED:
        bottomPosition = `-${calculateHidableHeight()}px`;
        break;
      case MODES.EXPANDED:
        bottomPosition = `0px`;
        break;
    }
    verticalSwiper.current!.style.bottom = bottomPosition;
  }, []);

  const calculateHidableHeight = useCallback(() => {
    if (!verticalSwiper.current || !touchArea.current) return 0;
    return (
      verticalSwiper.current!.clientHeight -
      touchArea.current!.clientHeight -
      props.minHeight
    );
  }, [verticalSwiper, touchArea, props.minHeight]);

  return (
    <div
      ref={verticalSwiper}
      className={`
        ${props.position || "absolute bottom-0"} 
        ${props.dimensions || "w-full h-3/4"} 
        ${props.background || "bg-neutral-50 bg-opacity-90"} 
        ${props.styling || "rounded-t-3xl"}
      `}
    >
      <TouchArea
        ref={touchArea}
        onTouchEnd={registerTouchEnd}
        onTouchMove={registerTouchMove}
        onTouchStart={registerTouchStart}
        className="rounded-t-3xl w-full h-6"
      />
      {props.children}
    </div>
  );
}

export default VerticalSwipe;
