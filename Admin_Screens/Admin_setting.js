import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { callurl } from "../apifile";

// Map icon names to their require calls
const iconMap = {
  "fps.png": require("../assets/fps.png"),
  "clock.png": require("../assets/clock.png"),
  "threshold.png": require("../assets/threshold.png"),
  "duration.png": require("../assets/duration.png"),
  "skip.png": require("../assets/skip.png"),
  "absence.png": require("../assets/absence.png"),
  "presence.png": require("../assets/presence.png"),
  "frameinterval.png": require("../assets/class.png"),
  "punish.png": require("../assets/abuse.png"),
};

function Admin_Setting({ navigation, route }) {
  const [settings, setSettings] = useState({
    fps: 0,
    interval: 0,
    threshold: 0,
    duration: 0,
    margin: 0,
    intervalPunishment: 0,
    absThreshold: 0,
    preThreshold:0,
    frame_interval:0
  });
  const [activeModal, setActiveModal] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    const keys = ["fps", "intervals", "threshold", "duration", "margin","intervalPunishment","absThreshold","preThreshold","frame_interval"];
    try {
      const fetchedSettings = {};
      for (const key of keys) {
        const res = await fetch(`${callurl}admin/getSettings?key=${key}`);
        if (res.ok) {
          const data = await res.json(); // Parse the response JSON only once
          console.log(data); // Log the parsed data
          fetchedSettings[key] = parseFloat(data.value); // Use parseFloat to handle decimal values
        } else {
          throw new Error(`Failed to fetch settings for key: ${key}`);
        }
      }
      setSettings(fetchedSettings);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    }
  };

  const updateSetting = async (key, value, description) => {
    try {
      const res = await fetch(
        `${callurl}admin/setSettings?key=${key}&value=${value}&description=${description}`,
        { method: "POST" }
      );
      if (res.ok) {
        console.log(`Updated ${key} to ${value}`);
      } else {
        throw new Error("Failed to update setting");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update setting");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const openModal = (key) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const renderSliderModal = (key, min, max, step, label) => (
    <Modal visible={activeModal === key} transparent animationType="slide" onRequestClose={closeModal}>
      <View style={styles.modalBackground}>
        <View style={styles.sliderContainer}>
          <Text style={styles.label}>{label}</Text>
          <Slider
            style={{ width: 250, height: 40 }}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={settings[key]}
            onValueChange={(value) => setSettings({ ...settings, [key]: value })}
            minimumTrackTintColor="#FFC2C0"
            maximumTrackTintColor="#FFC2C0"
            thumbTintColor="#FFC2C0"
          />
          <Text style={styles.sliderValue}>{settings[key]}</Text>
          <TextInput
            placeholder="Description"
            onChangeText={setDescription}
            style={styles.textInput}
          />
          <Button
            title="Save"
            onPress={() => {
              updateSetting(key, settings[key], description);
              closeModal();
            }}
            color="#90EE90"
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView>
      <ScrollView>
      <View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>Attendance Settings</Text>
        </View>
        <View style={{ flexDirection: "column", padding: 20 }}>
          {[
            { key: "fps", label: "FPS", desc: "Frames Per Second", min: 2, max: 15, step: 1, icon: "fps.png" },
            { key: "intervals", label: "INTERVAL", desc: "Interval Description", min: 5, max: 20, step: 5, icon: "clock.png" },
            { key: "threshold", label: "THRESHOLD", desc: "Threshold Limit", min: 10, max: 100, step: 5, icon: "threshold.png" },
            { key: "duration", label: "DURATION", desc: "Duration in Minutes", min: 1, max: 30, step: 1, icon: "duration.png" },
            { key: "margin", label: "MARGIN", desc: "Start and End Margin", min: 0, max: 10, step: 1, icon: "skip.png" },
            { key: "absThreshold", label: "ABSENT THRESHOLD", desc: "Threshold Limit for absent", min: 10, max: 100, step: 5, icon: "absence.png" },
            { key: "preThreshold", label: "PRESENT THRESHOLD", desc: "Threshold Limit for present", min: 10, max: 100, step: 5, icon: "presence.png" },
            { key: "frame_interval", label: "FRAME INTERVAL", desc: "Intervals for frames to pick frames", min: 10, max: 100, step: 5, icon: "frameinterval.png" },
          ].map((item) => (
            <View key={item.key} style={{ flexDirection: "row", padding: 20, alignItems: "center" }}>
              {/* Use the static icon mapping */}
              <Image source={iconMap[item.icon]} style={{ width: 40, height: 40 }} />
              <View style={{ marginLeft: 20, width: 150 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{item.label}</Text>
                <Text style={{ fontSize: 12, color: "#acb0b4" }}>{item.desc}</Text>
              </View>
              <TouchableOpacity onPress={() => openModal(item.key)}>
                <Text style={{ color: "#acb0b4", fontSize: 14 }}>{settings[item.key]}.0</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {renderSliderModal("fps", 2, 15, 1, "Adjust FPS")}
        {renderSliderModal("intervals", 5, 20, 5, "Adjust Interval")}
        {renderSliderModal("threshold", 10, 100, 5, "Adjust Threshold")}
        {renderSliderModal("duration", 1, 30, 1, "Adjust Duration")}
        {renderSliderModal("margin", 0, 10, 1, "Adjust Margin")}
        {renderSliderModal("absThreshold", 10, 100, 5, "Adjust Absent Threshold")}
        {renderSliderModal("preThreshold", 10, 100, 5, "Adjust Present Threshold")}
        {renderSliderModal("frame_interval", 10, 100, 5, "Adjust Threshold To Pick Frames")}
      </View>
      <View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>Punishment Settings</Text>
        </View>
        <View style={{ flexDirection: "column", padding: 20 }}>
          {[
            { key: "intervalPunishment", label: "Punish Interval", desc: "Interval for Punishment", min: 5, max: 20, step: 5, icon: "punish.png" },

          ].map((item) => (
            <View key={item.key} style={{ flexDirection: "row", padding: 20, alignItems: "center" }}>
              {/* Use the static icon mapping */}
              <Image source={iconMap[item.icon]} style={{ width: 40, height: 40 }} />
              <View style={{ marginLeft: 20, width: 150 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{item.label}</Text>
                <Text style={{ fontSize: 12, color: "#acb0b4" }}>{item.desc}</Text>
              </View>
              <TouchableOpacity onPress={() => openModal(item.key)}>
                <Text style={{ color: "#acb0b4", fontSize: 14 }}>{settings[item.key]}.0</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {renderSliderModal("intervalPunishment", 2, 15, 1, "Adjust interval for Punishment")}

      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  sliderContainer: { width: 300, padding: 20, backgroundColor: "#fff", borderRadius: 10, alignItems: "center" },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  sliderValue: { fontSize: 16, marginTop: 10 },
  textInput: { borderWidth: 1, borderColor: "#ccc", padding: 5, marginTop: 10, width: "100%",marginBottom:10 },
});

export default Admin_Setting;
