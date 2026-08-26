#pragma once

struct schema_offset_entry_t
{
    fnv1a_t m_hash;
    uint32_t m_offset;
};

static constexpr schema_offset_entry_t g_schema_offsets[] = {
    { 0x4c7c6391100b2438ull, 0x10 },  // CEntityInstance->m_pEntity
    { 0x51cee653ec562d63ull, 0x30 },  // CEntityIdentity->m_flags
    { 0x89b727c10692e033ull, 0xc8 },  // CGameSceneNode->m_vecAbsOrigin
    { 0x9f4c773fb92eaba8ull, 0x4a0 },  // C_BaseEntity->m_pGameSceneNode
    { 0x9320aed4f2ddf04bull, 0x4bc },  // C_BaseEntity->m_iHealth
    { 0x396bd442165e47e8ull, 0x557 },  // C_BaseEntity->m_iTeamNum
    { 0x1ff1d35b1575243eull, 0x698 },  // C_BaseEntity->m_hOwnerEntity
    { 0x79737564f6f2d233ull, 0x4f0 },  // C_BaseEntity->m_nSubclassID
    { 0xb61f1dc362857c87ull, 0x60 },  // CPlayer_WeaponServices->m_hActiveWeapon
    { 0x3c5213e0a7c01be8ull, 0x48 },  // CPlayer_WeaponServices->m_hMyWeapons
    { 0x4cb7c480e0dd5608ull, 0x48 },  // CCSPlayer_ItemServices->m_bHasDefuser
    { 0xcc213335eb672da1ull, 0x49 },  // CCSPlayer_ItemServices->m_bHasHelmet
    { 0xd68445ee808de532ull, 0x1190 },  // C_BasePlayerPawn->m_pWeaponServices
    { 0x10168edd02fb58edull, 0x1198 },  // C_BasePlayerPawn->m_pItemServices
    { 0x78eb5f5e8803797dull, 0x2b2c },  // C_CSPlayerPawn->m_ArmorValue
    { 0xfd1b2bf2e9afed9cull, 0x41d0 },  // C_CSPlayerPawn->m_angEyeAngles
    { 0x9241b8778dd136bdull, 0x83c },  // CBasePlayerController->m_hPawn
    { 0x205c00503ff5f03eull, 0x900 },  // CBasePlayerController->m_steamID
    { 0xd1949b00fc618a69ull, 0x990 },  // CCSPlayerController->m_pInGameMoneyServices
    { 0x5e9d171d2e85dce5ull, 0x9d0 },  // CCSPlayerController->m_iCompTeammateColor
    { 0x91f3227d5e5b0316ull, 0x9e8 },  // CCSPlayerController->m_sSanitizedPlayerName
    { 0x929f34a0c93099bcull, 0x40 },  // CCSPlayerController_InGameMoneyServices->m_iAccount
    { 0x521552f00a9307d4ull, 0x1128 },  // C_PlantedC4->m_bBombTicking
    { 0x1ae6fd70473ccac8ull, 0x1158 },  // C_PlantedC4->m_flC4Blow
    { 0xc78c595da4ebbdf9ull, 0x117c },  // C_PlantedC4->m_bBombDefused
    { 0x0da6b32698e9fb52ull, 0x1164 },  // C_PlantedC4->m_bBeingDefused
    { 0x5c0268a57eb4e518ull, 0x1178 },  // C_PlantedC4->m_flDefuseCountDown
    { 0xc11b1abece31bb76ull, 0x520 },  // CCSWeaponBaseVData->m_WeaponType
    { 0x891141f7499e7fdcull, 0x720 },  // CCSWeaponBaseVData->m_szName
    { 0x0d6ef18fd7bcdf6full, 0x140 },  // CSkeletonInstance->m_modelState
    { 0x3f67631b2a16580full, 0xa8 },  // CModelState->m_ModelName
};
