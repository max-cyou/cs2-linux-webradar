#pragma once

class c_memory
{
public:
	~c_memory()
	{
		if (this->m_mem_fd != -1)
			close(this->m_mem_fd);
	}

	bool setup();
	std::optional<uint32_t> get_process_id(const std::string_view& process_name);
	std::optional<c_address> find_pattern(const std::string_view& module_name, const std::string_view& pattern);
	std::pair<std::optional<uintptr_t>, std::optional<uintptr_t>> get_module_info(const std::string_view& module_name);

	bool read_t(const uintptr_t address, void* buffer, uintptr_t size)
	{
		return this->read_memory(reinterpret_cast<void*>(address), buffer, size);
	}

	template <typename t>
	t read_t(void* address)
	{
		t value{ 0 };
		this->read_memory(address, &value, sizeof(t));
		return value;
	}

	template <typename T>
	T read_t(const uintptr_t address) noexcept
	{
		if constexpr (std::is_same_v<T, std::string>)
		{
			static const int length = 64;
			std::vector<char> buffer(length);

			this->read_memory(reinterpret_cast<void*>(address), buffer.data(), length);

			const auto& it = std::find(buffer.begin(), buffer.end(), '\0');

			if (it != buffer.end())
				buffer.resize(std::distance(buffer.begin(), it));

			return std::string(buffer.begin(), buffer.end());
		}
		else
		{
			T buffer{};
			this->read_memory(reinterpret_cast<void*>(address), &buffer, sizeof(T));
			return buffer;
		}
	}

private:
	int m_mem_fd = -1;
	uint32_t m_id = 0;

	struct module_segment
	{
		uintptr_t base;
		uintptr_t end;
	};

	std::vector<module_segment> get_all_segments(const std::string_view& module_name);

	bool read_memory(void* address, void* buffer, const size_t size)
	{
		struct iovec local = { buffer, size };
		struct iovec remote = { address, size };
		const ssize_t result = process_vm_readv(this->m_id, &local, 1, &remote, 1, 0);
		return result == static_cast<ssize_t>(size);
	}
};

inline const std::unique_ptr<c_memory> m_memory{ new c_memory() };
