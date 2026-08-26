cmake_minimum_required(VERSION 3.20)
project(cs2_webradar LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(nlohmann_json REQUIRED)
find_package(ixwebsocket REQUIRED)

add_executable(cs2_webradar
    src/main.cpp
    src/utils/memory.cpp
    src/utils/address.cpp
    src/utils/config.cpp
    src/core/interfaces.cpp
    src/core/schema.cpp
    src/core/sdk.cpp
    src/sdk/entity.cpp
    src/features/features.cpp
    src/features/players/players.cpp
    src/features/bomb/bomb.cpp
)

target_include_directories(cs2_webradar PRIVATE src)
target_link_libraries(cs2_webradar PRIVATE nlohmann_json::nlohmann_json ixwebsocket::ixwebsocket pthread)
