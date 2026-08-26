#include "pch.hpp"

bool i::setup()
{
	bool success = true;

	LOG_INFO("looking for module '%s'", CLIENT_DLL);
	const auto [client_base, client_size] = m_memory->get_module_info(CLIENT_DLL);
	if (!client_base.has_value() || !client_size.has_value())
	{
		LOG_ERROR("module '%s' not found", CLIENT_DLL);
		return {};
	}
	LOG_INFO("module '%s' at 0x%lx (size 0x%lx)", CLIENT_DLL, client_base.value(), client_size.value());

	LOG_INFO("game_entity_system pattern: '%s'", GET_GAME_ENTITY_SYSTEM);
	m_game_entity_system = m_memory->find_pattern(CLIENT_DLL, GET_GAME_ENTITY_SYSTEM)
		->rip_read(0x03, 0x07).as<c_game_entity_system*>();
	LOG_INFO("game_entity_system = %p", (void*)m_game_entity_system);
	success &= (m_game_entity_system != nullptr);

	m_global_vars = m_memory->find_pattern(CLIENT_DLL, GET_GLOBAL_VARS)
		->rip_read(0x03, 0x07).as<c_global_vars*>();
	LOG_INFO("global_vars = %p", (void*)m_global_vars);
	success &= (m_global_vars != nullptr);

	return success;
}
