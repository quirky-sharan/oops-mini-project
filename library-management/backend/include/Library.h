#ifndef LIBRARY_H
#define LIBRARY_H

#include "FileHandler.h"
#include "Book.h"
#include "Student.h"
#include "Admin.h"
#include "Transaction.h"
#include "Reservation.h"
#include "Fine.h"
#include "json.hpp"

using json = nlohmann::json;

class Library {
private:
    FileHandler<Book> bookHandler;
    FileHandler<Student> studentHandler;
    FileHandler<Admin> adminHandler;
    FileHandler<Transaction> txHandler;
    FileHandler<Reservation> resHandler;
    FileHandler<Fine> fineHandler;

    string dataPath;

    // Helpers
    string getCurrentDate() const;
    string addDays(const string& date, int days) const;
    int daysBetween(const string& from, const string& to) const;
    double calculateFineAmount(int daysOverdue) const;
    string generateId(const string& prefix) const;
    void seedDataIfEmpty();

    // Polymorphism demonstration
    void demonstratePolymorphism() const;

public:
    Library(const string& dataPath);

    // Auth
    json login(const json& inputData);

    // Book ops
    json addBook(const json& bookData);
    json deleteBook(const string& bookId);
    json updateBook(const string& bookId, const json& data);

    // Member ops
    json addMember(const json& memberData);
    json deleteMember(const string& memberId);

    // Circulation
    json issueBook(const string& bookId, const string& memberId);
    json returnBook(const string& transactionId);

    // Reservations
    json reserveBook(const string& bookId, const string& memberId);
    json cancelReservation(const string& reservationId);

    // Fines
    json calculateAllFines();
    json payFine(const string& fineId);
};

#endif // LIBRARY_H
