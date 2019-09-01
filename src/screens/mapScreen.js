import React, { Component } from 'react';
import { Button, 
         Text, 
         View, 
         Image, 
         TouchableOpacity, 
         TouchableHighlight,
         ProgressBarAndroid,
        } from 'react-native';
import styles from '../styles/stylesOne';
import { MapView ,Permissions } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
//import Constants from 'expo-constants'
//import Permissions from 'expo-permissions'
//import MapView from 'react-native-maps'

const PRACTICE_TIME = 2* 1000;

export default class mapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude:null,
            longitude:null,
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
        console.log(+Permissions.LOCATION);
        const { status } = await  Permissions.getAsync(Permissions.LOCATION)
    
        if (status !== 'granted'){
            const response = await Permissions.askAsync(Permissions.LOCATION)
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => this.setState({ latitude, longitude}, () => console.log('State:',this.state)),
            (error) => console.log('Error:', error)
        )
    }

  render() {
    const { latitude,longitude } = this.state
    
    if (latitude) {
        return (
        <MapView
            showsUserLocation
            style={{ flex : 1}}
            initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
        >
        </MapView>
        );
    }
    return (
        <View style={{flex:1 , justifyContent:'center', alignItems: 'center'}}>
            <Text>We need your Permissions</Text>
        </View>
    )    
  }
}