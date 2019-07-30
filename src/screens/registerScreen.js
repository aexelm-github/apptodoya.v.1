import React, { Component } from 'react';
import {
        Button, 
        Text, 
        View, 
        Image, 
        TouchableOpacity, 
        ProgressBarAndroid ,
        ScrollView, 
        ImageBackground,
        StyleSheet,
        TextInput,
       } from 'react-native';
import { Dimensions } from "react-native";
import * as Font from 'expo-font'
import formulario from '../json/formulario.json'

import styles from '../styles/stylesOne';
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
            telefono2: '',
            slideThis: 0,
            fontLoaded: false, 
            inputValue : null,
        };
    }

    async componentDidMount() {
        await  Font.loadAsync({
            'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
          });
          await this.setState({ fontLoaded: true , slideNumber: 0});   
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

    btnNext = () => {
        console.log("["+this.state.inputValue+"]")
        if (this.state.inputValue==null && formulario[this.state.slideThis].textInput) {
            alert('Oops! debes ingresar un valor')
            return;
        }
               
        if (this.state.slideThis < formulario.length-1) {
            formulario[this.state.slideThis].value = this.state.inputValue
            console.log(formulario[this.state.slideThis])
            this.setState({slideThis: this.state.slideThis +1})
            this.setState({inputValue:formulario[this.state.slideThis].value })
        }

    }

    btnPrevious = () => {
        this.setState({slideThis: this.state.slideThis -1})
    }    

  render() {
    const slideThis = formulario[this.state.slideThis];
    return (
        <View style={[styles.container, {justifyContent: 'flex-start', paddingTop: 100}]}>
            <Image style={localStyles.logoImage}
            source={require('../images/TodoYa-03.png')}
            />              
            {this.state.fontLoaded ? (
                <View style={styles.logoContainer}>
                    <Text style={localStyles.introText}> 
                        {slideThis.texto}
                    </Text>  
                    { slideThis.textInput ? (                             
                    <TextInput 
                        style={localStyles.textInputLogin}
                        onChangeText={(inputValue) => this.setState({inputValue})}
                        placeholder={slideThis.placeholder}
                        value={slideThis.value}
                    />  ) : null }
                    <View style={localStyles.botonesContainer}>
                    {slideThis.btnPrevious ?
                    <CustomButton 
                        title={""} 
                        onPress={this.btnPrevious}
                        style={{marginBottom: 30, backgroundColor: '#e74c3c'}}
                        Icon={'arrowleft'}
                    /> : null}
                    {slideThis.btnNext ?
                    <CustomButton 
                        title={""} 
                        onPress={this.btnNext}
                        style={{marginBottom: 30, backgroundColor: '#3498db'}}
                        Icon={'arrowright'}
                    /> : null}
                    </View>                      
                </View>
            ) : null }                

        </View>
    );
  }
}

const localStyles = StyleSheet.create ({
    oneContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#3498db'
    },
    secondContainer: {
        flex: 1,
    } ,
    introText :  {
        color: '#3498db', 
        textAlign: 'center',
        fontFamily: 'RussoOne-Regular',
        fontSize: 22,
        padding: 20,
    },
    logoImage: {
        width:  110,
        height : 110
    },
    textInputLogin : { 
        color: "red",
        height: 70,
        borderColor: 'transparent', 
        borderWidth:1, 
        borderBottomColor: 'red',
        maxWidth: screenWidth - (screenWidth*0.2),
        width: 300,
        padding: 10,
        paddingBottom: 3,
        marginBottom: 5,
        fontSize: 18,
        textAlign: "center",
        backgroundColor: "rgba(255, 255, 255,0.3)"
       },  
    botonesContainer: {
        flexDirection: 'row',
        marginTop: 30,
    }  
})
