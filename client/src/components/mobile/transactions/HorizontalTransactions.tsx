// Interfaces
// import { any } from "../../../interfaces/transactions-interface";

// Swiper
import { Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Components
import AlternateTransaction from "./AlternateTransaction";

interface PropsInterface {
	onClick: (a: boolean, b: any | null) => void;
	transactions: Array<any>;
}

function HorizontalTransactions(props: PropsInterface) {
	return (
		<Swiper slidesPerView={2} modules={[Virtual]} virtual>
			{props.transactions.map((transaction, index) => (
				<SwiperSlide key={index}>
					<AlternateTransaction
						onClick={props.onClick}
						transaction={transaction}
					/>
				</SwiperSlide>
			))}
		</Swiper>
	);
}

export default HorizontalTransactions;
