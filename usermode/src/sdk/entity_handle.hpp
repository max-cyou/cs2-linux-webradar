#pragma once

#define INVALID_EHANDLE_IDX 0xffffffff
#define ENT_ENTRY_MASK 0x7fff
#define NUM_SERIAL_NUM_SHIFT_BITS 15

class c_base_handle
{
public:
	c_base_handle() noexcept :
		m_idx(INVALID_EHANDLE_IDX)
	{
	}

	c_base_handle(const int32_t entry, const int32_t serial) noexcept
	{
		assert(entry >= 0 && (entry & ENT_ENTRY_MASK) == entry);
		assert(serial >= 0 && serial < (1 << NUM_SERIAL_NUM_SHIFT_BITS));

		m_idx = entry | (serial << NUM_SERIAL_NUM_SHIFT_BITS);
	}

	bool is_valid() const noexcept
	{
		return m_idx != INVALID_EHANDLE_IDX;
	}

	int32_t get_entry_idx() const noexcept
	{
		return static_cast<int32_t>(m_idx & ENT_ENTRY_MASK);
	}

	int32_t get_serial_number() const noexcept
	{
		return static_cast<int32_t>(m_idx >> NUM_SERIAL_NUM_SHIFT_BITS);
	}

private:
	uint32_t m_idx;
};