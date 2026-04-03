#include "Admin.h"
#include <iostream>
#include <sstream>

Admin::Admin(string id, string name, string email, string password, string phone,
             string level, string dateRegistered)
    : Person(id, name, email, password, phone, dateRegistered), adminLevel(level) {}

string Admin::getRole() const { return "ADMIN"; }

void Admin::display() const {
    cout << "Admin [" << id << "] " << name << " (" << adminLevel << ")" << endl;
}

string Admin::serialize() const {
    return id + "|" + name + "|" + email + "|" + passwordHash + "|" + phone + "|" + adminLevel + "|" + dateRegistered;
}

Admin Admin::deserialize(const string& line) {
    stringstream ss(line);
    string id, name, email, password, phone, level, dateReg;
    getline(ss, id, '|');
    getline(ss, name, '|');
    getline(ss, email, '|');
    getline(ss, password, '|');
    getline(ss, phone, '|');
    getline(ss, level, '|');
    getline(ss, dateReg, '|');
    // Trim newline/whitespace from dateReg
    while (!dateReg.empty() && (dateReg.back() == '\n' || dateReg.back() == '\r' || dateReg.back() == ' ')) {
        dateReg.pop_back();
    }
    return Admin(id, name, email, password, phone, level, dateReg);
}

string Admin::getAdminLevel() const { return adminLevel; }
