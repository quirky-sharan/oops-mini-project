#include "LibraryItem.h"
#include <iostream>

LibraryItem::LibraryItem(string id, string title, string author, int year, string genre)
    : itemId(id), title(title), author(author), year(year), genre(genre), status("AVAILABLE") {}

string LibraryItem::getItemId() const { return itemId; }
string LibraryItem::getTitle() const { return title; }
string LibraryItem::getAuthor() const { return author; }
int LibraryItem::getYear() const { return year; }
string LibraryItem::getGenre() const { return genre; }
string LibraryItem::getStatus() const { return status; }
void LibraryItem::setStatus(const string& s) { status = s; }

// Friend function: print formatted details
void printItemDetails(const LibraryItem& item) {
    cerr << "[ITEM] " << item.getType() << ": " << item.title
         << " by " << item.author << " (" << item.year << ") "
         << "[" << item.status << "]" << endl;
}
