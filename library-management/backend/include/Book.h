#ifndef BOOK_H
#define BOOK_H

#include "LibraryItem.h"
#include <string>
using namespace std;

class Book : public LibraryItem {
private:
    string isbn;
    string publisher;
    int totalCopies;
    int availableCopies;
    string language;

public:
    Book(string id, string isbn, string title, string author, int year,
         string genre, string publisher, int totalCopies, string language = "English");

    string getType() const override;
    string getDetails() const override;
    string serialize() const override;

    static Book deserialize(const string& line);

    bool isAvailable() const;
    void issueOneCopy();
    void returnOneCopy();
    int getAvailableCopies() const;
    int getTotalCopies() const;
    string getISBN() const;
    string getPublisher() const;
    string getLanguage() const;
    string getId() const { return itemId; }

    // Operator overloading
    bool operator<(const Book& other) const;
    bool operator==(const Book& other) const;

    // Friend: compare by availability
    friend bool compareByAvailability(const Book& a, const Book& b);
};

#endif // BOOK_H
