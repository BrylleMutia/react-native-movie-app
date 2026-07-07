import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import React from "react";
import { Image, View } from "react-native";

const Saved = () => {
   return (
      <View className="bg-primary flex-1">
         <View className="flex-row items-center justify-between flex-1 flex-col">
            <Image source={images.bg} className="absolute w-full z-0" />
            <Image
               source={icons.logo}
               className="w-12 h-10 mt-20 mb-5 mx-auto"
            />
         </View>
      </View>
   );
};

export default Saved;
