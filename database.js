const firebaseConfig = {
    apiKey: "AIzaSyBd7z644_giN5TX9lv5T1AdHfp1ilwsrbA",
    authDomain: "revercial-43fe3.firebaseapp.com",
    databaseURL: "https://revercial-43fe3-default-rtdb.firebaseio.com",
    projectId: "revercial-43fe3",
    storageBucket: "revercial-43fe3.appspot.com",
    messagingSenderId: "277923181143",
    appId: "1:277923181143:web:17230c5cdb451126146912",
    measurementId: "G-4VYLQMSHKR"
  };

  // initialize firebase
  firebaseConfig.initializeApp(firebaseConfig);
  
 firebase.auth().onAuthStateChanged(function(user) {
    var notLoggedIn = document.getElementById('not-logged-in')
    var loggedIn = document.getElementById('logged-in')
    if (user) {
      // User is signed in
      loggedIn.style.display = 'block'
      notLoggedIn.style.display = 'none'
    } else {
      // User is signed out
      loggedIn.style.display = 'none'
      notLoggedIn.style.display = 'blocked'
    }
  });

  function login(event) {
    event.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error)
    {
        //Handle errors 
        console.log('Error signing in,',error.message)
        alert(error.message)
    }).then(function (user)
    {
        if(user)
        alert('Welcome back, you are now logged in!')
    })
  }
