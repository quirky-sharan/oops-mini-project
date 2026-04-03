#include "Library.h"
#include "json.hpp"
#include <iostream>
#include <string>

using json = nlohmann::json;
using namespace std;

string getArg(int argc, char* argv[], const string& flag) {
    for (int i = 1; i < argc - 1; i++) {
        if (string(argv[i]) == flag) {
            return string(argv[i + 1]);
        }
    }
    return "";
}

int main(int argc, char* argv[]) {
    try {
        string op = getArg(argc, argv, "--op");
        string dataStr = getArg(argc, argv, "--data");
        json inputData = dataStr.empty() ? json{} : json::parse(dataStr);

        // Resolve data path relative to binary location
        string dataPath = getArg(argc, argv, "--datapath");
        if (dataPath.empty()) {
            dataPath = "./data";
        }

        Library lib(dataPath);

        json result;

        if      (op == "LOGIN")               result = lib.login(inputData);
        else if (op == "ADD_BOOK")            result = lib.addBook(inputData);
        else if (op == "DELETE_BOOK")         result = lib.deleteBook(inputData.value("bookId", ""));
        else if (op == "UPDATE_BOOK")         result = lib.updateBook(inputData.value("bookId", ""), inputData);
        else if (op == "ADD_MEMBER")          result = lib.addMember(inputData);
        else if (op == "DELETE_MEMBER")       result = lib.deleteMember(inputData.value("memberId", ""));
        else if (op == "ISSUE_BOOK")          result = lib.issueBook(inputData.value("bookId", ""), inputData.value("memberId", ""));
        else if (op == "RETURN_BOOK")         result = lib.returnBook(inputData.value("transactionId", ""));
        else if (op == "RESERVE_BOOK")        result = lib.reserveBook(inputData.value("bookId", ""), inputData.value("memberId", ""));
        else if (op == "CANCEL_RESERVATION")  result = lib.cancelReservation(inputData.value("reservationId", ""));
        else if (op == "CALCULATE_FINES")     result = lib.calculateAllFines();
        else if (op == "PAY_FINE")            result = lib.payFine(inputData.value("fineId", ""));
        else                                  result = {{"success", false}, {"error", "Unknown operation: " + op}};

        cout << result.dump() << endl;

    } catch (const exception& e) {
        cout << json{{"success", false}, {"error", e.what()}}.dump() << endl;
        return 1;
    }
    return 0;
}
