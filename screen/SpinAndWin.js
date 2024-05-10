import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { getDatabase, ref, push, onValue, off } from "firebase/database";
import app from "../Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Ensure this is the correct import path for your Firebase configuration

const options = ["10", "15", "20", "25", "30"];

const WheelOfFortune = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [logemail, setLogemail] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);

  const getStoredEmail = async () => {
    try {
      const logemail = await AsyncStorage.getItem("logemail");
      setLogemail(logemail);
    } catch (error) {
      console.error("Error retrieving email:", error);
      return null;
    }
  };

  useEffect(() => {
    getStoredEmail();
    const db = getDatabase(app);
    const usersRef = ref(db, "myApp/users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });
    return () => {
      off(usersRef);
    };
  }, []);

  useEffect(() => {
    if (users.length > 0 && logemail) {
      const user = users.find((u) => u.email === logemail);
      setLoggedUser(user);
    }
  }, [users, logemail]);

  useEffect(() => {
    if (loggedUser) {
      setName(loggedUser.name);
      setEmail(loggedUser.email);
      setAddress(loggedUser.address);
      setPhoneNumber(loggedUser.phoneNumber);
    }
  }, [loggedUser]);

  const handleSpin = async () => {
    setIsSpinning(true);

    // Check if the user has already spun the wheel today
    const lastSpinDate = await AsyncStorage.getItem(
      `lastSpinDate_${loggedUser.id}`
    );
    const today = new Date().toDateString();

    if (lastSpinDate === today) {
      setIsSpinning(false);
      return; // User has already spun the wheel today, exit function
    }

    // User has not spun the wheel today, proceed with spinning
    const randomIndex = Math.floor(Math.random() * options.length);
    const sectionIndex = randomIndex % (360 / 30); // Calculate the section index
    const angleBySegment = (2 * Math.PI) / options.length;
    const toValue = 360 * 5 + randomIndex * angleBySegment - angleBySegment / 2;

    Animated.timing(rotateAnim, {
      toValue: toValue,
      duration: 5000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      const selected = options[randomIndex];
      setSelectedOption(selected);

      console.log("Selected option:", selected);
      saveToFirebase(selected); // Save selected option to Firebase

      // Save today's date as the last spin date for the user
      AsyncStorage.setItem(`lastSpinDate_${loggedUser.id}`, today).then(() => {
        setIsSpinning(false);
      });
    });
  };

  const saveToFirebase = (selected) => {
    const db = getDatabase(app);
    const dbRef = ref(db, "myApp/wheelOfFortune");
    const data = {
      selectedOption: selected,
      user: name,
      email: email,
      address: address,
      phoneNumber: phoneNumber,

      timestamp: new Date().getTime(),
    };

    push(dbRef, data)
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        navigation.navigate("Home");
      });
  };

  const wheelRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Spin the wheel and win a prize!</Text>
      <View style={styles.container}>
        <View style={styles.wheelContainer}>
          <Animated.Image
            source={require("../assets/spinnerWheel.png")}
            style={[
              styles.wheel,
              {
                transform: [{ rotate: wheelRotate }],
              },
            ]}
          />
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
              Congratulations! You won a {selectedOption}% discount today!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    height: "100%",
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    marginTop: 10,
  },
  wheelContainer: {
    position: "relative",
  },
  wheel: {
    width: 300,
    height: 300,
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
    backgroundColor: "#2A3F84",
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default WheelOfFortune;
