import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';

const PRACTICE_TIME = 0.2* 1000;

const retrieveStorage = {"value":''};

export default class logoScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    onPress = () => {
        alert("exel");
      }

    componentDidMount() {
        this._retrieveData("keyLogin");
        console.log("LogonScreen: " + retrieveStorage.value);
        setTimeout(() => (
            this.props.navigation.navigate('AppStackLogin', {})
            ), PRACTICE_TIME);        
    }

    _retrieveData = async (key) => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          keyStorage.keyLogin =  value;
          console.log(keyStorage.keyLogin);
          this.props.navigation.navigate('AppStackPpal', {})
        }else{
          console.log(key+" : No tiene nada!!!");
        }
      } catch (error) {
        // Error retrieving data
        console.log(key+" : Error recuperando dato!!" + error);
      }
    };

  render() {
    return (
      <View style={styles.container}>
        <View>
            <View  style={styles.logoContainer}>
                <TouchableOpacity  onPress={this.onPress}>
                    <Image style={styles.logoImage}
                    source={require('../images/TodoYa-03.png')}
                    />
                </TouchableOpacity >
            </View>
            <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
        </View>
      </View>
    );
  }
}