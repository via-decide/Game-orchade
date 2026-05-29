# Zayvora Asset Manifest (Text-Only)

This manifest defines planned asset placeholders for the Zayvora mobile strategy/base-builder prototype. It is a planning document only: do not generate, download, or commit actual image, audio, font, model, archive, or compiled binary files unless the project rules are explicitly changed.

## Naming Convention

- `ui_*` — interface art, buttons, frames, icons, and HUD states.
- `bldg_*` — base structures and upgrade tiers.
- `unit_*` — friendly mobile units, defenders, scouts, and Skyships.
- `env_*` — terrain, resource nodes, weather, map dressing, and hazards.
- `fx_*` — non-audio visual effects such as glows, impacts, and build previews.
- `sfx_*` — short sound effects.
- `amb_*` — looping ambience beds.
- `mus_*` — music stingers or loops.

## Visual Assets

| Logical ID | Expected path | Format | Dimensions | Description |
|---|---|---:|---:|---|
| `ui_btn_upgrade` | `assets/icons/ui_btn_upgrade.svg` | SVG | 128x64 | Upgrade button with Aether circuit motif for build menus. |
| `ui_btn_construct` | `assets/icons/ui_btn_construct.svg` | SVG | 128x64 | Construction button for placing new base modules. |
| `ui_btn_recall_skyship` | `assets/icons/ui_btn_recall_skyship.svg` | SVG | 128x64 | Skyship recall/action button for mobile command UI. |
| `ui_icon_aether` | `assets/icons/ui_icon_aether.svg` | SVG | 64x64 | Primary resource icon for refined Aether. |
| `ui_icon_lumina` | `assets/icons/ui_icon_lumina.svg` | SVG | 64x64 | Secondary resource icon for Lumina crystals. |
| `ui_icon_alloy` | `assets/icons/ui_icon_alloy.svg` | SVG | 64x64 | Structural alloy resource icon. |
| `ui_panel_base_status` | `assets/icons/ui_panel_base_status.svg` | SVG | 512x256 | HUD panel frame for base health, storage, and queue state. |
| `ui_badge_mission_p0` | `assets/icons/ui_badge_mission_p0.svg` | SVG | 96x96 | Early mission badge for onboarding objectives. |
| `bldg_core_spire_lvl1` | `assets/sprites/bldg_core_spire_lvl1.svg` | SVG | 192x192 | Level 1 settlement heart and command anchor. |
| `bldg_aether_extractor_lvl1` | `assets/sprites/bldg_aether_extractor_lvl1.svg` | SVG | 160x160 | Starter extractor that harvests raw Aether from vents. |
| `bldg_lumina_grove_lvl1` | `assets/sprites/bldg_lumina_grove_lvl1.svg` | SVG | 160x160 | Organic Lumina production grove with crystalline canopy. |
| `bldg_skyship_dock_lvl1` | `assets/sprites/bldg_skyship_dock_lvl1.svg` | SVG | 192x192 | Dock where scouts and Skyships launch. |
| `bldg_refinery_lvl1` | `assets/sprites/bldg_refinery_lvl1.svg` | SVG | 192x192 | Aether refinery that converts raw Aether into usable fuel. |
| `bldg_veil_wall_segment` | `assets/sprites/bldg_veil_wall_segment.svg` | SVG | 96x96 | Defensive wall segment using projected veil energy. |
| `bldg_storm_beacon_lvl1` | `assets/sprites/bldg_storm_beacon_lvl1.svg` | SVG | 160x160 | Defensive beacon that disrupts hostile storm entities. |
| `bldg_chronoforge_lvl1` | `assets/sprites/bldg_chronoforge_lvl1.svg` | SVG | 192x192 | Late-game crafting structure for timed upgrades. |
| `unit_pathfinder` | `assets/sprites/unit_pathfinder.svg` | SVG | 96x96 | Friendly scout unit for revealing nearby terrain. |
| `unit_skyship_mender` | `assets/sprites/unit_skyship_mender.svg` | SVG | 160x96 | Support Skyship that repairs structures. |
| `unit_skyship_lancer` | `assets/sprites/unit_skyship_lancer.svg` | SVG | 160x96 | Combat Skyship with narrow-beam Aether lance. |
| `unit_ward_sentinel` | `assets/sprites/unit_ward_sentinel.svg` | SVG | 96x128 | Ground defender stationed near base chokepoints. |
| `env_tile_grassland` | `assets/textures/env_tile_grassland.svg` | SVG | 128x128 | Default buildable terrain tile. |
| `env_tile_aether_vent` | `assets/textures/env_tile_aether_vent.svg` | SVG | 128x128 | Resource vent tile for Aether extractor placement. |
| `env_tile_lumina_field` | `assets/textures/env_tile_lumina_field.svg` | SVG | 128x128 | Crystal field tile for Lumina grove placement. |
| `env_hazard_static_storm` | `assets/sprites/env_hazard_static_storm.svg` | SVG | 192x192 | Animated-source placeholder for map storm hazard. |
| `env_ruin_skygate` | `assets/sprites/env_ruin_skygate.svg` | SVG | 192x192 | Discoverable ancient ruin objective. |
| `fx_build_preview_valid` | `assets/sprites/fx_build_preview_valid.svg` | SVG | 160x160 | Green placement preview overlay. |
| `fx_build_preview_blocked` | `assets/sprites/fx_build_preview_blocked.svg` | SVG | 160x160 | Red blocked placement preview overlay. |
| `fx_aether_harvest_burst` | `assets/sprites/fx_aether_harvest_burst.svg` | SVG | 128x128 | Short visual burst for resource collection. |
| `fx_combat_laser_impact` | `assets/sprites/fx_combat_laser_impact.svg` | SVG | 128x128 | Impact flash for Skyship lance attacks. |

