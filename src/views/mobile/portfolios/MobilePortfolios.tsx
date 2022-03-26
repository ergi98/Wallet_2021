// MUI
import { Button, Stack, Typography } from "@mui/material";

// Icons
import { RiAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// Interfaces
import { PortfolioInterface } from "../../../interfaces/portfolios-interface";

// Components
import Portfolio from "../../../components/mobile/portfolios/Portfolio";

// Swiper
import { Virtual, EffectCreative } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-cards";

// Components
import AmountDisplay from "../../../components/general/AmountDisplay";

const portfolios: Array<PortfolioInterface> = [
  {
    _id: "6023423j4kl32j4kl32j4",
    name: "Portofoli nr.1",
    amount: 24350.0,
    currency: "ALL",
    type: "wallet",
    lastUsed: new Date().toISOString(),
    favorite: false,
    deleted: false,
    avgAmountEarned: 250,
    avgAmountSpent: 23412.12,
    transactionCount: 10,
    color: "green",
  },
  {
    _id: "6023423j4kl32j4kl32j4",
    name: "Portofoli nr.2",
    amount: 24350.0,
    currency: "ALL",
    type: "wallet",
    lastUsed: new Date().toISOString(),
    favorite: false,
    deleted: false,
    avgAmountEarned: 250,
    avgAmountSpent: 23412.12,
    transactionCount: 10,
    cvc: "123",
    bank: "Raiffeisen Bank",
    cardNo: "5674364736271623",
    validity: "12/22",
    color: "yellow",
  },
];

function MobilePortfolios() {
  const navigate = useNavigate();

  function handlePortfolioClick(portfolioId: string) {}

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
        className="mt-6 -mx-3"
        modules={[Virtual, EffectCreative]}
        slidesPerView={1}
        effect={"creative"}
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
        centeredSlides
        virtual
      >
        {portfolios.map((portfolio, index) => (
          <SwiperSlide data-history={`${portfolio._id}-${index}`} key={index}>
            <Portfolio portfolio={portfolio} onClick={handlePortfolioClick} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MobilePortfolios;
