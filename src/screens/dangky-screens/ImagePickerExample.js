import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME } from "@env";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  
  const uploadImageToS3 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const fileName = imageUri.split("/").pop(); // Lấy tên file từ đường dẫn

      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ACL: "public-read", // Đảm bảo ảnh được tải lên có thể được truy cập công khai
      };

      const uploadResponse = await s3.upload(params).promise();
      console.log("Upload successful", uploadResponse.Location);
      return uploadResponse.Location; // Trả về đường dẫn của ảnh đã tải lên
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const imageUrl = await uploadImageToS3(result.assets[0].uri);
      setImage(imageUrl);
    }

    console.log(result);
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Update" onPress={uploadImageToS3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
