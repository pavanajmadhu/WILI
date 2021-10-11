import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCJkUSDh1FG6rBxUwpXjwC7p0DmqaQ43JQ",
  authDomain: "wily-b7ada.firebaseapp.com",
  projectId: "wily-b7ada",
  storageBucket: "wily-b7ada.appspot.com",
  messagingSenderId: "463591533146",
  appId: "1:463591533146:web:f8f4ee1b3502b786fe4663"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();