import React, { Component } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, TextInput, Image, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Keyboard, ToastAndroid } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import db from '../config';
import firebase from 'firebase';

export default class TransactionScreen extends Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions : null,
      scanned : false,
      scannedBookId : "",
      scannedStudentId : "",
      buttonState : "normal",
      transactionMessage : ""
    };
  }

  getCameraPermissions = async (id)=> {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);    
    
    this.setState({
      hasCameraPermissions : status === "granted",
      buttonState : id,
      scanned : false
    });
    console.log(this.state.hasCameraPermissions);
  }

  handleBarCodeScanned = async(type, data) => {
    const state = this.state.buttonState;
    if(state === "BookId") {
      this.setState({
        scanned : true,
        scannedBookId : type.data,
        buttonState : 'normal'
      });
    } else if(state === "StudentId") {
      this.setState({
        scanned : true,
        scannedStudentId : type.data,
        buttonState : 'normal'
      });
    }    
  }

  checkBookEligibility = async () => {
    var transactionType;
    var bookRef = await db.collection("Books").where("BookId","==",this.state.scannedBookId).get();
    console.log(bookRef.docs.length);
    if(bookRef.docs.length === 0) {
      transactionType = false;
      alert("Book does not exist in the database");
      this.setState({
        scannedBookId : "",
        scannedStudentId : ""
      });
    } else {
      bookRef.docs.map((doc) => {
        var book = doc.data();
        console.log(book)
        if(book.BookAvailability) {
          transactionType = "issue";
        } else {
          transactionType = "return";
        }
      })
    }
    return transactionType;
  }

  checkStudentEligibilityForIssue = async () => {
    var isStudentEligible;
    var studentRef = await db.collection("StudentsId").where("StudentId","==", this.state.scannedStudentId).get();
    if(studentRef.docs.length === 0) {
      isStudentEligible = false;
      alert("Student does not exist in the database")
    } else {
      studentRef.docs.map((doc) => {
        var student = doc.data();
        if(student.NumberOfBooksIssued < 2) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          alert("Student has already reached his limit of 2 books");
        }
      });
    }
    return isStudentEligible;
  }

  checkStudentEligibilityForReturn = async () => {
    var isStudentEligible;
    var studentRef = await db.collection("StudentsId").where("StudentId","==", this.state.scannedStudentId).get();
    if(studentRef.docs.length === 0) {
      isStudentEligible = false;
      alert("Student does not exist in the database")
    } else {
      var transactionRef = await db.collection("Transactions").where("BookId", "==", this.state.scannedBookId).limit(1).get();
      transactionRef.docs.map((doc) => {
        var lastBookTransaction = doc.data();
        if(lastBookTransaction.StudentId === this.state.scannedStudentId) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          alert("Book was not issued to this student")
        }
      });

    }
    return isStudentEligible;
  }

  handleTransaction = async () => {
    var isStudentEligible;
    var transactionType = await this.checkBookEligibility();
    if(transactionType === "issue") {
      isStudentEligible = await this.checkStudentEligibilityForIssue();
      if(isStudentEligible) {
        this.initiateBookIssue();
        alert("Book issued");
      }
    } else if(transactionType === "return") {
      isStudentEligible = await this.checkStudentEligibilityForReturn();
      if(isStudentEligible) {
        this.initiateBookReturn();
        alert("Book returned")
      }
    }   
  }

  initiateBookIssue = () => {
    db.collection("Transactions").add({
      BookId : this.state.scannedBookId,
      StudentId : this.state.scannedStudentId,
      Date : firebase.firestore.Timestamp.now().toDate(),
      TransactionType : "Issue"
    });

    db.collection("Books").doc(this.state.scannedBookId).update({
      BookAvailability : false
    });

    db.collection("StudentsId").doc(this.state.scannedStudentId).update({
      NumberOfBooksIssued : firebase.firestore.FieldValue.increment(1)
    });

    // Alert.alert("Book issued");

    
  }

  initiateBookReturn = () => {
    db.collection("Transactions").add({
      BookId : this.state.scannedBookId,
      StudentId : this.state.scannedStudentId,
      Date : firebase.firestore.Timestamp.now().toDate(),
      TransactionType : "Return"
    });

    db.collection("Books").doc(this.state.scannedBookId).update({
      BookAvailability : true
    });

    db.collection("StudentsId").doc(this.state.scannedStudentId).update({
      NumberOfBooksIssued : firebase.firestore.FieldValue.increment(-1)
    });

    // Alert.alert("Book returned");

    
  }

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;
 
    if(buttonState !== "normal" && hasCameraPermissions) {
      return(
        <BarCodeScanner 
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )
    }
    else if(buttonState === "normal") {
      return (
        
        <KeyboardAvoidingView style={styles.container}  behavior="padding" enabled>
          
          <View style={styles.container}>
          <View>
            <Image 
              source={require("../assets/booklogo.jpg")}
              style={{width : 100, height : 100}}
            />
            <Text style={{textAlign : "center", fontSize : 30}}>Wily</Text>
          </View>

          <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox} 
              placeholder="Book Id" 
              onChangeText = {(text) => {
                this.setState({
                  scannedBookId : text
                });
              }}
              value={this.state.scannedBookId}
            />
            <TouchableOpacity style={styles.scanButton}
                onPress = {() => {this.getCameraPermissions("BookId")}}
            >
              <Text style={styles.buttonText}>Scan </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox} 
              placeholder="Student Id" 
              onChangeText = {(text) => {
                this.setState({
                  scannedStudentId : text
                });
              }}
              value={this.state.scannedStudentId}
            />
            <TouchableOpacity style={styles.scanButton}
                onPress = {() => {this.getCameraPermissions("StudentId")}}
            >
              <Text style={styles.buttonText}>Scan </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton}
            onPress={this.handleTransaction}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          </View>
          
        </KeyboardAvoidingView>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems : "center",
    justifyContent : "center"
  }, 
  displayText : {
    fontSize : 15,
    textDecorationLine : "underline"
  },
  scanButton : {
    backgroundColor : "aqua",
    justifyContent : "center",
    width : 50,
    borderWidth : 1.5,
    borderLeftWidth : 0
  },
  buttonText : {
    fontSize : 20,
    fontWeight : "bold",
    textAlign : "center",
    
  },
  inputBox : {
    width : 200,
    height : 40,
    borderWidth : 1.5,
    fontSize : 20,
    borderRightWidth : 0
  },
  inputView : {
    flexDirection : "row",
    margin : 20
  },
  submitButton : {
    backgroundColor : "#FBC02D",
    width : 100,
    height : 50
  }, 
  submitButtonText : {
    textAlign : "center",
    fontSize : 25,
    fontWeight : "bold",
    padding : 5,
    color : "white"
  }
});