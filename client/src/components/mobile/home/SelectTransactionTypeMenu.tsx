import { useState, MouseEvent } from "react";

// MUI
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";

// Icons
import {
	RiAddFill,
	RiArrowDownCircleLine,
	RiArrowLeftRightLine,
	RiFundsLine,
	RiRepeat2Line,
} from "react-icons/ri";
import { Link } from "react-router-dom";

interface MenuInterface {
	show: boolean;
	anchor: HTMLElement | null;
}

function SelectTransactionTypeMenu() {
	const [menu, setMenu] = useState<MenuInterface>({
		show: false,
		anchor: null,
	});

	const openMenu = (event: MouseEvent<HTMLButtonElement>) =>
		setMenu({ show: true, anchor: event.currentTarget });

	const closeMenu = () => setMenu({ show: false, anchor: null });

	return (
		<div>
			<Button
				id="menu-button"
				onClick={openMenu}
				endIcon={<RiAddFill className=" scale-75" />}
				aria-expanded={menu.show ? "true" : undefined}
				sx={{ color: "inherit", borderColor: "inherit !important" }}
				aria-controls={menu.show ? "transactions-type-menu" : undefined}
				className="border-neutral-50"
				aria-haspopup="true"
				variant="outlined"
				size="small"
			>
				New
			</Button>
			<Menu
				open={menu.show}
				onClose={closeMenu}
				anchorEl={menu.anchor}
				MenuListProps={{
					"aria-labelledby": "menu-button",
				}}
				PaperProps={{
					sx: { background: "rgb(250, 250, 250)" },
				}}
				className="mt-2 ml-1 text-slate-900"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<MenuItem>
					<Link to="/new/expense">
						<ListItemIcon>
							<RiFundsLine className="text-red-400 rotate-180" />
						</ListItemIcon>
						Expense
					</Link>
				</MenuItem>
				<MenuItem>
					<Link to="/new/earning">
						<ListItemIcon>
							<RiFundsLine className="text-green-500" />
						</ListItemIcon>
						Earning
					</Link>
				</MenuItem>
				<MenuItem>
					<Link to="/new/transfer">
						<ListItemIcon>
							<RiArrowLeftRightLine className="text-slate-900" />
						</ListItemIcon>
						Transfer
					</Link>
				</MenuItem>
			</Menu>
		</div>
	);
}

export default SelectTransactionTypeMenu;
