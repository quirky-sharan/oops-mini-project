#ifndef RESERVATION_H
#define RESERVATION_H

#include <string>
using namespace std;

class Reservation {
private:
    string reservationId;
    string bookId;
    string memberId;
    string reservationDate;
    string expiryDate;
    string status; // "ACTIVE", "FULFILLED", "EXPIRED", "CANCELLED"

public:
    Reservation(string rId, string bookId, string memberId,
                string resDate, string expiryDate, string status = "ACTIVE");

    string serialize() const;
    static Reservation deserialize(const string& line);

    bool isExpired(const string& currentDate) const;

    string getReservationId() const;
    string getBookId() const;
    string getMemberId() const;
    string getReservationDate() const;
    string getExpiryDate() const;
    string getStatus() const;
    string getId() const { return reservationId; }
    void setStatus(const string& s);
};

#endif // RESERVATION_H
