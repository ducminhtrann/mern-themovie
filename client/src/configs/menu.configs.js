import {
  FavoriteBorderOutlined,
  HomeOutlined,
  LiveTvOutlined,
  LockResetOutlined,
  ReviewsOutlined,
  SearchOutlined,
  SlideshowOutlined,
} from "@mui/icons-material";

const main = [
  {
    display: "home",
    path: "/",
    icon: <HomeOutlined />,
    state: "home",
  },
  {
    display: "movies",
    path: "/movie",
    icon: <SlideshowOutlined />,
    state: "movie",
  },
  {
    display: "tv series",
    path: "/tv",
    icon: <LiveTvOutlined />,
    state: "tv",
  },
  {
    display: "search",
    path: "/search",
    icon: <SearchOutlined />,
    state: "search",
  },
];

const user = [
  {
    display: "favorites",
    path: "/favorites",
    icon: <FavoriteBorderOutlined />,
    state: "favorites",
  },
  {
    display: "reviews",
    path: "/reviews",
    icon: <ReviewsOutlined />,
    state: "reviews",
  },
  {
    display: "password update",
    path: "/password-update",
    icon: <LockResetOutlined />,
    state: "password.update",
  },
];

const menuConfigs = { main, user };

export default menuConfigs;
