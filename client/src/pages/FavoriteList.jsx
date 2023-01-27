import { Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import uiConfigs from "../configs/ui.configs";
import favoriteApi from "../api/modules/favorite.api";
import { useState } from "react";
import { toast } from "react-toastify";
import { removeFavorite } from "../redux/features/userSlice";
import MediaItem from "../components/common/MediaItem";
import { useEffect } from "react";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import Container from "../components/common/Container";

const FavoriteItem = ({ media, onRemoved }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, error } = await favoriteApi.remove({
      favoriteId: media.id,
    });
    setOnRequest(false);
    if (error) toast.error(error.message);
    if (response) {
      toast.success("Remove favorite success");
      dispatch(removeFavorite({ mediaId: media.id }));
      onRemoved(media.id);
    }
  };

  return (
    <>
      <MediaItem media={media} mediaType={media.mediaType} />
      <LoadingButton
        fullWidth
        variant="contained"
        sx={{
          marginTop: 2,
        }}
        startIcon={<Delete />}
        loadingPosition="start"
        loading={onRequest}
        onClick={onRemove}
      >
        remove
      </LoadingButton>
    </>
  );
};

const FavoriteList = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const skip = 8;

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await favoriteApi.getList();
      dispatch(setGlobalLoading(false));
      if (error) toast.error(error.message);
      if (response) {
        setCount(response.length);
        setMedias([...response]);
        setFilteredMedias([...response].splice(0, skip));
      }
    };
    getFavorites();
  }, []);

  const onLoadMore = () => {
    setFilteredMedias([
      ...filteredMedias,
      ...[...medias].splice(page * skip, skip),
    ]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newMedias = [...medias].filter((e) => e.id !== id);
    setMedias(newMedias);
    setFilteredMedias([...newMedias].splice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box
      sx={{
        ...uiConfigs.style.mainContent,
      }}
    >
      <Container header={`Your favorites (${count})`}>
        <Grid
          container
          spacing={1}
          sx={{
            marginRight: "-8px!important",
          }}
        >
          {filteredMedias.map((media, index) => (
            <Grid key={index} item xs={6} sm={4} md={3}>
              <FavoriteItem media={media} onRemoved={onRemoved} />
            </Grid>
          ))}
        </Grid>
        {filteredMedias.length < medias.length && (
          <Button onClick={onLoadMore}>load more</Button>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteList;
