export const TMBD_CONFIG = {
   BASE_URL: "https://api.themoviedb.org/3",
   API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
   headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
   },
};

export const fetchMovies = async ({ query }: { query: string }) => {
   const endpoint = query ? `/search/movie?query=${encodeURIComponent(query)}` : "/discover/movie?sort_by=popularity.desc";

   const response = await fetch(`${TMBD_CONFIG.BASE_URL}${endpoint}`, {
      method: "GET", 
      headers: TMBD_CONFIG.headers
   });

   if(!response.ok) {
      // @ts-ignore
      throw new Error("Failed to fetch movies", response.statusText); 
   }

   const data = response.json();

   // @ts-ignore
   return data.results;
};

// const url =
//    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
// const options = {
//    method: "GET",
//    headers: {
//       accept: "application/json",
//       Authorization:
//          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODZlOTE0MTcwMmY2MmYwZTBhZTU3YzE4OTU4MGM5YSIsIm5iZiI6MTc2ODQ1MDYzMS4zNTIsInN1YiI6IjY5Njg2YTQ3ZmQ4ODhlMjVlMzA3ODllMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9e-fpVxLaEz6e9lveYvUWN-VlhHp_WMgrR-IGdjH1V8",
//    },
// };

// fetch(url, options)
//    .then((res) => res.json())
//    .then((json) => console.log(json))
//    .catch((err) => console.error(err));
