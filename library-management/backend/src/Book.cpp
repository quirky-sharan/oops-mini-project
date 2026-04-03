#include "Book.h"
#include <iostream>
#include <sstream>

Book::Book(string id, string isbn, string title, string author, int year,
           string genre, string publisher, int totalCopies, string language)
    : LibraryItem(id, title, author, year, genre),
      isbn(isbn), publisher(publisher), totalCopies(totalCopies),
      availableCopies(totalCopies), language(language) {}

string Book::getType() const { return "BOOK"; }

string Book::getDetails() const {
    return "Book: " + title + " by " + author + " (ISBN: " + isbn + ") "
           + "[" + to_string(availableCopies) + "/" + to_string(totalCopies) + " available]";
}

string Book::serialize() const {
    return itemId + "|" + isbn + "|" + title + "|" + author + "|" + to_string(year) + "|"
           + genre + "|" + publisher + "|" + to_string(totalCopies) + "|"
           + to_string(availableCopies) + "|" + language + "|" + status;
}

Book Book::deserialize(const string& line) {
    stringstream ss(line);
    string id, isbn, title, author, yearStr, genre, publisher, totalStr, availStr, lang, status;
    getline(ss, id, '|');
    getline(ss, isbn, '|');
    getline(ss, title, '|');
    getline(ss, author, '|');
    getline(ss, yearStr, '|');
    getline(ss, genre, '|');
    getline(ss, publisher, '|');
    getline(ss, totalStr, '|');
    getline(ss, availStr, '|');
    getline(ss, lang, '|');
    getline(ss, status, '|');
    // Trim
    while (!status.empty() && (status.back() == '\n' || status.back() == '\r' || status.back() == ' ')) {
        status.pop_back();
    }

    int yr = 0, total = 0, avail = 0;
    try { yr = stoi(yearStr); } catch (...) {}
    try { total = stoi(totalStr); } catch (...) {}
    try { avail = stoi(availStr); } catch (...) {}

    Book book(id, isbn, title, author, yr, genre, publisher, total, lang);
    book.availableCopies = avail;
    book.status = status;
    return book;
}

bool Book::isAvailable() const { return availableCopies > 0; }

void Book::issueOneCopy() {
    if (availableCopies > 0) {
        availableCopies--;
        if (availableCopies == 0) {
            status = "ISSUED";
        }
    }
}

void Book::returnOneCopy() {
    if (availableCopies < totalCopies) {
        availableCopies++;
        if (availableCopies > 0) {
            status = "AVAILABLE";
        }
    }
}

int Book::getAvailableCopies() const { return availableCopies; }
int Book::getTotalCopies() const { return totalCopies; }
string Book::getISBN() const { return isbn; }
string Book::getPublisher() const { return publisher; }
string Book::getLanguage() const { return language; }

bool Book::operator<(const Book& other) const { return title < other.title; }
bool Book::operator==(const Book& other) const { return itemId == other.itemId; }

// Friend: compare by availability
bool compareByAvailability(const Book& a, const Book& b) {
    return a.availableCopies > b.availableCopies;
}
