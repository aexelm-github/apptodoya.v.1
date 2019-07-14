import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import styles from '../styles/stylesOne';

const PRACTICE_TIME = 2* 1000;

export default class logoScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    onPress = () => {
        alert("exel");
      }

    componentDidMount() {
        setTimeout(() => (
            this.props.navigation.navigate('AppStackLogin', {})
            ), PRACTICE_TIME);        
    }

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