import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Box } from "@mui/system";
import { Trans, useTranslation } from "react-i18next";
import { resolveApiError } from "../../../api/apiErrors";
import CloseIcon from "@mui/icons-material/Close";
import { StyledTextField } from "../../../pages/admin/AccountDetailsPage/AccountDetailsPage.styled";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { plPL } from "@mui/x-date-pickers/locales";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editWaterMeterSchema,
  EditWaterMeterSchema,
} from "../../../validation/validationSchemas";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  replaceMainWaterMeter,
  WaterMeterDto,
} from "../../../api/waterMeterApi";
import { HttpStatusCode } from "axios";

interface Props {
  waterMeter: WaterMeterDto | undefined;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ReplaceWaterMeterModal = ({
  waterMeter,
  isOpen,
  setIsOpen,
}: Props) => {
  const { t } = useTranslation();
  const [expiryDate, setExpiryDate] = useState<Dayjs | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditWaterMeterSchema>({
    resolver: zodResolver(editWaterMeterSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      serialNumber: "",
      startingValue: "",
      expectedMonthlyUsage: "",
    },
  });

  const {
    serialNumber: serialNumberError,
    startingValue: startingValueError,
    expectedMonthlyUsage: expectedMonthlyUsageError,
  } = errors;
  const serialNumberErrorMessage = serialNumberError?.message;
  const startingValueErrorMessage = startingValueError?.message;
  const expectedMonthlyUsageErrorMessage = expectedMonthlyUsageError?.message;

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleConfirmAction = async (replaceWaterMeter: any) => {
    const response = await replaceMainWaterMeter(waterMeter!.id, {
      ...replaceWaterMeter,
      expiryDate: expiryDate?.format("YYYY-MM-DD"),
    });

    if (response.status === HttpStatusCode.NoContent) {
      enqueueSnackbar(
        t("replaceWaterMeterDialog.waterMeterReplacedSuccessfully"),
        {
          variant: "success",
        }
      );
      handleClose();
    } else {
      enqueueSnackbar(t(resolveApiError(response.error)), {
        variant: "error",
      });
    }
  };

  return (
    <Box>
      <Dialog open={isOpen} onClose={handleClose}>
        <form onSubmit={handleSubmit(handleConfirmAction)}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <DialogTitle id="role-modal-title">
              {t("replaceWaterMeterDialog.replaceWaterMeter")}
            </DialogTitle>
            <Button sx={{ width: "30px" }} onClick={handleClose}>
              <CloseIcon />
            </Button>
          </Box>
          <DialogContent sx={{ width: "300px" }}>
            <Box
              sx={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              <StyledTextField
                variant="standard"
                sx={{ width: "100% !important" }}
                label={
                  <Trans
                    i18nKey={"replaceWaterMeterDialog.serialNumber"}
                    components={{ sup: <sup /> }}
                  />
                }
                {...register("serialNumber")}
                error={!!serialNumberError}
                helperText={
                  serialNumberErrorMessage && t(serialNumberErrorMessage)
                }
              />
              <StyledTextField
                autoFocus
                label={
                  <Trans
                    i18nKey={"replaceWaterMeterDialog.expectedMonthlyUsage"}
                    components={{ sup: <sup /> }}
                  />
                }
                variant="standard"
                sx={{ width: "100% !important" }}
                {...register("expectedMonthlyUsage")}
                error={!!expectedMonthlyUsageError}
                helperText={
                  expectedMonthlyUsageErrorMessage &&
                  t(expectedMonthlyUsageErrorMessage)
                }
              />
              <StyledTextField
                variant="standard"
                sx={{ width: "100% !important" }}
                label={
                  <Trans
                    i18nKey={"replaceWaterMeterDialog.startingValue"}
                    components={{ sup: <sup /> }}
                  />
                }
                {...register("startingValue")}
                error={!!startingValueError}
                helperText={
                  startingValueErrorMessage && t(startingValueErrorMessage)
                }
              />
              <LocalizationProvider
                adapterLocale="pl"
                dateAdapter={AdapterDayjs}
                localeText={
                  plPL.components.MuiLocalizationProvider.defaultProps
                    .localeText
                }
              >
                <DatePicker
                  label={t("replaceWaterMeterDialog.expiryDate")}
                  format="YYYY-MM-DD"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)}
                  views={["day", "month", "year"]}
                  sx={{ mb: 2 }}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("common.close")}</Button>
            <Button variant="contained" color="primary" type="submit">
              {t("common.confirm")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
