import { useEffect, useState } from "react";

// Formik
import { Formik } from "formik";

// Animation
import { motion } from "framer-motion";

// Validations
import { signUpSchema } from "../../validators/credentials";

// Icons
import { ChevronLeftOutlined } from "@mui/icons-material";

// MUI
import { Grid, Button, Stack, Typography } from "@mui/material";

// Navigation
import { useNavigate, useParams } from "react-router-dom";

// Components
import Sources from "./Sources";
import Portfolios from "./Portfolios";
import Categories from "./Categories";
import Credentials from "./Credentials";
import PersonalInfo from "./PersonalInfo";
import Introduction from "./Introduction";
import FrequentPlaces from "./FrequentPlaces";

const possibleSteps = [
  {
    key: "introduction",
    value: "Introduction",
  },
  {
    key: "personal-info",
    value: "Information",
  },
  {
    key: "credentials",
    value: "Credentials",
  },
  {
    key: "portfolios",
    value: "Portfolios",
  },
  {
    key: "sources",
    value: "Sources",
  },
  {
    key: "categories",
    value: "Categories",
  },
  {
    key: "frequent-places",
    value: "Places",
  },
];

function SignUpForm() {
  const params = useParams();

  const firstName = JSON.parse(
    localStorage.getItem("introduction") || '""'
  )?.name;

  const helpSection = [
    // Step 1
    {
      title: "What should we call you?",
      subtitle: "Welcome to your account setup.",
      paragraph: "",
    },
    // Step 2
    {
      title: `Lets get to know you ${firstName?.trim()}.`,
      subtitle: "",
      paragraph: `
        Tell us a little bit more about yourself and what you do. 
        All the fields below with the exception of the
        <strong> Currency </strong>field are optional.
      `,
    },
    // Step 3
    {
      title: "",
      subtitle: "",
      paragraph: "",
    },
    // Step 4
    {
      title: "",
      subtitle: "",
      paragraph: "",
    },
    // Step 5
    {
      title: "",
      subtitle: "",
      paragraph: "",
    },
  ];

  const [activeStep] = useState<number>(() =>
    determineActiveStep(params.step ?? "introduction")
  );

  const navigate = useNavigate();
  const navigateToLogin = () => navigate("/login");

  function changeStep(value: number) {
    let nextStep = activeStep + value;
    if (nextStep > possibleSteps.length || nextStep < 0) return;
    navigate(`/sign-up/${possibleSteps[nextStep].key}`);
  }

  function determineActiveStep(paramStep: string): number {
    let step = 0;
    switch (paramStep) {
      case "introduction":
        step = 0;
        break;
      case "personal-info":
        step = 1;
        break;
      case "credentials":
        step = 2;
        break;
      case "portfolios":
        step = 3;
        break;
      case "sources":
        step = 4;
        break;
      case "categories":
        step = 5;
        break;
      case "frequent-places":
        step = 6;
        break;
    }
    return step;
  }

  const activeFormComponent = [
    <Introduction changeStep={changeStep} />,
    <PersonalInfo changeStep={changeStep} />,
    // <Credentials changeStep={changeStep} />,
    // <Portfolios changeStep={changeStep} />,
    // <Sources changeStep={changeStep} />,
    // <Categories changeStep={changeStep} />,
    // <FrequentPlaces changeStep={changeStep} />,
  ];

  async function handleUserSignUp(values: Object, setSubmitting: Function) {
    // TODO: User sign up
    try {
      let dummyPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("Smth happened");
        }, 1000);
      });
      await dummyPromise;
    } catch (err) {
      setSubmitting(false);
      // TODO: Display error if something goes wrong
    }
  }

  return (
    <Grid container>
      {/* Explain */}
      <Grid
        xs={12}
        md={6}
        className="p-6 bg-gradient-to-b from-blue-900 to-blue-600"
        item
      >
        <Stack justifyContent="space-between" className="h-full text-gray-50">
          <div>
            <div>
              <span>{activeStep + 1}</span>
              <span>&nbsp;/&nbsp;{possibleSteps.length}</span>
            </div>
            <Typography className="text-gray-300" variant="subtitle1">
              {helpSection[activeStep].subtitle}
            </Typography>
            <Typography variant="h5">
              {helpSection[activeStep].title}
            </Typography>
          </div>
          <Typography paragraph>
            <span
              dangerouslySetInnerHTML={{
                __html: helpSection[activeStep].paragraph,
              }}
            />
          </Typography>
          <Button
            onClick={navigateToLogin}
            startIcon={<ChevronLeftOutlined />}
            variant="text"
            sx={{
              color: "white",
              fontSize: "12px",
              width: "fit-content",
            }}
          >
            Already have an account?
          </Button>
        </Stack>
      </Grid>
      {/* Form */}
      <Grid xs={12} md={6} className="p-6" item>
        <Formik
          initialValues={{
            // Step 1
            name: "",
            surname: "",
            // Step 2
            gender: "",
            birthday: null,
            employer: "",
            profession: "",
            defaultCurrency: "",
            // Step 3
            username: "",
            password: "",
            // Step 4
            portfolios: [],
            // Step 5
            sources: [],
            // Step 6
            categories: [],
            // Step 7
            frequentPlaces: [],
          }}
          validationSchema={signUpSchema}
          onSubmit={(values: any, { setSubmitting }: any) =>
            handleUserSignUp(values, setSubmitting)
          }
        >
          {({ handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit}>
              {activeFormComponent[activeStep]}
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default SignUpForm;
