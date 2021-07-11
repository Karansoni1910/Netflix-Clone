import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original";

export default function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailer] = useState("");

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);

      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  // console.log(movies);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailer("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url) => {
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailer(urlParams.get("v"));
          } else {
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <div className="row">
        <h2>{title}</h2>

        <div className="row_posters">
          {movies.map((movie) => {
            if (movie.poster_path !== null && movie.backdrop_path !== null) {
              const temp =
                movie?.title || movie?.name || movie?.original_name || "";
              return (
                <div className="movie_poster">
                  <div className="heading">
                    <h5>{truncate(temp, 20)}</h5>
                    <p>IMDb:-{movie?.vote_average}</p>
                  </div>
                  <img
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row_poster ${
                      isLargeRow ? "row_posterLarge" : "row_posterSmall"
                    }`}
                    src={`${baseUrl}${
                      isLargeRow ? movie.poster_path : movie.backdrop_path
                    }`}
                    alt={movie.name}
                  />
                </div>
              );
            } else {
              return "";
            }
          })}
        </div>

        {/* {"this is the url:-"+console.log(trailerUrl)} */}
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </>
  );
}
