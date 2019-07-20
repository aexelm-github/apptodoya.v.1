import React, { Component } from 'react';
import { Dimensions,
         Text, 
         View, 
         TouchableOpacity, 
         ProgressBarAndroid,
         StyleSheet,
         ScrollView,
         Divi
        } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import styles from '../styles/stylesOne';
import * as Font from 'expo-font'
import CacheImage from '../components/CacheImage';
import { FlatGrid } from 'react-native-super-grid';
import { Divider } from 'react-native-elements';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let categorias ;

export default class comerciosScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false, 
            categoriasLoaded: false,
        };        
    }
    
    onPress = () => {
        alert("exel");
    }

    _goScreen = (params) => {
        this.props.navigation.navigate('carta', { 
          params : params
        });
      }


    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: props => {return <Text style={{color:'#fff',fontWeight: "500", fontSize: 18}}>
                                           TodoYa
                                </Text>},
          headerStyle: {
            backgroundColor: '#2980b9',
            textAlign: 'center',
            elevation: 0,
          },
          headerRight: (
            <View style={{marginRight: 12, flexDirection:'row'}}>
              <Ionicons name='md-menu' color='#fff' size={36} />
            </View>
          ),
          headerBackTitleStyle: {
            color: 'white',
          },
        };
    };
    
    async componentDidMount() { 
        await  Font.loadAsync({
            'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });  
        console.log("EEEXEXEXEEX");
        // Buscar en servidor de BBDD 
        let formdata = new FormData();
        formdata.append('parent',this.props.navigation.getParam('params','').id);
    
        await fetch('http://todoya2.aexelm.com/index.php/maincontrol/getboard', {   
            method: "POST",
            body: formdata,
            })
            .then( (response) => response.json() )
            .then( (responseJson) => {
                console.log("entro por aca");
                if (responseJson.length == 0){
                alert("¡¡Oops!!. Categoría esá vacía.");
                }else{
                categorias = responseJson;
                this.setState({ categoriasLoaded: true });  
                }
        });               

    }

  render() {
    const params = this.props.navigation.getParam('params','');
    console.log(params.id);
    const nombreCategoria = 'Default';//this.props.navigation.getParam('data','');
    return (
        <View style={[styles.container,{backgroundColor: '#2980b9'}]}>
          { this.state.categoriasLoaded ? (
          <View >
              {
                this.state.fontLoaded ? (
                  <Text style={localStyles.simpleName}  >
                        {params.categoria}
                  </Text>
                ) : null
              }                  
              <Text style={localStyles.quePuedo}>¿Qué podemos hacer por ti?</Text>
              <Divider style={{ marginLeft: 10,marginRight: 10, backgroundColor: '#ffffffee', height: 8 }} />
              <ScrollView>  
              <FlatGrid
                itemDimension={130}
                items={categorias}
                style={localStyles.gridView}
                // staticDimension={300}
                // fixed
                spacing={15}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => {this._goScreen(item.name)}}>
                    <View style={localStyles.categoria} elevation={15}>
                      <CacheImage
                        style={localStyles.image}
                        uri= {'http://todoya2.aexelm.com/images/'+item.foto}
                      />                    
                      <Text style={localStyles.name}>{item.name}</Text>
                      <Text style={localStyles.simpleDetalle}>{item.detalle}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>  
          </View>
        ) : (
            this.state.fontLoaded ? (
              <View style={localStyles.welcome}>
                  <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
              </View>
            ) : null
        )}
        </View>
    );
  }
}

const localStyles = StyleSheet.create({
  simpleName : {
      color: "#fff",
      fontSize: 26,
      paddingTop: 10,
      paddingLeft : 20,
      fontFamily: 'RussoOne-Regular'
  },
  simpleTitle : {
    color: "#e74c3c",
    fontSize: 18,
    paddingTop: 10,
    paddingLeft : 20,
    marginBottom: 4,
    fontFamily: 'RussoOne-Regular'
  },  
  simpleDetalle : {
    color : '#34495e',
    fontSize: 14,
    padding: 3,
    padding: 10,
  },
  quePuedo : {
    fontSize: 16,
    color: "#ffffffee",
    paddingLeft: 18,
    paddingBottom : 15,
  },
  image : {
    height: 130,
    width: "100%",
    resizeMode: "stretch",
    borderRadius: 0,
    margin: 0,
    height: screenWidth/2,
  },
  categoria : {
    padding: 0,
    paddingBottom: 5,
    width: '100%',
    //borderColor: "#aaaaaaaa",
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "#fff",
},
  name : {
    fontSize: 18,
    color: '#2980b9',
    fontWeight: "600",
    paddingTop: 5,
    textAlign: "left",
    paddingLeft: 10,
  },
  gridView: {
    marginTop: 3,
    flex: 1,
    paddingBottom: 130,
  },
  welcome : {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
  }

})