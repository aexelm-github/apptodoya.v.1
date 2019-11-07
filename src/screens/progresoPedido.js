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
		 ActivityIndicator
		} from 'react-native';
import styles from '../styles/stylesOne';
import * as Permissions from 'expo-permissions'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {AsyncStorage} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CustomButton from '../components/customButton';
import BackgroundTimer from 'react-native-background-timer';
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
			noHayPedido: false,
			buscarPedido : true,
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
		this.subs = [
			this.props.navigation.addListener('didFocus', () => this.isFocused()),
		];
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
		//this.getPedido(this.state.usuarioId)
		
	}

	async componentWillUnmount() {
		this.subs.forEach(sub => sub.remove());
	}

  isFocused = async () => {
		this.setState({buscarPedido: true, pedidoLoaded: false})
		this._onStart()
	}

	async componentWillUnmount() {
		this._onPause()
	}

	getPedido =  async (usuarioId) => {
		let formdata = new FormData()
		console.log("usuarioId"+ usuarioId)
		formdata.append('usuarioId',usuarioId);
		//this.setState({pedidoLoaded:false});
		await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getPedidoPendiente', {   
			method: "POST",
			body: formdata,
		})
		.then( (response) => response.json() )
		.then( (responseJson) => {
			if (responseJson.length == 0){
				this.setState({noHayPedido: true, buscarPedido: false, })
				AsyncStorage.removeItem('estadoPedidoActual')
				this._onPause()	
				//alert("¡¡Oops!!. No se pudo traer la información.");
				console.log('jeje')
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


	timeLine = () => {
		const progreso = JSON.parse(pedido.progreso)
		console.log(progreso)
		var data = new Array()
		progreso.map((item, index) => { 
			if (item.done)
				data.push({ time: item.fechaHora.substring(11,17), title: item.progreso, description: item.descripcion, lineColor: item.done?'#009688':'#00968822'})
			if (item.progreso=='Entregado'&&item.done)
				this._onPause()
		})

		return (
				<Timeline
          style={localStyles.list}
          data={data}
          circleSize={20}
          circleColor="rgb(45,156,219)"
          lineColor="rgb(45,156,219)"
          timeContainerStyle={{ minWidth: 82, marginTop: -5 }}
          timeStyle={{
            textAlign: 'center',
            backgroundColor: '#ff9797',
            color: 'white',
            padding: 5,
            borderRadius: 13,
          }}
          descriptionStyle={{ color: 'gray' }}
          options={{
            style: { paddingTop: 5 },
          }}
        />			
		)
	}

	_interval=null;
	
	_onStart = () => {
		console.log('onStart')
		this._interval = setInterval(() => {
			console.log('activo _onStart()')
			this.getPedido(this.state.usuarioId)
		}, 5000)
	}

	_onPause =  async () => {
		//await AsyncStorage.setItem('estadoPedidoActual','noHay')
		//await 	AsyncStorage.removeItem('JSONpedido')		
		console.log('AJA APAGA ESTO')
		clearInterval(this._interval)
	}

  render() {
	const { region } = this.state
	if (this.state.latitude && this.state.pedidoLoaded) {
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
			<View style={{flex: 1, width: '100%', }}>
					<Text style={{textAlign:'center',width: '100%',paddingTop: 10, justifyContent:'center' }}>Progreso de mi pedido</Text>
					<View style={{flex: 1, width: '100%',paddingLeft: 20, paddingRight: 10}}>
					{this.timeLine()}
					</View>
				</View>
			:null
			}
		</View>
		);
	}
	return (
		<View style={{flex:1 , justifyContent:'center', alignItems: 'center'}}>
				{ this.state.buscarPedido ? 
					<View style={styles.container}>
						<View  style={styles.logoContainer}>
								<ActivityIndicator  size={30} color={"#e74c3c"}/>
								<Text>Buscando progeso de pedido...</Text>               
						</View>
					</View>
				:	<View style={styles.container}>
						<View  style={styles.logoContainer}>
						<Image style={styles.logoImage}
                    source={require('../images/emptyBox.png')}
                    />
                  <Text style={{color: '#0984e3', fontSize: 20, margin: 15, textAlign:'center'}}>No hay nada que mostrar</Text>               								        
						</View>
					</View>
				}

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
	list: {
    flex: 1,
    marginTop: 20,
  },
})