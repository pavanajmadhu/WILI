import React, { Component } from 'react';
import { Button, View, Text, Image, TextInput,TouchableOpacity ,StyleSheet} from 'react-native';
import firebase from 'firebase'

export default class Login extends Component {
  constructor(){
    super()
    this.state={
      email:'',
      password:''
    }
  }
  login= async ()=>{
 var {email,password}=this.state

 if(email && password){
try{
var response=await firebase.auth().signInWithEmailAndPassword(email,password)
if(response){
  this.props.navigation.navigate('tabs')
}
}catch(error){
  alert(error.message)

}
 }else{
   alert('fill the details')
 }

  }
  render(){
    return(
      <View>
       <TextInput 
              style={styles.inputBox} 
              placeholder="Email" 
              onChangeText = {(text) => {
                this.setState({
                  email : text
                });
              }}
              value={this.state.email}
            />
             <TextInput 
              style={styles.inputBox} 
              secureTextEntry={true}
              placeholder="password" 
              onChangeText = {(text) => {
                this.setState({
                  password : text
                });
              }}
              value={this.state.password}
            />

            <TouchableOpacity style={styles.submitButton} onPress={this.login}> <Text style={styles.submitButtonText} >login</Text></TouchableOpacity>
            </View>
    )
    
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems : "center",
    justifyContent : "center"
  },
  inputBox : {
    width : 200,
    height : 40,
    borderWidth : 1.5,
    fontSize : 20,
    margin:20,
    marginLeft:60
  },
   submitButton : {
    backgroundColor : "#FBC02D",
    width : 100,
    height : 50,
    justifyContent:"center",
    margin:70
  },
  submitButtonText : {
    textAlign : "center",
    fontSize : 25,
    fontWeight : "bold",
    padding : 5,
    color : "white"
  }
})