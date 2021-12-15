import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAlDhrhSPN3TZqX4wKmxmJwd8RpilVBCWc',
  authDomain: 'fir-9-dojo-61eca.firebaseapp.com',
  projectId: 'fir-9-dojo-61eca',
  storageBucket: 'fir-9-dojo-61eca.appspot.com',
  messagingSenderId: '48868517322',
  appId: '1:48868517322:web:126b7655f51173097adb33',
};

// init firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, 'books');

//queries
const q = query(colRef, orderBy('createdAt'));

// get real time collection data
// callback function to onSnapshot takes the snapshot and is called
// whenever the data changes in firestore (and once initially)
const unsubCollection = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

//   // get one-time collection data
// getDocs(colRef)
// .then((snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// })
// .catch((err) => {
//   console.error(err.message);
// });

// adding docs
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => addBookForm.reset());
});

// deleting docs
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let bookID = deleteBookForm.id.value;
  const docRef = doc(db, 'books', bookID);
  deleteDoc(docRef).then(() => deleteBookForm.reset());
});

// getting single doc
const docRef = doc(db, 'books', 'x4hLTwzoGDBoEoMnegoi');

// getDoc(docRef)
// .then((doc) => {
//   console.log(doc.data(), doc.id)
// })

// get realtime data from single doc
const unsubDoc = onSnapshot(docRef, (doc) => console.log(doc.data(), doc.id));

// update a doc
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'books', updateForm.id.value);
  updateDoc(docRef, {
    title: updateForm.title.value,
  }).then(() => updateForm.reset());
});

// signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created: ', cred.user);
      signupForm.reset();
    })
    .catch((err) => console.error(err.message));
});

// logging in and out
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => console.log('user signed out'))
    .catch((err) => console.error(err.message));
});

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user logged in:', cred.user);
      loginForm.reset();
    })
    .catch((err) => console.error(err.message));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user);
});

//unsubscribing
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCollection();
  unsubDoc();
  unsubAuth();
});
