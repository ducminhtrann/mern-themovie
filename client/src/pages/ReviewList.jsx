import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import tmdbConfigs from "../api/configs/tmdb.configs";
import reviewApi from "../api/modules/review.api";
import uiConfigs from "../configs/ui.configs";
import { Delete } from "@mui/icons-material";
import { routesGen } from "../routes/routes";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../components/common/Container";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";

const ReviewItem = ({ review, onRemoved }) => {
  const [onRequest, setOnRequest] = useState(false);
  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, error } = await reviewApi.remove({
      reviewId: review.id,
    });
    setOnRequest(false);
    if (error) toast.error(error.message);
    if (response) {
      toast.success("Remove review success");
      onRemoved(review.id);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        padding: 1,
        opacity: onRequest ? 0.6 : 1,
        "&:hover": {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 0, md: "10%" },
        }}
      >
        <Link
          to={routesGen.mediaDetail(review.mediaType, review.mediaId)}
          style={{
            color: "unset",
            textDecoration: "none",
          }}
        >
          <Box
            sx={{
              paddingTop: "160%",
              ...uiConfigs.style.backgroundImage(
                tmdbConfigs.posterPath(review.mediaPoster)
              ),
            }}
          ></Box>
        </Link>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "80%" },
          padding: { xs: 0, md: "0 2rem" },
        }}
      >
        <Stack spacing={1}>
          <Link
            to={routesGen.mediaDetail(review.mediaType, review.mediaId)}
            style={{
              color: "unset",
              textDecoration: "none",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                ...uiConfigs.style.typoLines(1, "left"),
              }}
            >
              {review.mediaTitle}
            </Typography>
          </Link>
          <Typography variant="caption">
            {dayjs(review.createAt).format("DD-MM-YYYY HH:mm:ss")}
          </Typography>
          <Typography>{review.content}</Typography>
        </Stack>
      </Box>
      <LoadingButton
        variant="contained"
        sx={{
          position: { xs: "relative", md: "absolute" },
          right: { xs: 0, md: "10px" },
          marginTop: { xs: 2, md: 0 },
          width: "max-content",
        }}
        startIcon={<Delete />}
        loadingPosition="start"
        loading={onRequest}
        onClick={onRemove}
      >
        remove
      </LoadingButton>
    </Box>
  );
};

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const skip = 4;

  useEffect(() => {
    const getReviews = async () => {
      dispatch(setGlobalLoading(true));
      const { response, error } = await reviewApi.getList();
      dispatch(setGlobalLoading(false));
      if (error) toast.error(error.message);
      if (response) {
        setCount(response.length);
        setReviews([...response]);
        setFilteredReviews([...response].splice(0, skip));
      }
    };
    getReviews();
  }, []);

  const onLoadMore = () => {
    setFilteredReviews([
      ...filteredReviews,
      ...[...reviews].splice(page * skip, skip),
    ]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newReviews = [...reviews].filter((e) => e.id !== id);
    setReviews(newReviews);
    setFilteredReviews([...newReviews].splice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box
      sx={{
        ...uiConfigs.style.mainContent,
      }}
    >
      <Container header={`Your reviews (${count})`}>
        <Stack spacing={2}>
          {filteredReviews.map((item, index) => (
            <Box key={index}>
              <ReviewItem review={item} onRemoved={onRemoved} />
              <Divider
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              />
            </Box>
          ))}
          {filteredReviews.length < reviews.length && (
            <Button onClick={onLoadMore}>load more</Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ReviewList;
