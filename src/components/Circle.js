import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';

var Circle = (props) => {
  const { style } = props;
  return (
      <View style={[props.style, styles.circle, {backgroundColor:props.filled?props.color:'transparent', borderColor: props.color} ]} elevation={props.elevation}/>
  )
}

const styles = StyleSheet.create({
  circle: {
      width: 20,
      height: 20,
      borderRadius: 20/2,
      backgroundColor: 'red',
      borderWidth: 1,
  },
});


export default Circle;