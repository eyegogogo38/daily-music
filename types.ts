
export interface Song {
  title: string;
  artist: string;
  reason: string;
  origin: 'Korean' | 'International';
}

export interface RecommendationResponse {
  recommendations: Song[];
}
