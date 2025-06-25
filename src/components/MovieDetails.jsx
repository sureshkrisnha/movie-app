import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const fetchMovieDetails = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/movie/${id}?language=en-US`,
        options
      );
      const data = await res.json();
      setMovie(data);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (!movie) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper space-y-8">
        <Link to="/" className="text-gradient text-lg mb-5 inline-block">
          ← Back to Home
        </Link>

        <div className="movie-card grid md:grid-cols-2 gap-10 p-8">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "./public/No-Poster.png"
            }
            alt={movie.title}
            className="w-full h-auto max-w-sm mx-auto"
          />

          <div className="space-y-4">
            <h3 className="text-3xl text-gradient">{movie.title}</h3>
            {movie.tagline && (
              <p className="italic text-light-200">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="rating flex items-center gap-1">
                <img src={"../public/Vector.png"} />
                <p>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </p>
              </div>
              <span>.</span>
              <p className="lang capitalize">{movie.original_language}</p>
              <span>.</span>
              <p className="year">
                {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
              </p>
              <span>.</span>
              <p>{movie.runtime} min</p>
            </div>

            <p className="text-gray-100">
              {movie.overview || "No description available."}
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-white" >
                <strong className="text-white">Genres:</strong>{" "}
                {movie.genres?.map((genre) => genre.name).join(", ")}
              </p>
              <p className="text-white" >
                <strong className="text-white">Popularity:</strong>{" "}
                {movie.popularity}
              </p>
              <p className="text-white" >
                <strong className="text-white">Revenue:</strong> $
                {movie.revenue?.toLocaleString()}
              </p>
              <p className="text-white" >
                <strong >Vote Count:</strong>{" "}
                {movie.vote_count}
              </p>
              {console.log(movie.vote_count , movie.revenue)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieDetails;
