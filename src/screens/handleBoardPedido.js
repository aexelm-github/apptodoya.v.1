import * as React from 'react';
import { 
        Image, 
        View, 
        TextInput,
        StyleSheet,
        TouchableOpacity, 
        TouchableHighlight,
        ScrollView,
        Picker ,
        ActivityIndicator,
        Keyboard,
        Dimensions,
        Text
      } from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';
import CustomButton from '../components/customButton';
import styles from '../styles/stylesOne';

GLOBAL = require('../globals/globals');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let didMountParams = null;

export default class ImagePickerX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      name: null,
      detalle: null,
      grupo: null,
      precio: null,
      fileName: null,
      fileNameBrand: null,
      URImanipulatedFile: null,
      id: null,
      waittingWhileSaving : false,
      shrinkScreen: 0,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('params').action,
      headerRight: (
        <View style={{marginRight: 8, flexDirection:'row'}}>
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

  async componentWillMount(){
    console.log('exe')
  }

  async componentDidMount() {
    //this.getPermissionAsync();
    didMountParams = this.props.navigation.getParam('params');
    console.log(didMountParams);
    
    if (didMountParams.action != 'Nuevo') {
      this.setState((previousState) => (
         {...previousState,  
          'name':didMountParams.data.name, 
          'detalle':didMountParams.data.detalle, 
          'grupo':didMountParams.data.cboa_grupo,
          'precio':didMountParams.data.cboa_precio ,
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


  _accionButtons = () => {
    switch(didMountParams.action){
      case "Nuevo": this._saveDatos();
        break;
      case "borrar": this._deleteDatos();
        break;
      case "Editar": this._editarDatos();
        break;
    }
  }

  _editarDatos = async () => {
    this.setState({waittingWhileSaving: true});
    if(this.state.image != null) {
      await this.upLoadImage(this.state.URImanipulatedFile);  
    }else{
      await this.setState({'fileName':didMountParams.data.foto}) ;
      console.log(this.state.fileName+" <<<<<<<<<"+didMountParams.data.foto)
      this._sendDataToServer();
    }
    console.log(this.state.image+' '+didMountParams.data.foto+" "+this.state.fileName);
  }


  _onGoBack = () => {
    this.props.navigation.goBack();
    this.props.navigation.state.params.onGoBack();
  }

  _deleteDatos = async () => {
    let formdata = new FormData();
    formdata.append('id',didMountParams.data.cboa_id);
    formdata.append('name',this.state.name);
    formdata.append('detalle',this.state.detalle);
    formdata.append('filename',this.state.fileName);
    formdata.append('action',didMountParams.action);
    this.setState({waittingWhileSaving: true});
    await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/saveboard', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
          if (responseJson.length == 0){
            alert("¡¡Oops!!. Problemas para tratar la información.");
            this.setState({waittingWhileSaving: false});
          }else{
            alert(responseJson[0].message);
            //console.log(responseJson);
            //categorias = responseJson;
            //this.setState({ categoriasLoaded: true });  
            this.setState({waittingWhileSaving: false});
            if (responseJson[0].success == 'ok'){
              this._onGoBack();
            }
          }
    });         
  }

  _saveDatos = async () => {
    if ((this.state.name == null)||(this.state.grupo == null)||(this.state.precio == null)) {
      alert('Todos lo campo deben ser dilgenciados.','');
    }else{
      this._sendDataToServer();
    }

  }

  _sendDataToServer = async () => {
      //console.log('ESTE EL PARENT que ESTOY RECIBIENDO '+didMountParams.parentId);
      // Buscar en servidor de BBDD 
      let formdata = new FormData();
      formdata.append('id',didMountParams.action == "Editar" ? didMountParams.data.cboa_id : null);
      formdata.append('name',this.state.name);
      formdata.append('detalle',this.state.detalle);
      formdata.append('filename',this.state.fileName);
      formdata.append('filenameBrand',this.state.fileNameBrand);
      formdata.append('parentId',didMountParams.parentId);
      formdata.append('action',didMountParams.action);
      formdata.append('GO',didMountParams.go);
      formdata.append('grupo',this.state.grupo);
      formdata.append('precio',this.state.precio);
      //console.log(formdata);
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/saveboard', {   
          method: "POST",
          body: formdata,
        })
        .then( (response) => response.json())
        .then( (responseJson) => { 
            if (responseJson.length == 0){
              alert("¡¡Oops!!. Problemas para guardar la información.");
            }else{
              this.setState({waittingWhileSaving: false});
              alert(responseJson[0].message);
              //console.log(responseJson);
              if (responseJson[0].success == 'ok'){
                this._onGoBack();
              }                  
            }
      }).catch((e) => { 
          this.setState({waittingWhileSaving: false});
          alert(e)
      });                



  }

  render() {
    const params = this.props.navigation.getParam('params');
    let ColorBoton1 = params.action == 'Nuevo' ? '#f39c12' : (params.action == 'Editar' ? '#27ae60': '#e74c3c');
    const grupoPickerOPtions = params.jsonGrupo;
    console.log(params);
    return (
      <View
        style={{flex: 1,}}
        behavior='padding'
      >
      {this.state.waittingWhileSaving ? (
        <View style={{flex:1, alignItems:'center', justifyContent: 'center', position: 'absolute', top: 0, left:0, width: '100%', height: '100%',  zIndex: 1000}} >
          <ActivityIndicator  size={80} color={ColorBoton1}/>
        </View>        
        ) : null
      }
      <View style={[localStyles.container,{paddingBottom: this.state.shrinkScreen}]}>
      <ScrollView style={{flex:1, width:'100%', marginBottom: 55}}> 
          <View>
            <Text style={localStyles.label} >Grupo</Text>
              <View style={{flexDirection: 'row'}}>
              <TextInput 
                style={[localStyles.inputText,{width: screenWidth-50}]}
                placeholder='¿Cómo prefieres agrupar este producto?'
                onChangeText={(grupo) => this.setState({grupo})}
                value={this.state.grupo}
                maxLength={50}
              />
              <Picker
                style={{width: 50}}
                onValueChange={(value) => this.setState({grupo: value})}
                selectedValue={''}
              >
                {grupoPickerOPtions.map((value, index) => <Picker.Item  key={index} label={value} value={value} />)}
              </Picker>
            </View>
        </View>
        <View>
        <Text style={localStyles.label} >Nombre</Text>
        <TextInput 
          style={[localStyles.inputText,{fontWeight: '600', fontSize: 19}]}
          placeholder='¿Qué nombre tiene el producto o servicio?'
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          maxLength={20}
        />          
        <Text style={localStyles.label} >Precio</Text>
        <TextInput 
          style={localStyles.inputText}
          placeholder='¿Qué valor deseas darle a este producto?'
          onChangeText={(precio) => this.setState({precio})}
          value={this.state.precio}
          maxLength={50}
          keyboardType='number-pad'
        /></View>
      </ScrollView>
      
      { params.action == 'Editar' ? 
          <View style={{flexDirection: 'row'}}>
            <CustomButton 
                title={""} 
                onPress={() => this._editarDatos()}
                style={{marginBottom: 50, backgroundColor: "#27ae60"}}
                Icon={'check'}
            />    
            <CustomButton 
                title={""} 
                onPress={() => this._deleteDatos()}
                style={{marginBottom: 50, backgroundColor: "#e74c3c"}}
                Icon={'delete'}
            />              
          </View>                        
        : 
        <CustomButton 
                    title={params.action}
                    style={[styles.buttonViewLogin, {position:'absolute',bottom:0, marginBottom: 0, backgroundColor: ColorBoton1}]}
                    onPress={() => this._saveDatos()}
                />
      }
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
    width: '100%',
    height: 270,
    backgroundColor: '#aaa',
  },
  iconCamera : {
    
  },
  image: { position: 'absolute', top:0, left:0, width: '100%', height: '100%' },
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
  }
})