## Audio Assets

| Logical ID | Expected path | Format | Target length | Description |
|---|---|---:|---:|---|
| `sfx_ui_tap_soft` | `assets/audio/sfx_ui_tap_soft.ogg` | OGG | <1s | Soft tap confirmation for mobile UI. |
| `sfx_ui_upgrade_confirm` | `assets/audio/sfx_ui_upgrade_confirm.ogg` | OGG | <2s | Positive upgrade confirmation. |
| `sfx_build_place` | `assets/audio/sfx_build_place.ogg` | OGG | <2s | Structure placement sound with light mechanical settle. |
| `sfx_aether_collect` | `assets/audio/sfx_aether_collect.ogg` | OGG | <2s | Resource collection shimmer for Aether. |
| `sfx_lumina_collect` | `assets/audio/sfx_lumina_collect.ogg` | OGG | <2s | Crystal harvest chime for Lumina. |
| `sfx_skyship_launch` | `assets/audio/sfx_skyship_launch.ogg` | OGG | <3s | Skyship launch thruster swell. |
| `sfx_combat_laser` | `assets/audio/sfx_combat_laser.ogg` | OGG | <2s | Aether lance firing sound. |
| `sfx_storm_beacon_pulse` | `assets/audio/sfx_storm_beacon_pulse.ogg` | OGG | <3s | Defensive beacon pulse. |
| `sfx_warning_base_under_threat` | `assets/audio/sfx_warning_base_under_threat.ogg` | OGG | <3s | Short warning cue for incoming danger. |
| `amb_frontier_wind` | `assets/audio/amb_frontier_wind.ogg` | OGG | 30-60s loop | Low alien wind ambience for base view. |
| `amb_aether_vent_hum` | `assets/audio/amb_aether_vent_hum.ogg` | OGG | 20-40s loop | Subtle hum near Aether vent terrain. |
| `mus_base_dawn_loop` | `assets/audio/mus_base_dawn_loop.ogg` | OGG | 60-120s loop | Calm base management music loop. |
| `mus_storm_warning_stinger` | `assets/audio/mus_storm_warning_stinger.ogg` | OGG | <8s | Musical cue for storm or enemy pressure. |
