"use client";

const googleBooksApiURL = "https://www.googleapis.com/books/v1/volumes/";
const googleBooksAPIKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API;

const googleBooksService = {
    searchBooks: async (query: string) => {
        try {
            const response = await fetch(`${googleBooksApiURL}/${query}/${googleBooksAPIKey}`, {
                method: "GET",
            });
            const data = response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error fetching data from Google Books API ", error);
            throw error;
        }
    },
    getBookDetails: async (id: string) => {
        try {
            const response = await fetch(`${googleBooksApiURL}/${id}/${googleBooksAPIKey}`, {
                method: "GET",
            });
            const data = response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error fetching book details from Google Books API ", error);
            throw error;
        }
    },
};

export default googleBooksService;