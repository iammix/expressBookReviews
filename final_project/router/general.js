const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

public_users.get("/books", async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        const booksList = response.data;
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books list", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const ISBN = req.params.isbn;
    return res.send(books[ISBN]);
});

public_users.get("/isbn/:isbn", async (req, res) => {
    const ISBN = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${ISBN}`);
        const bookDetails = response.data;
        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(500).json({ message: `Error retrieving details for ISBN ${ISBN}`, error: error.message });
    }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    console.log(author);
    const result={};
    const ISBN = Object.keys(books);
    for (let i=0; i < ISBN.length; i++) {
        const isbn = ISBN[i];
        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    }
    console.log(result);
    if(Object.keys(result).length > 0){
        return res.send(JSON.stringify(result, null, 4))
    }
    return res.status(404).json({message: "author not found"});
});

public_users.get("/author/:author", async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        const booksByAuthor = response.data;
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(500).json({ message: `Error retrieving books by author ${author}`, error: error.message });
    }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    console.log(title)
    const ISBN = Object.keys(books)
    for (let i=0; i<ISBN.length; i++){
        isbn = ISBN[i]
        if ( books[isbn].title === title){
            return res.send(books[isbn])
        }
    }
    return res.status(404).json({message: "title not found"});
});

public_users.get("/title/:title", async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        const booksByTitle = response.data;
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(500).json({ message: `Error retrieving books by title ${title}`, error: error.message });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews)
});

module.exports.general = public_users;
