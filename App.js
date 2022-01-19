import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, {useState, useRef, useEffect} from 'react'

//IMPORT GAUGE PACKAGE
import { ECharts } from "react-native-echarts-wrapper";

//IMPORT MQTT PACKAGE
var mqtt = require('@taoqf/react-native-mqtt')
var client

export default function App() {
 
  useEffect(() => {
    //CONNECT TO WEBSOCKET SERVER
    client  = mqtt.connect(`ws://www.txio.live:8083/mqtt`)
    client.on('connect', function(){
      console.log('connected websocket')
    })
    //SUBSCRIBE TO MQTT TOPIC
    //CHANGE HERE WITH CORRECT TOPIC
    //BELOW TOPIC IS DEBUGING PURPOSE
    client.subscribe('TRX/data/bomba/debug', function (err) {
      if (!err) {
         console.log('connected')
       }
    })
    client.on('message', function (topic, message) {
      //LISTEN TO MQTT TOPIC
      if(topic==="TRX/data/bomba/debug"){
        //USE DATA FROM MQTT TO RENDER NEW VALUE
        //CHANGE HERE TO PROCESS DATA
        let data = {
          series:[
            {
              data:[
              {
                //INSERT VALUE FROM SENSOR DATA HERE
                //BELOW IS FOR DEBUGING PURPOSE
                value: Math.round(Math.random()*100)
              }
            ]
          }
          ]
        };
        //UPDATE GAUGE WITH REAL-TIME DATA
        chart.current.setOption(data)
      }
    })
}, []);
  
  //IMPORTANT USEREF TO USE FUNCTIONAL COMPONENT FOR ECHARTS
  const chart = useRef(null);

  //SET INITIAL STATE OF GAUGE OPTION
  //PLAY AROUND WITH OPTION BELOW TO GET DESIRE GAUGE STYLE
  const option= {
    series: [
      {
        type: 'gauge',
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#00B500'], //SET COLOR FOR LOW VALUE AND ITS VALUE
              [0.7, '#E6E600'], //SET COLOR FOR MEDIUM VALUE AND ITS VALUE
              [1, '#CA3838']  //SET COLOR FOR HIGH VALUE AND ITS VALUE
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto' // POINTER WILL USE LINESTYLE COLOR BASED ON VALUE
          }
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          distance: -30,
          length: 20,
          lineStyle: {
            color: '#fff',
            width: 4
          }
        },
        axisLabel: {
          color: 'black', 
          distance: 5,
          fontSize: 16
        },
        detail: {
          valueAnimation: true,
          formatter: '{value} ppm', //UNIT FOR VALUE
          color: 'black',
          fontSize: 20,
          offsetCenter: [0, 80]
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.setFontSizeOne}>Bomba Hartamas</Text>
        <StatusBar style="auto" />
      </View>
      <Text style={styles.setFontSizeTwo}>Gas Sensor</Text>
      <View style={{height:300, width:"90%"}}>
        <ECharts
          ref={chart}
          option={option}
          backgroundColor="white"
          // backgroundColor="rgba(93, 169, 81, 0.4)"
        />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4c4',
    alignItems: 'center',
    paddingTop: 20,
  },
  header:{
    backgroundColor:'red',
    padding: 20,
  },
  setFontSizeOne: {
    fontSize: 40,
  },
  setFontSizeTwo: {
    fontSize: 25,
  },
 
  
});