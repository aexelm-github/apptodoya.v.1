import { StyleSheet } from 'react-native';
import { Dimensions, Platform} from "react-native";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


export default StyleSheet.create({
  // paste the styles from App.js here
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerCategoria: {
    flex: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  containerLogin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    //paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0    
  },  
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: "#0095d7"
  },
  word: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
  },
  results: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 30,
    fontSize: 20
  },
  todoYa: {
    textAlign: "center",
    color: "blue",
  },  
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center', 
  },
  logoImage: {
      width:  100,
      height : 100
  },
  textInputLogin : { 
    color: "#fff",
    height: 70,
    borderRadius: 35, 
    borderColor: 'rgba(0, 168, 255,0.4)', 
    borderWidth: 2, 
    maxWidth: screenWidth - (screenWidth*0.2),
    width: 300,
    padding: 10,
    marginBottom: 5,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0,0.3)"
   },
   buttonViewLogin: {
    height: 50,
    borderRadius: 0, 
    borderColor: 'white', 
    borderWidth: 0, 
    minWidth: screenWidth, /* - (screenWidth*0.2),*/
    padding: 20,
    marginBottom: 5,
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#2ecc71",
    color: "#fff"
   },
   textTitle : {
    padding: 17,
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
   },
   textButton: {
    color: "#fff"
   },
   copyright: {
    width: '100%', 
    height: "auto", 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0 ,
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    padding: 4
   }
});

