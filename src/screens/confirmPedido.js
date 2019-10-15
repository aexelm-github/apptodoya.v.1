import React, { Component } from 'react';
import { 
        Button, 
        Text, 
        View, 
        Image, 
        TouchableOpacity, 
        ProgressBarAndroid ,
        StyleSheet,
      } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';
import * as Font from 'expo-font'
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const PRACTICE_TIME = 0.2* 1000;

const retrieveStorage = {"value":null};

export default class confirmPedido extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pedido:null,
            fontLoaded: false,
        }

    }
    onPress = () => {
        alert("exel");
      }

    async componentDidMount() {
        //await this._retrieveData("keyLogin");
        /*setTimeout(() => (
            this.props.navigation.navigate('AppStackLogin', {})
            ), PRACTICE_TIME); 
               */
        await  Font.loadAsync({
          'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
          'Roboto-Thin': require('../../assets/fonts/Roboto/Roboto-Thin.ttf'),
          'Roboto-Medium': require('../../assets/fonts/Roboto/Roboto-Medium.ttf'),
        });
        this.setState({ fontLoaded: true });                
        const pedido = await AsyncStorage.getItem("pedido")
        this.setState({pedido: pedido})
        
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
    const pedido = JSON.parse(this.state.pedido)
    console.log(JSON.parse(this.state.pedido))
    return (
      <ScrollView>
        {pedido!=null && this.state.fontLoaded ? 
          <View style={[localStyles.container]}>
            <View>
             <Text>{this.state.pedido}</Text>
            </View>
            <Text style={localStyles.title1}>Mi pedido</Text>
            <Divider style={{ backgroundColor: 'blue' }} />
            <Text style={localStyles.boxData}>{  pedido.comercio }</Text>
            <Text style={localStyles.boxData}>Producto: {  pedido.productName }</Text>
            <Text style={localStyles.boxData}>Dirección:{"\n"}{ pedido.direccion }</Text>
            <Text style={localStyles.title1}>Detalle del pedido:</Text>
            <Divider style={{ backgroundColor: 'blue' }} />
          </View>
        : null }
      </ScrollView>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff',
  },
  title1 : {
    fontFamily: 'Roboto-Thin',
    fontSize: 18,
    padding: 5,
    paddingTop: 10,
  },
  boxData : {
    fontSize: 18,
    backgroundColor: '#ecf0f1',
    color : '#7f8c8d',
    padding: 5,
    paddingTop: 0,
    margin: 5,
    marginBottom: 0.5,
    paddingLeft: 10
  }

})