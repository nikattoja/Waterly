import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { resolveApiError } from "../../api/apiErrors";
import { useSnackbar } from "notistack";
import { Box, Button, Typography } from "@mui/material";
import { Loading } from "../../layouts/components/Loading";
import { ApartmentDto, getApartmentDetails } from "../../api/apartmentApi";
import { ApartmentDetails } from "../../layouts/components/apartment/ApartmentDetails";
import { MainLayout } from "../../layouts/MainLayout";
import { AssignWaterMeterToApartmentDialog } from "../../layouts/components/watermeter/AssingWaterMeterToApartmentModal";
import AddIcon from "@mui/icons-material/Add";

export const ApartmentDetailsPage = () => {
  const [apartmentDetails, setApartmentDetails] = useState<
    ApartmentDto | undefined
  >(undefined);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { id } = useParams();
  const [assignWaterMeterDialogOpen, setAssignWaterMeterDialogOpen] =
    useState(false);

  const fetchApartmentDetails = async () => {
    const response = await getApartmentDetails(parseInt(id as string));
    if (response.status === 200) {
      setApartmentDetails(response.data);
    } else {
      enqueueSnackbar(t(resolveApiError(response.error)), {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchApartmentDetails();
  }, [assignWaterMeterDialogOpen]);

  if (!apartmentDetails) {
    return <Loading />;
  }

  return (
    <MainLayout>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          mx: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "700", mb: 2 }}>
          {t("apartmentDetailsPage.header")}
        </Typography>
        <Typography sx={{ mb: { xs: 5, md: 5 }, color: "text.secondary" }}>
          {t("apartmentDetailsPage.description")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            mb: { xs: 3, md: 2 },
            width: "30vh",
          }}
          onClick={() => setAssignWaterMeterDialogOpen(true)}
        >
          {t("assignWaterMeterDialog.addWaterMeter")}
        </Button>
        <AssignWaterMeterToApartmentDialog
          isOpen={assignWaterMeterDialogOpen}
          setIsOpen={setAssignWaterMeterDialogOpen}
          apartmentId={apartmentDetails.id}
        />
      </Box>
      <ApartmentDetails apartment={apartmentDetails} />
    </MainLayout>
  );
};