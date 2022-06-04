// MUI
import styled from "@emotion/styled";
import { ButtonBase, Divider } from "@mui/material";
import { color } from "@mui/system";
import { useState } from "react";

// Interfaces
import { PortfolioType } from "../../interfaces/portfolios-interface";
import { TransactionType } from "../../interfaces/transactions-interface";

interface PropsInterface {
	value: string;
	select: (a: string) => void;
	options: Array<TransactionType | PortfolioType>;
}

const SelectOption = styled(ButtonBase)(() => ({
	height: "40px",
	width: "100%",
	fontSize: ".8rem",
	letterSpacing: ".5px",
	transition: "all 250ms",
	textTransform: "uppercase",
}));

function HorizontalSelect(props: PropsInterface) {
	const [selected, setSelected] = useState({
		index: 0,
		value: props.options[0]._id,
	});

	function handleSelect(
		option: TransactionType | PortfolioType,
		index: number
	) {
		setSelected({
			index,
			value: option._id,
		});
		props.select(option._id);
	}

	function getStyles(index: number) {
		const styles = {} as any;
		if (index === 0) {
			styles.borderRadius = "0.375rem 0 0 0.375rem";
		} else if (index === props.options.length - 1) {
			styles.borderRadius = "0 0.375rem 0.375rem 0";
		}
		if (index === selected.index) {
			const bgColor = getBackgroundColor(props.options[selected.index]);
			styles.backgroundColor = bgColor;
			styles.color = "rgb(250, 250, 250)";
		}
		return styles;
	}

	function getBackgroundColor(option: TransactionType | PortfolioType) {
		let color;
		switch (option.type) {
			case "earning":
				color = "#22c55e";
				break;
			case "expense":
				color = "#f87171";
				break;
			case "transfer":
				color = "#6b7280";
				break;
		}
		return color;
	}

	return (
		<div className="flex rounded-md border">
			{props.options.map((option, index) => (
				<div className="flex-grow flex" key={`option-${index}`}>
					<SelectOption
						onClick={() => handleSelect(option, index)}
						sx={getStyles(index)}
					>
						{option.type}
					</SelectOption>
					{index !== props.options.length - 1 ? (
						<Divider orientation="vertical" flexItem />
					) : null}
				</div>
			))}
		</div>
	);
}

export default HorizontalSelect;
