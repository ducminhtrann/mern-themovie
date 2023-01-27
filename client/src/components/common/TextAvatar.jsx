import { Avatar } from "@mui/material";

const TextAvatar = ({ text }) => {
  const stringColor = (str) => {
    let hash = 0;
    let i;
    for (i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };
  const renderAvatar = () => {
    let result = "";
    text.split(" ").forEach((word) => {
      result += word.split("")[0];
    });
    return result.toUpperCase();
  };
  return (
    <Avatar
      sx={{
        backgroundColor: stringColor(text),
        width: 40,
        height: 40,
      }}
      children={renderAvatar()}
    />
  );
};

export default TextAvatar;
