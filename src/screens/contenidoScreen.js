import React, { Component } from 'react';
import { Button, 
         StyleSheet, 
         Text, 
         View, 
         Image, 
         TouchableHighlight, 
         ProgressBarAndroid,
         Dimensions,
        } from 'react-native';
import styles from '../styles/stylesOne';
import CacheImage from '../components/CacheImage';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


const PRACTICE_TIME = 2* 1000;

export default class cartaScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          fontLoaded: false, 
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
    }

  render() {
    const item = this.props.navigation.getParam('params');
    console.log(item);
    return (
      <ScrollView>
        <View style={[styles.container]}>
          <CacheImage
              style={localStyles.image}
              uri= {'http://todoya2.aexelm.com/images/'+item.foto}
          />   
          <View style={localStyles.titleBox}>   
            {this.state.fontLoaded ? 
              <Text 
                  style={[localStyles.title1,localStyles.shadow]}
              >{item.name}</Text> : null }
          </View>
        </View>
        <View style={{padding: 10, paddingLeft:15}}>
          <Text style={localStyles.title2} >{item.name}</Text>
          <Text style={localStyles.paragraph} >
            {item.detalle}
          </Text>
        </View>
      </ScrollView>
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
    paragraph: {
      fontSize: 18,
      fontWeight: '100',
      textAlign: 'justify',
      color: "#00000077",
    },
   }
)