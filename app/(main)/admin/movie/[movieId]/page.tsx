import { DetailMovie } from "@/app/components/admin/movie/detail-movie"

export default function MovieIdPage({ 
  params 
}: { params: { movieId: number } }) {
  const { movieId } = params
  return (
  <>
    <DetailMovie movieId={+movieId}/>
  </>
)
}