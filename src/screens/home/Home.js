import React from "react";
import { useEffect, useState } from "react";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Card,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  useAppContext,
  useAppContextUpdate,
} from "../../common/app-context/AppContext";
import "./Home.css";
import Details from "../details/Details";

export default function Home(props) {
  const app = useAppContext();
  const updateAppContext = useAppContextUpdate();

  const [movieData, setMovieData] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState();
  const [releaseDateEnd, setReleaseDateEnd] = useState();
  const [movieName, setMovieName] = useState();

  useEffect(() => {
    console.log("Fetching movies");
    let url = "http://localhost:8085/api/v1/movies/";
    const requestOptions = {
      headers: {
        Accept: "application/json;charset=UTF-8",
      },
    };
    fetch(url, requestOptions)
      .then(
        (response) => {
          return response.json();
        },
        (error) => {
          console.log(error);
        }
      )
      .then((data) => {
        setMovieData(data.movies);
        setFilteredMovies(data.movies);
      });

    url = "http://localhost:8085/api/v1/genres";

    fetch(url, requestOptions)
      .then(
        (response) => {
          return response.json();
        },
        (error) => {
          console.log(error);
        }
      )
      .then((data) => {
        setGenres(data.genres);
      });

    url = "http://localhost:8085/api/v1/artists";

    fetch(url, requestOptions)
      .then(
        (response) => {
          return response.json();
        },
        (error) => {
          console.log(error);
        }
      )
      .then((data) => {
        setArtists(data.artists);
      });
  }, []);

  function handleStartDateChange(date) {
    console.log(date);
    setReleaseDateStart(date);
  }

  function handleEndDateChange(date) {
    console.log(date);
    setReleaseDateEnd(date);
  }

  const handleGenreChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedGenres(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleArtistChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(event);
    setSelectedArtists(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  function handleMovieName(event) {
    const value = event.target.value;
    setMovieName(value);
  }

  function handleApplyFilters() {
    let filtered = movieData;
    if (movieName) {
      filtered = filtered.filter(
        (movie) =>
          !movie.title.localeCompare(movieName, undefined, {
            sensitivity: "base",
          })
      );
    }
    if (selectedGenres?.length > 0) {
      if (filtered.length > 0) {
        filtered = filtered.filter((movie) => {
          for (var genre of selectedGenres) {
            if (movie.genres.indexOf(genre) > -1) {
              return true;
            }
            return false;
          }
        });
      }
    }
    if (selectedArtists?.length > 0) {
      if (filtered.length > 0) {
        filtered = filtered.filter((movie) => {
          for (var artistId of selectedArtists) {
            if (movie.artists.find((a) => a.id === artistId)) {
              return true;
            }
            return false;
          }
        });
      }
    }

    if (releaseDateStart || releaseDateEnd) {
      if (filtered.length > 0) {
        if (releaseDateStart) {
          // if no end date filter for all releases after this date
          if (!releaseDateEnd) {
            filtered = filterByDate(releaseDateStart, null, "after", filtered);
          }
          // else filter in bounds
          else {
            filtered = filterByDate(
              releaseDateStart,
              releaseDateEnd,
              "between",
              filtered
            );
          }
        } else if (releaseDateEnd) {
          // if no start date filter for all releases before this date
          if (!releaseDateStart) {
            filtered = filterByDate(null, releaseDateEnd, "before", filtered);
          }
          // else filter in bounds
          else {
            filtered = filterByDate(
              releaseDateStart,
              releaseDateEnd,
              "between",
              filtered
            );
          }
        }
      }
    }

    setFilteredMovies(filtered);
  }

  function filterByDate(first, second, op, movies) {
    switch (op) {
      case "after": {
        movies = movies.filter(
          (movie) => first <= Date.parse(movie.release_date)
        );
        break;
      }
      case "before": {
        movies = movies.filter(
          (movie) => second >= Date.parse(movie.release_date)
        );
        break;
      }
      case "between": {
        movies = movies.filter(
          (movie) =>
            first <= Date.parse(movie.release_date) &&
            second >= Date.parse(movie.release_date)
        );
        break;
      }
    }
    return movies;
  }

  function handleMovieClick(movie) {
    updateAppContext({
      onDetailsPage: true,
      movie,
    });
  }

  if (!app.onDetailsPage) {
    return (
      <div className="home-container">
        <div className="upcoming-movies">
          <span className="um-text">Upcoming Movies</span>
        </div>
        <div className="movie-list">
          <GridList cellHeight={250} cols={6}>
            {movieData?.map((movie) => (
              <GridListTile key={movie.id} className="movie-tile">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  height={"186px"}
                />
                <GridListTileBar title={movie.title} className="movie-title" />
              </GridListTile>
            ))}
          </GridList>
        </div>
        <div className="movie-showcase-container">
          <div className="movie-showcase">
            <GridList cellHeight={350} cols={4} className="">
              {filteredMovies?.map((movie) => (
                <GridListTile
                  key={movie.id}
                  className="movie-showcase-tile"
                  onClick={() => handleMovieClick(movie)}
                >
                  <img src={movie.poster_url} alt={movie.title} />
                  <GridListTileBar
                    title={movie.title}
                    subtitle={new Date(movie.release_date).toDateString()}
                    className="movie-title"
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
          <div className="filter-container">
            <Card variant="outlined" className="filter-card">
              <CardHeader
                titleTypographyProps={{ variant: "body1" }}
                title="FIND MOVIES BY:"
                className="filter-title"
              />
              <CardContent>
                <TextField
                  id="name"
                  label="Movie name"
                  margin="normal"
                  align="center"
                  name="name"
                  onChange={handleMovieName}
                />
                <FormControl variant="filled" style={{ minWidth: "150px" }}>
                  <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                  <Select
                    labelId="genre-label"
                    id="genre"
                    name="genre"
                    label="Genres"
                    margin="normal"
                    variant="standard"
                    value={selectedGenres}
                    multiple
                    renderValue={(selected) => selected.join(", ")}
                    onChange={handleGenreChange}
                  >
                    {genres?.map((genre, i) => (
                      <MenuItem value={genre.genre} key={i}>
                        <Checkbox
                          checked={selectedGenres.indexOf(genre.genre) > -1}
                        />
                        <ListItemText primary={genre.genre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="filled" style={{ minWidth: "150px" }}>
                  <InputLabel id="demo-simple-select-label">Artist</InputLabel>
                  <Select
                    labelId="artist-label"
                    id="artist"
                    name="artist"
                    label="Artists"
                    margin="normal"
                    variant="standard"
                    value={selectedArtists}
                    multiple
                    renderValue={(selected) => {
                      const values = selected.map((id) => {
                        const artist = artists.find((x) => x.id == id);
                        return artist.first_name + " " + artist.last_name;
                      });
                      return values.join(", ");
                    }}
                    onChange={handleArtistChange}
                  >
                    {artists?.map((artist, i) => (
                      <MenuItem value={artist.id} key={i}>
                        <Checkbox
                          checked={selectedArtists.indexOf(artist.id) > -1}
                        />
                        <ListItemText
                          primary={artist.first_name + " " + artist.last_name}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    format="dd/MM/yyyy"
                    label="Release Date Start"
                    value={releaseDateStart ? releaseDateStart : null}
                    onChange={handleStartDateChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    clearable
                  />
                </MuiPickersUtilsProvider>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    format="dd/MM/yyyy"
                    label="Release Date End"
                    value={releaseDateEnd}
                    value={releaseDateEnd ? releaseDateEnd : null}
                    onChange={handleEndDateChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    clearable
                  />
                </MuiPickersUtilsProvider>
                <Button
                  variant="contained"
                  className="apply-btn"
                  color="primary"
                  onClick={handleApplyFilters}
                >
                  APPLY
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  if (app.onDetailsPage) {
    return <Details {...props} />;
  }
}
