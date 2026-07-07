import { images } from "@/constants/images";
import {
   fetchMovieDetails,
   fetchMovies,
} from "@/services/api";
import useFetch from "@/services/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
   ActivityIndicator,
   Image,
   ImageBackground,
   ScrollView,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const profile = {
   name: "Movie Explorer",
   handle: "@cinephile",
   initials: "ME",
   memberSince: "Member since 2024",
   stats: [
      { value: "156", label: "Watched" },
      { value: "24", label: "Saved" },
      { value: "38", label: "Rated" },
   ],
   genres: ["Action", "Sci-Fi", "Thriller"],
};

interface ProfileData {
   movies: Movie[];
   featuredMovie: MovieDetails | null;
}

interface StatProps {
   value: string;
   label: string;
   isLast: boolean;
}

const ProfileStat = ({ value, label, isLast }: StatProps) => (
   <View
      className={`flex-1 items-center ${
         isLast ? "" : "border-r border-white/10"
      }`}
   >
      <Text className="text-xl font-bold text-white">{value}</Text>
      <Text className="mt-1 text-xs text-light-300">{label}</Text>
   </View>
);

const MovieShelfCard = ({
   movie,
   onPress,
}: {
   movie: Movie;
   onPress: () => void;
}) => (
   <TouchableOpacity
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Open ${movie.title}`}
      className="mr-4 w-32"
      onPress={onPress}
   >
      <View className="relative overflow-hidden rounded-xl bg-[#221f3d]">
         <Image
            source={{
               uri: movie.poster_path
                  ? `${IMAGE_BASE_URL}/w342${movie.poster_path}`
                  : "https://via.placeholder.com/342x513/221f3d/a8b5db.png?text=No+Poster",
            }}
            className="h-48 w-32"
            resizeMode="cover"
         />

         <View className="absolute bottom-2 right-2 flex-row items-center rounded-full bg-primary/90 px-2 py-1">
            <Ionicons name="star" size={11} color="#facc15" />
            <Text className="ml-1 text-[10px] font-bold text-white">
               {movie.vote_average.toFixed(1)}
            </Text>
         </View>
      </View>

      <Text className="mt-2 text-sm font-semibold text-white" numberOfLines={1}>
         {movie.title}
      </Text>
      <Text className="mt-1 text-xs text-light-300">
         {movie.release_date?.split("-")[0] || "Coming soon"}
      </Text>
   </TouchableOpacity>
);

const Profile = () => {
   const router = useRouter();

   const {
      data,
      loading,
      error,
      refetch,
   } = useFetch<ProfileData>(async () => {
      const movies = (await fetchMovies({ query: "" })) as Movie[];
      const featuredMovie = movies[0]
         ? await fetchMovieDetails(movies[0].id.toString()).catch(() => null)
         : null;

      return { movies, featuredMovie };
   });

   const openMovie = (movieId: number) => {
      router.push(`/movies/${movieId}`);
   };

   const featuredMovie = data?.featuredMovie;
   const recommendations = data?.movies.slice(1, 9) ?? [];

   return (
      <View className="flex-1 bg-primary">
         <Image
            source={images.bg}
            className="absolute w-full opacity-60"
            resizeMode="cover"
         />

         <SafeAreaView edges={["top"]} className="flex-1">
            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingBottom: 130 }}
            >
               <View className="px-5 pt-5">
                  <View className="mb-6 flex-row items-center justify-between">
                     <View>
                        <Text className="text-sm font-medium uppercase tracking-[2px] text-accent">
                           Your space
                        </Text>
                        <Text className="mt-1 text-3xl font-bold text-white">
                           Profile
                        </Text>
                     </View>

                     <View className="h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#221f3d]">
                        <Ionicons
                           name="person-outline"
                           size={21}
                           color="#D6C6FF"
                        />
                     </View>
                  </View>

                  <View className="overflow-hidden rounded-3xl border border-white/10 bg-[#221f3d] p-5">
                     <View className="flex-row items-center">
                        <View className="h-[72px] w-[72px] items-center justify-center rounded-3xl border-2 border-accent bg-primary">
                           <Text className="text-2xl font-bold text-accent">
                              {profile.initials}
                           </Text>
                        </View>

                        <View className="ml-4 flex-1">
                           <Text className="text-xl font-bold text-white">
                              {profile.name}
                           </Text>
                           <Text className="mt-1 text-sm text-light-200">
                              {profile.handle}
                           </Text>
                           <Text className="mt-2 text-xs text-light-300">
                              {profile.memberSince}
                           </Text>
                        </View>

                        <Ionicons
                           name="sparkles"
                           size={22}
                           color="#AB8BFF"
                        />
                     </View>

                     <View className="my-5 h-px bg-white/10" />

                     <View className="flex-row">
                        {profile.stats.map((stat, index) => (
                           <ProfileStat
                              key={stat.label}
                              {...stat}
                              isLast={index === profile.stats.length - 1}
                           />
                        ))}
                     </View>
                  </View>

                  <View className="mt-7">
                     <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-white">
                           Your taste
                        </Text>
                        <Text className="text-xs text-light-300">
                           Top genres
                        </Text>
                     </View>

                     <View className="flex-row flex-wrap">
                        {profile.genres.map((genre, index) => (
                           <View
                              key={genre}
                              className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
                                 index === 0
                                    ? "border-accent bg-accent/20"
                                    : "border-white/10 bg-[#221f3d]"
                              }`}
                           >
                              <Text
                                 className={`text-sm font-medium ${
                                    index === 0
                                       ? "text-light-100"
                                       : "text-light-200"
                                 }`}
                              >
                                 {genre}
                              </Text>
                           </View>
                        ))}
                     </View>
                  </View>

                  <View className="mt-6">
                     <View className="mb-4">
                        <Text className="text-lg font-bold text-white">
                           Picked for you
                        </Text>
                        <Text className="mt-1 text-sm text-light-300">
                           A popular title that matches your movie mood
                        </Text>
                     </View>

                     {loading ? (
                        <View className="h-64 items-center justify-center rounded-3xl border border-white/10 bg-[#221f3d]">
                           <ActivityIndicator size="large" color="#AB8BFF" />
                           <Text className="mt-3 text-sm text-light-300">
                              Finding your next watch...
                           </Text>
                        </View>
                     ) : error ? (
                        <View className="items-center rounded-3xl border border-white/10 bg-[#221f3d] px-6 py-10">
                           <Ionicons
                              name="cloud-offline-outline"
                              size={30}
                              color="#AB8BFF"
                           />
                           <Text className="mt-3 text-center font-semibold text-white">
                              Recommendations are taking a break
                           </Text>
                           <Text className="mt-2 text-center text-sm text-light-300">
                              Check your connection and try again.
                           </Text>
                           <TouchableOpacity
                              className="mt-5 rounded-full bg-accent px-5 py-3"
                              onPress={refetch}
                           >
                              <Text className="font-bold text-secondary">
                                 Try again
                              </Text>
                           </TouchableOpacity>
                        </View>
                     ) : featuredMovie ? (
                        <TouchableOpacity
                           activeOpacity={0.9}
                           accessibilityRole="button"
                           accessibilityLabel={`Open ${featuredMovie.title}`}
                           onPress={() => openMovie(featuredMovie.id)}
                        >
                           <ImageBackground
                              source={{
                                 uri: `${IMAGE_BASE_URL}/w780${
                                    featuredMovie.backdrop_path ??
                                    featuredMovie.poster_path
                                 }`,
                              }}
                              className="h-64 overflow-hidden rounded-3xl bg-[#221f3d]"
                              resizeMode="cover"
                           >
                              <View className="flex-1 justify-end bg-black/50 p-5">
                                 <View className="mb-3 flex-row items-center">
                                    <View className="flex-row items-center rounded-full bg-black/70 px-3 py-1.5">
                                       <Ionicons
                                          name="star"
                                          size={12}
                                          color="#facc15"
                                       />
                                       <Text className="ml-1.5 text-xs font-bold text-white">
                                          {featuredMovie.vote_average.toFixed(1)}
                                       </Text>
                                    </View>
                                    {featuredMovie.runtime ? (
                                       <Text className="ml-3 text-xs font-medium text-white">
                                          {featuredMovie.runtime} min
                                       </Text>
                                    ) : null}
                                 </View>

                                 <Text
                                    className="text-2xl font-bold text-white"
                                    numberOfLines={2}
                                 >
                                    {featuredMovie.title}
                                 </Text>
                                 <Text
                                    className="mt-2 text-sm leading-5 text-light-100"
                                    numberOfLines={2}
                                 >
                                    {featuredMovie.overview}
                                 </Text>

                                 <View className="mt-4 flex-row items-center">
                                    <View className="h-9 w-9 items-center justify-center rounded-full bg-accent">
                                       <Ionicons
                                          name="play"
                                          size={16}
                                          color="#151312"
                                       />
                                    </View>
                                    <Text className="ml-3 text-sm font-bold text-white">
                                       View movie details
                                    </Text>
                                 </View>
                              </View>
                           </ImageBackground>
                        </TouchableOpacity>
                     ) : (
                        <View className="rounded-3xl border border-white/10 bg-[#221f3d] px-6 py-10">
                           <Text className="text-center text-light-300">
                              No featured movie is available right now.
                           </Text>
                        </View>
                     )}
                  </View>
               </View>

               {!loading && !error && recommendations.length > 0 ? (
                  <View className="mt-8">
                     <View className="mb-4 flex-row items-end justify-between px-5">
                        <View>
                           <Text className="text-lg font-bold text-white">
                              Popular right now
                           </Text>
                           <Text className="mt-1 text-sm text-light-300">
                              More movies worth a look
                           </Text>
                        </View>
                        <Ionicons
                           name="arrow-forward"
                           size={20}
                           color="#AB8BFF"
                        />
                     </View>

                     <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                           paddingLeft: 20,
                           paddingRight: 4,
                        }}
                     >
                        {recommendations.map((movie) => (
                           <MovieShelfCard
                              key={movie.id}
                              movie={movie}
                              onPress={() => openMovie(movie.id)}
                           />
                        ))}
                     </ScrollView>
                  </View>
               ) : null}

               <View className="mx-5 mt-8 flex-row items-center rounded-2xl border border-white/10 bg-[#221f3d] px-4 py-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                     <Ionicons
                        name="film-outline"
                        size={20}
                        color="#AB8BFF"
                     />
                  </View>
                  <View className="ml-3 flex-1">
                     <Text className="font-semibold text-white">
                        Keep exploring
                     </Text>
                     <Text className="mt-1 text-xs text-light-300">
                        Your profile gets better with every search.
                     </Text>
                  </View>
               </View>
            </ScrollView>
         </SafeAreaView>
      </View>
   );
};

export default Profile;
