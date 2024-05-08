import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Assuming you're using Expo for vector icons

const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

const colorPalettes = [
  ["#007AFF", "#FF3B30", "#4CD964", "#FFCC00", "#5856D6"],
  ["#FF9500", "#FF2D55", "#5AC8FA", "#34AADC", "#CDDC39"],
  ["#8B572A", "#FFC107", "#007AFF", "#FF3B30", "#4CD964"],
];

const WheelOfFortune = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinnerColor, setSpinnerColor] = useState(colorPalettes[0][0]);

  const handleSpin = () => {
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * options.length);
    setTimeout(() => {
      setSelectedOption(options[randomIndex]);
      setSpinnerColor(getRandomColor());
      setIsSpinning(false);
    }, 5000); // Change the duration as per your requirement
  };

  const getRandomColor = () => {
    const randomPalette =
      colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    return randomPalette[Math.floor(Math.random() * randomPalette.length)];
  };

  return (
    <View style={styles.container}>
      <View style={[styles.wheel, { backgroundColor: spinnerColor }]}>
        {options.map((option, index) => (
          <Text key={index} style={styles.option}>
            {option}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.spinButton, isSpinning ? styles.disabled : null]}
        onPress={handleSpin}
        disabled={isSpinning}
      >
        <AntDesign name="arrowright" size={24} color="white" />
        <Text style={styles.buttonText}>Spin to Win</Text>
      </TouchableOpacity>
      {selectedOption && (
        <View style={styles.selectedOption}>
          <Text style={styles.selectedOptionText}>
            You won: {selectedOption}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  wheel: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    transform: [{ translateY: -100 }],
  },
  spinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  selectedOption: {
    marginTop: 20,
  },
  selectedOptionText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default WheelOfFortune;
