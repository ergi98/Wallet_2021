import { useState } from "react";

// MUI
import { Button, Stack, Typography } from "@mui/material";

// Icons
import { RiAddFill } from "react-icons/ri";

// Interfaces
import { PortfolioInterface } from "../../../interfaces/portfolios-interface";

// Components
import Portfolio from "../../../components/mobile/portfolios/Portfolio";

// Swiper
import { Virtual, EffectCreative } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Components
import AmountDisplay from "../../../components/general/AmountDisplay";
import PortfolioDetails from "../../../components/mobile/portfolios/PortfolioDetails";

const portfolios: Array<PortfolioInterface> = [
  {
    _id: "6023423j4kl32j4kl32j4",
    name: "Portofoli nr.1",
    amount: 24350.0,
    currency: "ALL",
    type: "wallet",
    favorite: false,
    deleted: false,
    color: "gray",
  },
  {
    _id: "6023423j4kl32j4kl32j5",
    name: "Portofoli nr.2",
    amount: 24350.0,
    currency: "ALL",
    type: "wallet",
    favorite: false,
    deleted: false,
    color: "yellow",
  },
];

interface ActiveElement {
  id: string;
  index: number;
}

function MobilePortfolios() {
  const [swiperInstance, setSwiperInstance] = useState<any>();
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    id: "6023423j4kl32j4kl32j4",
    index: 0,
  });

  function handleSwiper(swiper: any) {
    setSwiperInstance(swiper);
  }

  function handleSlideChange(event: any) {
    let index = event.realIndex ?? 0;
    setActiveElement({
      index,
      id: portfolios[index]._id,
    });
  }

  return (
    <div className="app-height relative overflow-y-auto pt-3">
      <div className="px-3">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Portfolios
          </Typography>
          <Button
            sx={{ minWidth: 24, padding: 1, borderRadius: "50%" }}
            variant="contained"
          >
            <RiAddFill />
          </Button>
        </Stack>
        <Stack className="pt-4">
          <Typography className=" text-slate-300" variant="subtitle2">
            Total Balance
          </Typography>
          <AmountDisplay
            wholeClass=" text-3xl"
            decimalClass="text-xl"
            amount={23412.12 * 5}
            currency={"ALL"}
          />
        </Stack>
      </div>
      <Swiper
        onSwiper={handleSwiper}
        onTransitionEnd={handleSlideChange}
        slidesPerView={1}
        effect={"creative"}
        modules={[Virtual, EffectCreative]}
        creativeEffect={{
          prev: {
            scale: 0.75,
            opacity: 0.85,
            translate: ["-75%", 0, -400],
          },
          next: {
            scale: 0.75,
            opacity: 0.85,
            translate: ["75%", 0, -400],
          },
        }}
        className="mt-6 -mx-3"
        centeredSlides
        virtual
        rewind
      >
        {portfolios.map((portfolio, index) => (
          <SwiperSlide key={index}>
            <Portfolio portfolio={portfolio} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-6 px-3">
        <PortfolioDetails id={activeElement.id} />
      </div>
    </div>
  );
}

export default MobilePortfolios;
