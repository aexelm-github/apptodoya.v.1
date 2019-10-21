import React, { Component } from 'react';
import { Button, 
		 Text, 
		 View, 
		 Image, 
		 TouchableOpacity, 
		 TouchableHighlight,
		 ProgressBarAndroid,
		 StyleSheet,
		 FlatList,
		} from 'react-native';
import styles from '../styles/stylesOne';
import * as Permissions from 'expo-permissions'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import {AsyncStorage} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CustomButton from '../components/customButton';
import Circle from '../components/Circle';

import Timeline from 'react-native-timeline-flatlist';

GLOBAL = require('../globals/globals');

const PRACTICE_TIME = 2* 1000;

const latitudeDelta = 0.005
const longitudeDelta = 0.003
let pedido = null

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
			progreso: null,
			usuarioId: null,
			pedidoLoaded: null,
			pedido: null,
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
		const keyLogin = await AsyncStorage.getItem('keyLogin')
		this.setState({usuarioId: JSON.parse(keyLogin)[0].usuario_id, nameLoaded: true} )
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
			   // this.showAddress(this.state.latitude, this.state.longitude);
			}),
			(error) => console.log('Error:', error)
		)
		this.getPedido(this.state.usuarioId)
	}

	getPedido =  async (usuarioId) => {
		let formdata = new FormData()
		console.log("usuarioId"+ usuarioId)
		formdata.append('usuarioId',usuarioId);
		this.setState({pedidoLoaded:false});
		await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getPedidoPendiente', {   
			method: "POST",
			body: formdata,
		})
		.then( (response) => response.json() )
		.then( (responseJson) => {
			if (responseJson.length == 0){
				alert("¡¡Oops!!. No se pudo traer la información.");
			}else{
				pedido = responseJson[0];
				this.setState({ pedidoLoaded: true });  
			}
		});   
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
			const address = responseJson.results[0].address_components[1].short_name+" "+responseJson.results[0].address_components[0].short_name
			responseJson.results.map((item, index) => {
			});
			this.setState({ formatted_address: address });
	})
  }    

  onRegionChange = async (region) => {
		this.setState({
			region
		})
		this.showAddress(region.latitude, region.longitude)
		await AsyncStorage.setItem("gpsLocation",JSON.stringify(region))
		const gpsLocation = await AsyncStorage.getItem("gpsLocation")
		console.log(gpsLocation)
  }

  _usarDireccion = () => {
		const { commingFrom } = this.props.navigation.state.params
		this.props.navigation.state.params.handleChange({ direccion:  this.state.formatted_address, })
		this.props.navigation.navigate(commingFrom)
  }



	mostrarProgreso =  () => {
		const progreso = JSON.parse(pedido.progreso)
		let rPedido = 
		<View >
			<Text style={{padding: 10}}>Progreso del pedido</Text>
			<FlatList
				data={progreso}
				renderItem={({ item, index }) => 
					<View style={{ margin: 2, flexDirection: 'row'}}>
							<Circle  style={{margin: 12, marginLeft: 20}} color={'#bdc3c7'} filled={false} />
							<Text style={{padding: 10, alignItems:'flex-start', color:'#bdc3c7'	}}>{item.progreso}</Text>
							<Text style={{padding: 10 , position:'absolute', right: 0, color:'#bdc3c7'}}>{item.progreso}</Text>
							
					</View>
				}
				keyExtractor={(item,index) => index.toString()}
			/>        
			
		</View>
		return rPedido
	}
  
  render() {
	const { region } = this.state
	if (this.state.latitude) {
		return (
			<View style={localStyles.container}>
			<View  style={{ width:'100%', height: '50%'}} elevation={20}>
				<MapView
						/*showsUserLocation*/
						style={{ flex : 1, width:'100%'}}
						initialRegion={region}
						onRegionChangeComplete={this.onRegionChange}
					>
				</MapView>
			</View>
			{ this.state.pedidoLoaded ?
				<View style={{flex: 1, width: '100%'}}>
					{this.mostrarProgreso()}
				</View>
			:null
			}
			

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
  container  : {
		flex: 1,
		alignItems: 'center',
	},    
  sameRow : {
		flexDirection: 'row',
		//alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	text: {
		fontSize: 16,
		color: '#00000077',
	},
	circle: {
		width: 20,
		height: 20,
		borderRadius: 20/2,
		backgroundColor: 'red',
		position: 'absolute',
		top: 20, left: 30,
	},  
})