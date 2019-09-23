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
import { Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
//import Constants from 'expo-constants'
//import Permissions from 'expo-permissions'
//import MapView from 'react-native-maps'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

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
          headerRight: (
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
        console.log('exel');
        console.log(Permissions.LOCATION);
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
              console.log('State:',this.state)
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
            console.log(responseJson.results[0].address_components[0])
            console.log(responseJson.results[0].address_components[1])
            const address = responseJson.results[0].address_components[1].short_name+" "+responseJson.results[0].address_components[0].short_name
            responseJson.results.map((item, index) => {
              //console.log(item.formatted_address); 
            });
            this.setState({ formatted_address: address });
            this.props.navigation.state.params.handleChange({ direccion: address })
    })
  }    

  onRegionChange = (region) => {
    console.log(region);
    this.setState({
      region
    })
    this.showAddress(region.latitude, region.longitude)
  }

  render() {
    const { region } = this.state
    
    if (this.state.latitude) {
        return (
        <View style={{flex:1}}>
          <MapView
              /*showsUserLocation*/
              style={{ flex : 1}}
              initialRegion={region}
              onRegionChangeComplete={this.onRegionChange}
          >
          </MapView>
          <Ionicons style={localStyles.markerFixed } name='md-locate' color='red' size={36} />
          <Text style={localStyles.address}>
            {this.state.formatted_address}
          </Text>
        </View>
        );
    }
    return (
        <View style={{flex:1 , justifyContent:'center', alignItems: 'center'}}>
            <Text>Loading map..</Text>
        </View>
    )    
  }
}

const localStyles = StyleSheet.create({
  address : {
    position: 'absolute',
    color: '#fff',
    backgroundColor: '#34495e99',
    padding: 20,
    textAlign: 'center',
    margin: 20,
    borderRadius: 10,
    width: '90%',
  },
  markerFixed: {
    left: '50%',
    marginLeft: -17,
    marginTop: -17,
    position: 'absolute',
    top: '50%'
  },
})