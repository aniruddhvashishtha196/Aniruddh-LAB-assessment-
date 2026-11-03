import http from "http";
import fs from "fs";

let books = [
    { id: 1, title: "Alchemist", author: "Paulo", price: 350 },
    { id: 2, title: "Wings of Fire", author: "Kalam", price: 250 }
];

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {
        res.end("<h1>Welcome to Library</h1>");
    }

    else if (req.method === "GET" && req.url === "/books") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(books));
    }

    else if (req.method === "GET" && req.url === "/about") {
        res.end("Library Management Application");
    }

    else if (req.method === "GET" && req.url === "/home") {

        fs.readFile("public/index.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("File error");
            } else {
                res.setHeader("Content-Type", "text/html");
                res.end(data);
            }
        });

    }

    else if (req.method === "POST" && req.url === "/add-book") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                let book = JSON.parse(body);

                if (!book.id || !book.title || !book.author ||
                    book.price === undefined || !Number.isFinite(Number(book.price))) {
                    res.writeHead(400);
                    return res.end("Invalid book details");
                }

                books.push(book);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Book added successfully",
                    book: book
                }));
            } catch {
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });

    }

    else {
        res.writeHead(404);
        res.end("Page not found");
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running on port 3000");
});