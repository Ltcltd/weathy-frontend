// API Configuration
export const API_BASE_URL = "https://studybuddy.allanhanan.qzz.io";

// API Endpoints
export const API_ENDPOINTS = {
  chatbot: {
    query: `${API_BASE_URL}/api/chatbot/query`,
  },
  map: {
    probability: (lat: number, lon: number, date: string) =>
      `${API_BASE_URL}/api/map/probability/${lat}/${lon}/${date}`,
  },
} as const;
