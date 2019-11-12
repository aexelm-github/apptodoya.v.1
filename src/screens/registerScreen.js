import React, { Component } from 'react';
import {
        Button, 
        Text, 
        View, 
        Image, 
        TouchableOpacity, 
        ProgressBarAndroid ,
        ScrollView, 
        Keyboard,
        StyleSheet,
        TextInput,
        ActivityIndicator,
       } from 'react-native';
import { Dimensions } from "react-native";
import * as Font from 'expo-font'
import formulario from '../json/formulario.json'
import { Divider } from 'react-native-elements';

GLOBAL = require('../globals/globals');

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
            waittingWhileSaving : false,
            shrinkScreen: 0,
        };
    }

    async componentDidMount() {
        await  Font.loadAsync({
            'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
          });
          await this.setState({ fontLoaded: true , slideNumber: 0});  
          this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
          );
          this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
          );    
    }
    
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        keyboardParams = {
            keyboardHeight: e.endCoordinates.height,
            normalHeight: Dimensions.get('window').height, 
            shortHeight: Dimensions.get('window').height - e.endCoordinates.height, 
        };         
        console.log(keyboardParams);
        this.setState({shrinkScreen : keyboardParams.keyboardHeight + 20 });
    }

    _keyboardDidHide = () => {
        console.log('Keyboard Hidden');
        this.setState({shrinkScreen : 0 })

    }

    validateEmail = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(text) === false){
            return false;
        }else {
            return true;
        }
    }

    _sendDataToServer = async () => {
          // Buscar en servidor de BBDD 
          let formdata = new FormData();
          formdata.append('email',formulario[1].value);
          formdata.append('nombre',formulario[2].value);
          formdata.append('apellido',formulario[3].value);
          formdata.append('telefono',formulario[4].value);
          formdata.append('direccion',formulario[5].value);
          console.log(formdata);
          this.setState({waittingWhileSaving: true});

          await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/saveUsuario', {   
              method: "POST",
              body: formdata,
            })
            .then( (response) => response.json())
            .then( (responseJson) => { 
                if (responseJson.length == 0){
                  alert("¡¡Oops!!. Problemas para guardar la información.");
                }else{
                  this.setState({waittingWhileSaving: false});
                  
                  console.log(responseJson);
                  if (responseJson[0].success == 'ok'){
                    this.props.navigation.navigate('Confirm',{
                        confirmCode : responseJson[0].confirmCode,
                        email: formulario[1].value,
                    });
                  } else{
                    alert(responseJson[0].message);
                  }                 
                }
          }).catch((e) => { 
              this.setState({waittingWhileSaving: false});
              alert(e)
          });                
    }    

    btnNext = () => {
        var slideActual = formulario[this.state.slideActual] 
        if ((slideActual.state == 'email')&&(!this.validateEmail(slideActual.value))) {
            alert('Oops!! Lo que has ingresado no parece ser una dirección de correo válida. Inténtalo de nuevo!!')
            return;
        }
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
        this.setState({slideActual: this.state.slideActual -1, mostrarTodosLosDatos: false })
        formulario[this.state.slideActual].value = null;
        console.log(formulario[this.state.slideActual]);
    }    

    btnPreviousInfo = () => {
        this.setState({slideActual: this.state.slideActual , mostrarTodosLosDatos: false })
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
            renderThis = <View style={{paddingTop: 30,textAlign: 'left'}}>
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
                <View style={localStyles.botonesContainer}>
                    {slideActual.btnPrevious ?
                    <CustomButton 
                        title={""} 
                        onPress={this.btnPreviousInfo}
                        style={{marginBottom: 30, backgroundColor: '#e74c3c'}}
                        Icon={'arrowleft'}
                    /> : null}
                    {slideActual.btnNext ?
                    <CustomButton 
                        title={""} 
                        onPress={this._sendDataToServer}
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
        <View style={[styles.container, {justifyContent: 'flex-start', paddingTop: 50},{paddingBottom: this.state.shrinkScreen}]}>
            {this.state.waittingWhileSaving ? (
                <View style={{flex:1, alignItems:'center', justifyContent: 'center', position: 'absolute', top: 0, left:0, width: '100%', height: '100%',  zIndex: 1000}} >
                <ActivityIndicator  size={80} color='#e74c3c'/>
                </View>        
                ) : null
            }            
            <Image style={localStyles.logoImage}
            source={require('../images/TodoYa-03.png')}
            />  
              <Divider style={{ borderRadius: 2, marginLeft: 20,marginRight: 20, backgroundColor: '#3498db', height: 4 }} />
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
