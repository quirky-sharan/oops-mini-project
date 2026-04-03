#ifndef FINE_H
#define FINE_H

#include <string>
using namespace std;

class Fine {
private:
    string fineId;
    string transactionId;
    string memberId;
    double amount;
    string status; // "PENDING", "PAID"
    string calculatedDate;
    string paidDate;

public:
    Fine(string fId, string txId, string memberId, double amount,
         string calcDate, string status = "PENDING", string paidDate = "NULL");

    string serialize() const;
    static Fine deserialize(const string& line);

    void markPaid(const string& date);

    double getAmount() const;
    string getStatus() const;
    string getMemberId() const;
    string getFineId() const;
    string getTransactionId() const;
    string getId() const { return fineId; }
    string getCalculatedDate() const;
    string getPaidDate() const;

    // Friend function: compare two fines by amount
    friend bool compareFineAmount(const Fine& a, const Fine& b);
};

#endif // FINE_H
