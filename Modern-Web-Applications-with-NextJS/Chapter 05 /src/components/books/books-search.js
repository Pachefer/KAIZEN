import { useRef } from 'react';

import Button from '../ui/button';
import classes from './books-search.module.css';

function BooksSearch(props) {
  const yearInputRef = useRef();
  const monthInputRef = useRef();
  const nameInputRef = useRef();
  const authorNameInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();
    const bookName = nameInputRef.current.value;
    const authorName = authorNameInputRef.current.value;
    console.log('book name ->', bookName, ' author name  ->', authorName);
    // const selectedYear = yearInputRef.current.value;
    // const selectedYear = monthInputRef.current.value;
    //  console.log('selectedYear ->', year, ' selectedMonth  ->', month);
    
props.onSearch(bookName, authorName);



    
    // props.onSearch(selectedYear, selectedYear);
    
    
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.controls}>
        <div className={classes.control}>
  <label htmlFor="book-name">Book Name</label>
  <input id="book-name" ref={nameInputRef} />
</div>
<div className={classes.control}>
  <label htmlFor="author-name">Author Name</label>
  <input id="author-name" ref={authorNameInputRef} />
</div>
      </div>
      <Button>Find Book</Button>
    </form>
  );
}

export default BooksSearch;
