import React, { Component } from 'react';
import {
  FlatList,
  ListItem,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Button,
  TextInput
} from 'react-native';
import morse from  'morse';
import RNFlash from 'react-native-flash';
import Sound from 'react-native-sound';


export default class FlashlightniMariel extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.display = this.display.bind(this);
    this.addtoList = this.addtoList.bind(this);
    this.sound = this.sound.bind(this);
    
    this.state = {
      list:[
        "HELP",
        "SOS",
        "EMERGENCY",
        "RUN"
      ],
      descriptionInput: ''    
    };
  }

  addtoList(){
    const items = this.state.list.concat();
    this.setState({
      list: items.concat(this.state.descriptionInput)
    });
    this.setState({descriptionInput: ""});
  }

  remove(input){
    var items = this.state.list.concat();
    for(var i = 0; i< items.length; i++){
      if(items[i] == input){
        items.splice(i,1);
        break;
      }
    }
    this.setState({list:items});
  }

  display(input){
    const msg = morse.encode(input);
    ToastAndroid.show(msg, ToastAndroid.SHORT);
    var time = 0;

    for (var i = 0; i < msg.length; i++) {
      //ToastAndroid.show(msg[i], ToastAndroid.SHORT);
      if(msg[i] == "."){
        time +=600;
        setTimeout(()=>{
          RNFlash.turnOnFlash();
          this.sound('dot.mp3');
          setTimeout(()=>{RNFlash.turnOffFlash()},300);
        },time-300)      
      }
      else if(msg[i] == "-"){
        time+=1200;
        setTimeout(()=>{
          RNFlash.turnOnFlash();
          this.sound('dash.mp3');
          setTimeout(()=>{RNFlash.turnOffFlash()},700);
        },time-500)
      }
      else if(msg[i] == " "){
        time+=900;
      }
      console.log("char: || "+msg[i]+" || " + time);
    }
    }

    sound(file){
          var whoosh = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
            }else{
              console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
              whoosh.setVolume(1);
              whoosh.play(()=>{
                whoosh.release();
              });
            } 
            });     
    }

  render() {
    RNFlash.hasFlash(function(){
		},function(){
      ToastAndroid.show("Flash is not available for your device.", ToastAndroid.SHORT);
		});

    return (
      <View style={styles.container}>
         <Text style={styles.welcome}> i S O S </Text>
        <FlatList
            style = {{width: 300}}
            data={this.state.list}
            renderItem={({item}) => (
              <View style={{flex: 1,  flexDirection: 'row',justifyContent: 'center',alignItems: 'center',margin: 5 }}>
                <Text style={styles.items}>{item}</Text>
                <Button style={styles.items}  title="PLAY" onPress={() =>(this.display(item))}/>
                <Button  style={styles.items}title="Remove" onPress={() =>(this.remove(item))}/>
              </View>
              )}/>
        <TextInput style={{width: 300,}} value ={this.state.descriptionInput} onChangeText={(text) => this.setState({descriptionInput:text})}/>
          <Button  onPress={()=>(this.display(this.state.descriptionInput))} title="EXECUTE" buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>        
          <Button onPress={(this.addtoList)} title="ADD TO LIST" buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  items: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 30,
  },
});

AppRegistry.registerComponent('FlashlightniMariel', () => FlashlightniMariel);
