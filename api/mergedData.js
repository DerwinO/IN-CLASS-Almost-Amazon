// for merged promises
import { getSingleBook, deleteBook } from './bookData';
import { getAuthorBooks, getSingleAuthor, deleteSingleAuthor } from './authorData';

const getBookDetails = (firebaseKey) => new Promise((resolve, reject) => {
  // GET SINGLE BOOK
  getSingleBook(firebaseKey).then((bookObject) => { // returns single book object
    getSingleAuthor(bookObject.author_id) // we nest this promise so that we can use the book object
      .then((authorObject) => resolve({ ...bookObject, authorObject }));
  }).catch(reject);
  // GET AUTHOR
  // Create an object that has book data and an object named authorObject
});

// const getAuthorDetails = (firebaseKey) => new Promise((resolve, reject) => {
//   // GET SINGLE AUTHOR
//   getSingleAuthor(firebaseKey).then((authorObject) => {
//     getSingleAuthor(authorObject.book_id)
//       .then((bookObject) => resolve({ ...authorObject, bookObject }));
//   }).catch(reject);
// });

const deleteAuthorBooksRelationship = (firebaseKey) => new Promise((resolve, reject) => {
  getAuthorBooks(firebaseKey).then((authorBooksArray) => {
    const deleteBookPromises = authorBooksArray.map((book) => deleteBook(book.firebaseKey));

    Promise.all(deleteBookPromises).then(() => {
      deleteSingleAuthor(firebaseKey).then(resolve);
    });
  }).catch(reject);
});

const getAuthorDetails = async (firebaseKey) => { // the async keyword let's JS know this is asynchronous function (promise)
  const authorObject = await getSingleAuthor(firebaseKey); // await stops the code in this function and waits for the response. This is like using .then
  const authorBooks = await getAuthorBooks(firebaseKey); // this function uses the data response from the bookObject

  return { ...authorObject, books: authorBooks };
};

export { getBookDetails, getAuthorDetails, deleteAuthorBooksRelationship };
