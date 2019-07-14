import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid ,ScrollView, ImageBackground} from 'react-native';
import { Dimensions } from "react-native";

import styles from '../styles/stylesOne';
import { TextInput } from 'react-native-gesture-handler';
import CustomButton from '../components/customButton';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class registerScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: 'aexelm@gmail.com', 
            pass: '123',
            direccion: '',
            nombre1: '',
            nombre2: '',
            apellido1: '',
            apellido2: '',
            telefono1: '',
            telefono2: ''
        };
    }

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
                  console.log(responseJson);
                  console.log(responseJson.length);
                  if (responseJson.length == 0){
                    alert("¡¡Oops!!. El email o el password son incorrectos.");
                  }else{
                    
                  }
              });                
        }
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
            <ScrollView>
            <View  style={[styles.logoContainer,{paddingBottom: 70,paddingTop: 20}]}>
                <Text style={styles.textTitle}>
                    Para registrarse en TodoYa! debe ingresar la siguiente información:
                </Text>
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(email) => this.setState({email})}
                    placeholder= {"usuario@email.com"}
                    value={this.state.email}
                    autoCompleteType ={"email"}
                    textContentType={"emailAddress"}
                />
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(direccion) => this.setState({direccion})}
                    placeholder={"Dirección"}
                />  
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(nombre1) => this.setState({nombre1})}
                    placeholder={"Primer Nombre"}
                />       
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(nombre2) => this.setState({nombre2})}
                    placeholder={"Segundo Nombre"}
                />       
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(apellido1) => this.setState({apellido1})}
                    placeholder={"Primer Apellido"}
                />       
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(apellido2) => this.setState({apellido2})}
                    placeholder={"Segundo Apelldo"}
                /> 
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(telefono1) => this.setState({telefono1})}
                    placeholder={"Teléfono 1"}
                />       
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(telefono2) => this.setState({telefono2})}
                    placeholder={"Otro Teléfono"}
                />       
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(telefono2) => this.setState({telefono2})}
                    placeholder={"Otro Teléfono"}
                />       
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(telefono2) => this.setState({telefono2})}
                    placeholder={"Otro Teléfono"}
                />       
                <TextInput 
                    style={styles.textInputLogin}
                    onChangeText={(telefono2) => this.setState({telefono2})}
                    placeholder={"Otro Teléfono"}
                />       
            </View>
            </ScrollView>
            <CustomButton 
                    title={"Enviar"}
                    style={[styles.buttonViewLogin, {position:'absolute',bottom:0, marginBottom: 0}]}
                    onPress={this.btnLogin}
                />
        </View>
        </ImageBackground>
    );
  }
}

