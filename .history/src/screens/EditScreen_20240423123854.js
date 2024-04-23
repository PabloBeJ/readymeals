import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import globalStyles from '../styles/globalStyles';

