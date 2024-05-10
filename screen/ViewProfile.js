import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button, Card } from "react-native-paper";
import { getDatabase, ref, onValue, off, remove } from "firebase/database";
import app from "../Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [logemail, setLogemail] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);

  const handleEdit = () => {
    navigation.navigate("EditProfile");
  };

  const handleDelete = () => {
    if (loggedUser) {
      const db = getDatabase(app);
      const userRef = ref(db, `myApp/users/${loggedUser.id}`);

      remove(userRef)
        .then(() => {
          console.log("User deleted successfully.");
          navigation.navigate("Login");
        })
        .catch((error) => {
          console.error("Error deleting user: ", error);
        });
    }
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Profile</Text>
      <Card style={styles.card1}>
        <ImageBackground
          source={require("../assets/Avatar.png")} // Use require() to import the image
          style={styles.background}
        ></ImageBackground>
        <Card.Content>
          <Text style={styles.name}>{name}</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card2}>
        <Card.Content>
          <Text style={styles.detail}>
            <Text style={styles.label}>Email:</Text> <Text>{email}</Text>
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Address:</Text> <Text>{address}</Text>
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Phone Number:</Text>{" "}
            <Text>{phoneNumber}</Text>
          </Text>
        </Card.Content>
      </Card>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleEdit} style={styles.button}>
          Edit Profile
        </Button>
        <Button
          mode="contained"
          onPress={handleDelete}
          style={[styles.button, styles.deleteButton]}
        >
          Delete Profile
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  background: {
    width: 150,
    height: 150,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    fontFamily: "Arial",
    color: "#2A3F84",
  },
  card1: {
    display: "flex",
  },
  card2: {
    width: "90%",
    marginBottom: 30,
    elevation: 4,
    margin: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    height: 40,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#2A3F84",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
});

export default ViewProfile;
