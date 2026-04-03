#ifndef STUDENT_H
#define STUDENT_H

#include "Person.h"
#include <string>
using namespace std;

class Student : public Person {
private:
    string rollNumber;
    string department;
    int activeBorrows;
    int maxBorrowLimit;

public:
    Student(string id, string name, string email, string password, string phone,
            string roll, string dept, int activeBorrows = 0, string dateRegistered = "");

    string getRole() const override;
    void display() const override;
    string serialize() const override;

    static Student deserialize(const string& line);

    bool canBorrow() const;
    void incrementBorrows();
    void decrementBorrows();

    string getRollNumber() const;
    string getDepartment() const;
    int getActiveBorrows() const;
    string getId() const { return id; }
};

#endif // STUDENT_H
