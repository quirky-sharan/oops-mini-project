cmake_minimum_required(VERSION 3.10)
project(library_backend CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

add_executable(library_backend
    src/main.cpp
    src/Person.cpp
    src/Admin.cpp
    src/Student.cpp
    src/LibraryItem.cpp
    src/Book.cpp
    src/Transaction.cpp
    src/Reservation.cpp
    src/Fine.cpp
    src/Library.cpp
)
