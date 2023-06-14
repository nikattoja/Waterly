import { useParams } from "react-router-dom";
import { OwnerBillDto, getOwnerBills } from "../../api/billApi";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { resolveApiError } from "../../api/apiErrors";
import { enqueueSnackbar } from "notistack";
import { Loading } from "../../layouts/components/Loading";
import { Box } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import { MainLayout } from "../../layouts/MainLayout";
import styled from "@emotion/styled";
import { ShowBillModal } from "../../layouts/components/bill/ShowBillModal";
import { monthName } from "../../common/dates";
import { useAccount } from "../../hooks/useAccount";

const BillsContainer = styled.div`
  display: flex;
  column-gap: 50px;
`;

interface BillsByDate {
  year: number;
  months: {
    billId: number;
    apartmentId: number;
    apartmentNumber: string;
    month: number;
  }[];
}

const toBillsByMonthYear = (bills: OwnerBillDto[]) => {
  let billsByDate: BillsByDate[] = [];

  bills.forEach((bill) => {
    const dateParts = bill.billDate.split("-");
    const date = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );

    const billByDate = billsByDate.find((it) => it.year === date.getFullYear());

    if (billByDate) {
      billByDate.months.push({
        billId: bill.billId,
        month: date.getMonth(),
        apartmentId: bill.apartmentId,
        apartmentNumber: bill.apartmentNumber,
      });
      console.log("dupa");
    } else {
      billsByDate.push({
        year: date.getFullYear(),
        months: [
          {
            billId: bill.billId,
            month: date.getMonth(),
            apartmentId: bill.apartmentId,
            apartmentNumber: bill.apartmentNumber,
          },
        ],
      });
    }
  });

  return billsByDate;
};

interface Selection {
  selectedDate: Date;
  selectedApartmentId: number;
}

export const BillListPage = () => {
  const { account } = useAccount();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [billsByDate, setBillsByDate] = useState<BillsByDate[]>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedYearMonthAndApartment, setSelectedYearMonthAndApartment] =
    useState<Selection>();

  const contextUserLogin = account?.username!!;

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const getBills = async () => {
    setIsLoading(true);
    await getOwnerBills(contextUserLogin).then((response) => {
      if (response.status === 200) {
        const billsByDate = toBillsByMonthYear(response.data!);
        setBillsByDate(billsByDate);
        if (billsByDate && billsByDate.length > 0) {
          setSelectedYearMonthAndApartment({
            selectedDate: new Date(
              billsByDate[0].year,
              billsByDate[0].months?.at(-1)?.month!!
            ),
            selectedApartmentId: billsByDate[0].months?.at(-1)?.apartmentId!!,
          });
          setExpanded(billsByDate[0].year.toString());
        }
      } else {
        enqueueSnackbar(t(resolveApiError(response.error)), {
          variant: "error",
        });
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getBills();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <MainLayout>
      <BillsContainer>
        <Box>
          {billsByDate?.map((billByDate) => (
            <>
              <Accordion
                disableGutters
                sx={{ width: "200px" }}
                expanded={expanded === billByDate.year.toString()}
                onChange={handleChange(billByDate.year.toString())}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    {billByDate.year}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {billByDate.months.map((it) => (
                    <Button
                      key={it.billId}
                      onClick={() =>
                        setSelectedYearMonthAndApartment({
                          selectedDate: new Date(billByDate.year, it.month),
                          selectedApartmentId: it.apartmentId,
                        })
                      }
                    >
                      {t(monthName(it.month)) + " " + it.apartmentNumber}
                    </Button>
                  ))}
                </AccordionDetails>
              </Accordion>
            </>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            flex: "3",
            bgcolor: "background.paper",
            height: "100%",
            minHeight: "160px",
            borderRadius: 1,
            boxShadow: 8,
            marginBottom: "25px",
            paddingBottom: "25px",
          }}
        >
          {billsByDate?.length === 0 ? (
            <Box sx={{ margin: "auto" }}>
              <Typography sx={{ fontSize: "50px" }}>
                {t("billPage.noBills")}
              </Typography>
            </Box>
          ) : (
            billsByDate && (
              <ShowBillModal
                apartmentId={
                  selectedYearMonthAndApartment?.selectedApartmentId!!
                }
                yearMonthDate={selectedYearMonthAndApartment?.selectedDate}
              />
            )
          )}
        </Box>
      </BillsContainer>
    </MainLayout>
  );
};
