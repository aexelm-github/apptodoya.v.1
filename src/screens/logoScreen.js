import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';

const PRACTICE_TIME = 0.2* 1000;

const retrieveStorage = {"value":null};

export default class logoScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    onPress = () => {
        alert("exel");
      }

    async componentDidMount() {
        await this._retrieveData("keyLogin");
        console.log( JSON.parse(retrieveStorage.value));
        console.log(await AsyncStorage.getAllKeys())
        if (retrieveStorage.value == null)  {
          this.props.navigation.navigate('AppStackLogin', {});
        }else {
          const estadoPedidoActual = await AsyncStorage.getItem("estadoPedidoActual")
          console.log(estadoPedidoActual)
          if ((estadoPedidoActual=='noHay')||(estadoPedidoActual==null)) {
            console.log('paso por aca ' + estadoPedidoActual)
            this.props.navigation.navigate('Categorias', { 
              data : retrieveStorage.value
            });          
          }else{
            this.props.navigation.navigate('Carrito', { 
              data : retrieveStorage.value
            });          
          }
        }
          
        /*setTimeout(() => (
            this.props.navigation.navigate('AppStackLogin', {})
            ), PRACTICE_TIME);        */
    }

    _retrieveData = async (key) => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          retrieveStorage.value =  value;
          //await this.props.navigation.navigate('AppStackPpal', {})
        }else{
          console.log('_retrieveData: error: logoScreen: '+value)
        }
      } catch (error) {
        // Error retrieving data
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