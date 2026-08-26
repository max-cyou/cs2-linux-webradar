#pragma once

#include <cstdint>
#include <chrono>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <string>
#include <string_view>
#include <vector>
#include <set>
#include <optional>
#include <memory>
#include <algorithm>
#include <cassert>
#include <charconv>
#include <format>
#include <filesystem>
#include <thread>
#include <mutex>
#include <condition_variable>

#include <unistd.h>
#include <sys/uio.h>
#include <sys/types.h>
#include <signal.h>

#include <nlohmann/json.hpp>
#include <ixwebsocket/IXNetSystem.h>
#include <ixwebsocket/IXWebSocket.h>

#include "common.hpp"

#include "utils/config.hpp"
#include "utils/address.hpp"
#include "utils/memory.hpp"
#include "utils/fnv1a.hpp"

#include "core/interfaces.hpp"
#include "core/schema.hpp"

#include "sdk/datatypes/utl_vector.hpp"
#include "sdk/datatypes/vector.hpp"

#include "sdk/entity_handle.hpp"
#include "sdk/entity.hpp"

#include "sdk/interfaces/game_entity_system.hpp"
#include "sdk/interfaces/global_vars.hpp"

#include "core/sdk.hpp"

#include "features/features.hpp"
