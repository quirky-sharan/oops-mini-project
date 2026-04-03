#include "Person.h"
#include <iostream>

Person::Person(string id, string name, string email, string password, string phone, string dateRegistered)
    : id(id), name(name), email(email), passwordHash(password), phone(phone), dateRegistered(dateRegistered) {}

string Person::getId() const { return id; }
string Person::getName() const { return name; }
string Person::getEmail() const { return email; }
string Person::getPhone() const { return phone; }
string Person::getDateRegistered() const { return dateRegistered; }

bool Person::verifyPassword(const string& pwd) const {
    return passwordHash == pwd;
}

// Friend function: compare two persons by name alphabetically
bool compareByName(const Person& a, const Person& b) {
    return a.name < b.name;
}
