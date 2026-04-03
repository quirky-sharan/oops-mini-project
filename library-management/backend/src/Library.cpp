#include "Library.h"
#include "Exceptions.h"
#include <ctime>
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <vector>
#include <iostream>
#include <fstream>
#include <random>

using json = nlohmann::json;

Library::Library(const string& dataPath)
    : dataPath(dataPath),
      bookHandler(dataPath + "/books.txt"),
      studentHandler(dataPath + "/members.txt"),
      adminHandler(dataPath + "/admins.txt"),
      txHandler(dataPath + "/transactions.txt"),
      resHandler(dataPath + "/reservations.txt"),
      fineHandler(dataPath + "/fines.txt") {
    seedDataIfEmpty();
}

// ========== HELPERS ==========

string Library::getCurrentDate() const {
    time_t now = time(nullptr);
    struct tm* t = localtime(&now);
    char buf[11];
    strftime(buf, sizeof(buf), "%Y-%m-%d", t);
    return string(buf);
}

string Library::addDays(const string& date, int days) const {
    int y, m, d;
    sscanf(date.c_str(), "%d-%d-%d", &y, &m, &d);
    struct tm t = {};
    t.tm_year = y - 1900;
    t.tm_mon = m - 1;
    t.tm_mday = d + days;
    t.tm_hour = 12;
    mktime(&t);
    char buf[11];
    strftime(buf, sizeof(buf), "%Y-%m-%d", &t);
    return string(buf);
}

int Library::daysBetween(const string& from, const string& to) const {
    int y1, m1, d1, y2, m2, d2;
    sscanf(from.c_str(), "%d-%d-%d", &y1, &m1, &d1);
    sscanf(to.c_str(), "%d-%d-%d", &y2, &m2, &d2);
    struct tm t1 = {}, t2 = {};
    t1.tm_year = y1 - 1900; t1.tm_mon = m1 - 1; t1.tm_mday = d1; t1.tm_hour = 12;
    t2.tm_year = y2 - 1900; t2.tm_mon = m2 - 1; t2.tm_mday = d2; t2.tm_hour = 12;
    time_t time1 = mktime(&t1);
    time_t time2 = mktime(&t2);
    return (int)difftime(time2, time1) / 86400;
}

double Library::calculateFineAmount(int daysOverdue) const {
    if (daysOverdue <= 0) return 0.0;
    double fine = 0.0;
    // Days 1-7: ₹2/day
    int tier1 = min(daysOverdue, 7);
    fine += tier1 * 2.0;
    // Days 8-14: ₹5/day
    if (daysOverdue > 7) {
        int tier2 = min(daysOverdue - 7, 7);
        fine += tier2 * 5.0;
    }
    // Days 15+: ₹10/day
    if (daysOverdue > 14) {
        int tier3 = daysOverdue - 14;
        fine += tier3 * 10.0;
    }
    return fine;
}

string Library::generateId(const string& prefix) const {
    // Generate based on timestamp + random
    static mt19937 rng(static_cast<unsigned>(time(nullptr)));
    uniform_int_distribution<int> dist(100, 999);
    time_t now = time(nullptr);
    int r = dist(rng);
    return prefix + to_string(now % 100000) + to_string(r);
}

// ========== POLYMORPHISM DEMONSTRATION ==========
void Library::demonstratePolymorphism() const {
    // Demonstrate runtime polymorphism with vector<Person*>
    vector<Person*> people;
    
    auto admins = adminHandler.readAll();
    auto students = studentHandler.readAll();
    
    // Store Admin* and Student* in Person* vector
    vector<Admin> adminStorage = admins;
    vector<Student> studentStorage = students;
    
    for (auto& a : adminStorage) {
        people.push_back(&a);
    }
    for (auto& s : studentStorage) {
        people.push_back(&s);
    }
    
    // Virtual dispatch — calls the correct getRole() for each
    for (const auto* person : people) {
        // This call is polymorphic — resolves at runtime
        cerr << "[POLY] " << person->getName() << " -> Role: " << person->getRole() << endl;
    }
}

