import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import styles from '../styles/stylesOne';
import CustomButton from "../components/customButton";
import {AsyncStorage} from 'react-native';

const PRACTICE_TIME = 2* 1000;

export default class closeSession extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      version:null,
    }
  }

  async componentDidMount() {
    const version = await AsyncStorage.getItem('version')
    this.setState({version:version})
  }

  deleteKey = async() => {
    await AsyncStorage.removeItem("keyLogin")
    await AsyncStorage.clear()
    await AsyncStorage.setItem('estadoPedidoActual','noHay')
    this.props.navigation.navigate('Login')
  }
  render() {
    return (
      <View style={[styles.container,{}]} >
        <Image style={{width: 150, height: 150}}
          source={require('../images/TodoYa-03.png')}
        />  
        { this.state.version!=null?
          <View style={{alignItems:'center',marginBottom: 20}}> 
            <Text style={{fontSize:15, fontWeight: '400'}}>{this.state.version}</Text>
          </View>
        : null}          
        <Text style={{fontSize: 25, color: "#00000055", textAlign: 'center', padding: 20,}}
          >Hola, lamentamos que tengas que irte y cerrar la aplicación. Esperamos verte pronto!
        </Text>
        <CustomButton 
            title="Cerrar Sesíón" 
            onPress={() => {this.deleteKey()}}
            style={{marginBottom: 15, width: 200, height: 50 }}
            fontSize={12}

        />          
      </View>
    )
  }
}