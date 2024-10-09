import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
export default function Post({
  _id,
  title,
  cover,
  author,
  state,
  destination,
  likes,
}) {
  return (
    <div>
      <Card className="post" sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              <div className="texts">
                <Link to={`/post/${_id}`}>
                  <h2>{title}</h2>
                </Link>
              </div>
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              <div className="texts">
                <p className="info">
                  <a className="author">@{author.username}</a>
                </p>
                <p>
                  <strong>State:</strong> {state}
                </p>
                <p>
                  <strong>Destination:</strong>
                  <LocationOnIcon className="location-icon" /> {destination}
                </p>
                <p>
                  <strong>Total Likes:</strong> {likes?.count || 0}
                  <FavoriteIcon className="like-icon" />
                </p>
              </div>
            </Typography>
          </CardContent>
        </Box>
        <CardMedia component="img" className="image" image={cover.path} />
      </Card>
    </div>
  );
}
