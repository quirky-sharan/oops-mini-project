#ifndef LIBRARYITEM_H
#define LIBRARYITEM_H

#include <string>
using namespace std;

class LibraryItem {
protected:
    string itemId;
    string title;
    string author;
    int year;
    string genre;
    string status; // "AVAILABLE", "ISSUED", "RESERVED"

public:
    LibraryItem(string id, string title, string author, int year, string genre);
    virtual ~LibraryItem() = default;

    virtual string getType() const = 0;
    virtual string getDetails() const = 0;
    virtual string serialize() const = 0;

    string getItemId() const;
    string getTitle() const;
    string getAuthor() const;
    int getYear() const;
    string getGenre() const;
    string getStatus() const;
    void setStatus(const string& s);

    // Friend function: print formatted details
    friend void printItemDetails(const LibraryItem& item);
};

#endif // LIBRARYITEM_H
