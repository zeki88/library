class Book {
    constructor(title, author, pages, read) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.read = read;
      this.id = getId();
    }
  }
    
  let count = 0;
  let myLibrary = [];
  const form = document.querySelector('form')
  const cards = document.getElementById('cards')
  const button_add_book = document.getElementById('button_add_book')
  const book_form = document.getElementById('book_form')
  const inputs = document.querySelectorAll('#book_add input');
  const errorFields = {
    title: document.getElementById('error_title'),
    author: document.getElementById('error_author'),
    pages: document.getElementById('error_pages')
  };
  const fields = ['title', 'author', 'pages'];
  
  const expressions = {
    title: /^.{1,60}$/,
    author: /^[a-zA-ZÀ-ÿ\s]{1,60}$/,
    pages: /^[0-9]{1,4}$/,
  }
  
  function addBookToLibrary() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read').checked;
    const book = new Book(title, author, pages, read)
    myLibrary.push(book);
    createBookCard(book.id);
    localStorage.setItem('books', JSON.stringify(myLibrary));
  }
  
  function validateField(fieldName, value) {
    const isValid = expressions[fieldName].test(value);
    errorFields[fieldName].classList.toggle('error_title', !isValid);
    document.getElementById(fieldName).classList.toggle('input_error', !isValid);
    return isValid;
  }
  
  function createBookCard(id) {
    const bookCard = document.createElement('div')
    const title = document.createElement('p')
    const author = document.createElement('p')
    const pages = document.createElement('p')
    const read = document.createElement ('button')
    const remove = document.createElement ('button')

    bookCard.classList.add('book')
    bookCard.setAttribute('id', id)
    title.textContent = getBook(id).title
    author.textContent = getBook(id).author
    pages.textContent = getBook(id).pages

    if (getBook(id).read) {
        read.textContent = 'Read'
        read.classList.add('read')
    } else {
        read.textContent = 'Not read'
        read.classList.add('not-read')
    }

    read.addEventListener('click', getRead)
 
    remove.textContent = 'Remove'
    remove.addEventListener('click', removeBook)

    bookCard.appendChild(title)
    bookCard.appendChild(author)
    bookCard.appendChild(pages)
    bookCard.appendChild(read)
    bookCard.appendChild(remove)
    cards.appendChild(bookCard)
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValidForm = fields.every(fieldName => validateField(fieldName, document.getElementById(fieldName).value));
    if (isValidForm) {
      addBookToLibrary();
      form.reset();
      book_form.style.display = 'none';
      document.getElementById('blur').style.display = 'none';
      document.getElementById('fill').classList.remove('fill_display')
    } else {
      document.getElementById('fill').classList.add('fill_display')
    }
  })
  
  button_add_book.addEventListener('click', () => {
    book_form.style.display = 'flex';
    document.getElementById('blur').style.display = 'flex';
  })
  
  inputs.forEach((input) => {
    input.addEventListener('keyup', (e) => validateField(e.target.name, e.target.value));
    input.addEventListener('blur', (e) => validateField(e.target.name, e.target.value));
  });

  function getId() {
      return count += 1;
  };

  function getBook(id) {
    return myLibrary.find((book) => book.id === Number(id));
  }
  
  function getRead(e) {
    const id = e.currentTarget.parentElement.id;
    const readButton = e.currentTarget
      if (getBook(id).read === false) {
        readButton.classList.add('read')
        readButton.textContent = 'Read'
        readButton.classList.remove('not-read')
        getBook(id).read = true
      } else {
        readButton.textContent = 'Not read'
        readButton.classList.add('not-read')
        readButton.classList.remove('read')
        getBook(id).read = false
      }
      updateLocal()
  }

  function removeBook (e) {
    const id = e.currentTarget.parentElement.id;
    cards.removeChild(e.currentTarget.parentElement)
    const index = myLibrary.indexOf(getBook(id))
    myLibrary.splice(index, 1)
    updateLocal()
  }

  function updateLocal () {
    localStorage.setItem('books', JSON.stringify(myLibrary));
  }

  function initialize() {
    if (localStorage.getItem('books')) {
      myLibrary = JSON.parse(localStorage.getItem('books'))
      myLibrary.forEach((book) => {
        createBookCard(book.id)
      })
    }

    if (myLibrary[myLibrary.length-1]) {
      count = myLibrary[myLibrary.length-1].id
    }
  }

  initialize()