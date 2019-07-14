import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import styles from '../styles/stylesOne';

const PRACTICE_TIME = 2* 1000;

export default class pedidoScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    onPress = () => {
        alert("exel");
      }

    componentDidMount() {
    }

  render() {
    return (
      <View style={styles.container}>
        <View>
            <View  style={styles.logoContainer}>
                <Text>Screen pedido</Text>               
            </View>
            <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
        </View>
      </View>
    );
  }
}