// ========== SEED DATA ==========
void Library::seedDataIfEmpty() {
    // Check if books.txt exists and has content
    ifstream checkFile(dataPath + "/books.txt");
    bool needsSeed = !checkFile.is_open();
    if (checkFile.is_open()) {
        checkFile.seekg(0, ios::end);
        needsSeed = (checkFile.tellg() == 0);
        checkFile.close();
    }

    if (!needsSeed) return;

    // Seed books
    {
        ofstream f(dataPath + "/books.txt");
        f << "BK001|978-0-7432-7356-5|To Kill a Mockingbird|Harper Lee|1960|Classic Fiction|Grand Central Publishing|3|3|English|AVAILABLE\n";
        f << "BK002|978-0-7432-7357-2|1984|George Orwell|1949|Dystopian Fiction|Signet Classic|4|3|English|AVAILABLE\n";
        f << "BK003|978-0-06-112008-4|The Great Gatsby|F. Scott Fitzgerald|1925|Classic Fiction|Scribner|2|2|English|AVAILABLE\n";
        f << "BK004|978-0-14-028329-7|The Catcher in the Rye|J.D. Salinger|1951|Literary Fiction|Little, Brown|3|2|English|AVAILABLE\n";
        f << "BK005|978-0-545-01022-1|Harry Potter and the Sorcerer's Stone|J.K. Rowling|1997|Fantasy|Scholastic|5|4|English|AVAILABLE\n";
        f << "BK006|978-0-06-093546-9|The Kite Runner|Khaled Hosseini|2003|Literary Fiction|Riverhead Books|3|3|English|AVAILABLE\n";
        f << "BK007|978-0-316-76948-0|The Catcher in the Rye|J.D. Salinger|1951|Literary Fiction|Little Brown|3|1|English|ISSUED\n";
        f << "BK008|978-0-374-52954-0|Introduction to Algorithms|Cormen, Leiserson, Rivest|2009|Computer Science|MIT Press|4|4|English|AVAILABLE\n";
        f << "BK009|978-0-13-110362-7|The C Programming Language|Brian W. Kernighan|1988|Computer Science|Prentice Hall|3|3|English|AVAILABLE\n";
        f << "BK010|978-0-201-63361-0|Design Patterns|Erich Gamma|1994|Computer Science|Addison-Wesley|2|1|English|ISSUED\n";
        f << "BK011|978-0-679-72020-1|Crime and Punishment|Fyodor Dostoevsky|1866|Classic Fiction|Vintage|2|2|English|AVAILABLE\n";
        f << "BK012|978-0-14-303943-3|Sapiens: A Brief History of Humankind|Yuval Noah Harari|2011|Non-Fiction|Harper Perennial|4|4|English|AVAILABLE\n";
        f.close();
    }

    // Seed members
    {
        ofstream f(dataPath + "/members.txt");
        f << "STU001|Aanya Sharma|aanya@college.edu|pass123|9876543210|CS2021001|Computer Science|1|2024-01-10\n";
        f << "STU002|Rohan Mehta|rohan@college.edu|pass123|9876543211|CS2021002|Computer Science|0|2024-01-10\n";
        f << "STU003|Priya Nair|priya@college.edu|pass123|9876543212|EC2021001|Electronics|2|2024-01-12\n";
        f << "STU004|Arjun Patel|arjun@college.edu|pass123|9876543213|ME2021001|Mechanical|0|2024-01-15\n";
        f << "STU005|Divya Krishnan|divya@college.edu|pass123|9876543214|CS2021003|Computer Science|1|2024-01-20\n";
        f.close();
    }

    // Seed admins
    {
        ofstream f(dataPath + "/admins.txt");
        f << "ADM001|Dr. Ramesh Kumar|admin@library.edu|admin123|9800000001|SUPER|2023-06-01\n";
        f.close();
    }

    // Seed transactions
    {
        ofstream f(dataPath + "/transactions.txt");
        f << "TX001|BK007|STU001|2024-03-01|2024-03-15|NULL|ACTIVE\n";
        f << "TX002|BK010|STU003|2024-03-05|2024-03-19|NULL|ACTIVE\n";
        f << "TX003|BK002|STU005|2024-02-10|2024-02-24|2024-02-22|RETURNED\n";
        f << "TX004|BK005|STU002|2024-02-15|2024-03-01|2024-03-01|RETURNED\n";
        f << "TX005|BK001|STU003|2024-03-10|2024-03-24|NULL|ACTIVE\n";
        f.close();
    }

    // Seed reservations (empty)
    {
        ofstream f(dataPath + "/reservations.txt");
        f.close();
    }

    // Seed fines
    {
        ofstream f(dataPath + "/fines.txt");
        f << "FN001|TX001|STU001|14.00|PENDING|2024-03-20|NULL\n";
        f.close();
    }
}

// ========== AUTH ==========
json Library::login(const json& inputData) {
    string email = inputData.value("email", "");
    string password = inputData.value("password", "");

    // Check admins first
    auto admins = adminHandler.readAll();
    for (const auto& admin : admins) {
        if (admin.getEmail() == email && admin.verifyPassword(password)) {
            // Demonstrate polymorphism on login
            demonstratePolymorphism();
            return {
                {"success", true},
                {"userId", admin.getId()},
                {"name", admin.getName()},
                {"role", "ADMIN"},
                {"email", admin.getEmail()},
                {"adminLevel", admin.getAdminLevel()}
            };
        }
    }

    // Check students
    auto students = studentHandler.readAll();
    for (const auto& student : students) {
        if (student.getEmail() == email && student.verifyPassword(password)) {
            return {
                {"success", true},
                {"userId", student.getId()},
                {"name", student.getName()},
                {"role", "STUDENT"},
                {"email", student.getEmail()},
                {"rollNumber", student.getRollNumber()},
                {"department", student.getDepartment()}
            };
        }
    }

    throw InvalidCredentialsException();
}

