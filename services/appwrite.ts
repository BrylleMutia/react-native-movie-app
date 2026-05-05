import { Client, Databases, ID, Query } from "react-native-appwrite";

// track searches made by users

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// inialize appwrite client/database
const client = new Client()
   .setEndpoint("https://cloud.appwrite.io/v1")
   .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
   // check if search term already exists in database
   // otherwise create a new document with count 1

   try {
      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
         Query.equal("search_term", query),
      ]);

      console.log(result);

      if (result.documents.length > 0) {
         const existingMovie = result.documents[0];

         await database.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            existingMovie.$id,
            { count: existingMovie.count + 1 },
         );
      } else
         await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
               search_term: query,
               movie_id: movie?.id || 0,
               title: movie?.title || "",
               count: 1,
               poster_url: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            },
         );
   } catch (error) {
      console.error("Error updating search count:", error);
      throw error;
   }
};

export const getTrendingMovies = async (): Promise<
   TrendingMovie[] | undefined
> => {
   try {
      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
         Query.limit(5),
         Query.orderDesc("count"),
      ]);

      console.log(result);
      return result.documents as unknown as TrendingMovie[];
   } catch (error) {
      console.log(error);
      return undefined;
   }
};
