#include "Transaction.h"
#include <sstream>
#include <ctime>

Transaction::Transaction(string txId, string bookId, string memberId,
                         string issueDate, string dueDate, string returnDate, string status)
    : transactionId(txId), bookId(bookId), memberId(memberId),
      issueDate(issueDate), dueDate(dueDate), returnDate(returnDate), status(status) {}

string Transaction::serialize() const {
    return transactionId + "|" + bookId + "|" + memberId + "|"
           + issueDate + "|" + dueDate + "|" + returnDate + "|" + status;
}

Transaction Transaction::deserialize(const string& line) {
    stringstream ss(line);
    string txId, bookId, memberId, issueDate, dueDate, returnDate, status;
    getline(ss, txId, '|');
    getline(ss, bookId, '|');
    getline(ss, memberId, '|');
    getline(ss, issueDate, '|');
    getline(ss, dueDate, '|');
    getline(ss, returnDate, '|');
    getline(ss, status, '|');
    while (!status.empty() && (status.back() == '\n' || status.back() == '\r' || status.back() == ' ')) {
        status.pop_back();
    }
    return Transaction(txId, bookId, memberId, issueDate, dueDate, returnDate, status);
}

// Helper to parse date string to tm struct, returns days since epoch
static int dateToDays(const string& dateStr) {
    if (dateStr.empty() || dateStr == "NULL") return 0;
    int y, m, d;
    sscanf(dateStr.c_str(), "%d-%d-%d", &y, &m, &d);
    struct tm t = {};
    t.tm_year = y - 1900;
    t.tm_mon = m - 1;
    t.tm_mday = d;
    t.tm_hour = 12; // Noon to avoid DST issues
    time_t time = mktime(&t);
    return (int)(time / 86400);
}

bool Transaction::isOverdue(const string& currentDate) const {
    if (status == "RETURNED") return false;
    return dateToDays(currentDate) > dateToDays(dueDate);
}

int Transaction::daysOverdue(const string& currentDate) const {
    if (status == "RETURNED") return 0;
    int diff = dateToDays(currentDate) - dateToDays(dueDate);
    return diff > 0 ? diff : 0;
}

string Transaction::getTransactionId() const { return transactionId; }
string Transaction::getBookId() const { return bookId; }
string Transaction::getMemberId() const { return memberId; }
string Transaction::getIssueDate() const { return issueDate; }
string Transaction::getDueDate() const { return dueDate; }
string Transaction::getReturnDate() const { return returnDate; }
string Transaction::getStatus() const { return status; }

void Transaction::markReturned(const string& retDate) {
    returnDate = retDate;
    status = "RETURNED";
}

void Transaction::setStatus(const string& s) { status = s; }
