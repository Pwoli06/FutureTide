# 🌊 FutureTide

**See how our fossil-fuel choices could reshape the Southern Ocean: its sea ice, its krill, and the animals that depend on them.**

<!-- Screenshot: add docs/screenshot.png once the app renders -->

> ⚠️ **Illustrative scenarios, not predictions.** FutureTide's values are informed by published CMIP6 ranges. They are not output from FishCast's models. See [Data and disclaimer](#data-and-disclaimer).

---

## About

FutureTide is an interactive 3D simulator of the Southern Ocean. Pick a fossil-fuel pathway and a future year, and the underwater world changes: sea ice thins, krill swarms shrink, predators disappear, and krill drift outside protected waters.

The app has three tabs:

- **Simulation** (default): sail a research ship around a 3D globe to CCAMLR krill grounds, send a diver under the ice, turn the forcing clock from 2025 to 2100, compare two futures side by side, and open a Grok-written decision brief.
- **Explore**: one pathway and year in a 3D scene, with stats and a plain-language explanation.
- **Compare**: two scenarios side by side, with a difference table and a stress trajectory chart.

> 🙌 The **Simulation** (globe and dive scenes, HUD, and station model) was built by [@sohitpatro123](https://github.com/sohitpatro123) in [sohitpatro123/futuretide](https://github.com/sohitpatro123/futuretide) and integrated here.

It was built in 90 minutes for the **Georgia Tech Big Data Big Impact (BDBI) Grokathon** using Grok Bot and Cursor.

## Connection to BDBI FishCast

[FishCast](https://github.com/gt-big-data/fish-cast) models where **Antarctic krill** (*Euphausia superba*) live and how that may change with the climate, especially relative to the marine protected areas (MPAs) managed by CCAMLR. It combines KRILLBASE survey records with CMIP6 projections of sea surface temperature, sea ice, and chlorophyll-a.

FutureTide is a public-facing companion to that work. It uses **the same CMIP6 scenarios FishCast downloads** and turns its core question ("will krill move out of protected areas?") into something policymakers and the public can see.

## Scenarios

| Pathway | Fossil-fuel use | CMIP6 scenario |
| --- | --- | --- |
| 🟢 Reducing | Falls sharply | SSP1-2.6 |
| 🟡 Maintaining | Stays roughly as today | SSP2-4.5 |
| 🔴 Increasing | Keeps rising | SSP5-8.5 |

Each pathway is available for **2035, 2050, and 2100**, plus a present-day baseline (2025) for comparison.

## Features

- **Globe voyage and dive simulation**: steer with W A S D or the on-screen helm, drop waypoints on a polar chart, visit six CCAMLR krill grounds, then dive to see krill, salps, fish, ice, and the seafloor change with the forcing clock
- **Grok decision brief** per station, pathway, and year, built from the Grok-written text in `data/scenarios.json` (no API key or backend needed)
- **3D Southern Ocean scene**, with a sea-ice ceiling, glowing krill swarms, penguins and whales, water clarity, and a glowing MPA boundary, all driven by the scenario data
- **Pathway and year selectors** with smooth transitions between futures
- **Stats panel** showing sea temperature, sea ice, chlorophyll, krill density, hotspot probability, krill outside MPAs, predator health, and ecosystem stress, with changes compared with today
- **Plain-language explanations** for every scenario, written for non-specialists
- **Side-by-side comparison** of two futures
- **Always-visible disclaimer** and a list of sources

## How we used Grok Bot and Cursor

**Grok Bot**
- Reviewed the FishCast project page and repository. It found that our first coral-reef concept didn't match FishCast's Antarctic krill focus, so it reframed the app around the Southern Ocean.
- Mapped our three fossil-fuel pathways to the CMIP6 scenarios FishCast uses.
- Generated the structured scenario data (9 scenarios plus a baseline), checked it for consistency, and added plain-language explanations and parameters for the 3D visuals.
- Created this repository, committed the data, proposed the team split, and launched a Cursor cloud agent to build the app.

**Cursor**
- A Cursor cloud agent built the React and three.js app skeleton.
- Our team extended the scene, the UI, and the comparison view in Cursor.

## Tech stack

- [Vite](https://vitejs.dev/), React, and TypeScript
- [three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), and [@react-three/drei](https://github.com/pmndrs/drei)
- Simulation UI: [Tailwind CSS v4](https://tailwindcss.com/), [zustand](https://github.com/pmndrs/zustand), [Recharts](https://recharts.org/), and [lucide-react](https://lucide.dev/)
- Static site with no backend. Scenario data ships as JSON.

## Getting started

```bash
git clone https://github.com/Pwoli06/grokathon-project.git
cd grokathon-project
npm install
npm run dev      # start the local dev server
npm run build    # production build
```

## Project structure

| Path | What's in it | Owner |
| --- | --- | --- |
| `data/` | Scenario data (`scenarios.json`), types (`schema.ts`), generator (`gen.py`) | Data lead |
| `src/data/` | Typed loader and `getScenario(pathway, year)` | Data lead |
| `src/Root.tsx` | Top-level tabs (Simulation, Explore, Compare) and the always-on disclaimer strip | — |
| `src/components/futuretide/` | Simulation: `FutureTide.tsx` (shell), `GlobeScene.tsx` (ship and globe), `DiveScene.tsx` (underwater dive), `Hud.tsx` (panels, forcing clock, chart, brief) | [@sohitpatro123](https://github.com/sohitpatro123) |
| `src/lib/futuretide/` | Simulation model (`model.ts`, now driven by `data/scenarios.json`), state (`store.ts`), input, pose, and the static Grok brief (`briefing.ts`) | [@sohitpatro123](https://github.com/sohitpatro123) |
| `src/simulation.css` | Tailwind v4 theme for the simulation | [@sohitpatro123](https://github.com/sohitpatro123) |
| `public/textures/` | Earth texture for the globe | [@sohitpatro123](https://github.com/sohitpatro123) |
| `src/scene/` | 3D Southern Ocean world (Explore and Compare) | 3D lead |
| `src/ui/` | Selectors, stats panel, explanations, disclaimer | UI lead |
| `src/compare/` | Side-by-side comparison mode | UI lead |

## Data and disclaimer

All scenario values are **illustrative estimates**. We shaped them to match published magnitudes from IPCC AR6 and the krill literature (for example, Atkinson et al. 2019). They are **not** output from FishCast's models, and FishCast's own README notes that no climate-only model shows predictive skill yet. Antarctic sea ice projections are especially uncertain, so the 2050 and 2100 scenarios are marked low confidence. The share of krill outside MPAs is illustrative. In the Simulation, station-level readings are derived from the same scenario values with illustrative per-station weights, and sea-ice extent is converted to "ice days lost" at about 1.5 days per 1% of extent.

Field definitions and the SSP mapping are documented in [`data/README.md`](data/README.md).

## Team

- [@Pwoli06](https://github.com/Pwoli06)
- [@Barbarossa203](https://github.com/Barbarossa203)
- [@Glizzybaka](https://github.com/Glizzybaka)
- [@sohitpatro123](https://github.com/sohitpatro123)

## Sources

- IPCC (2021). *Climate Change 2021: The Physical Science Basis*, Working Group I, Chapter 9: Ocean, Cryosphere and Sea Level Change.
- IPCC (2019). *Special Report on the Ocean and Cryosphere in a Changing Climate (SROCC)*.
- Atkinson, A. et al. (2019). Krill (*Euphausia superba*) distribution contracts southward during rapid regional warming. *Nature Climate Change*, 9, 142–147.
- CMIP6 climate projections, [Copernicus Climate Data Store](https://cds.climate.copernicus.eu/datasets/projections-cmip6).
- [FishCast](https://github.com/gt-big-data/fish-cast), Georgia Tech Big Data Big Impact.
