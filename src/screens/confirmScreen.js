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


import styles from '../styles/stylesOne';
import CustomButton from '../components/customButton';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class confirmScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            confirmCodeState : null,
            password1: null,
            password2: null,
            fontLoaded: false, 
            mostrarTodosLosDatos: null,
            waittingWhileSaving : false,
            registerSuccessfull : false,
            shrinkScreen: 0,
        };
    }

    async componentDidMount() {
        await  Font.loadAsync({
            'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
          });
          await this.setState({ fontLoaded: true });   
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

    _confirmCode = async () => {
        let error = false;
        if (this.state.password1 != this.state.password2) {
            alert('Oops!! El valor de los passwords no coinciden.');
            error = true;
        }
        if (this.state.password1 == "" || this.state.password2== "") {
            alert('Oops!! Los passwords no pueden ser vacíos.');
            error = true;
        }
        if (this.state.confirmCode == "") {
            alert('Oops!! Por favor escribe el código de confirmación.');
            error = true;
        }
        if (!error) {
            const email = this.props.navigation.getParam('email');
            let formdata = new FormData();
            formdata.append('email',email);
            formdata.append('confirmCode',this.state.confirmCodeState);
            formdata.append('password',this.state.password1);
            console.log(formdata);
            this.setState({waittingWhileSaving: true});

            await fetch('http://todoya2.aexelm.com/index.php/maincontrol/confirmCode', {   
                method: "POST",
                body: formdata,
            })
            .then( (response) => response.json())
            .then( (responseJson) => { 
                if (responseJson.length == 0){
                    alert("¡¡Oops!!. Problemas para guardar la información.");
                }else{
                    this.setState({waittingWhileSaving: false});
                    //alert(responseJson[0].message);
                    console.log(responseJson);
                    if (responseJson[0].success == 'ok'){
                        this.setState({registerSuccessfull: true})
                    }                  
                }
            }).catch((e) => { 
                this.setState({waittingWhileSaving: false});
                alert(e)
            });
        }               
    }    

    renderFormulario() {
        const confirmCode = this.props.navigation.getParam('confirmCode');
        
        let renderThis=<View></View>;
        if (this.state.fontLoaded) {
            renderThis = 
            <View style={styles.logoContainer}>
                <Text style={localStyles.introText}> 
                    Enhorabuena! Solo basta un paso más para poder disfrutar de nuestros servicios.
                    Introduce en siguiente código para continuar.
                </Text>  
                <Text  style={[localStyles.introText,{color:'red'}]}> 
                 {confirmCode}
                </Text>
                <TextInput 
                    style={localStyles.textInputLogin}
                    onChangeText={(confirmCodeState) => this.setState({confirmCodeState})}
                    placeholder="Código de confirmación"
                    value={this.state.confirmCodeState}
                    keyboardType='numeric'
                    autoCompleteType="off"
                    maxLength={6}
                />  
                <Text style={[localStyles.introText,{color:'#555', fontSize: 18}]}>   Elige una clave secreta de maximo 8 caracteres</Text>
                <TextInput 
                    style={localStyles.textInputLogin}
                    onChangeText={(password1) => this.setState({password1})}
                    placeholder="Password"
                    value={this.state.password1}
                    keyboardType='default'
                    autoCompleteType="off"
                    maxLength={8}
                />  
                <TextInput 
                    style={localStyles.textInputLogin}
                    onChangeText={(password2) => this.setState({password2})}
                    placeholder="Confirmar password"
                    value={this.state.password2}
                    keyboardType='default'
                    autoCompleteType="off"
                    maxLength={8}
                />  
                <View style={localStyles.botonesContainer}>
                    <CustomButton 
                        title={""} 
                        onPress={this._confirmCode}
                        style={{marginBottom: 30, backgroundColor: '#3498db'}}
                        Icon='check'
                    /> 
                </View>    
            </View>   
        } 
        return renderThis
    }

    renderSuccessful() {
        const email = this.props.navigation.getParam('email');
        let renderThis=<View></View>;
        if (this.state.fontLoaded) {
            renderThis = 
            <View style={styles.logoContainer}>
                <Text style={localStyles.introText}> 
                    ¡¡¡LO HAS LOGRADO!!!
                </Text>  
                <Text  style={[localStyles.introText,{color:'red'}]}> 
                    Ya puedes acceder a nuestros servicios
                </Text>
                <Text style={[localStyles.introText,{color:'#555', fontSize: 18}]}> 
                    Recuerda, el usuario y password que has registrado son:
                </Text>
                <Text style={[localStyles.introText,{color:'#555', fontSize: 18}]}> 
                    email: {email}
                </Text>
                <Text style={[localStyles.introText,{color:'#555', fontSize: 18}]}> 
                    password: {this.state.password1}
                </Text>                                
                <View style={localStyles.botonesContainer}>
                    <CustomButton 
                        title={""} 
                        onPress={() => {this.props.navigation.navigate('Login')}}
                        style={{marginBottom: 30, backgroundColor: '#3498db'}}
                        Icon='check'
                    /> 
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
                <ActivityIndicator  size={80} color='#3498db'/>
                </View>        
                ) : null
            }            
            <Image style={localStyles.logoImage}
            source={require('../images/TodoYa-03.png')}
            />  
            <Divider style={{ borderRadius: 2, marginLeft: 20,marginRight: 20, backgroundColor: '#3498db', height: 4 }} />
            <ScrollView>
                {this.state.registerSuccessfull ? this.renderSuccessful() :  this.renderFormulario()}
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
