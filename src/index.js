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
} from 'firebase/firestore';

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

// collection ref
const colRef = collection(db, 'books');

//queries
const q = query(colRef, where('author', '==', 'various'));

// get real time collection data
onSnapshot(q, (snapshot) => {
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
