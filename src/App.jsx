// src/App.jsx (Example modification for logout)
import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite"; // Assuming appwrite.js is still used for movie data
import { useAuth } from "./context/AuthContext"; // New import
import { useNavigate } from "react-router-dom"; // New import


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // TMDB Read Access Token (v4)

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const { logout, user } = useAuth(); // Destructure logout and user from useAuth
  const navigate = useNavigate(); // Initialize navigate

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`, // Use TMDB Read Access Token
    },
  };

  const fetchMovies = async (query = "") => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      let url = "";
      if (query) {
        url = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
      } else {
        url = `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=2&sort_by=popularity.desc`;
      }

      const res = await fetch(url, options);
      const data = await res.json();

      if (data.success === false || !data.results) {
        setErrorMsg(data.status_message || "Failed to fetch movies.");
      } else {
        setMovieList(data.results);
      }
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

      updateSearchCount();
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMsg("Failed to fetch movies.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async() => {
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    }
    catch(error){
      console.error(`Error in trending movies : ${error}`);
      // setErrorMsg('Error in fetching trending movies')
    }
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect( ()=>{
    loadTrendingMovies();
  },[] )


  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          {user && (
            <p className="text-white text-right mb-2">Welcome, {user.email}!</p>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 float-right"
          >
            Logout
          </button>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
      {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2 className="">All Movies</h2>
          {isLoading && <Spinner />}
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
          {!isLoading && !errorMsg && (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;