#ifndef PERSON_H
#define PERSON_H

#include <string>
using namespace std;

class Person {
protected:
    string id;
    string name;
    string email;
    string passwordHash;
    string phone;
    string dateRegistered;

public:
    Person(string id, string name, string email, string password, string phone, string dateRegistered = "");
    virtual ~Person() = default;

    // Pure virtual — must be overridden
    virtual string getRole() const = 0;
    virtual void display() const = 0;
    virtual string serialize() const = 0;

    // Concrete
    string getId() const;
    string getName() const;
    string getEmail() const;
    string getPhone() const;
    string getDateRegistered() const;
    bool verifyPassword(const string& pwd) const;

    // Friend function: compare two persons by name alphabetically
    friend bool compareByName(const Person& a, const Person& b);
};

#endif // PERSON_H
