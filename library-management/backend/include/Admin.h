#ifndef ADMIN_H
#define ADMIN_H

#include "Person.h"
#include <string>
using namespace std;

class Admin : public Person {
private:
    string adminLevel; // "SUPER" or "STANDARD"

public:
    Admin(string id, string name, string email, string password, string phone,
          string level = "STANDARD", string dateRegistered = "");

    string getRole() const override;
    void display() const override;
    string serialize() const override;

    static Admin deserialize(const string& line);

    string getAdminLevel() const;
    string getId() const { return id; }
};

#endif // ADMIN_H
