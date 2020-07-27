import React, { Component } from 'react';
import { Button, 
         Text, 
         View, 
         Image, 
         TouchableOpacity, 
         TouchableHighlight,
         ProgressBarAndroid,
         StyleSheet,
        } from 'react-native';
import styles from '../styles/stylesOne';
import * as Permissions from 'expo-permissions';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import {AsyncStorage} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CustomButton from '../components/customButton';
import * as Fx from '../globals/Fx'

import { StatusBar } from 'react-native';

StatusBar.setBarStyle("dark-content")
StatusBar.setTranslucent(false)
StatusBar.setBackgroundColor("#aaddff")

GLOBAL = require('../globals/globals');

const PRACTICE_TIME = 2* 1000;

const latitudeDelta = 0.005
const longitudeDelta = 0.003

export default class mapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude:null,
            longitude:null,
            formatted_address: 'Calculando Dirección...',
            region: {
              latitude: 25.1948475,
              longitude: 55.2682899,
              latitudeDelta,
              longitudeDelta,
            },
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
          headerTitle: props => {return <Text style={{color:'#3498db',fontWeight: "500", fontSize: 18}}>
                                            TodoYa
                                </Text>},
          headerRight: ()=>(
            <View style={{marginRight: 12, flexDirection:'row'}}>
              <TouchableHighlight activeOpacity={0.7} underlayColor='#ccc'
                onPress={() => {  navigation.openDrawer() }}
                style={{width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center'}}
              >
                  <Ionicons name='ios-menu' color='#3498db' size={36} />
              </TouchableHighlight>
            </View>
            
          ),
        };
      }; 

    async componentDidMount() {
        //console.log('exel');
        //console.log(Permissions.LOCATION);
        const { status } = await  Permissions.getAsync(Permissions.LOCATION)
    
        if (status !== 'granted'){
            const response = await Permissions.askAsync(Permissions.LOCATION)
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => this.setState({ latitude, longitude }, () => {
              this.setState((previousState) => ({
                region: {
                  ...previousState.region,
                  latitude: latitude,
                  longitude: longitude,
                }
              }))   
              //console.log('State:',this.state)
              //await AsyncStorage.setItem("gpsLocation",region)
                this.showAddress(this.state.latitude, this.state.longitude);
            }),
            (error) => console.log('Error:', error)
        )
        
    }

  showAddress(latitude, longitude) {
    var NY = {
      lat: latitude,
      lng: longitude
    };
    this.setState({ formatted_address: 'Calculando Dirección...' });
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + NY.lat + ',' + NY.lng + '&key=' + GLOBAL.apiKey)
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            //console.log(responseJson.results[0].address_components[0])
            //console.log(responseJson.results[0].address_components[1])
            const address = responseJson.results[0].address_components[1].short_name+" "+responseJson.results[0].address_components[0].short_name
            responseJson.results.map((item, index) => {
              //console.log(item.formatted_address); 
            });
            this.setState({ formatted_address: address });
            //this.props.navigation.state.params.handleChange({ direccion: address })
    })
  }    

  onRegionChange = async (region) => {
    //console.log(region);
    this.setState({
      region
    })
    this.showAddress(region.latitude, region.longitude)
    await AsyncStorage.setItem("gpsLocation",JSON.stringify(region))
    const gpsLocation = await AsyncStorage.getItem("gpsLocation")
    console.log(gpsLocation)
  }

  _usarDireccion = async () => {
    // const { commingFrom } = this.props.navigation.state.params
    // this.props.navigation.state.params.handleChange({ direccion:  this.state.formatted_address, })
    // this.props.navigation.navigate(commingFrom)
    await Fx._storeData('ubicacion', JSON.stringify({ direccion:  this.state.formatted_address, gps: this.state.region }))
    this.props.actionOverTheMap("useAddress",{ direccion:  this.state.formatted_address, gps: this.state.region })
  }

  justClose = async () => {
     this.props.actionOverTheMap('justClose', {}) 
  }

  render() {
    const { region } = this.state
    
    if (this.state.latitude) {
        return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <MapView
              /*showsUserLocation*/
              style={{ flex : 1, width:'100%'}}
              initialRegion={region}
              onRegionChangeComplete={this.onRegionChange}
          >
          </MapView>
          <FontAwesome style={localStyles.markerFixed } name='map-pin' color='red' size={36} />
          <Text style={localStyles.address}>
            {this.state.formatted_address}
          </Text>
          <CustomButton 
              title={'Usar dirección'}
              style={[ styles.buttonViewLogin, {margin:0, width: '100%',position:'absolute',bottom:0, marginBottom: 0, backgroundColor: '#e17055'}]}
              onPress={() => this._usarDireccion()}
          />
        </View>
        );
    }
    return (
        <View style={{flex:1 , justifyContent:'center', alignItems: 'center'}}>
            <Image style={localStyles.logoImage}
              source={require('../images/pinMapa.png')}
              />
            <Text style={{color: '#0984e3', fontSize: 15, margin: 15, textAlign:'center'}}>Cargando mapa...</Text>  
            <TouchableOpacity 
               style={{position: 'absolute', bottom: 0, right: 0, padding: 4}}
               onPress={() => this.justClose()}
            >     
               <Text style={{color: '#0984e3', fontSize: 12, margin: 15, textAlign:'right'}}>Aviso!. Si no carga el mapa dale Aquí para continuar</Text>       
            </TouchableOpacity>

        </View>
    )    
  }
}

const localStyles = StyleSheet.create({
  logoImage: {
    width:  100,
    height : 100
  },
  address : {
    position: 'absolute',
    color: '#fff',
    backgroundColor: '#34495eee',
    padding: 10,
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 4,
    //width: '90%',
    top: '40%',
  },
  markerFixed: {
    left: '50%',
    marginLeft: -10,
    marginTop: -17,
    position: 'absolute',
    top: '50%'
  },
})