import React, { Component } from 'react';
import { Button, 
         StyleSheet, 
         Text, 
         View, 
         Image, 
         TouchableHighlight, 
         TouchableOpacity,
         ProgressBarAndroid,
         Dimensions,
         FlatList,
         SectionList,
        } from 'react-native';
import styles from '../styles/stylesOne';
import CacheImage from '../components/CacheImage';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font'
import ActionMenu2 from '../components/ActionMenu2';

GLOBAL = require('../globals/globals');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


const PRACTICE_TIME = 2* 1000;
let categorias;
let jsonFinal = new Array;
let jsonGrupo = new Array;

export default class cartaScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          fontLoaded: false, 
          categoriasLoaded: false,
          itemChecked: null,
          estosBotonesActivos: {"add": true,"delete":false, "edit": false},
        }

    }

    static navigationOptions = ({navigation}) => {
      return {
        headerTitle: (<Text style={{paddingLeft: 2  , color: "#fff"}} >TodoYA!</Text>),
       /* headerLeft: (
          <Image 
            source={require('../images/TodoYa-03.png')} 
            style={{marginLeft: 8,marginTop: 5, width:50,height: 50, resizeMode:'stretch'}}
          />
        ),*/
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
        headerTintColor: '#fff',
        headerStyle : {
          backgroundColor: '#3498db',
          
          
        }
      };
    };

    async componentDidMount() { 
      await  Font.loadAsync({
        'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });  
      this._getBoard();
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
              console.log(categorias)
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
    this._seleccionaItem({index: null, id: null }) 
    console.log(jsonFinal);
  }

  _renderSectionList() {
    let renderThis = <SectionList 
                        sections={jsonFinal}
                        renderSectionHeader={({ section }) => (
                          <View  style={styles.SectionHeaderStyle}>
                            <Text style={localStyles.title3}> {section.title} </Text>
                          </View>
                        )}                                 
                        renderItem={({ item, index }) => (
                          <TouchableOpacity 
                            onPress={() => {this._goScreen(item)}}
                            delayLongPress={GLOBAL.LONG_PRESS_SECONDS}
                            onLongPress={() => { this._seleccionaItem({cboa_id: item.cboa_id}) }}
                            activeOpacity={0.7}
                          >                          
                            <View style={{flexDirection: 'row', width: screenWidth}}>
                              <CacheImage
                                  style={localStyles.imageProduct}
                                  uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
                              />   
                              <View style={{width:0, flexGrow: 1, marginTop: 15, marginRight: 15}}>
                                <Text style={{fontSize: 20, color:"orange"}}>{item.name}</Text>
                                <Text style={{fontSize: 16, color:"#343434",flexWrap: 'wrap'}}>{item.detalle}</Text>
                                { item.cboa_precio>0 ? 
                                  <Text style={localStyles.precio}>$ {item.cboa_precio}</Text>
                                : null }
                              </View>
                            </View>
                            {
                              this.state.itemChecked == item.cboa_id ? (
                                  <View style={localStyles.checked}>
                                      <Ionicons name='ios-checkmark-circle-outline' color='#fff' size={36} />
                                  </View>
                                  ) : null
                            }                            
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item,index) => index.toString()}
                      ></SectionList>
    return renderThis;
  }


  _goScreen = (params) => {
    console.log('Desde contenidoScreen: goScreen');
    if (this.state.itemChecked == null )
        this.props.navigation.navigate(params.cboa_go, { 
        params : params
        }); 
  }

  _seleccionaItem = (params) => {
    console.log('selecciono: '+params.cboa_id)
    this.state.itemChecked == params.cboa_id ? this.setState({'itemChecked':null}) :this.setState({'itemChecked':params.cboa_id}) ;
    if (this.state.itemChecked == null ){
      this.setState((previousState) => ({
        estosBotonesActivos: {
          ...previousState.estosBotonesActivos,
          add: true, edit: false, delete: false
        }
      }))
    }else{
      this.setState((previousState) => ({
        estosBotonesActivos: {
          ...previousState.estosBotonesActivos,
          add: false, edit: true, delete: true
        }
      }))
    }
  }

  _accionMenuPress = (data) => {
    const params = this.props.navigation.getParam('params','');
    console.log('ESTE ES PARENT QUE ESTOY ENVIANDO parentId:' + params.cboa_id + " "+ this.state.itemChecked);
    const item = categorias.filter(item => item.cboa_id == this.state.itemChecked);
    console.log(item[0]);
    switch(data){
      case 'add': data='Nuevo';break;
      case 'edit': data='Editar';break;
      case 'delete': data='borrar';break;
    }
    this.props.navigation.navigate('HandleBoard', {
      onGoBack : this._getBoard,
      params : {
        commingFrom: 'contenidoScreen',
        parentId: params.cboa_id,
        action: data,
        id: this.state.itemChecked,
        data: this.state.itemChecked == null ? null : item[0],
        go: 'Pedido',
        jsonGrupo: jsonGrupo,
      }
    }); 
  }

  render() {
    const item = this.props.navigation.getParam('params');
    console.log(item);
    return (
      <View>
      <ScrollView>
        <View style={[styles.container]}>
          <CacheImage
              style={localStyles.image}
              uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
          />   
          <View style={localStyles.titleBox}>   
            {this.state.fontLoaded ? 
              <Text 
                  style={[localStyles.title1,localStyles.shadow]}
              >{item.name}</Text> : null }
          </View>
        </View>
        <View style={{padding: 15, paddingTop:10}}>
          <Text style={localStyles.title2} >{item.name}</Text>
          <Text style={localStyles.paragraph} >
            {item.detalle}
          </Text>
        </View>
        { this.state.categoriasLoaded ? ( 
              this._renderSectionList()
          ) : null }
      </ScrollView>
      <ActionMenu2
        callbackFromParent={this._accionMenuPress}
        estosBotonesActivos={this.state.estosBotonesActivos}
      />       
      </View>
    );
  } 
}

const localStyles = StyleSheet.create (
  {
    image : {
        width: "100%",
        resizeMode: "stretch",
        borderRadius:0,
        margin: 0,
        height: screenWidth*0.80,
      },
      imageProduct : {
        width: screenWidth*0.25,
        resizeMode: "stretch",
        margin: 15,
        borderRadius: 8,
        height: screenWidth*0.25,
      },      
    title1 : {
      fontFamily: 'RussoOne-Regular',
      color: "#fff", fontSize: 36,
    }  ,
    shadow: {
      color: '#fff',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
      textShadowColor: '#000',
    },    
    titleBox : {
      position: 'absolute', top:0, left: 0, color: "#fff", fontSize: 36,
      justifyContent: 'center',
      alignItems: 'center',
      height: screenWidth*0.80,
      width: screenWidth,
    },
    title2 : {
      fontFamily: 'RussoOne-Regular',
      color: "#3498db", fontSize: 22,
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
    SectionHeaderStyle: {
      backgroundColor: '#CDDC89',
      fontSize: 20,
      padding: 5,
      color: '#3498db',
    },
    checked: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: '#00000077',
      alignItems: 'center',
      justifyContent: 'center'
    },
    precio: {
      fontSize: 18, color:"#e74c3c", textAlign: 'right',
      marginRight: 5,
    },
   }
)