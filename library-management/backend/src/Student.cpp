#include "Student.h"
#include <iostream>
#include <sstream>

Student::Student(string id, string name, string email, string password, string phone,
                 string roll, string dept, int activeBorrows, string dateRegistered)
    : Person(id, name, email, password, phone, dateRegistered),
      rollNumber(roll), department(dept), activeBorrows(activeBorrows), maxBorrowLimit(3) {}

string Student::getRole() const { return "STUDENT"; }

void Student::display() const {
    cout << "Student [" << id << "] " << name << " | " << rollNumber
         << " | " << department << " | Borrows: " << activeBorrows << "/" << maxBorrowLimit << endl;
}

string Student::serialize() const {
    return id + "|" + name + "|" + email + "|" + passwordHash + "|" + phone + "|"
           + rollNumber + "|" + department + "|" + to_string(activeBorrows) + "|" + dateRegistered;
}

Student Student::deserialize(const string& line) {
    stringstream ss(line);
    string id, name, email, password, phone, roll, dept, borrowsStr, dateReg;
    getline(ss, id, '|');
    getline(ss, name, '|');
    getline(ss, email, '|');
    getline(ss, password, '|');
    getline(ss, phone, '|');
    getline(ss, roll, '|');
    getline(ss, dept, '|');
    getline(ss, borrowsStr, '|');
    getline(ss, dateReg, '|');
    // Trim
    while (!dateReg.empty() && (dateReg.back() == '\n' || dateReg.back() == '\r' || dateReg.back() == ' ')) {
        dateReg.pop_back();
    }
    int borrows = 0;
    try { borrows = stoi(borrowsStr); } catch (...) {}
    return Student(id, name, email, password, phone, roll, dept, borrows, dateReg);
}

bool Student::canBorrow() const { return activeBorrows < maxBorrowLimit; }

void Student::incrementBorrows() { activeBorrows++; }

void Student::decrementBorrows() {
    if (activeBorrows > 0) activeBorrows--;
}

string Student::getRollNumber() const { return rollNumber; }
string Student::getDepartment() const { return department; }
int Student::getActiveBorrows() const { return activeBorrows; }
