import { useTranslation } from "react-i18next";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { putVerifyAccount } from '../api/accountApi';
import { useSnackbar } from 'notistack';
import { Box, Grid, Typography } from "@mui/material";
import verifyPose from "../assets/verifyPose.svg";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const VerifyAccountPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token") as string;

  useEffect(() => {
    putVerifyAccount(token)
    .then((response) => {
      if (response.status === 200) {
        enqueueSnackbar(t("verifyAccountPage.toastSuccess"), {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(t('verifyAccountPage.toastError'), {
          variant: 'error',
        });
      }
    }).finally(() => navigate("/"));
  }, []);
  
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: { xs: "flex-start", md: "center" },
        alignItems: "center",
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
      container
    >
      <Grid
        sx={{
          mt: { xs: 10, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: { xs: "flex-start", md: "center" },
          alignItems: "center",
          textAlign: "center",
        }}
        item
        xs={9}
        md={4}
      >
        <Box
          sx={{
            width: { xs: "80px", md: "96px" },
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
        <Typography
          variant="h2"
          sx={{
            mt: 4,
            fontSize: { xs: "32px", md: "40px" },
            fontWeight: "700",
          }}
        >
          {t("verifyAccountPage.header")}
        </Typography>
        <Typography
          sx={{
            mt: 2,
            color: "text.secondary",
            mb: { xs: 10, md: 0 },
            fontSize: { xs: "16px", md: "20px" },
          }}
        >
          {t("verifyAccountPage.description")}
        </Typography>
        <Box
          sx={{
            width: { xs: "500px", md: "800px" },
            height: { xs: "500px", md: "800px" },
            position: "absolute",
            bottom: 0,
            left: { xs: "50%", md: -200 },
            transform: { xs: "translateX(-50%)", md: "translateX(0)" },
            top: { xs: "50%", md: 200 },
          }}
        >
          <img
            src={verifyPose}
            alt="XD"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Grid>
    </Grid>
    // </MainLayout>
  );
};

export default VerifyAccountPage;
