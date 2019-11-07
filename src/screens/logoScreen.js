import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';

GLOBAL = require('../globals/globals');
const PRACTICE_TIME = 0.2* 1000;

const retrieveStorage = {"value":null};

export default class logoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          version : null,
          nVersion : null,
        }
    }
    onPress = () => {
       // alert("exel");
    }

    async componentDidMount() {
        console.log(await AsyncStorage.getAllKeys())
        const version = await this.validateVersion()
        console.log('VERSION : '+version)
    }

    async validateVersion() {
      const keyLogin = await AsyncStorage.getItem('keyLogin')
      let formdata = new FormData()
      formdata.append('param_id','VERSION');
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getParam', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
        if (responseJson.length == 0){
          console.log('Version: none')
          this.setState({version:false,nVersion: 'v.0.0.0'})
          return false
        }else{
          console.log('Version: '+responseJson[0].valor1)
          AsyncStorage.setItem('version',responseJson[0].valor1)
          if (GLOBAL.version == responseJson[0].valor1) {
            if (keyLogin == null)  {
              this.props.navigation.navigate('AppStackLogin', {});
            }else {
              const usuarioId = JSON.parse(keyLogin)[0].usuario_id
              this.setEstosDatos(keyLogin)
              this.getPedido(usuarioId)
            }            
            this.setState({version:true,nVersion: responseJson[0].valor1})
          }else{
            this.setState({version:false,nVersion: responseJson[0].valor1})
          }
        }
      });   
       
    }

    async setEstosDatos(keyLogin) {
      await AsyncStorage.setItem('esteTelefono',keyLogin.telefono1)
      await AsyncStorage.setItem('esteNombre',keyLogin.nombre1+" "+keyLogin.apellido1)
    }

    getPedido =  async (usuarioId) => {
      const estadoPedidoActual = await AsyncStorage.getItem("estadoPedidoActual")
      let formdata = new FormData()
      formdata.append('usuarioId',usuarioId);
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getPedidoPendiente', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
        if (responseJson.length == 0){
          if ((estadoPedidoActual=='noHay')||(estadoPedidoActual==null)) {
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
          }
          //alert("¡¡Oops!!. No se pudo traer la información.");
        }else{
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
            { this.state.version!=null?
              <View style={{alignItems:'center',marginBottom: 20}}> 
                <Text style={{fontSize:15, fontWeight: '500'}}>{this.state.nVersion}</Text>
              </View>
            : null}
            { this.state.version == true || this.state.version==null ? 
              <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
            : <View style={{padding:10,borderRadius: 10,backgroundColor: '#e74c3c'}}>
                <Text style={{color:'#fff'}}>Oops!! Hay un problema con la versión de la App!</Text>
              </View>
            }
        </View>
      </View>
    );
  }
}