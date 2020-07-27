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
import { Ionicons, AntDesign } from '@expo/vector-icons';

import CustomButton from './customButton';

GLOBAL = require('../globals/globals');

export default class Cantidad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value : 10
        }
    }

    async componentDidMount() {
        const { value } = this.props
        this.setState({value : value === null || value === undefined ? 0 : value})
    }

    addValue = async () => {    
        var { value } = this.state
        value = value === this.props.maxValue ? value : value + 1
        this.setState({ value })
        this.props.onChange(value)
    }

    susValue = async () => {    
        var  { value } = this.state
        value = value === this.props.minValue ? value : value - 1
        this.setState({ value })
        this.props.onChange(value)
    }

    render () {
        const { value }  = this.state
        return (
            <View style={{ width: 100, marginRight: 10, flexDirection: 'row', textAlign: 'center', alignItems:'center', alignContent: 'center',}}>
                <TouchableOpacity
                    style={{margin: 5}}
                    onPress={() => this.susValue()}
                >
                    <AntDesign name="minuscircle" size={24} color="#0652DD" />
                </TouchableOpacity>
                <Text style={{margin: 5, marginRight: 10}}>x{value}</Text>
                <TouchableOpacity
                    style={{margin: 5}}
                    onPress={() => this.addValue()}
                >
                    <AntDesign name="pluscircle" size={24} color="#EA2027" />
                </TouchableOpacity>
            </View>
        )
    }
}


const localStyles = StyleSheet.create({
   x: {
       textAlign: 'center'
   }
})  