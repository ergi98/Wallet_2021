// MUI
import { Typography } from "@mui/material";

// Swiper
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/pagination";

// Interfaces
import { PortfolioDetailsInterface } from "../../../interfaces/portfolios-interface";

// Components
import PortfolioStatisticsFields from "./PortfolioStatisticsFields";

interface PropsInterface {
  details: PortfolioDetailsInterface;
}

function PortfolioStatistics(props: PropsInterface) {
  return (
    <div className="bg-neutral-50 p-3 pb-0 rounded-lg text-slate-900 h-full">
      <Typography variant="h6">Statistics</Typography>
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={30}
        className="-mt-1 -mx-3"
        centeredSlides
        pagination
      >
        <SwiperSlide>
          <div className="pb-10">
            <PortfolioStatisticsFields
              details={props.details}
              type="expenses"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="pb-10">
            <PortfolioStatisticsFields
              details={props.details}
              type="earnings"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default PortfolioStatistics;
