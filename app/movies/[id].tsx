import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
   SafeAreaView,
   useSafeAreaInsets,
} from "react-native-safe-area-context";

interface MovieInfoProps {
   label: string;
   value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
   return (
      <View className="flex-col items-start justify-center mt-5">
         <Text className="text-light-200 font-normal text-sm">{label}</Text>
         <Text className="text-light-200 font-bold text-sm mt-2">
            {value || "N/A"}
         </Text>
      </View>
   );
};

const MovieDetails = () => {
   const { id } = useLocalSearchParams();
   const insets = useSafeAreaInsets();

   const {
      data: movie,
      loading,
      error,
   } = useFetch(() => fetchMovieDetails(id as string), !!id);

   console.log(movie);

   return (
      <SafeAreaView edges={["top", "bottom"]} className="bg-primary flex-1">
         <ScrollView
            contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
         >
            <View>
               <Image
                  source={{
                     uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                  }}
                  className="w-full h-[550px]"
                  resizeMode="stretch"
               />
            </View>

            <View className="flex-col items-start justify-center mt-t px-5">
               <Text className="text-white font-bold text-xl mt-5">
                  {movie?.title}
               </Text>
               <View className="flex-row items-center gap-x-1 mt-2">
                  <Text className="text-light-200 text-sm">
                     {movie?.release_date?.split("-")[0]}
                  </Text>
                  <Text className="text-light-200 text-sm">•</Text>
                  <Text className="text-light-200 text-sm">
                     {movie?.runtime} mins.
                  </Text>
               </View>

               <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                  <Image source={icons.star} className="size-4" />
                  <Text className="text-white font-bold text-sm">
                     {Math.round(movie?.vote_average ?? 0)}/10
                  </Text>
                  <Text className="text-light-200 text-sm">
                     ({movie?.vote_count} votes)
                  </Text>
               </View>

               <MovieInfo label="Overview" value={movie?.overview!} />
               <MovieInfo
                  label="Genres"
                  value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
               />

               <View className="flex flex-row justify-between w-1/2">
                  <MovieInfo
                     label="Budget"
                     value={
                        movie?.budget
                           ? `$${(movie.budget / 1_000_000).toFixed(0)} million`
                           : "N/A"
                     }
                  />
                  <MovieInfo
                     label="Revenue"
                     value={
                        movie?.revenue
                           ? `$${(movie.revenue / 1_000_000).toFixed(0)} million`
                           : "N/A"
                     }
                  />
               </View>
               <MovieInfo
                  label="Production Companies"
                  value={
                     movie?.production_companies
                        ?.map((company) => company.name)
                        .join(" - ") || "N/A"
                  }
               />
            </View>
         </ScrollView>

         <TouchableOpacity
            className="absolute left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row icons-center justify-center z-50"
            style={{ bottom: insets.bottom + 12 }}
            onPress={router.back}
         >
            <Image
               source={icons.arrow}
               className="size-5 mr-1 mt-0.5 rotate-180"
               tintColor="#fff"
            />
            <Text className="text-white font-semibold text-base">Go back</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};

export default MovieDetails;
