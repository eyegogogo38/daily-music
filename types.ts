
export interface Song {
  title: string;
  artist: string;
  reason: string;
  origin: 'Korean' | 'International';
  videoId: string;
}

export interface RecommendationResponse {
  recommendations: Song[];
}
