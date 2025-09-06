import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getAllBools, getBookById, getFeaturedBooks, getFilteredBooks } from '../../helpers/api-util';
import BookList from '../../components/books/book-list';
import BooksSearch from '../../components/books/books-search';

function AllBooksPage(props) {
  const router = useRouter();
  const { books } = props;

  // function findEventsHandler(year, month) {
  //   const fullPath = `/books/${year}/${month}`;

  //   router.push(fullPath);
  // }

  function findEventsHandler(bookName, authorName) {
  const fullPath = `/books?name=${encodeURIComponent(bookName)}&author=${encodeURIComponent(authorName)}`;
  router.push(fullPath);
}

// Filtrado por query params
  const { name, author } = router.query;
  let filteredBooks = books;

  if (name || author) {
    filteredBooks = books.filter(book => {
      const matchesName = name ? book.title.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesAuthor = author ? book.authorName.toLowerCase().includes(author.toLowerCase()) : true;
      return matchesName && matchesAuthor;
    });
  }


  return (
    <Fragment>
      <Head>
        <title>All Books - Your Website Name</title>
        <meta
          name="description"
          content="Browse and search for books in our collection"
        />
      </Head>
      <BooksSearch onSearch={findEventsHandler} />
      {/* <BookList items={Books} /> */}
      <BookList items={filteredBooks} />
    </Fragment>
  );
}

export async function getStaticProps() {
  const books = await getAllBools();
  console.log('books ->', books);
  
  //TMP PACHEFER
const featuredBooks = await getFeaturedBooks(); 
console.log('featuredBooks ->', featuredBooks);

//const bookById = await getBookById('b1');
//  const book = await getBookById('b1');
// console.log('bookById ->', book);

// const nameFilter={bookName: 'The Lost City', authorName: 'David Anderson'};
// const filteredBooks = await getFilteredBooks(nameFilter);
// console.log('filteredBooks ->', filteredBooks);


//END TMP PACHEFER
  return {
    props: {
      books: books,
    },
    revalidate: 60,
  };
}

export default AllBooksPage;
