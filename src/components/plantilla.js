import React, { Component } from 'react';
import { Button, 
         Text, 
         View, 
         Image, 
         TouchableOpacity, 
         TouchableHighlight,
         ProgressBarAndroid,
         StyleSheet,
        } from 'react-native';
import styles from '../styles/stylesOne';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import CustomButton from './customButton';
import * as fn from '../globals/fn'

GLOBAL = require('../globals/globals');

export default class InfoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
    
        }
    }

    async componentDidMount() {

    }


    render () {
        return (
            <View><Text>Component template</Text></View>
        )
    }
}


const localStyles = StyleSheet.create({
   
})  