// ========== BOOK OPS ==========
json Library::addBook(const json& bookData) {
    string id = generateId("BK");
    Book book(
        id,
        bookData.value("isbn", ""),
        bookData.value("title", ""),
        bookData.value("author", ""),
        bookData.value("year", 2024),
        bookData.value("genre", "General"),
        bookData.value("publisher", ""),
        bookData.value("totalCopies", 1),
        bookData.value("language", "English")
    );
    bookHandler.append(book);

    // Use friend function to demonstrate
    printItemDetails(book);

    return {
        {"success", true},
        {"message", "Book added successfully"},
        {"bookId", id}
    };
}

json Library::deleteBook(const string& bookId) {
    if (!bookHandler.deleteById(bookId)) {
        throw BookNotFoundException(bookId);
    }
    return {
        {"success", true},
        {"message", "Book deleted successfully"}
    };
}

json Library::updateBook(const string& bookId, const json& data) {
    try {
        Book book = bookHandler.findById(bookId);
        // Create updated book with new data (keeping existing values as defaults)
        Book updated(
            bookId,
            data.value("isbn", book.getISBN()),
            data.value("title", book.getTitle()),
            data.value("author", book.getAuthor()),
            data.value("year", book.getYear()),
            data.value("genre", book.getGenre()),
            data.value("publisher", book.getPublisher()),
            data.value("totalCopies", book.getTotalCopies()),
            data.value("language", book.getLanguage())
        );
        updated.setStatus(book.getStatus());

        bookHandler.updateById(bookId, updated);
        return {
            {"success", true},
            {"message", "Book updated successfully"}
        };
    } catch (const NotFoundException&) {
        throw BookNotFoundException(bookId);
    }
}

// ========== MEMBER OPS ==========
json Library::addMember(const json& memberData) {
    string id = generateId("STU");
    Student student(
        id,
        memberData.value("name", ""),
        memberData.value("email", ""),
        memberData.value("password", "pass123"),
        memberData.value("phone", ""),
        memberData.value("rollNumber", ""),
        memberData.value("department", ""),
        0,
        getCurrentDate()
    );
    studentHandler.append(student);
    return {
        {"success", true},
        {"message", "Member added successfully"},
        {"memberId", id}
    };
}

json Library::deleteMember(const string& memberId) {
    if (!studentHandler.deleteById(memberId)) {
        throw MemberNotFoundException(memberId);
    }
    return {
        {"success", true},
        {"message", "Member deleted successfully"}
    };
}

// ========== CIRCULATION ==========
json Library::issueBook(const string& bookId, const string& memberId) {
    // Find book
    Book book = bookHandler.findById(bookId);
    if (!book.isAvailable()) {
        throw BookNotAvailableException(bookId);
    }

    // Find member
    Student student = studentHandler.findById(memberId);
    if (!student.canBorrow()) {
        throw BorrowLimitExceededException(memberId);
    }

    // Check if student already has this book
    auto transactions = txHandler.readAll();
    for (const auto& tx : transactions) {
        if (tx.getBookId() == bookId && tx.getMemberId() == memberId && tx.getStatus() == "ACTIVE") {
            throw AlreadyBorrowedException(bookId, memberId);
        }
    }

    // Issue
    string txId = generateId("TX");
    string issueDate = getCurrentDate();
    string dueDate = addDays(issueDate, 14);

    Transaction tx(txId, bookId, memberId, issueDate, dueDate);
    txHandler.append(tx);

    // Update book copies
    book.issueOneCopy();
    bookHandler.updateById(bookId, book);

    // Update student borrows
    student.incrementBorrows();
    studentHandler.updateById(memberId, student);

    return {
        {"success", true},
        {"message", "Book issued successfully"},
        {"transactionId", txId},
        {"dueDate", dueDate}
    };
}

