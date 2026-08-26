#pragma once

#include <windows.h>
#include <tlhelp32.h>
#include <cstdint>
#include <chrono>
#include <fstream>
#include <set>
#include <thread>
#include <mutex>
#include <condition_variable>

/* ext/includes */
#include <nlohmann/json.hpp>
#include <ixwebsocket/IXNetSystem.h>
#include <ixwebsocket/IXWebSocket.h>

/* root */
#include "common.hpp"

/* utils */
#include "utils/config.hpp"
#include "utils/address.hpp"
#include "utils/memory.hpp"
#include "utils/fnv1a.hpp"

/* core */
#include "core/interfaces.hpp"
#include "core/schema.hpp"

/* datatypes */
#include "sdk/datatypes/utl_ts_hash.hpp"
#include "sdk/datatypes/utl_vector.hpp"
#include "sdk/datatypes/vector.hpp"

/* sdk */
#include "sdk/entity_handle.hpp"
#include "sdk/entity.hpp"

/* sdk/interfaces */
#include "sdk/interfaces/game_entity_system.hpp"
#include "sdk/interfaces/schema_system.hpp"
#include "sdk/interfaces/global_vars.hpp"

#include "core/sdk.hpp"

/* features */
#include "features/features.hpp"