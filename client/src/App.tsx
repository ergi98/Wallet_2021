import React, { useEffect, useState } from "react";

// MUI
import Container from "@mui/material/Container";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Date FNS
import DateAdapter from "@mui/lab/AdapterDateFns";

// Router
import { BrowserRouter } from "react-router-dom";

// Assets
import { ReactComponent as TopRightBlob } from "./assets/blobs/top_right_blob.svg";
import { ReactComponent as MiddleLeftBlob } from "./assets/blobs/middle_left_blob.svg";
import { ReactComponent as BottomRightBlob } from "./assets/blobs/bottom_right_blob.svg";

// Components
import AppRoutes from "./routes/AppRoutes";

// Slider
import "swiper/css";

declare module "@mui/material/styles" {
	interface BreakpointOverrides {
		xs: true;
		sm: true;
		md: true;
		lg: true;
		xl: true;
		"2xl": true;
	}
}

const theme = createTheme({
	palette: {
		primary: {
			main: "#2563eb",
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			"2xl": 1536,
		},
	},
});

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Global View Height (Mobile 100vh Fix)
	useEffect(() => {
		function setGlobalVh() {
			let vh = window.innerHeight * 0.01;
			let root = document.querySelector<HTMLElement>(":root");
			root!.style.setProperty("--vh", `${vh}px`);
			window.addEventListener("resize", setGlobalVh);
			window.addEventListener("orientationchange", setGlobalVh);
		}
		setGlobalVh();
		return () => {
			window.removeEventListener("resize", setGlobalVh);
			window.removeEventListener("orientationchange", setGlobalVh);
		};
	}, []);

	return (
		<LocalizationProvider dateAdapter={DateAdapter}>
			<CssBaseline>
				<Container
					disableGutters
					maxWidth={false}
					className="z-10 h-full overflow-x-hidden overflow-y-auto relative px-env pt-env"
				>
					<React.StrictMode>
						<ThemeProvider theme={theme}>
							<BrowserRouter>
								<AppRoutes isAuthenticated={isAuthenticated} />
							</BrowserRouter>
						</ThemeProvider>
					</React.StrictMode>
				</Container>
				<TopRightBlob className="top-0 right-0 absolute rotate-50 select-none translate-x-1/2 -translate-y-1/2 opacity-50" />
				<MiddleLeftBlob className="left-0 top-1/4 absolute select-none -translate-y-1/5 -translate-x-1/3 opacity-50" />
				<BottomRightBlob className="right-0 bottom-0 absolute select-none translate-y-1/2 translate-x-1/2 opacity-50" />
			</CssBaseline>
		</LocalizationProvider>
	);
}

export default App;