json Library::returnBook(const string& transactionId) {
    Transaction tx = txHandler.findById(transactionId);

    if (tx.getStatus() == "RETURNED") {
        return {{"success", false}, {"error", "Book already returned"}};
    }

    string returnDate = getCurrentDate();
    tx.markReturned(returnDate);
    txHandler.updateById(transactionId, tx);

    // Return book copy
    Book book = bookHandler.findById(tx.getBookId());
    book.returnOneCopy();
    bookHandler.updateById(tx.getBookId(), book);

    // Decrement student borrows
    try {
        Student student = studentHandler.findById(tx.getMemberId());
        student.decrementBorrows();
        studentHandler.updateById(tx.getMemberId(), student);
    } catch (...) {}

    // Calculate fine if overdue
    int overdueDays = daysBetween(tx.getDueDate(), returnDate);
    double fineAmount = 0.0;
    string fineId = "";
    if (overdueDays > 0) {
        fineAmount = calculateFineAmount(overdueDays);
        fineId = generateId("FN");
        Fine fine(fineId, transactionId, tx.getMemberId(), fineAmount, returnDate);
        fineHandler.append(fine);
    }

    json result = {
        {"success", true},
        {"message", "Book returned successfully"},
        {"returnDate", returnDate},
        {"daysOverdue", overdueDays > 0 ? overdueDays : 0}
    };

    if (fineAmount > 0) {
        result["fineAmount"] = fineAmount;
        result["fineId"] = fineId;
    }

    return result;
}

// ========== RESERVATIONS ==========
json Library::reserveBook(const string& bookId, const string& memberId) {
    // Verify book exists
    Book book = bookHandler.findById(bookId);

    // Check if student already reserved this book
    auto reservations = resHandler.readAll();
    for (const auto& res : reservations) {
        if (res.getBookId() == bookId && res.getMemberId() == memberId && res.getStatus() == "ACTIVE") {
            return {{"success", false}, {"error", "You already have an active reservation for this book"}};
        }
    }

    string resId = generateId("RES");
    string resDate = getCurrentDate();
    string expDate = addDays(resDate, 3);

    Reservation res(resId, bookId, memberId, resDate, expDate);
    resHandler.append(res);

    // If book is available, mark as RESERVED
    if (book.isAvailable()) {
        book.setStatus("RESERVED");
        bookHandler.updateById(bookId, book);
    }

    return {
        {"success", true},
        {"message", "Book reserved successfully"},
        {"reservationId", resId},
        {"expiryDate", expDate}
    };
}

json Library::cancelReservation(const string& reservationId) {
    try {
        Reservation res = resHandler.findById(reservationId);
        res.setStatus("CANCELLED");
        resHandler.updateById(reservationId, res);

        return {
            {"success", true},
            {"message", "Reservation cancelled successfully"}
        };
    } catch (const NotFoundException&) {
        throw ReservationNotFoundException(reservationId);
    }
}

// ========== FINES ==========
json Library::calculateAllFines() {
    string today = getCurrentDate();
    auto transactions = txHandler.readAll();
    auto existingFines = fineHandler.readAll();

    int newFines = 0;
    int updatedFines = 0;

    for (auto& tx : transactions) {
        if (tx.getStatus() != "ACTIVE") continue;

        int overdueDays = daysBetween(tx.getDueDate(), today);
        if (overdueDays <= 0) continue;

        // Mark transaction as overdue
        tx.setStatus("OVERDUE");
        txHandler.updateById(tx.getTransactionId(), tx);

        double fineAmount = calculateFineAmount(overdueDays);

        // Check if fine already exists for this transaction
        bool fineExists = false;
        for (auto& fine : existingFines) {
            if (fine.getTransactionId() == tx.getTransactionId() && fine.getStatus() == "PENDING") {
                // Update existing fine amount
                Fine updatedFine(fine.getFineId(), fine.getTransactionId(), fine.getMemberId(),
                                 fineAmount, today, "PENDING", "NULL");
                fineHandler.updateById(fine.getFineId(), updatedFine);
                fineExists = true;
                updatedFines++;
                break;
            }
        }

        if (!fineExists) {
            string fineId = generateId("FN");
            Fine newFine(fineId, tx.getTransactionId(), tx.getMemberId(), fineAmount, today);
            fineHandler.append(newFine);
            newFines++;
        }
    }

    return {
        {"success", true},
        {"message", "Fines calculated successfully"},
        {"newFines", newFines},
        {"updatedFines", updatedFines},
        {"calculatedDate", today}
    };
}

json Library::payFine(const string& fineId) {
    try {
        Fine fine = fineHandler.findById(fineId);
        if (fine.getStatus() == "PAID") {
            return {{"success", false}, {"error", "Fine already paid"}};
        }
        fine.markPaid(getCurrentDate());
        fineHandler.updateById(fineId, fine);

        // Use friend function to sort/compare
        auto allFines = fineHandler.readAll();
        sort(allFines.begin(), allFines.end(), compareFineAmount);

        return {
            {"success", true},
            {"message", "Fine paid successfully"},
            {"amount", fine.getAmount()},
            {"paidDate", getCurrentDate()}
        };
    } catch (const NotFoundException&) {
        throw FineNotFoundException(fineId);
    }
}
