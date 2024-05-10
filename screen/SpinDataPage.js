import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TextInput,
} from "react-native";
import { getDatabase, ref, onValue, off, remove, get } from "firebase/database";
import * as Sharing from "expo-sharing";
import { Feather } from "@expo/vector-icons";
import app from "../Firebase";
import * as Print from "expo-print";

const SpinDataPage = () => {
  const [spinData, setSpinData] = useState([]);
  const [filteredSpinData, setFilteredSpinData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const spinDataRef = ref(db, "myApp/wheelOfFortune");

      onValue(spinDataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const spinDataArray = Object.values(data);
          setSpinData(spinDataArray);
          setFilteredSpinData(spinDataArray);
        } else {
          setSpinData([]);
          setFilteredSpinData([]);
        }
      });

      return () => {
        off(spinDataRef);
      };
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter spin data based on search query
    const filteredData = spinData.filter((item) =>
      item.user.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSpinData(filteredData);
  }, [searchQuery, spinData]);

  const handleGenerateAndSharePDF = async () => {
    const htmlContent = generateHTMLReport(filteredSpinData);
    try {
      const pdf = await Print.printToFileAsync({ html: htmlContent });
      if (pdf.uri) {
        Sharing.shareAsync(pdf.uri);
      }
    } catch (error) {
      console.error("Error generating and sharing PDF:", error);
    }
  };

  const handleDelete = async (item) => {
    try {
      const db = getDatabase(app);
      const spinDataRef = ref(db, `myApp/wheelOfFortune`);

      // Find the child node with the matching timestamp
      const snapshot = await get(spinDataRef);
      if (snapshot.exists()) {
        const children = snapshot.val();
        const timestampToDelete = item.timestamp; // Assuming timestamp is unique
        const childToDelete = Object.keys(children).find(
          (key) => children[key].timestamp === timestampToDelete
        );

        if (childToDelete) {
          const itemRef = ref(db, `myApp/wheelOfFortune/${childToDelete}`);
          await remove(itemRef);
          console.log("Item deleted successfully.");
        } else {
          console.log("Item not found.");
        }
      } else {
        console.log("No data found in the database.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const generateHTMLReport = (spinData) => {
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
                <th>User</th>
                <th>Email</th>
                <th>Selected Option</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
    `;

    spinData.forEach((item) => {
      html += `
              <tr>
                <td>${item.user}</td>
                <td>${item.email}</td>
                <td>${item.selectedOption}</td>
                <td>${new Date(item.timestamp).toLocaleString()}</td>
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

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Feather
          name="share-2"
          size={24}
          color="#2A3F84"
          style={styles.icon}
          onPress={handleGenerateAndSharePDF}
        />
      </View>
      <Text style={styles.title}>Wheel Spin Data</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Feather name="search" size={24} color="#2A3F84" style={styles.icon} />
      </View>

      <FlatList
        data={filteredSpinData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{`User: ${item.user}`}</Text>
            <Text style={styles.itemText}>{`Email: ${item.email}`}</Text>
            <Text
              style={styles.itemText}
            >{`Discount Percentage: ${item.selectedOption}`}</Text>
            <Text style={styles.itemText}>{`Date & Time: ${new Date(
              item.timestamp
            ).toLocaleString()}`}</Text>
            <Feather
              name="trash-2"
              size={24}
              color="#007bff"
              style={styles.remove}
              onPress={() => handleDelete(item)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2A3F84",
  },
  item: {
    borderRadius: 10,
    borderColor: "none",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ADD8E6",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  itemText: {
    fontSize: 16,
    marginStart: 10,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    height: 40,
    paddingStart: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "end",
    justifyContent: "flex-end",
  },
  icon: {
    marginHorizontal: 10,
  },
  remove: {
    position: "absolute",
    right: 10,
    top: 50,
  },
});

export default SpinDataPage;
