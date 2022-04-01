import { ReactChild, TouchEvent, useEffect, useRef, useState } from "react";

// MUI
import { Dialog } from "@mui/material";

// Components
import TouchArea from "./TouchArea";

interface PropsInterface {
	open: boolean;
	children: ReactChild;
	closeOnSwipe?: boolean;
	onClose: (a: boolean) => void;
}

function BottomDialog(props: PropsInterface) {
	const touchArea = useRef<HTMLDivElement>(null);
	const dialogArea = useRef<HTMLDivElement>(null);

	const [dialogHeight, setDialogHeight] = useState<number>(0);

	useEffect(() => {
		function initialSetup() {
			console.dir(dialogArea.current);
			if (dialogArea.current) {
				let paperHeight =
					dialogArea.current.children[2].children[0].clientHeight;
				setDialogHeight(paperHeight);
			}
		}
		initialSetup();
	}, [dialogArea.current]);

	let bottomPosition: number = 0;
	let userTouchYPosition: number = 0;

	function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
		dialogArea.current!.classList.remove("transition-all");
		userTouchYPosition = event.touches[0].clientY;
		bottomPosition = parseInt(
			dialogArea.current!.style.bottom.split("px")[0] || "0"
		);
	}

	function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
		let currentPosition = event.touches[0].clientY;
		let delta = userTouchYPosition - currentPosition;
		let newBottom = bottomPosition + delta;
		let newBottomStyles = `${newBottom}px`;

		newBottom > 0 && (newBottomStyles = `0px`);
		dialogArea.current!.style.bottom = newBottomStyles;
	}

	function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
		let position = "";
		let delta = userTouchYPosition - event.changedTouches[0].clientY;
		dialogArea.current!.classList.add("transition-all");
		if (delta < userTouchYPosition * -1.5) {
			position = `-${dialogHeight}px`;
			setTimeout(() => {
				props.onClose(false);
			}, 150);
		} else {
			position = "0px";
		}
		dialogArea.current!.style.bottom = position;
	}

	return (
		<Dialog
			sx={{
				".MuiDialog-container": {
					alignItems: "flex-end",
				},
				".MuiPaper-root": {
					bottom: 0,
					margin: 0,
					width: "100%",
					position: "absolute",
					borderTopLeftRadius: "1.5rem",
					borderTopRightRadius: "1.5rem",
				},
			}}
			ref={dialogArea}
			onBackdropClick={() => props.onClose(false)}
			onClose={() => props.onClose(false)}
			open={props.open}
		>
			{props.closeOnSwipe && (
				<TouchArea
					ref={touchArea}
					className="h-7 rounded-t-3xl w-full"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				/>
			)}
			{props.children}
		</Dialog>
	);
}

export default BottomDialog;
