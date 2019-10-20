import React, { Component } from 'react';
import { 
        Button, 
        Text, 
        View, 
        Image, 
        TouchableOpacity, 
        ProgressBarAndroid ,
        StyleSheet,
        Dimensions,
        TouchableHighlight,
      } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';
import * as Font from 'expo-font'
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import CacheImage from '../components/CacheImage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

GLOBAL = require('../globals/globals');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class confirmPedido extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pedido:null,
            fontLoaded: false,
            x1HeightLayout: null,
            x1Height:  screenHeight *.80,
        }

    }

    static navigationOptions = ({navigation}) => {
      return {
        headerTitle: (<Text style={[localStyles.shadow,{paddingLeft: 2  , color: "#fff"}]} >TodoYA!</Text>),
        headerRight: (
          <View style={{marginRight: 12, flexDirection:'row'}}>
              <TouchableHighlight activeOpacity={0.7} underlayColor='#ccc'
                onPress={() => {  navigation.openDrawer() }}
                style={{width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center'}}
              >
                  <Ionicons name='ios-menu' color='#fff' size={36} />
              </TouchableHighlight>
          </View>
        ),
        headerTransparent: true,
        headerTintColor: '#fff',
        headerStyle : {
          //backgroundColor: '#3498db',
          backgroundColor: '#00000000',
        }
      };
    };    

    async componentDidMount() {
        //await this._retrieveData("keyLogin");
        /*setTimeout(() => (
            this.props.navigation.navigate('AppStackLogin', {})
            ), PRACTICE_TIME); 
               */
        await  Font.loadAsync({
          'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
          'Roboto-Thin': require('../../assets/fonts/Roboto/Roboto-Thin.ttf'),
          'Roboto-Medium': require('../../assets/fonts/Roboto/Roboto-Medium.ttf'),
        });
        this.setState({ fontLoaded: true });                
        const JSONpedido = JSON.parse(await AsyncStorage.getItem("JSONpedido"))
        JSONpedido === null ? pedido=null : pedido = JSONpedido[0]
        console.log((JSONpedido))
        console.log('Juera')
        this.setState({pedido: pedido})
        
    }

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        retrieveStorage.value =  value;
        //await this.props.navigation.navigate('AppStackPpal', {})
      }else{
        console.log('_retrieveData: error: logoScreen: '+value)
      }
    } catch (error) {
      // Error retrieving data
    }
  };    

  find_dimensions(layout){
    const {x, y, width, height} = layout;
    this.setState({x1HeightLayout: height + 100})
  }

  renderPedido = () => {
    return <View>
      {}
    </View>
  }

  render() {
    const pedido = JSON.parse(this.state.pedido)
    //console.log(JSON.parse(this.state.pedido))
    return (
      <ScrollView>
         {pedido!=null && this.state.fontLoaded ? 
        <View style={[styles.container, {height: this.state.x1HeightLayout}]} elevation={35}>
          <Text>exel</Text>
          <CacheImage
            style={localStyles.image}
            uri= {GLOBAL.BASE_URL+'/images/'+pedido.fotoComercio}
          />
          <View style={{position: 'absolute', left: 0, bottom: 0, margin: 20,marginBottom: 30,}} 
                onLayout={(event) => { this.find_dimensions(event.nativeEvent.layout) }}  
          >
            {this.state.fontLoaded ? 
              <Text 
                  style={[localStyles.title1,localStyles.shadow]}
              >{pedido.comercio}</Text> : null }
            <Text style={[localStyles.shadow,{ color: '#fff', fontSize: 20}]} >
              {pedido.detalleComercio}
            </Text>   
          </View>   
        </View> : null }
        <View>
            {this.renderPedido()}
        </View>

      </ScrollView>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff',
  },
  image : {
    width: "100%",
    //resizeMode: "stretch",
    borderRadius:0,
    margin: 0,
    //height: screenWidth*0.80,
    height: '100%',
  },
  title1 : {
    fontFamily: 'Roboto-Medium',
    fontSize: 35,
    padding: 5,
    paddingTop: 10,
  },
  boxData : {
    fontSize: 18,
    backgroundColor: '#ecf0f1',
    color : '#7f8c8d',
    padding: 5,
    paddingTop: 0,
    margin: 5,
    marginBottom: 0.5,
    paddingLeft: 10
  },
  shadow: {
    color: '#fff',
    textShadowOffset: { width: 0.4, height: 0.4 },
    textShadowRadius: 1,
    textShadowColor: '#000',
  }, 
})