import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View, 
         Image, 
         TouchableOpacity, 
         ImageBackground
       } from 'react-native';
import { Dimensions } from "react-native";
import { Icon ,Input} from 'react-native-elements'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font'

import styles from '../styles/stylesOne';
import { TextInput } from 'react-native-gesture-handler';
import CustomButton from '../components/customButton';
import CustomInput from '../components/customInput';
import {AsyncStorage} from 'react-native';

const retrieveStorage = {"value":''};

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class loginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: 'aexelm@gmail.com', pass: '123' ,fontLoaded: false};
    }

    async componentDidMount() {
        await  Font.loadAsync({
          'Changa-Regular': require('../../assets/fonts/Changa-Regular.ttf'),
        });
        
        this.setState({ fontLoaded: true });
      }

      _storeData = async (key, value) => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
          console.log(key + " " + value);
        } catch (error) {
          console.log("Error al salvar datos locales!!");
        }
      }
      
      _retrieveData = async (props) => {
        try {
          const value = await AsyncStorage.getItem('value');
          if (value !== null) {
            console.log(value);
            retrieveStorage.value =  value;
            console.log(retrieveStorage.value);
          }
        } catch (error) {
          // Error retrieving data
        }
      };
      
    btnLogin = async (params) => {
        if ((this.state.email.trim().length =0) || (this.state.pass.trim().length == 0) ){
            alert("Error. Los campos Email y Password no pueden estar vacíos!");
        }else{
            let formdata = new FormData();
            formdata.append('email',this.state.email);
            formdata.append('password',this.state.pass);

            fetch('http://todoya2.aexelm.com/', {   
                method: "POST",
                body: formdata,
              })
              .then( (response) => response.json() )
              .then( (responseJson) => {
                  //console.log(responseJson);
                  //console.log(responseJson.length);
                  if (responseJson.length == 0){
                    alert("¡¡Oops!!. El email o el password son incorrectos.");
                  }else{
                    this._storeData("keyLogin",responseJson);                   
                    this.props.navigation.navigate('Categorias', { 
                        data : JSON.stringify(responseJson)
                    });
                  }
              });                
        }
    }

    btnRegister = (params) => {
        console.log("RegisterScreen");
        this.props.navigation.navigate('Register', {});
    }

    btnRecuperar = (params) => {
        this._textInputEmail.setNativeProps({value: '', text: ''})
        his._textInputEmail.style
        this.setState({"email":''});
    }

  render() {
    return (
      <ImageBackground
        source={require('../images/bkg-pizza-01.jpg')}
        style={{width: '100%', height: '100%'}}
        imageStyle={{resizeMode: 'stretch'}}
        /*style={Style.someAdditionalViewStyles}*/
      >
      <View style={styles.containerLogin}>
        <View>
            <View  style={styles.logoContainer}>
                <Image style={[styles.logoImage,{resizeMode: "stretch",marginBottom:50}]}
                    width={200}
                    height={200}
                    source={require('../images/TodoYa-03.png')}
                    />        
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(email) => this.setState({email})}
                    placeholder= {"Email"}
                    value={this.state.email}
                    autoCompleteType ={"email"}
                    textContentType={"emailAddress"}
                    ref={component => this._textInputEmail = component}
                />
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(pass) => this.setState({pass})}
                    placeholder={"Password"}
                    value={this.state.pass}
                    textContentType={"password"}
                    secureTextEntry={true}
                />     
                      
                <CustomButton 
                    title={""} 
                    onPress={this.btnLogin}
                    style={{marginBottom: 30}}
                />
                <TouchableOpacity>
                    {
                        this.state.fontLoaded ? (
                          <Text style={localStyles.simpleLink} onPress = {this.btnRegister} >Registro</Text>
                        ) : null
                    }
                </TouchableOpacity>
                <TouchableOpacity>
                    {
                        this.state.fontLoaded ? (
                            <Text style={localStyles.simpleLink} onPress = {this.btnRecuperar} >Recuperar Constraseña</Text>
                        ) : null
                    }
                </TouchableOpacity>
              
            </View>
        </View>
        <Text style={styles.copyright}>TodoYa! Derechos Reservados 2019. (aexelm@gmail.com)</Text>
      </View>
      </ImageBackground>
    );
  }
}

const localStyles = StyleSheet.create({
    simpleLink : {
        color: "#fff",
        fontSize: 20,
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0,1)',
        textShadowOffset: {width: -11, height: 10},
        textShadowRadius: 10,
        fontFamily: "Changa-Regular"
    },

})