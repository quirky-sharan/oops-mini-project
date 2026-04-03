#include "Reservation.h"
#include <sstream>
#include <ctime>

Reservation::Reservation(string rId, string bookId, string memberId,
                         string resDate, string expiryDate, string status)
    : reservationId(rId), bookId(bookId), memberId(memberId),
      reservationDate(resDate), expiryDate(expiryDate), status(status) {}

string Reservation::serialize() const {
    return reservationId + "|" + bookId + "|" + memberId + "|"
           + reservationDate + "|" + expiryDate + "|" + status;
}

Reservation Reservation::deserialize(const string& line) {
    stringstream ss(line);
    string rId, bookId, memberId, resDate, expDate, status;
    getline(ss, rId, '|');
    getline(ss, bookId, '|');
    getline(ss, memberId, '|');
    getline(ss, resDate, '|');
    getline(ss, expDate, '|');
    getline(ss, status, '|');
    while (!status.empty() && (status.back() == '\n' || status.back() == '\r' || status.back() == ' ')) {
        status.pop_back();
    }
    return Reservation(rId, bookId, memberId, resDate, expDate, status);
}

static int dateToDays(const string& dateStr) {
    if (dateStr.empty() || dateStr == "NULL") return 0;
    int y, m, d;
    sscanf(dateStr.c_str(), "%d-%d-%d", &y, &m, &d);
    struct tm t = {};
    t.tm_year = y - 1900;
    t.tm_mon = m - 1;
    t.tm_mday = d;
    t.tm_hour = 12;
    time_t time = mktime(&t);
    return (int)(time / 86400);
}

bool Reservation::isExpired(const string& currentDate) const {
    return dateToDays(currentDate) > dateToDays(expiryDate);
}

string Reservation::getReservationId() const { return reservationId; }
string Reservation::getBookId() const { return bookId; }
string Reservation::getMemberId() const { return memberId; }
string Reservation::getReservationDate() const { return reservationDate; }
string Reservation::getExpiryDate() const { return expiryDate; }
string Reservation::getStatus() const { return status; }
void Reservation::setStatus(const string& s) { status = s; }
