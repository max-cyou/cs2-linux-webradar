#include "pch.hpp"

bool cfg::setup(config_data_t& config_data)
{
	std::ifstream file("config.json");
	if (!file.is_open())
	{
		LOG_WARNING("cannot open file 'config.json'");

		std::ofstream example_config("config.json");
		example_config << std::format("{}", R"({
    "m_ip": "localhost"
})");

		return {};
	}

	const auto parsed_data = nlohmann::json::parse(file);
	if (parsed_data.empty())
	{
		LOG_ERROR("failed to parse 'config.json'");
		return {};
	}

	try
	{
		config_data = parsed_data.get<config_data_t>();
	}
	catch (const std::exception& e)
	{
		LOG_ERROR("failed to deserialize 'config_data_t' (%s)", e.what());
		return {};
	}

	return true;
}