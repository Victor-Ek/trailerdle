"use client";
import { Button } from "@mui/base";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { Autocomplete } from "./Autocomplete";

interface PlayerProps {
  trailer: any;
  correctMovie: any;
}

const times = [15_000, 25_000, 35_000, 45_000, 55_000];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_HEADER_KEY}`,
  },
};

export const Player = (props: PlayerProps) => {
  const { trailer, correctMovie } = props;
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [guesses, setGuesses] = useState(0);
  const [won, setWon] = useState(false);
  const [movies, setMovies] = useState([]);
  const [text, setText] = useState("");
  const [wrongGuess, setWrongGuess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const trailerToWatch = trailer.results.find(
    (trail: { type: string }) => trail.type === "Trailer"
  );

  const toggleVideo = () => {
    setWrongGuess(false);
    setIsPlaying((prev) => !prev);
    let timeOut;
    if (!isPlaying) {
      player?.playVideo();
      timeOut = setTimeout(() => {
        player.pauseVideo();
        player.seekTo(0);
      }, times[guesses]);
    } else {
      player?.pauseVideo();
      clearTimeout(timeOut);
    }
  };

  const correctAnswer =
    correctMovie.title + " " + correctMovie.release_date.split("-")[0];

  console.log({ correctAnswer, text });

  const handleSearch = async (event: any) => {
    setText(event.target.value);
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${event.target.value}&include_adult=false&language=en-US&page=1`,
      options
    );
    const result = await response.json();

    setMovies(result.results);
  };

  const handleGuess = () => {
    setGuesses((prev) => prev + 1);
    if (text === correctAnswer) {
      setWon(true);
    } else {
      setWrongGuess(true);
    }
  };

  const lose = guesses >= 5;

  return (
    <div className="flex flex-col gap-5">
      {times[guesses] && <p>Guess: {times[guesses] / 1000} seconds</p>}

      <YouTube
        videoId={trailerToWatch.key}
        className={won || lose ? "" : "hidden"}
        onReady={(event) => setPlayer(event.target)}
      />
      <div className="flex items-center justify-between">
        <Button
          className="border-pink-400 border rounded-md py-1 px-4 text-white"
          type="button"
          onClick={toggleVideo}
        >
          {isPlaying ? "⏸" : "►"}
        </Button>
        <Button
          type="button"
          className="border-pink-400 border rounded-md py-1 px-4 text-white"
          onClick={() => setGuesses((prev) => prev + 1)}
        >
          Skip 👉
        </Button>
      </div>
      <div className="flex gap-2">
        <Autocomplete options={movies} onInputChange={handleSearch} />
        <Button
          type="button"
          onClick={handleGuess}
          className="bg-pink-400 rounded-md py-1 px-4 text-black"
        >
          Guess
        </Button>
      </div>

      <h1>{won ? "You won!" : ""}</h1>
      <h1>{lose ? "You lose!" : ""}</h1>
      <h1>{wrongGuess ? "Wrong! Guess again!" : ""}</h1>
    </div>
  );
};
