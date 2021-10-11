import React, { Component } from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import db from '../config';

export default class SearchScreen extends Component {
  constructor() {
    super();
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null,
      searchId: '',
    };
  }
  searchTransaction = async () => {
    this.setState({
      lastVisibleTransaction: null,
      allTransactions: [],
    });
    var firstLetter = this.state.searchId.split('')[0];
    console.log(firstLetter);
    if (firstLetter === 'B') {
      const query = await db
        .collection('Transactions')
        .where('BookId', '==', this.state.searchId)
        .limit(6)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    } else if (firstLetter === 'S') {
      const query = await db
        .collection('Transactions')
        .where('StudentId', '==', this.state.searchId)
        .limit(6)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    }
  };

  componentDidMount = async () => {
    const query = await db.collection('Transactions').limit(6).get();
    query.docs.map((doc, index) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc,
      });
    });
  };

  fetchMoreTransactions = async () => {
    var firstLetter = this.state.searchId.split('')[0];
    console.log(firstLetter);
    if (firstLetter === 'B') {
      const query = await db
        .collection('Transactions')
        .where('BookId', '==', this.state.searchId)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(6)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    } else if (firstLetter === 'S') {
      const query = await db
        .collection('Transactions')
        .where('StudentId', '==', this.state.searchId)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(6)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    }
  };

  render() {
    return (
      <View>
        <View style={styles.view}>
          <TextInput
            style={styles.textinput}
            placeholder={'enter Book/Student ID'}
            value={this.state.searchId}
            onChangeText={(text) => {
              this.setState({
                searchId: text,
              });
            }}></TextInput>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={this.searchTransaction}>
            <Text> search</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.allTransactions}
          renderItem={({ item }) => {
            return (
              <View style={{ borderBottomWidth: 2 }}>
                <Text>{'Book Id : ' + item.BookId}</Text>
                <Text>{'Student Id : ' + item.StudentId}</Text>
                <Text>{'Transaction Type : ' + item.transactionType}</Text>
                <Text>{'Date : ' + item.Date.toDate()}</Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          onEndReached={this.fetchMoreTransactions}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    borderWidth: 2,
    width: 200,
    height: 30,
    marginLeft: 20,
  },
  searchButton: {
    width: 50,
    height: 30,
    backgroundColor: 'lightblue',
    marginLeft: 20,
    justifyContent: 'CENTER',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'CENTER',
  },
});
