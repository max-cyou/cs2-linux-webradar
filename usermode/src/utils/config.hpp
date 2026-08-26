#pragma once

struct config_data_t
{
	std::string m_ip;

	NLOHMANN_DEFINE_TYPE_INTRUSIVE(config_data_t, m_ip)
};

namespace cfg
{
	bool setup(config_data_t& config_data);
}