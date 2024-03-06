import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const Header = ({ title }) => {
	return (
	  <View style={styles.container}>
		<Text style={styles.title}>{title}</Text>
	  </View>
	);
  };
  
  const styles = StyleSheet.create({
	container: {
	  backgroundColor: 'black',
	  paddingVertical: 10,
	  paddingHorizontal: 20,
	  alignItems: 'center',
	},
	title: {
	  color: 'white',
	  fontSize: 20,
	},
  });

export default Header;


