import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';


const customButton = (props) => {
    const {title = 'Enter', style={}, textStyle={}, onPress } = props;

    return (
        <TouchableOpacity 
                onPress={onPress} style={[styles.button, style]}
                activeOpacity={0.7}
        >
                <AntDesign name='check' style={{fontSize: 40, color: '#fff'}}></AntDesign>
                <Text style={[styles.text, textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    );  
};

const styles = StyleSheet.create({
    button: {
        height: 70,
        width: 70,
        backgroundColor: '#2AC062',
        shadowColor: '#2AC062',
        shadowOpacity: 0.4,
        shadowOffset: { height: 10, width: 0 },
        shadowRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 35,
        justifyContent: 'center',
        margin: 10,
    },
    text: {
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#FFFFFF',
    },
});

export default customButton;
