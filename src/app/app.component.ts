import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'koo';
  public isMenuCollapsed = true;

  constructor(public auth: AngularFireAuth) {
  }
  login() {
    const provider = new auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    auth().signInWithRedirect(provider);
  }
  logout() {
    this.auth.signOut();
  }
}

/*

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA3wloJ91pfrgzj6Hri6LhCDQP1nXllLvY",
    authDomain: "auth.koo.mintyapps.pl",
    databaseURL: "https://formal-vortex-233909.firebaseio.com",
    projectId: "formal-vortex-233909",
    storageBucket: "formal-vortex-233909.appspot.com",
    messagingSenderId: "471260100108",
    appId: "1:471260100108:web:e893fab432f73ff1cfa029"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

firebase.auth().getRedirectResult().then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
  console.log('dziaĹa');
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
// console.error('no nie dziaĹa');
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log(user);
  } else {
    // No user is signed in.
    auth();
  }
});

*/