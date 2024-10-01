import { MovieDetail } from "@/app/components/client/movie/movie.detail";
import React from "react";

export default function MovieIdPage({
  params,
}: {
  params: { movieId: number, episodeId: number };
}) {
  const { movieId, episodeId } = params;
  return (
    <>
      <div className="w-[100%]">
        <MovieDetail movieId={+movieId} episodeId={+episodeId}/>
      </div>
    </>
  );
}
