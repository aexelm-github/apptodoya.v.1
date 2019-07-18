import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';

      
_storeData = async (props) => {
  try {
    await AsyncStorage.setItem('TASKS', 'I like to save it.');
  } catch (error) {
    // Error saving data
  }
}

_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('TASKS');
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};

export default _storeData;