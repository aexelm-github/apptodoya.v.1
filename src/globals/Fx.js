import {AsyncStorage, NativeModules} from 'react-native';
import * as Permissions from 'expo-permissions';
// import {Notifications} from 'expo';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


GLOBAL = require('./globals');
// import * as SQLite from 'expo-sqlite';

// const db =   SQLite.openDatabase("DatabaseLocal", 1.0, 'DatabaseLocal', 10000)

export  let  _storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value, () => {console.log(key, 'grabadada')});
    } catch (error) {
        console.log("Error al salvar datos locales!!", error);
    }
}    

export let _retrieveData = async (key) => {
    const value = await AsyncStorage.getItem(key).then(console.log("se supone que trajo", key));
    if (value !== null) {
        return value
    }else{
        return null
    }
};

export let getTimeDate = (date) => {

    /*var wDay = new Array('Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado')
     var nMonth = new Array('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre')
     */
     var nDay = date.getDay();
     var day = date.getDate();
     var month = date.getMonth() ; //Current Month
     var year = date.getFullYear(); //Current Year      
     var hours = date.getHours(); //Current Hours
     var min = date.getMinutes(); //Current Minutes
     var sec = date.getSeconds(); //Current Seconds      
 
     //var day = wDay[nDay];
     //var Mes = nMonth[month]
 
     //this.setState({ hora: hours + ':' + ("00" + min).slice(-2) , fecha : day +', '+date+' de '+Mes })
     return (year+"-"+("00"+(month+1)).slice(-2)+"-"+("00"+(day)).slice(-2)+" "+("00"+(hours)).slice(-2)+":"+("00"+(min)).slice(-2)+":"+("00"+(sec)).slice(-2) )
   }


   export let  sendToken = async (usuario_id) => {
    const token = await getToken()
    if (token !== null && token !== undefined ){
        let formdata = new FormData()
        formdata.append("usuario_id",usuario_id);
        formdata.append('token',token);
        console.log(token, usuario_id)
        await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/setPushToken', {   
            method: "POST", 
            body: formdata,
        })
        .then( (response) => response.json() )
        .then( async (responseJson) => {
            if (responseJson.length === 0 ){
              console.log("responseJson",responseJson)
            }else{
              console.log("responseJson",responseJson)
            }
        });
    }    

  }

  const getToken = async () => {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }