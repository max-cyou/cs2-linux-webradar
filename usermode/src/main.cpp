#include "pch.hpp"
#include <atomic>
#include <csignal>

static std::atomic<bool> g_running{true};

static void signal_handler(int)
{
    g_running = false;
}

int main()
{
    std::signal(SIGINT, signal_handler);
    std::signal(SIGTERM, signal_handler);
    config_data_t config_data = {};
    INIT_STEP("config system", cfg::setup(config_data));
    INIT_STEP("memory", m_memory->setup());
    INIT_STEP("interfaces", i::setup());
    INIT_STEP("schema", schema::setup());

    ix::initNetSystem();
    LOG_INFO("net initialization completed");

    const auto formatted_address = std::format("ws://{}:22006/cs2_webradar", config_data.m_ip);

    static ix::WebSocket web_socket;
    std::mutex handshake_mutex;
    std::condition_variable handshake_cv;
    bool connected = false;
    bool failed = false;

    web_socket.setUrl(formatted_address);
    web_socket.setOnMessageCallback([&](const ix::WebSocketMessagePtr& msg)
    {
        if (msg->type == ix::WebSocketMessageType::Open)
        {
            {
                std::lock_guard lock(handshake_mutex);
                connected = true;
            }
            handshake_cv.notify_one();
            LOG_INFO("connected to the web socket ('%s')", formatted_address.c_str());
        }
        else if (msg->type == ix::WebSocketMessageType::Error)
        {
            {
                std::lock_guard lock(handshake_mutex);
                failed = true;
            }
            handshake_cv.notify_one();
            LOG_ERROR("failed to connect to the web socket ('%s')", formatted_address.c_str());
        }
    });
    web_socket.start();

    {
        std::unique_lock lock(handshake_mutex);
        handshake_cv.wait(lock, [&] { return connected || failed; });
    }

    if (!connected)
    {
        std::this_thread::sleep_for(std::chrono::seconds(5));
        return 1;
    }

    while (g_running)
    {
        sdk::update();

        if (!sdk::m_local_controller)
        {
            static int warn_count = 0;
            if (warn_count++ % 50 == 0)
                LOG_WARNING("m_local_controller is null, skipping");
            web_socket.send(f::m_data.dump());
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            continue;
        }

        f::run();
        web_socket.send(f::m_data.dump());

        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    web_socket.stop();
    ix::uninitNetSystem();
    LOG_INFO("shutdown complete");

    return 0;
}
