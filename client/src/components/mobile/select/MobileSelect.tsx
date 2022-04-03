import { ChangeEvent, useState } from "react";

// MUI
import {
	List,
	Stack,
	Button,
	Divider,
	ListItem,
	FormLabel,
	TextField,
	ListItemText,
	ListItemButton,
} from "@mui/material";

// Utilities
import { isStringEmpty } from "../../../utilities/general-utilities";

interface SelectOption {
	text: string;
	value: string;
}

interface PropsInterface {
	value: string;
	label: string;
	search?: boolean;
	multiple?: boolean;
	options: Array<SelectOption>;
	onChange: (a: Array<string> | string) => void;
}

function MobileSelect(props: PropsInterface) {
	const [localOptions, setLocalOptions] = useState<Array<SelectOption>>(
		() => props.options
	);

	const [selectedOptions, setSelectedOptions] = useState<Array<string>>([]);

	function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
		let value = event.target.value?.toLowerCase()?.trim();
		if (isStringEmpty(value)) setLocalOptions(props.options);
		else {
			let filteredOptions = props.options.filter((option) =>
				option.text.toLowerCase().includes(value)
			);
			setLocalOptions(filteredOptions);
		}
	}

	const isSelected = (value: string): boolean =>
		selectedOptions.find((option) => option === value) !== undefined;

	function handleItemClick(value: string) {
		// Multi value select
		if (props.multiple) {
			if (isSelected(value)) {
				setSelectedOptions((prev) =>
					prev.filter((prevOption) => prevOption === value)
				);
			} else {
				setSelectedOptions((prev) => [...prev, value]);
			}
		}
		// Single value select
		else setSelectedOptions(isSelected(value) ? [] : [value]);
	}

	const clearSelections = () => setSelectedOptions([]);

	function confirmSelections() {
		console.log(selectedOptions);
		props.onChange(props.multiple ? selectedOptions : selectedOptions[0]);
	}

	return (
		<div className="pb-env">
			<div className="px-3">
				<FormLabel id="custom-select-label">
					<span className=" text-slate-900">{props.label}</span>
				</FormLabel>
				<Divider />
				<div className="py-4">
					{props.search && (
						<TextField
							onChange={handleSearchChange}
							placeholder="Search for a option"
							autoComplete="off"
							label="Search"
							type="search"
							size="small"
							fullWidth
						/>
					)}
				</div>
			</div>
			<div className=" bg-blue h-fit max-h-64 rounded-t-xl overflow-x-hidden overflow-y-auto">
				<List>
					<Divider />
					{localOptions.map((option) => (
						<ListItem
							key={option.value}
							onClick={() => handleItemClick(option.value)}
							selected={isSelected(option.value)}
							sx={{
								"&.Mui-selected": {
									color: "#0f172a",
									backgroundColor: "#bfdbfe",
								},
							}}
							disablePadding
							divider
						>
							<ListItemButton>
								<ListItemText primary={option.text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</div>
			<div className="p-3">
				<Stack direction="row" gap={2}>
					<Button onClick={clearSelections} variant="outlined" fullWidth>
						Clear
					</Button>
					<Button onClick={confirmSelections} variant="contained" fullWidth>
						Done
					</Button>
				</Stack>
			</div>
		</div>
	);
}

export default MobileSelect;
