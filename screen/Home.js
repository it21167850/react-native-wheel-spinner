import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { getDatabase, ref, onValue, off } from "firebase/database";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import app from "../Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [logemail, setLogemail] = useState("");

  const handleViewProfile = () => {
    navigation.navigate("ViewProfile");
  };

  const handleOnSpin = () => {
    navigation.navigate("Spinner");
  };

  const handleSpinData = () => {
    navigation.navigate("SpinData");
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
  }, []);

  const downloadUsersReport = async () => {
    const htmlContent = generateHTMLReport(users);
    try {
      const pdf = await Print.printToFileAsync({ html: htmlContent });
      if (pdf.uri) {
        Sharing.shareAsync(pdf.uri);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generateHTMLReport = (users) => {
    let html = `
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

    users.forEach((user) => {
      html += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.address}</td>
                    <td>${user.phoneNumber}</td>
                </tr>
            `;
    });

    html += `
                        </tbody>
                    </table>
                </body>
            </html>
        `;

    return html;
  };

  useEffect(() => {
    const db = getDatabase(app);
    const usersRef = ref(db, "myApp/users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.values(data);
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });

    return () => {
      off(usersRef);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={handleViewProfile}
        style={styles.button}
      >
        View Profile
      </Button>
      {logemail == "admin@gmail.com" && (
        <Button
          mode="contained"
          onPress={downloadUsersReport}
          style={styles.button}
        >
          Report
        </Button>
      )}
      {logemail == "admin@gmail.com" && (
        <Button mode="contained" onPress={handleSpinData} style={styles.button}>
          Spin Data
        </Button>
      )}
      {logemail != "admin@gmail.com" && (
        <Button mode="contained" onPress={handleOnSpin} style={styles.button}>
          Spinner
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#2A3F84",
  },
});

export default Home;
