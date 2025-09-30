import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import { Link } from "react-router-dom";

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDk5ZGFjMjljYjUzODNmYmMwYTY2NmVlY2QzMGJhMSIsIm5iZiI6MTc1OTE1NzQ2MC41MTUsInN1YiI6IjY4ZGE5Y2Q0ZjMzYzc3OTBhZjUzMGFkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MCIByjwN6aOvNPwpg0GgUnp6oz6alA_DDEpmCHAA4n0",
    },
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    // Fetch API data
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category || "now_playing"
      }?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((response) => setApiData(response.results || []))
      .catch((err) => console.error(err));

    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheel);
      }
    };
  }, [category]);

  return (
    <div className="title-cards">
      <h2>{title || "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {Array.isArray(apiData) &&
          apiData.map((card, index) => (
            <Link
              to={`/player/${card.id}`}
              className="card"
              key={card.id || index}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${card.poster_path}`}
                alt={card.original_title || "Movie poster"}
              />
              <p>{card.original_title}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default TitleCards;
