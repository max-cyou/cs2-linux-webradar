#include "pch.hpp"

void f::run()
{
	if (!sdk::m_local_controller)
		return;

	const auto local_team = sdk::m_local_controller->m_iTeamNum();
	if (local_team == e_team::none || local_team == e_team::spec)
	{
		static int team_warn = 0;
		if (team_warn++ % 50 == 0)
			LOG_WARNING("local_team=%d, skipping", (int)local_team);
		return;
	}

	m_data = nlohmann::json{};
	m_player_data = nlohmann::json{};

	m_data["m_local_team"] = local_team;

	get_player_info();
}

void f::get_player_info()
{
	m_data["m_players"] = nlohmann::json::array();

	const auto highest_idx = 1024;
	int checked = 0, found = 0;
	for (int32_t idx = 0; idx < highest_idx; idx++)
	{
		const auto entity = i::m_game_entity_system->get(idx);
		if (!entity)
			continue;

		const auto entity_handle = entity->get_ref_e_handle();
		if (!entity_handle.is_valid())
			continue;

		const auto class_name = entity->get_schema_class_name();
		if (class_name.empty())
			continue;

		checked++;
		const auto hashed_class_name = fnv1a::hash(class_name);

		if (hashed_class_name == fnv1a::hash("CCSPlayerController"))
		{
			const auto player = i::m_game_entity_system->get<c_cs_player_controller*>(entity_handle);
			if (!player)
				continue;

			const auto player_pawn = player->get_player_pawn();
			if (!player_pawn)
				continue;

			if (!f::players::get_data(idx, player, player_pawn))
				continue;

			f::players::get_weapons(player_pawn);
			f::players::get_active_weapon(player_pawn);

			m_data["m_players"].push_back(m_player_data);
		}
		else if (hashed_class_name == fnv1a::hash("C_C4"))
		{
			const auto bomb = entity;
			f::bomb::get_carried_bomb(bomb);
		}
		else if (hashed_class_name == fnv1a::hash("C_PlantedC4"))
		{
			const auto planted_c4 = reinterpret_cast<c_planted_c4*>(entity);
			f::bomb::get_planted_bomb(planted_c4);
		}
	}

	static int log_count = 0;
	if (log_count++ % 50 == 0)
		LOG_INFO("entity scan: checked=%d, players=%zu", checked, m_data["m_players"].size());
}