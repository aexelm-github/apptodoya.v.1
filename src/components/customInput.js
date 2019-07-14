import React from  'react'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Input, ThemeProvider } from 'react-native-elements'
import { View, StyleSheet}  from 'react-native'
import { Dimensions } from "react-native";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const theme = {
    Input: {
        placeholder: 'Input',
        inputStyle: { flex:1, color: 'white', padding: 0, backgroundColor: 'rgba(0,0,0,0.2)'},
        label: '',
        value: '',
    },
  };
  
  // Your App
  const customInput = (props) => {
    const {title = 'Enter', style={}, textStyle={}, onChangeText, icon='', label='', value='' } = props;
    return (
        <View style={[styles.viewContainer]}   >
      <ThemeProvider theme={theme}>
        <Input  placeholder={props.title}
                label={props.label}
                leftIcon={
                    <FontAwesome 
                        name={props.icon} 
                        size={32} color="rgba(255,255,255,0.8)"
                        
                    />
                }
                onChangeText={props.onChangeText}
                value={props.value} 
                style={{width: 100}}
        />
      </ThemeProvider>
        </View>
    );
  };


  const styles = StyleSheet.create({
    viewContainer : {
        minWidth: 100, /*screenWidth - (screenWidth*0.2),*/
        borderBottomColor: 'red', 
        borderBottomWidth: 2,
        marginBottom: 10,
    }
  });   

export default customInput;
