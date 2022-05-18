import { useState, useEffect } from "react";

// Recharts
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";

// Components
import AmountDisplay from "../../general/AmountDisplay";

interface TooltipProps {
	active?: Boolean;
	payload?: Array<any>;
}

interface PropsInterface {
	data: Array<{
		[key: string]: string | number;
	}>;
	labelKey?: string;
	valueKey?: string;
}

const CustomTooltip = (props: TooltipProps) => {
	if (props.active && props.payload && props.payload.length) {
		return (
			<div className="bg-neutral-50 text-slate-700 px-3 rounded-xl">
				<AmountDisplay
					wholeClass="text-xs"
					decimalClass="text-[10px]"
					className="pb-[2px]"
					amount={props.payload[0].value}
				/>
			</div>
		);
	}
	return null;
};

function SparkLine(props: PropsInterface) {
	const [showChart, setShowChart] = useState<boolean>(true);

	useEffect(() => {
		const checkIfShouldRenderChart = (data: Array<any>) =>
			setShowChart(data.length !== 0);
		checkIfShouldRenderChart(props.data);
	}, [props.data]);

	return (
		<>
			{showChart ? (
				<div className="p-3">
					<ResponsiveContainer width="100%" height={128}>
						<AreaChart data={props.data}>
							<Tooltip content={<CustomTooltip />} />
							<XAxis
								axisLine={false}
								tickLine={false}
								dataKey={props.labelKey ?? "label"}
								tick={{ fill: "white", fontSize: 12, strokeWidth: 0 }}
							/>
							<Area
								dot={true}
								fillOpacity={1}
								activeDot={{ fill: "#3b82f6" }}
								dataKey={props.valueKey ?? "value"}
								type="monotone"
								stroke="#fafafa"
								fill="url(#gradient)"
							/>
							<defs>
								<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#fafafa" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#fafafa" stopOpacity={0} />
								</linearGradient>
							</defs>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			) : null}
		</>
	);
}

export default SparkLine;
