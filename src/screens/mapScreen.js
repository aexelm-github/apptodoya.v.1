import React, { Component } from 'react';
import { Button, 
         Text, 
         View, 
         Image, 
         TouchableOpacity, 
         ProgressBarAndroid,
        } from 'react-native';
import styles from '../styles/stylesOne';
import { MapView, Permissions, Constants } from 'expo';

const PRACTICE_TIME = 2* 1000;

export default class mapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude:null,
            longitude:null,
        }
    }


    async componentDidMount() {
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