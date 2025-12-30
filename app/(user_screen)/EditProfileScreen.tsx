import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: Date;
  category: string;
  address: string;
}

const EditProfileScreen = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "Rokey Mahmud",
    email: "alice@example.com",
    password: "",
    confirmPassword: "",
    phone: "+1 (555) 123-4567",
    dob: new Date(),
    category: "",
    address: "123 Business St, Dhaka",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const categories = ["Business", "Personal", "Shopping", "Others"];

  const handleChange = (name: keyof FormData, value: string | Date) => {
    setFormData({ ...formData, [name]: value } as FormData);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("dob", selectedDate);
    }
  };

  const handleSave = () => {
    console.log("Final Data:", formData);
    Alert.alert("Success", "Profile information saved!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <InputGroup
            label="Full name"
            value={formData.fullName}
            onChange={(val) => handleChange("fullName", val)}
          />

          <InputGroup
            label="E-mail address"
            value={formData.email}
            keyboardType="email-address"
            onChange={(val) => handleChange("email", val)}
          />

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(val) => handleChange("password", val)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#AAA"
              />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {formData.dob.toLocaleDateString()}
            </Text>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#AAA"
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dob}
              mode="date"
              onChange={onDateChange}
            />
          )}

          {/* Category */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text
              style={[
                styles.inputText,
                { color: formData.category ? "#333" : "#999" },
              ]}
            >
              {formData.category || "Select Category"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#AAA"
            />
          </TouchableOpacity>

          <InputGroup
            label="Business Address"
            value={formData.address}
            onChange={(val) => handleChange("address", val)}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Category</Text>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalItem}
                onPress={() => {
                  handleChange("category", item);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  keyboardType = "default",
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder={label}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 40,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  backBtn: { backgroundColor: "#F0F2F1", borderRadius: 10, padding: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF2F0",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
  },
  input: { flex: 1, fontSize: 15, color: "#333" },
  inputText: { flex: 1, fontSize: 15, color: "#333" },
  saveButton: {
    backgroundColor: "#2D8282",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
  },
  modalItemText: { fontSize: 16, textAlign: "center", color: "#333" },
});

export default EditProfileScreen;
