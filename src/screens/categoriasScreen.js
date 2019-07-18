import React, { Component } from 'react';
import { Dimensions, Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid, ScrollView, StyleSheet } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';
import * as Font from 'expo-font'
import { Divider, Card } from 'react-native-elements';
import CacheImage from '../components/CacheImage';



const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const categorias = [
  {
     name: 'Comidas',
     foto: 'http://todoya2.aexelm.com/images/comidas.png'
  },
  {
    name: 'Envíos',
    foto: 'http://todoya2.aexelm.com/images/envios.jpg'
  },  
  {
    name: 'Giros',
    foto: 'http://todoya2.aexelm.com/images/giros2.jpg'
  },  
  {
    name: 'Entretenimiento',
    foto: 'http://todoya2.aexelm.com/images/entrenimiento.jpg'
  },  
  {
    name: 'Auto Partes',
    foto: 'http://todoya2.aexelm.com/images/autopartes.jpg'
  },  
];

export default class categoriasScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fontLoaded: false};
    }

    async componentDidMount() { 
      await  Font.loadAsync({
        'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
      });
      
      this.setState({ fontLoaded: true });       
    }

    _removeData = async (key) => {
      try {
        await AsyncStorage.removeItem(key);
        console.log(key + ": Removido!!");
      } catch (error) {
        console.log(key + ":"+error);
      }
    };

  render() {
    const dataJson = JSON.parse(this.props.navigation.getParam('data',''));
    const nombre1 = dataJson[0].nombre1;
    let Image_Http_URL ={ uri: 'http://todoya2.aexelm.com/images/Indra_000x000.jpg'};

    return (
      <View style={styles.containerCategoria}>
        <ScrollView>
          {
            this.state.fontLoaded ? (
              <Text style={localStyles.simpleName} 
                    onPress = {() => {this._removeData("keyLogin");}} >
                    Hola, {nombre1}.
              </Text>
            ) : null
          }
          <Text style={localStyles.quePuedo}>¿Qué puedo hacer por ti?</Text>
          <Divider style={{ backgroundColor: 'blue' }} />
            
              {
                categorias.map((u, i) => {
                  let Image_Http_URL = { uri : u.foto };
                  console.log(u.foto);
                  return (
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity 
                          style={{width: screenWidth/2,height: screenWidth/2}}
                    >
                      <View key={i} style={localStyles.categoria}>
                        <CacheImage
                          style={localStyles.image}
                          uri= {u.foto}
                        />                    
                        <Text style={localStyles.name}>({i}){u.name}</Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                  );
                })
              }
            
        </ScrollView>  
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  simpleName : {
      color: "rgba(0,0,0,0.5)",
      fontSize: 26,
      paddingTop: 10,
      paddingLeft : 20,
      fontFamily: 'RussoOne-Regular'
  },
  quePuedo : {
    fontSize: 15,
    color: "#2196F3",
    paddingLeft: 18,
    paddingBottom : 15,
  },
  image : {
    height: 150,
    width: "100%",
    resizeMode: "stretch",
    borderRadius: 10,
  },
  categoria : {
    padding: 10,
    width: '100%',
  },
  name : {
    fontSize: 18,
    color: 'orange',
    fontWeight: "400",
    paddingTop: 5,
    textAlign: "center"
  }

})