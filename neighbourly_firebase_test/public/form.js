var firebaseConfig = {
apiKey: "AIzaSyB7a44l0zXx7mJVyeiw1FNarr2mrq56WCc",
authDomain: "ordinal-reason-280014.firebaseapp.com",
databaseURL: "https://ordinal-reason-280014.firebaseio.com",
projectId: "ordinal-reason-280014",
storageBucket: "ordinal-reason-280014.appspot.com",
messagingSenderId: "420048105649",
appId: "1:420048105649:web:ef7d8fb8d62ca0f959b290",
measurementId: "G-T050Y2CMXH"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

// Sign-In
function signIn() {
    var email = document.getElementById('logInEmail');
    var password = document.getElementById('logInPassword');

    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
}

// Sign-Out
function signOut() {
    auth.signOut();
    
    firstName.value = null;
    lastName.value = null;
    age.value = null;
    city.value = null;  
    email.value = null;    
    password.value = null;
}

// Opens Registeration Form
function register() {
    whenSignedIn.hidden = true;
    whenRegistering.hidden = false;
    whenSignedOut.hidden = true;
}

// Adds User Info to Database
    // References 'users' Database
const usersRef = db.collection('users');

function signUp() {
    var email = document.getElementById('signUpEmail');
    var password = document.getElementById('signUpPassword');

    var firstName = document.getElementById('firstName');
    var lastName = document.getElementById('lastName');
    var age = document.getElementById('age');
    var city = document.getElementById('city');
    
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value).then(function(userCredential) {
        usersRef.doc(`${userCredential.user.uid}`).set({
            uid: userCredential.user.uid,
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            city: city.value
        })
    });    
    promise.catch(e => alert(e.message));
}

// Adjusts Page Content when User Logs-in/out
auth.onAuthStateChanged(user => {
    if (user) {
        whenSignedOut.hidden = true;
        whenSignedIn.hidden = false;
        whenRegistering.hidden = true;

        db.collection("users").where("uid", "==", user.uid)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                const userData = doc.data();
                userName.innerHTML += userData.firstName + " " + userData.lastName;
                displayEmail.innerHTML += user.email;
                displayAge.innerHTML += userData.age;
                displayCity.innerHTML += userData.city;
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    } else {
        whenSignedOut.hidden = false;
        whenSignedIn.hidden = true;
        whenRegistering.hidden = true;
    }
});