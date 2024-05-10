import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../Firebase";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const handleRegister = async () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setAddressError("");
    setPhoneNumberError("");

    if (!name) {
      setNameError("Name is required");
      return;
    }

    if (!email) {
      setEmailError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (!address) {
      setAddressError("Address is required");
      return;
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required");
      return;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Phone number must be 10 digits");
      return;
    }

    const user = {
      name,
      email,
      address,
      phoneNumber,
      password,
    };
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "myApp/users"));
    set(newDocRef, user)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        alert("Error adding user:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
        error={!!nameError}
      />
      {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        error={!!emailError}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        error={!!passwordError}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      <TextInput
        label="Address"
        mode="outlined"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        error={!!addressError}
      />
      {addressError ? <Text style={styles.error}>{addressError}</Text> : null}
      <TextInput
        label="Phone Number"
        mode="outlined"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        error={!!phoneNumberError}
      />
      {phoneNumberError ? (
        <Text style={styles.error}>{phoneNumberError}</Text>
      ) : null}
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Text style={styles.loginButton}>Already have an account?</Text>
      <Button
        onPress={() => navigation.navigate("Login")}
        style={styles.loginButton}
      >
        Login here
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2A3F84",
  },
  input: {
    width: "80%",
    marginBottom: 10,
  },
  button: {
    width: "80%",
    height: 50,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#2A3F84",
  },
  loginButton: {
    marginTop: 20,
  },
  error: {
    color: "red",
    marginBottom: 5,
  },
});

export default Register;
