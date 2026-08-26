#pragma once

#define CLIENT_DLL "libclient.so"
#define ENGINE2_DLL "libengine2.so"
#define SCHEMASYSTEM_DLL "libschemasystem.so"

#define GET_GLOBAL_VARS "48 8d 05 ? ? ? ? 48 8b 00 8b 40 44 f3"
#define GET_GAME_ENTITY_SYSTEM "48 89 3d ? ? ? ? e9 ? ? ? ? 55"
#define GET_LOCAL_PLAYER_CONTROLLER "48 83 3d ? ? ? ? 00 0f 95 c0 c3"

#define LOG_INFO(str, ...) \
    printf(" [info] " str "\n", ##__VA_ARGS__)

#define LOG_WARNING(str, ...) \
    printf(" [warning] " str "\n", ##__VA_ARGS__)

#define LOG_ERROR(str, ...) \
    { \
        const auto filename = std::filesystem::path(__FILE__).filename().string(); \
        printf(" [error] [%s:%d] " str "\n", filename.c_str(), __LINE__, ##__VA_ARGS__); \
    }

#define INIT_STEP(name, expr) \
    if (!(expr)) \
    { \
        std::this_thread::sleep_for(std::chrono::seconds(5)); \
        return 1; \
    } \
    LOG_INFO(name " initialization completed")
