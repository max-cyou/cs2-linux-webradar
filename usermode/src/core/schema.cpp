#include "pch.hpp"
#include "schema_offsets.hpp"

bool schema::setup()
{
	LOG_INFO("loaded %d static schema offsets from a2x/cs2-dumper", std::size(g_schema_offsets));
	return true;
}

uint32_t schema::get_offset(const fnv1a_t hashed_field_name)
{
	for (const auto& entry : g_schema_offsets)
	{
		if (entry.m_hash == hashed_field_name)
			return entry.m_offset;
	}

	LOG_ERROR("failed to find an offset for the field with the hash value '%llu'", hashed_field_name);
	return {};
}
