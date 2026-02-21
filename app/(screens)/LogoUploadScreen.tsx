import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { updateVendorRegistration } from "../../store/slices/registrationSlice";

const LogoUploadScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      dispatch(updateVendorRegistration({ logo: selectedImage }));
    }
    router.push("/(screens)/endorIDUploadScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Upload your business logo</Text>

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleImagePicker}
          activeOpacity={0.7}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/685/685655.png",
                }}
                style={styles.cameraIcon}
              />
              <Text style={styles.uploadText}>Upload</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LogoUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBF9",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  content: {
    marginTop: 60,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    fontWeight: "500",
  },
  uploadBox: {
    width: "100%",
    height: 180,
    borderWidth: 1.5,
    borderColor: "#C0C0C0",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  cameraIcon: {
    width: 35,
    height: 35,
    tintColor: "#444",
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "400",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#2A8888",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
