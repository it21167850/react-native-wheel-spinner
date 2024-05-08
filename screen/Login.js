import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from '../Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        const usersRef = ref(db, 'myApp/users');

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

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');
        
        if (!email) {
            setEmailError('Email is required');
            return;
        }
    
        if (!password) {
            setPasswordError('Password is required');
            return;
        }
    
        const user = users.find(u => u.email === email && u.password === password);
    
        if (user) {   
            try {
                await AsyncStorage.setItem('logemail', email);
                navigation.navigate('Home');
            } catch (error) {
                console.error('Error storing email:', error);
            }        
        } else {                        
            alert('Invalid email or password');
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Login
            </Button>
            <Text style={styles.loginButton}>New User ?</Text>
            <Button onPress={() => navigation.navigate('Register')} style={styles.loginButton}>
            Register here
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
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Arial',
    },
    input: {
        width: '80%',
        marginBottom: 10,
    },
    button: {
        width: '40%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    error: {
        color: 'red',
        marginBottom: 5,
    },
    loginButton: {
        marginTop: 20,
    },
});

export default Login;
