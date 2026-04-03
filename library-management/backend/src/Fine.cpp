#include "Fine.h"
#include <sstream>
#include <iomanip>

Fine::Fine(string fId, string txId, string memberId, double amount,
           string calcDate, string status, string paidDate)
    : fineId(fId), transactionId(txId), memberId(memberId), amount(amount),
      calculatedDate(calcDate), status(status), paidDate(paidDate) {}

string Fine::serialize() const {
    ostringstream oss;
    oss << fixed << setprecision(2) << amount;
    return fineId + "|" + transactionId + "|" + memberId + "|"
           + oss.str() + "|" + status + "|" + calculatedDate + "|" + paidDate;
}

Fine Fine::deserialize(const string& line) {
    stringstream ss(line);
    string fId, txId, memberId, amtStr, status, calcDate, paidDate;
    getline(ss, fId, '|');
    getline(ss, txId, '|');
    getline(ss, memberId, '|');
    getline(ss, amtStr, '|');
    getline(ss, status, '|');
    getline(ss, calcDate, '|');
    getline(ss, paidDate, '|');
    while (!paidDate.empty() && (paidDate.back() == '\n' || paidDate.back() == '\r' || paidDate.back() == ' ')) {
        paidDate.pop_back();
    }
    double amt = 0.0;
    try { amt = stod(amtStr); } catch (...) {}
    return Fine(fId, txId, memberId, amt, calcDate, status, paidDate);
}

void Fine::markPaid(const string& date) {
    status = "PAID";
    paidDate = date;
}

double Fine::getAmount() const { return amount; }
string Fine::getStatus() const { return status; }
string Fine::getMemberId() const { return memberId; }
string Fine::getFineId() const { return fineId; }
string Fine::getTransactionId() const { return transactionId; }
string Fine::getCalculatedDate() const { return calculatedDate; }
string Fine::getPaidDate() const { return paidDate; }

// Friend function: compare two fines by amount
bool compareFineAmount(const Fine& a, const Fine& b) {
    return a.amount < b.amount;
}
