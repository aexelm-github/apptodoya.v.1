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
        Text,
        SectionList,
      } from 'react-native';
import { Permissions, Constants} from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';
import CustomButton from '../components/customButton';
import styles from '../styles/stylesOne';
import { CheckBox } from 'react-native-elements'
import ActionMenu2 from '../components/ActionMenu2';

GLOBAL = require('../globals/globals');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


let didMountParams = null;
let categorias;
let jsonFinal = new Array;
let jsonGrupo = new Array;
let checkboxSelected = new Array;

export default class pedidoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          direccion: null,
          shrinkScreen: 0,         
          checked : false, 
          fontLoaded: false, 
          categoriasLoaded: false,
          itemChecked: null,
          estosBotonesActivos: {"add": true,"delete":false, "edit": false},
          Total : '$0.00',
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
      this.getPermissionAsync();
      didMountParams = this.props.navigation.getParam('params');
      checkboxSelected = new Array;
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
      this._getBoard();
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
  
    _getBoard = async () => {
      console.log('_getBoard(): ');
      console.log(this.props.navigation.getParam('params').cboa_id);
      let formdata = new FormData();
      formdata.append('parent',this.props.navigation.getParam('params').cboa_id);
      await this.setState({categoriasLoaded:false});
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getBoard', {   
          method: "POST",
          body: formdata,
        })
        .then( (response) => response.json() )
        .then( (responseJson) => {
            if (responseJson.length == 0){
              alert("¡¡Oops!!. Parece que está vacío!!.");
            }else{
              categorias = responseJson;
              //console.log(categorias)
              //this.setState({ categoriasLoaded: true, itemChecked: null });  
              //this._seleccionaItem({index: null, id: null }) 
              this.organizarPorGrupos(categorias);
              
            }
      });   
    }

    organizarPorGrupos(data) {
      jsonFinal = new Array;  
      jsonGrupo = new Array;  
      jsonGrupo.push('');
      let grupoAnterior;
      let checkbox;
      data.map((item, i) => {
        if (item.cboa_grupo != grupoAnterior ) {
          jsonGrupo.push(item.cboa_grupo);
          grupoAnterior = item.cboa_grupo;
          jsonFinal.push({"title":grupoAnterior, data:[]})
          jsonFinal[jsonFinal.length-1 ].data.push(item);
        }else{
          jsonFinal[jsonFinal.length-1 ].data.push(item);
        }
      })
      this.setState({ categoriasLoaded: true, itemChecked: null });  
      //this._seleccionaItem({index: null, id: null }) 
      //console.log(jsonFinal);
    }

    _seleccionaItem = (params) => {
      console.log('selecciono: '+params.cboa_id)
      this.state.itemChecked == params.cboa_id ? this.setState({'itemChecked':null}) :this.setState({'itemChecked':params.cboa_id}) ;
      this._accionMenuPress('edit');
    }

    _pressCheckBox(item, value) {
      this.setState({['cbox'+item.cboa_id]: !this.state['cbox'+item.cboa_id]});
      if (this.state['cbox'+item.cboa_id]){
        checkboxSelected = checkboxSelected.filter(thisItem => thisItem.cboa_id !== item.cboa_id);
      }else{
        checkboxSelected.push({cboa_id:item.cboa_id, precio: item.cboa_precio})
      }
      console.log(checkboxSelected)
      let total = 0;
      checkboxSelected.map((item) => {
        total+= parseInt(item.precio);
      })
      this.setState({Total: '$ '+ new Intl.NumberFormat("en-US").format(total)+'.00'})
    }

    _renderSectionList() {
      let renderThis = <SectionList 
                          sections={jsonFinal}
                          renderSectionHeader={({ section }) => (
                            <Text style={[localStyles.label,{marginTop: 10, marginBottom: 10}]} >{section.title}</Text>
                          )}                                 
                          renderItem={({ item, index }) => (
                            <CheckBox
                            style={{width: screenWidth - 50}}
                            title={item.name+ ' [ $ '+ new Intl.NumberFormat("en-US").format(item.cboa_precio)+' ]' }
                            checked= { this.state['cbox'+item.cboa_id] }
                            onPress={() => this._pressCheckBox(item, item.cboa_id)}
                            delayLongPress={GLOBAL.LONG_PRESS_SECONDS}
                            onLongPress={() => { this._seleccionaItem({cboa_id: item.cboa_id}) }}
                            value={item.cboa_id}
                          />                            
                          )}
                          keyExtractor={(item,index) => index.toString()}
                        ></SectionList>
      return renderThis;
    }

    _accionMenuPress = (data) => { 
      const params = this.props.navigation.getParam('params','');
      //console.log(params);
      console.log('ESTE ES PARENT QUE ESTOY ENVIANDO parentId:' + params.cboa_id + " "+ this.state.itemChecked);
      const item = categorias.filter(item => item.cboa_id == this.state.itemChecked);
      //console.log(item[0]); 
      switch(data){
        case 'add': data='Nuevo';break;
        case 'edit': data='Editar';break;
        case 'delete': data='borrar';break;
      }
      this.props.navigation.navigate('HandleBoardPedido', {
        onGoBack : this._getBoard,
        params : {
          commingFrom: 'pedidoScreen',
          parentId: params.cboa_id,
          action: data,
          id: this.state.itemChecked,
          data: this.state.itemChecked == null ? null : item[0],
          go: 'detalle',
          jsonGrupo: jsonGrupo,
        }
      }); 
    }
  
    goMaps() {
      this.props.navigation.navigate('Mapa', {})
    }
    
  render() {
    const params = this.props.navigation.getParam('params');
    //console.log(this.state);
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
          
          <View style={{flexDirection: 'row'}}>
              <TextInput 
                style={[localStyles.inputText,{width: screenWidth-50}]}
                placeholder='Escriba la dirección de envío'
                onChangeText={(direccion) => this.setState({direccion})}
                value={this.state.direccion}
                maxLength={80}
              />            
              <TouchableOpacity
                style={{width: 50, alignContent:"center", alignItems: "center", flex:1}}
                onPress={() => {this.goMaps()}}
              >
                <MaterialCommunityIcons name='map-marker' color='#3498db' size={45} />
              </TouchableOpacity>
          </View>          
          { this.state.categoriasLoaded ? ( 
              this._renderSectionList()
          ) : null }
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
   
        <CustomButton 
            title={`[ ${this.state.Total} ] Confirmar Pedido`}
            style={[styles.buttonViewLogin, {position:'absolute',bottom:0, marginBottom: 0, backgroundColor: 'blue'}]}
            onPress={() =>{}}
        />  
        </View>
        <ActionMenu2
          callbackFromParent={this._accionMenuPress}
          estosBotonesActivos={this.state.estosBotonesActivos}
        /> 
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