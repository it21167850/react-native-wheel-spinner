import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { getDatabase, ref, onValue, off, set } from 'firebase/database';
import app from '../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [logemail, setLogemail] = useState('');
    const [loggedUser, setLoggedUser] = useState(null);
    const [users, setUsers] = useState([]);


    const handleUpdate = async () => {
        // Resetting errors
        setNameError('');
        setEmailError('');
        setAddressError('');
        setPhoneNumberError('');

        // Validation
        if (!name) {
            setNameError('Name is required');
            return;
        }

        if (!email) {
            setEmailError('Email is required');
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid email address');
            return;
        }

        if (!address) {
            setAddressError('Address is required');
            return;
        }

        if (!phoneNumber) {
            setPhoneNumberError('Phone number is required');
            return;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            setPhoneNumberError('Phone number must be 10 digits');
            return;
        }

        try {
            const db = getDatabase(app);
            const userRef = ref(db, `myApp/users/${loggedUser.id}`);
            await set(userRef, {
                name: name,
                email: email,
                address: address,
                phoneNumber: phoneNumber,
                password: loggedUser.password
            });
            console.log('User data updated successfully');
            navigation.navigate('ViewProfile');
        } catch (error) {
            console.error('Error updating user data:', error.message);
        }
    };
    const getStoredEmail = async () => {
        try {
            const logemail = await AsyncStorage.getItem('logemail');
            setLogemail(logemail);
        } catch (error) {
            console.error('Error retrieving email:', error);
            return null;
        }
    };

    useEffect(() => {
        getStoredEmail();
        const db = getDatabase(app);
        const usersRef = ref(db, 'myApp/users');

        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const usersArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
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
            const user = users.find(u => u.email === logemail);
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
            <Text style={styles.title}>Edit Profile</Text>
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
                disabled
            />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
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
            {phoneNumberError ? <Text style={styles.error}>{phoneNumberError}</Text> : null}
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                Save
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '80%',
        marginBottom: 20,
    },
    button: {
        width: '80%',
        height: 40,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 5,
    },
});

export default EditProfile;
