import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
   ActivityIndicator,
   FlatList,
   Image,
   Text,
   View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../globals.css";

export default function App() {
   const router = useRouter();
   const {
      data: movies,
      loading: moviesLoading,
      error: moviesError,
   } = useFetch(() => fetchMovies({ query: "" }));

   return (
      <View className="flex-1 bg-primary">
         <Image source={images.bg} className="absolute w-full z-0" />

         <View
            className="flex-1 px-5 min-h-full"
         >
            <Image
               source={icons.logo}
               className="w-12 h-10 mt-20 mb-5 mx-auto"
            />

            {moviesLoading ? (
               <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="mt-10 self-center"
               />
            ) : moviesError ? (
               <Text>Error: {moviesError?.message}</Text>
            ) : (
               <View className="flex-1 mt-5">
                  <SearchBar
                     onPress={() => router.push("/search")}
                     placeholder="Search"
                  />
                  <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        data={movies}
                        ListHeaderComponent={
                           <Text className="text-lg text-white font-bold mt-5 mb-3">
                              Latest movies
                           </Text>
                        }
                        renderItem={({ item }) => (
                           <MovieCard {...item} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        columnWrapperStyle={{
                           justifyContent: "flex-start",
                           gap: 20,
                           paddingRight: 5,
                           marginBottom: 10 
                        }}
                        className="mt-2 pb-32"
                     />
                  </SafeAreaView>
               </View>
            )}
         </View>
      </View>
   );
}
