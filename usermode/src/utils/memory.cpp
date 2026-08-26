#include "pch.hpp"
#include <dirent.h>
#include <fcntl.h>

bool c_memory::setup()
{
	const auto process_id = this->get_process_id("cs2");
	if (!process_id.has_value())
	{
		LOG_ERROR("failed to get process id for 'cs2'\n\t\t\t  make sure the game is running");
		return {};
	}

	this->m_id = process_id.value();

	const auto mem_path = std::format("/proc/{}/mem", this->m_id);
	this->m_mem_fd = open(mem_path.c_str(), O_RDONLY);

	return this->m_mem_fd != -1;
}

std::optional<uint32_t> c_memory::get_process_id(const std::string_view& process_name)
{
	const auto proc_dir = opendir("/proc");
	if (!proc_dir)
		return {};

	struct dirent* entry;
	while ((entry = readdir(proc_dir)) != nullptr)
	{
		if (entry->d_type != DT_DIR)
			continue;

		const std::string_view name = entry->d_name;
		if (name.empty() || !std::isdigit(name[0]))
			continue;

		const auto status_path = std::format("/proc/{}/comm", name);

		std::ifstream status_file(status_path);
		if (!status_file.is_open())
			continue;

		std::string line;
		if (std::getline(status_file, line))
		{
			if (!line.empty() && line.back() == '\n')
				line.pop_back();

			if (line == process_name)
			{
				closedir(proc_dir);
				return static_cast<uint32_t>(std::stoul(std::string(name)));
			}
		}
	}

	closedir(proc_dir);
	return {};
}

std::optional<c_address> c_memory::find_pattern(const std::string_view& module_name, const std::string_view& pattern)
{
	constexpr auto pattern_to_bytes = [](const std::string_view& pattern)
	{
		std::vector<int32_t> bytes;

		for (uint32_t idx = 0; idx < pattern.size(); ++idx)
		{
			switch (pattern[idx])
			{
				case '?':
					bytes.push_back(-1);
					break;

				case ' ':
					break;

				default:
				{
					if (idx + 1 < pattern.size())
					{
						uint32_t value = 0;

						if (const auto [ptr, ec] = std::from_chars(pattern.data() + idx, pattern.data() + idx + 2, value, 16); ec == std::errc())
						{
							bytes.push_back(value);
							++idx;
						}
					}

					break;
				}
			}
		}

		return bytes;
	};

	const auto segments = this->get_all_segments(module_name);
	if (segments.empty())
		return {};

	const auto pattern_bytes = pattern_to_bytes(pattern);
	const auto pattern_len = pattern_bytes.size();

	for (const auto& seg : segments)
	{
		const auto seg_size = seg.end - seg.base;
		const auto module_data = std::make_unique<uint8_t[]>(seg_size);
		if (!this->read_t(seg.base, module_data.get(), seg_size))
			continue;

		for (uint32_t idx = 0; idx + pattern_len <= seg_size; ++idx)
		{
			bool found = true;

			for (uint32_t b_idx = 0; b_idx < pattern_len; ++b_idx)
			{
				if (module_data[idx + b_idx] != pattern_bytes[b_idx] && pattern_bytes[b_idx] != -1)
				{
					found = false;
					break;
				}
			}

			if (found)
				return c_address(seg.base + idx);
		}
	}

	return {};
}

std::vector<c_memory::module_segment> c_memory::get_all_segments(const std::string_view& module_name)
{
	std::vector<module_segment> result;

	const auto maps_path = std::format("/proc/{}/maps", this->m_id);
	std::ifstream maps_file(maps_path);
	if (!maps_file.is_open())
		return result;

	std::string line;
	while (std::getline(maps_file, line))
	{
		if (line.find(module_name) == std::string::npos)
			continue;

		const auto dash_pos = line.find('-');
		const auto space_pos = line.find(' ', dash_pos + 1);

		if (dash_pos == std::string::npos || space_pos == std::string::npos)
			continue;

		uintptr_t start = 0, end = 0;
		std::from_chars(line.c_str(), line.c_str() + dash_pos, start, 16);
		std::from_chars(line.c_str() + dash_pos + 1, line.c_str() + space_pos, end, 16);

		if (start && end && end > start && line[space_pos + 1] == 'r')
			result.push_back({ start, end });
	}

	return result;
}

std::pair<std::optional<uintptr_t>, std::optional<uintptr_t>> c_memory::get_module_info(const std::string_view& module_name)
{
	const auto segments = this->get_all_segments(module_name);
	if (segments.empty())
		return {};

	return std::make_pair(segments.front().base, segments.front().end - segments.front().base);
}
