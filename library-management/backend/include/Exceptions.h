#ifndef EXCEPTIONS_H
#define EXCEPTIONS_H

#include <exception>
#include <string>

using namespace std;

// Base exception for all library operations
class LibraryException : public exception {
protected:
    string message;
public:
    LibraryException(const string& msg) : message(msg) {}
    const char* what() const noexcept override { return message.c_str(); }
};

class BookNotFoundException : public LibraryException {
public:
    BookNotFoundException(const string& id)
        : LibraryException("Book not found: " + id) {}
};

class MemberNotFoundException : public LibraryException {
public:
    MemberNotFoundException(const string& id)
        : LibraryException("Member not found: " + id) {}
};

class BookNotAvailableException : public LibraryException {
public:
    BookNotAvailableException(const string& id)
        : LibraryException("Book not available for issue: " + id) {}
};

class BorrowLimitExceededException : public LibraryException {
public:
    BorrowLimitExceededException(const string& memberId)
        : LibraryException("Borrow limit exceeded for member: " + memberId) {}
};

class AlreadyBorrowedException : public LibraryException {
public:
    AlreadyBorrowedException(const string& bookId, const string& memberId)
        : LibraryException("Book " + bookId + " already borrowed by member " + memberId) {}
};

class ReservationNotFoundException : public LibraryException {
public:
    ReservationNotFoundException(const string& id)
        : LibraryException("Reservation not found: " + id) {}
};

class InvalidCredentialsException : public LibraryException {
public:
    InvalidCredentialsException()
        : LibraryException("Invalid email or password") {}
};

class FileIOException : public LibraryException {
public:
    FileIOException(const string& filepath)
        : LibraryException("Failed to open file: " + filepath) {}
};

class TransactionNotFoundException : public LibraryException {
public:
    TransactionNotFoundException(const string& id)
        : LibraryException("Transaction not found: " + id) {}
};

class FineNotFoundException : public LibraryException {
public:
    FineNotFoundException(const string& id)
        : LibraryException("Fine not found: " + id) {}
};

class NotFoundException : public LibraryException {
public:
    NotFoundException(const string& msg)
        : LibraryException("Not found: " + msg) {}
};

#endif // EXCEPTIONS_H
