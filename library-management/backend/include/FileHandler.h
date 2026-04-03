#ifndef FILEHANDLER_H
#define FILEHANDLER_H

#include <vector>
#include <string>
#include <fstream>
#include <sstream>
#include "Exceptions.h"

using namespace std;

template <typename T>
class FileHandler {
private:
    string filePath;

public:
    FileHandler(const string& path) : filePath(path) {}

    // Read all records — calls T::deserialize on each line
    vector<T> readAll() const {
        vector<T> records;
        ifstream file(filePath);
        if (!file.is_open()) {
            // If file doesn't exist yet, return empty
            return records;
        }
        string line;
        while (getline(file, line)) {
            if (!line.empty() && line[0] != '#') {
                try {
                    records.push_back(T::deserialize(line));
                } catch (...) {
                    // Skip malformed lines
                    continue;
                }
            }
        }
        file.close();
        return records;
    }

    // Write entire vector back (overwrites file)
    void writeAll(const vector<T>& records) const {
        ofstream file(filePath, ios::trunc);
        if (!file.is_open()) {
            throw FileIOException(filePath);
        }
        for (const auto& record : records) {
            file << record.serialize() << "\n";
        }
        file.close();
    }

    // Append single record
    void append(const T& record) const {
        ofstream file(filePath, ios::app);
        if (!file.is_open()) {
            throw FileIOException(filePath);
        }
        file << record.serialize() << "\n";
        file.close();
    }

    // Find by ID — calls record.getId() for comparison
    T findById(const string& id) const {
        vector<T> records = readAll();
        for (const auto& record : records) {
            if (record.getId() == id) {
                return record;
            }
        }
        throw NotFoundException(id);
    }

    // Delete by ID — rewrites file without the matching record
    bool deleteById(const string& id) {
        vector<T> records = readAll();
        bool found = false;
        vector<T> updated;
        for (const auto& record : records) {
            if (record.getId() == id) {
                found = true;
            } else {
                updated.push_back(record);
            }
        }
        if (found) {
            writeAll(updated);
        }
        return found;
    }

    // Update by ID — replaces matching record
    bool updateById(const string& id, const T& updatedRecord) {
        vector<T> records = readAll();
        bool found = false;
        for (auto& record : records) {
            if (record.getId() == id) {
                record = updatedRecord;
                found = true;
                break;
            }
        }
        if (found) {
            writeAll(records);
        }
        return found;
    }
};

#endif // FILEHANDLER_H
