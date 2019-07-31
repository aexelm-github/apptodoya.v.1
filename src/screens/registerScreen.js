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
            slideActual: 0,
            fontLoaded: false, 
            inputValue : null,
            mostrarTodosLosDatos: null,
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
        var slideActual = formulario[this.state.slideActual] 
        if (slideActual.value==null && slideActual.requiereInputText) {
            alert('Oops! debes ingresar un valor')
            return;
        }
               
        if (this.state.slideActual < formulario.length-1) {
            console.log(slideActual.value)
            this.setState({slideActual: this.state.slideActual +1})
        }else{
            this.setState({mostrarTodosLosDatos: true})
        }
    }

    btnPrevious = () => {
        this.setState({slideActual: this.state.slideActual -1, mostrarTodosLosDatos: false})
        formulario[this.state.slideActual].value = null;
        console.log(formulario[this.state.slideActual]);
    }    

    setInputValue = async (value) => {
         formulario[this.state.slideActual].value = value;
    }

    renderFormulario() {
        const slideActual = formulario[this.state.slideActual];
        let renderThis=<View></View>;
        if (this.state.fontLoaded) {
            renderThis = 
            <View style={styles.logoContainer}>
                <Text style={localStyles.introText}> 
                    {slideActual.texto}
                </Text>  
                { slideActual.requiereInputText ? (                             
                <TextInput 
                    style={localStyles.textInputLogin}
                    onChangeText={(value) => this.setInputValue(value)}
                    placeholder={slideActual.placeholder}
                    value={this.state.state}
                    keyboardType={slideActual.keyboardType}
                    autoCompleteType="off"
                />  ) : null }
                <View style={localStyles.botonesContainer}>
                    {slideActual.btnPrevious ?
                    <CustomButton 
                        title={""} 
                        onPress={this.btnPrevious}
                        style={{marginBottom: 30, backgroundColor: '#e74c3c'}}
                        Icon={'arrowleft'}
                    /> : null}
                    {slideActual.btnNext ?
                    <CustomButton 
                        title={""} 
                        onPress={this.btnNext}
                        style={{marginBottom: 30, backgroundColor: '#3498db'}}
                        Icon={'arrowright'}
                    /> : null}
                </View>    
            </View>   
        } 
        return renderThis
    }

    renderAllInfo(){
        const slideActual = formulario[this.state.slideActual];
        let renderThis=<View></View>;
        let body=null;
        if (this.state.fontLoaded) {
            formulario.map((item)=> {
                console.log('<Text style={{color:"#000"}}>'+item.value+'</Text>');
                body = body + <Text style={{color:"#000"}}>o{item.value}</Text>
            })           
            console.log(body);
            renderThis = 
            <View style={styles.logoContainer}>
                {body}
            </View>
        }
        return renderThis
    }

    renderTest () {
        
        const slideActual = formulario[this.state.slideActual];
        let renderThis=<View></View>;
        if (this.state.fontLoaded) {
            renderThis = <View style={{textAlign: 'left'}}>
                <Text style={localStyles.showTitle}>{formulario[1].state}</Text>
                <Text style={localStyles.showText}>{formulario[1].value}</Text>
                <Text style={localStyles.showTitle}>{formulario[2].state}</Text>
                <Text style={localStyles.showText}>{formulario[2].value}</Text>
                <Text style={localStyles.showTitle}>{formulario[3].state}</Text>
                <Text style={localStyles.showText}>{formulario[3].value}</Text>
                <Text style={localStyles.showTitle}>{formulario[4].state}</Text>
                <Text style={localStyles.showText}>{formulario[4].value}</Text>
                <Text style={localStyles.showTitle}>{formulario[5].state}</Text>
                <Text style={localStyles.showText}>{formulario[5].value}</Text>
                <Text style={localStyles.showTitle}>{formulario[6].state}</Text>
                <Text style={localStyles.showText}>{formulario[6].value}</Text>
                <View style={localStyles.botonesContainer}>
                    {slideActual.btnPrevious ?
                    <CustomButton 
                        title={""} 
                        onPress={this.btnPrevious}
                        style={{marginBottom: 30, backgroundColor: '#e74c3c'}}
                        Icon={'arrowleft'}
                    /> : null}
                    {slideActual.btnNext ?
                    <CustomButton 
                        title={""} 
                        onPress={this.btnNext}
                        style={{marginBottom: 30}}
                        Icon={'check'}
                    /> : null}
                </View>                    
            </View>

        }
        return renderThis
  
    }

  render() {
    return (
        <View style={[styles.container, {justifyContent: 'flex-start', paddingTop: 50}]}>
            <Image style={localStyles.logoImage}
            source={require('../images/TodoYa-03.png')}
            />  
            <ScrollView>
                {this.state.mostrarTodosLosDatos ? this.renderTest() : this.renderFormulario()}

            </ScrollView>     
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
    showText :  {
        color: '#3498db', 
        fontFamily: 'RussoOne-Regular',
        fontSize: 22,
        padding: 20,
        textAlign: 'left',
    },
    showTitle: {
        color:'red', 
        fontSize: 14,
        fontFamily: 'RussoOne-Regular',
        textTransform: 'capitalize',
        paddingLeft: 20,
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
        textAlign: 'center',
        alignContent: 'center',
    }  
})
