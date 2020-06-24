import {AsyncStorage, NativeModules} from 'react-native';
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