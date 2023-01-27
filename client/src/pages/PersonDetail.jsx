import { Box, Button, Typography, Stack, Toolbar } from "@mui/material";
import { useParams } from "react-router-dom";
import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import personApi from "../api/modules/person.api";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import Container from "../components/common/Container";
import PersonMediaGrid from "../components/common/PersonMediaGrid";

const PersonDetail = () => {
  const { personId } = useParams();
  const [person, setPerson] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const getPerson = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await personApi.detail({ personId });
      dispatch(setGlobalLoading(false));
      if (error) toast.error(error.message);
      if (response) setPerson(response);
    };
    getPerson();
  }, [personId]);

  return (
    <>
      <Toolbar />
      {person && (
        <>
          <Box
            sx={{
              ...uiConfigs.style.mainContent,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "50%", md: "20%" },
                }}
              >
                <Box
                  sx={{
                    paddingTop: "160%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "darkgrey",
                    backgroundImage: `url(${tmdbConfigs.posterPath(
                      person.profile_path
                    )})`,
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: { xs: "100%", md: "80%" },
                  padding: { xs: "1rem 0", md: "1rem 2rem" },
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight={700}>
                    {`${person.name} (${person.birthday.split("-")[0]}`}
                    {person.deathday && ` - ${person.deathday.split("-")[0]}`}
                    {")"}
                  </Typography>
                  <Typography
                    sx={{
                      ...uiConfigs.style.typoLines(10),
                    }}
                  >
                    {person.biography}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Container header="medias">
              <PersonMediaGrid personId={personId} />
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

export default PersonDetail;
