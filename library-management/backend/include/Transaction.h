#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
using namespace std;

class Transaction {
private:
    string transactionId;
    string bookId;
    string memberId;
    string issueDate;
    string dueDate;
    string returnDate;
    string status; // "ACTIVE", "RETURNED", "OVERDUE"

public:
    Transaction(string txId, string bookId, string memberId,
                string issueDate, string dueDate, string returnDate = "NULL",
                string status = "ACTIVE");

    string serialize() const;
    static Transaction deserialize(const string& line);

    bool isOverdue(const string& currentDate) const;
    int daysOverdue(const string& currentDate) const;

    string getTransactionId() const;
    string getBookId() const;
    string getMemberId() const;
    string getIssueDate() const;
    string getDueDate() const;
    string getReturnDate() const;
    string getStatus() const;
    string getId() const { return transactionId; }

    void markReturned(const string& returnDate);
    void setStatus(const string& s);
};

#endif // TRANSACTION_H
