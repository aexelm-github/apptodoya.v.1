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
        //await this._retrieveData("keyLogin");
        console.log( JSON.parse(retrieveStorage.value));
        console.log(await AsyncStorage.getAllKeys())
        const keyLogin = await AsyncStorage.getItem('keyLogin')
        //if (retrieveStorage.value == null)  { 
        if (keyLogin == null)  {
          this.props.navigation.navigate('AppStackLogin', {});
        }else {
          const usuarioId = JSON.parse(keyLogin)[0].usuario_id
          this.getPedido(usuarioId)
        }
          
        /*setTimeout(() => (
            this.props.navigation.navigate('AppStackLogin', {})
            ), PRACTICE_TIME);        */
    }

    getPedido =  async (usuarioId) => {
      const estadoPedidoActual = await AsyncStorage.getItem("estadoPedidoActual")
      let formdata = new FormData()
      console.log("2. usuarioId "+ usuarioId)
      formdata.append('usuarioId',usuarioId);
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getPedidoPendiente', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
        if (responseJson.length == 0){
          console.log('3.1 no hay supuestamente+'+false)
          console.log('4.2 ya paso por aca '+estadoPedidoActual)
          if ((estadoPedidoActual=='noHay')||(estadoPedidoActual==null)) {
            console.log('5.1 paso por aca ' + estadoPedidoActual)
            this.props.navigation.navigate('Categorias', { 
              data : retrieveStorage.value
            });          
          }else{
            if (estadoPedidoActual=='solicitado') {
              AsyncStorage.setItem('estadoPedidoActual','noHay')
              this.props.navigation.navigate('Categorias', { 
                data : retrieveStorage.value
              }); 
            }else{
              this.props.navigation.navigate('Carrito', { 
                data : retrieveStorage.value
              }); 
            }
            console.log('5.3 entropor aca¿')
                     
          }
          //alert("¡¡Oops!!. No se pudo traer la información.");
        }else{
          console.log('3.2 si hay supuestamente+'+true)
          this.props.navigation.navigate('Avance Pedido')
        }
      });   
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