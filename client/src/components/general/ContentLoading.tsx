import React, { ReactNode } from "react";

interface LoadingProps {
	loading: boolean;
	dimensions: { height: number; width: number };
	children: ReactNode;
}
function ContentLoading(props: LoadingProps) {
	return (
		<>
			<div className={props.loading ? "hidden" : ""}>{props.children}</div>
			{props.loading && (
				<div
					style={{
						height: `${props.dimensions.height}px`,
						width: `${
							props.dimensions.width || props.dimensions.height * 1.5
						}px`,
					}}
					className="bg-slate-50/20 overflow-hidden"
				>
					<div className="loading-animation w-full h-full bg-gradient-to-r from-slate-50/0 via-slate-50/30 to-slate-50/0"></div>
				</div>
			)}
		</>
	);
}

export default ContentLoading;
