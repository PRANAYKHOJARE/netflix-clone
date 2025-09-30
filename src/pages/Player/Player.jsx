import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
// Removed 'response' import as it's not needed and causes confusion
import { useParams } from "react-router-dom";

const Player = () => {
  const { id, type } = useParams();

  // Use separate states for data and metadata for clearer rendering logic
  const [videoData, setVideoData] = useState(null); // Will hold the final video object
  const [movieDetails, setMovieDetails] = useState(null); // To fetch and hold details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Using the Bearer token you provided
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDk5ZGFjMjljYjUzODNmYmMwYTY2NmVlY2QzMGJhMSIsIm5iZiI6MTc1OTE1NzQ2MC41MTUsInN1YiI6IjY4ZGE5Y2Q0ZjMzYzc3OTBhZjUzMGFkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MCIByjwN6aOvNPwpg0GgUnp6oz6alA_DDEpmCHAA4n0",
    },
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch Movie Videos
        const videoUrl = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
        const videoRes = await fetch(videoUrl, options);
        const videoJson = await videoRes.json();

        // 2. Fetch Movie Details for the info section
        const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
        const detailsRes = await fetch(detailsUrl, options);
        const detailsJson = await detailsRes.json();

        setMovieDetails(detailsJson);

        if (videoJson.results && videoJson.results.length > 0) {
          // Find the official 'Trailer' or the first available video
          const trailer =
            videoJson.results.find(
              (video) => video.type === "Trailer" && video.site === "YouTube"
            ) ||
            videoJson.results.find((video) => video.site === "YouTube") ||
            videoJson.results[0];

          setVideoData(trailer);
        } else {
          // Movie details fetched, but no video found
          setVideoData(null);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch movie data or video.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  // Add a simple navigation helper for the back button
  const navigateBack = () => {
    window.history.back();
  };

  if (loading) {
    return <div className="player">Loading Player...</div>;
  }
  if (error) {
    return (
      <div className="player" style={{ color: "red" }}>
        Error: {error}
      </div>
    );
  }
  // Handle case where details were fetched but no videos were found
  if (!videoData && movieDetails) {
    return (
      <div className="player">
        <img
          src={back_arrow_icon}
          alt="Back"
          onClick={navigateBack}
          className="back-icon"
        />
        <h1>{movieDetails.title}</h1>
        <p>No trailer or video available.</p>
        <div className="player-info">
          <p>
            <strong>Release Date:</strong> {movieDetails.release_date}
          </p>
          <p>
            <strong>Overview:</strong> {movieDetails.overview}
          </p>
        </div>
      </div>
    );
  }

  // Fallback if we couldn't fetch anything
  if (!videoData || !movieDetails) {
    return <div className="player">Data not available.</div>;
  }

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back"
        onClick={navigateBack}
        className="back-icon"
      />
      <iframe
        width="90%"
        height="90%"
        // Use the videoData key
        src={`https://www.youtube.com/embed/${videoData.key}?autoplay=1`}
        title={movieDetails.title + " Trailer"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <div className="player-info">
        {/* Use details from movieDetails for robust info */}
        <p>
          <strong>Release Date:</strong> {movieDetails.release_date}
        </p>
        <p>
          <strong>Title:</strong> {movieDetails.title}
        </p>
        <p>
          <strong>Type:</strong> {type === "tv" ? "TV Show" : "Movie"}
        </p>
      </div>
    </div>
  );
};

export default Player;
