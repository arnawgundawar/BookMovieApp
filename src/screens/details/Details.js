import React from "react";
import {
  useAppContext,
  useAppContextUpdate,
} from "../../common/app-context/AppContext";
import {
  Typography,
  GridList,
  GridListTile,
  GridListTileBar,
} from "@material-ui/core";
import YouTube from "react-youtube";
import ReactStars from "react-rating-stars-component";
import "./Details.css";

export default function Details() {
  const app = useAppContext();
  const updateAppContext = useAppContextUpdate();

  return (
    <div className="details-container">
      <Typography
        variant="h6"
        className="back-btn"
        onClick={() => updateAppContext({ onDetailsPage: false })}
      >
        &#60; Back to home
      </Typography>
      <div className="details">
        <div className="poster">
          <img
            src={app.movie.poster_url}
            alt={app.movie.title}
            className="poster-img"
          />
        </div>
        <div className="info">
          <div>
            <Typography variant="h2">{app.movie.title}</Typography>
            <Typography>
              <span style={{ fontWeight: 600 }}>Genre:</span>
              <span style={{ paddingLeft: "8px" }}>
                {app.movie.genres.join(", ")}
              </span>
            </Typography>

            <Typography>
              <span style={{ fontWeight: 600 }}>Duration:</span>
              <span style={{ paddingLeft: "8px" }}>{app.movie.duration}</span>
            </Typography>

            <Typography>
              <span style={{ fontWeight: 600 }}>Release Date:</span>
              <span style={{ paddingLeft: "8px" }}>
                {new Date(app.movie.release_date).toDateString()}
              </span>
            </Typography>

            <Typography>
              <span style={{ fontWeight: 600 }}>Rating:</span>
              <span style={{ paddingLeft: "8px" }}>{app.movie.rating}</span>
            </Typography>
          </div>
          <div>
            <Typography>
              <span style={{ fontWeight: 600 }}>Plot:</span>
              <span style={{ paddingLeft: "8px" }}>
                <a href={app.movie.wiki_url}>(Wiki Link)</a>
                {app.movie.storyline}
              </span>
            </Typography>
          </div>
          <div>
            <Typography>
              <span style={{ fontWeight: 600 }}>Trailer:</span>
            </Typography>
            <YouTube videoId={app.movie.trailer_url.split("?v=")[1]} />
          </div>
        </div>
        <div className="artists">
          <div>
            <Typography>
              <span style={{ fontWeight: 600 }}>Rate this movie:</span>
            </Typography>
            <ReactStars count={5} size={20} value={0} activeColor="#ffd700" />
          </div>
          <div>
            <Typography>
              <span style={{ fontWeight: 600 }}>Artists:</span>
            </Typography>
            <GridList cellHeight={200} cols={2} className="">
              {app.movie.artists?.map((artist) => (
                <GridListTile key={artist.id} className="artist-tile">
                  <img
                    src={artist.profile_url}
                    alt={artist.first_name + " " + artist.last_name}
                  />
                  <GridListTileBar
                    title={artist.first_name + " " + artist.last_name}
                    className="artist-title"
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </div>
      </div>
    </div>
  );
}
