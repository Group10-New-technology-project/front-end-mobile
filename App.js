import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StackNavigator } from "./src/navigation/StackNavigator";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
//-------------------//
console.log(ACCESS_KEY_ID);
console.log(SECRET_ACCESS_KEY);
console.log(REGION);
console.log(S3_BUCKET_NAME);
console.log(API_URL);
//-------------------//
export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
