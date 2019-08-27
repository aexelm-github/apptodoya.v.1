import * as React from 'react';
import { 
        Image, 
        View, 
        TextInput,
        StyleSheet,
        TouchableOpacity, 
        TouchableHighlight,
        ScrollView,
        KeyboardAvoidingView ,
        ActivityIndicator,
        Keyboard,
        Dimensions,
        Text
      } from 'react-native';
import { Permissions, Constants} from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';
import CustomButton from '../components/customButton';
import styles from '../styles/stylesOne';
import { CheckBox } from 'react-native-elements'

GLOBAL = require('../globals/globals');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


let didMountParams = null;

export default class pedidoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          direccion: null,
          shrinkScreen: 0,         
          checked : false, 
        }
    }
    async componentDidMount() {
      this.getPermissionAsync();
      didMountParams = this.props.navigation.getParam('params');
      
      if (didMountParams.action != 'Nuevo') {
        this.setState((previousState) => (
           {...previousState,  
          }
        ))      
      }
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
      this.setState({shrinkScreen : keyboardParams.keyboardHeight - 68   });
  }
  
  _keyboardDidHide = () => {
      console.log('Keyboard Hidden');
      this.setState({shrinkScreen : 0 })
  
  }
  
    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    }
  
  render() {
    const params = this.props.navigation.getParam('params');
    console.log(params);
    return (
      <View
        style={{flex: 1,}}
        behavior='padding'
      >
        <View style={[localStyles.container,{paddingBottom: this.state.shrinkScreen}]}>
        <ScrollView style={{flex:1, width:'100%', marginBottom: 55}}> 
        <TouchableOpacity style={localStyles.imageView} >
          <CacheImage
            style={localStyles.image}
            uri= {GLOBAL.BASE_URL+'/images/'+params.foto}
          />
        </TouchableOpacity>
        <View style={{padding: 20, paddingTop:10}}>
          <Text style={localStyles.title2} >{params.name}</Text>
          <Text style={localStyles.paragraph} >
            {params.detalle}
          </Text>
        </View>        
          <Text style={localStyles.label} >Dirección de envío</Text>
          <TextInput 
            style={[localStyles.inputText,{fontSize: 19}]}
            placeholder='Escriba la dirección de envío'
            onChangeText={(direccion) => this.setState({direccion})}
            value={this.state.direccion}
            maxLength={80}
          />
          <Text style={[localStyles.label,{marginTop: 10, marginBottom: 10}]} >DEFINIR PEDIDO</Text>
          <CheckBox
            title='Tamaño Small ($ 8000)'
            checked={this.state.checked}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
          <CheckBox
            title='Tamaño MEdium ($ 25000)'
            checked={this.state.checked}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
          <CheckBox
            title='Tamaño Large ($ 45000)'
            checked={this.state.checked}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
          <Text style={[localStyles.label,{marginTop: 10, marginBottom: 10}]} >BEBIDAS</Text>
          <CheckBox
            title='Gaseosa Litro'
            checked={this.state.checked}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
          <CheckBox
            title='Mr Tea'
            checked={this.state.checked}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
          <CheckBox
            title='Agua'
            checked={this.state.checked}
            onPress={() => this.setState({checked: !this.state.checked})}
          />
          <Text style={[localStyles.label,{marginTop: 10, marginBottom: 10}]} >INFORMACIÓN ADICIONAL</Text>
          <TextInput 
            style={[localStyles.inputText,{fontSize: 15, margin: 15, marginTop: 0, width: screenWidth - 30, borderRadius: 10}]}
            multiline={true}
            numberOfLines={4}
            placeholder='¿Deseas agregar información adicional a tu pedido?'
            onChangeText={(informacionAdicional) => this.setState({informacionAdicional})}
            value={this.state.informacionAdicional}
            maxLength={180}
          />          
        </ScrollView>
        </View>
      </View>

    );
  }
}

const localStyles = StyleSheet.create({
  container : { flex: 1, alignItems: 'center' },
  imageView : {
    alignItems: 'center',
    justifyContent: 'center',
    width:screenWidth,
    height: screenWidth*0.25,
    backgroundColor: 'transparent',
  },
  iconCamera : {
    
  },
  image: {  width: screenWidth*0.25, height: screenWidth*0.25, borderRadius: (screenWidth*0.25)/2, },
  inputText : {
    width:'100%', 
    padding: 10,
    paddingLeft: 20, 
    color:'#3498db',
    fontSize: 16, 
    backgroundColor:'#eeeeee',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: "#3f3f3f",
    paddingLeft: 20,
    paddingTop: 4,
  },
  title2 : {
    fontFamily: 'RussoOne-Regular',
    color: "#3498db", fontSize: 22,
    textAlign: 'center',
  }  ,
  title3: {
    //fontFamily: 'RussoOne-Regular',
    color: "#e74c3c", fontSize: 18,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  }  ,    
  paragraph: {
    fontSize: 16,
    fontWeight: '100',
    textAlign: 'justify',
    color: "#00000077",
  },

})