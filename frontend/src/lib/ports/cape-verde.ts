/**
 * Cape Verdean port coverage — hull cleaning only.
 *
 * Nine ports in the archipelago, all run by ENAPOR (Portos de Cabo Verde).
 * Seven are here. Porto Novo and Porto Inglês are not yet; Porto Grande is
 * not a separate entry because it IS Mindelo — UN/LOCODE lists CVGRA and
 * CVMIN at the same coordinates, and two pages for one harbour would compete
 * with each other.
 *
 * Brava's port is Furna. Fajã d'Água, which was the island's harbour until
 * 1843, is now a fishing and anchorage bay a few kilometres away, so it is
 * covered from the Furna page rather than given one of its own.
 *
 * Vale dos Cavaleiros and Furna have no UN/LOCODE. The nearest codes on the
 * UN list (CVSFL, CVBVR) are the São Filipe and Brava AIRPORTS, so the field
 * is left empty rather than filled with the wrong place.
 *
 * Every port carries `lineOverrides` turning hold and tank cleaning off: the
 * programme here is hull work, and several of these ports would otherwise
 * derive a tank line from fuel imports we have nothing specific to say about.
 */

import type { Port } from "./types";

const HULL_ONLY = { "hold-cleaning": false, "tank-cleaning": false } as const;

export const capeVerdePorts: Port[] = [
  {
    slug: "praia-port",
    name: "Praia",
    officialName: "Porto da Praia",
    aka: ["Porto da Praia", "Santiago", "Cabo Verde"],
    unlocode: "CVRAI",
    state: "Santiago",
    country: "Cape Verde",
    countryCode: "CV",
    coast: "Santiago, Sotavento islands",
    weather: "cape-verde",
    waterBody: "Atlantic Ocean",
    authority: "ENAPOR – Portos de Cabo Verde",
    type: "State Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: ["Containers", "General cargo", "Construction materials", "Fishing catch"],
    vesselTypes: [
      "Feeder container ships",
      "Inter-island ferries",
      "General cargo coasters",
      "Cruise ships",
      "Fishing vessels",
    ],
    airports: ["Praia (RAI)"],
    workAreas: [
      "main commercial quays",
      "ferry berths",
      "fishing quay",
      "anchorage in Praia bay",
    ],
    conditions:
      "Praia sits in a natural bay between Ponta Temerosa and Ponta das Bicudas, with the Ilhéu de Santa Maria to the west, and the quays are sheltered from the north-east trade wind that governs the rest of the archipelago. The water is ocean water rather than river or lagoon water, so visibility is good by the standards of the African coast, though it drops close to the quays with propeller wash and harbour traffic. The berths are busy with ferries and feeders, so in-water work is either sequenced around the ferry timetable or taken at the anchorage in the bay.",
    profile:
      "Praia is Cape Verde's capital and its second-busiest port after Mindelo, modernised in 2014 to 863 metres of quay and a maximum depth of 13.5 metres. It is the hub of the inter-island network — ferries run from here to seven of the other islands — as well as the main container and general cargo gateway for Santiago, with a fishing quay and a growing cruise trade alongside.",
    hook: "the capital's harbour and hub of the inter-island ferries",
    neighbours: ["vale-dos-cavaleiros-port", "furna-port", "mindelo-port"],
    visibility:
      "good — this is ocean water with no river runoff — though it drops for a while near the quays after ferry and feeder movements stir up the bottom",
    lineOverrides: HULL_ONLY,
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Praia's hull work is shaped by the ferry network. The inter-island ferries run fixed timetables out of here and spend their lives in warm Atlantic water with short turnarounds, so a hull clean has to fit between sailings rather than stop the service — typically overnight at the berth or during a scheduled lay day. The container feeders on the Europe–West Africa rotations are the other regular case: their berth time is set by the box count, so their hull is cleaned at the anchorage in the bay while they wait, not at the quay.",
        faq: {
          q: "Can an inter-island ferry be hull-cleaned in Praia without missing a sailing?",
          a: "Usually, yes. We plan the clean around the timetable — overnight at the berth or on a scheduled lay day — and size the dive team so the hull is finished inside that gap. Tell us the ferry's schedule and we work back from the next departure.",
        },
      },
      "propeller-polishing": {
        note:
          "The ferries out of Praia make hard crossings — the run to Fogo and Brava in particular is exposed to the trade wind sea, and crossing times stretch by hours in rough weather. On a vessel that burns fuel against a head sea several times a week, propeller roughness is paid for on every trip, and polishing is the cheapest efficiency gain available between dockings. For the feeders calling Praia on a liner rotation, the polish is best timed to the anchorage wait before the berth, so it costs no berth time at all.",
        faq: {
          q: "How often should a Cape Verde inter-island ferry have the propeller polished?",
          a: "More often than a deep-sea ship, because ferries run short, hard, frequent crossings. We set the interval from the vessel's fuel and performance data rather than a fixed calendar; for most ferries working out of Praia, a check at each hull clean and a polish whenever roughness has returned is the practical rhythm.",
        },
      },
      "thruster-cleaning": {
        note:
          "Ferries berth at Praia several times a week and they berth on their thrusters, often with the trade wind pushing them off or onto the quay. A tunnel that has fouled quietly over weeks of short trips costs exactly the thrust that makes those berthings safe. Because the ferries are in and out of Praia so often, a thruster clean here fits easily into a normal port stay — the thruster is isolated with the master, cleaned, and handed back before the next departure.",
        faq: {
          q: "Can you clean a ferry's bow thruster during a normal port stay in Praia?",
          a: "Yes. The thruster is isolated and tagged out with the master, the divers clean the tunnel, blades and gratings, and it is returned to service before the next sailing. For most ferries the job fits into an ordinary overnight stay.",
        },
      },
      "in-water-survey": {
        note:
          "Praia is one of the better places in the region for survey work, because it is ocean water rather than a river mouth or a lagoon. The limitation is the harbour itself: close to the busy quays, propeller wash from ferries and feeders stirs up the bottom and takes the visibility down for a while after each movement. Surveys here are therefore planned for a quiet period at the berth or done at the anchorage in the bay, where the water stays clearer, and agreed with the surveyor in advance.",
        faq: {
          q: "Is the water clear enough in Praia for a class in-water survey?",
          a: "Generally, yes — it is ocean water, clearer than most African ports. Near the quays, propeller wash from ferry and feeder movements reduces visibility for a time, so we plan the survey for a quiet period at the berth or carry it out at the anchorage in Praia bay.",
        },
      },
      "uwild-inspection": {
        note:
          "Cape Verde's main ship repair yard, Cabnave, is in Mindelo on another island; beyond that, a docking means leaving the archipelago. For a ferry that the island network depends on, or a feeder on a tight rotation, taking the vessel out of service for a dry dock is expensive in a way that goes beyond the yard bill. UWILD at Praia lets an eligible vessel earn the docking survey credit without leaving her route, and it is planned around the timetable like any other job here.",
        faq: {
          q: "Where is the nearest dry dock to Praia?",
          a: "The Cabnave ship repair yard in Mindelo, on São Vicente, is the country's main yard; otherwise the vessel has to leave the archipelago. For eligible vessels, UWILD in Praia earns the survey credit without that trip. We confirm eligibility with the class society before anything is booked.",
        },
      },
    },
  },
  {
    slug: "mindelo-port",
    name: "Mindelo",
    officialName: "Porto Grande do Mindelo",
    aka: ["Porto Grande", "Mindelo", "São Vicente", "Cabo Verde"],
    unlocode: "CVMIN",
    state: "São Vicente",
    country: "Cape Verde",
    countryCode: "CV",
    coast: "São Vicente, Barlavento islands",
    weather: "cape-verde",
    waterBody: "Mindelo Bay (Porto Grande), Atlantic Ocean",
    authority: "ENAPOR – Portos de Cabo Verde",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: ["Containers", "Fuel and bunkers", "General cargo", "Fishing catch"],
    vesselTypes: [
      "Transatlantic vessels calling for bunkers",
      "Cruise ships",
      "Feeder container ships",
      "Fishing vessels",
      "Inter-island ferries",
    ],
    airports: ["São Vicente (VXE)"],
    workAreas: [
      "commercial quays of Porto Grande",
      "Mindelo cruise terminal",
      "bunkering anchorage in the bay",
      "fishing port",
    ],
    conditions:
      "Porto Grande is a bay formed in an old, drowned volcanic crater, which is what makes it the deepest and best-sheltered natural harbour in the archipelago. Inside the bay the water is calm and — away from the working quays — clear. The exposure is in the approaches: the channel between São Vicente and Santo Antão funnels the north-east trade wind and can run a rough sea when the trades are strong, so launches and dive support are planned against the wind as well as the berth.",
    profile:
      "Mindelo's Porto Grande is Cape Verde's busiest port and its historic mid-Atlantic stop — a coaling station in the age of steam and a bunkering call today for ships crossing between Europe, South America and West Africa. A new cruise terminal with a 400-metre quay opened in June 2025, Cabnave, the country's main ship repair yard, is in the same bay, and an EU-backed expansion is adding quay for transhipment and bunkering.",
    hook: "the mid-Atlantic bunkering stop inside a drowned volcanic crater",
    neighbours: ["tarrafal-sao-nicolau-port", "palmeira-port", "praia-port"],
    visibility:
      "the best of any Cape Verdean harbour inside the sheltered crater bay, reduced only close to the busy commercial quays",
    lineOverrides: HULL_ONLY,
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Many ships come into Porto Grande for one thing: bunkers on the way across the Atlantic. That stop is the hull cleaning opportunity. The vessel is stationary in the sheltered bay for the length of the bunkering, and a dive team working alongside can clean the hull in the same window — so the ship leaves on a long ocean passage with a clean bottom, which is where the fuel saving is largest. It is one call, one stop and no deviation.",
        faq: {
          q: "Can the hull be cleaned in Mindelo while the vessel takes bunkers?",
          a: "Yes, and that is the most efficient way to do it. The bay is sheltered, the vessel is stationary for the bunkering anyway, and the clean runs in parallel under the usual safety arrangements agreed with the master and the bunker supplier. She then starts her ocean passage with a clean hull.",
        },
      },
      "propeller-polishing": {
        note:
          "A ship leaving Mindelo after bunkering is usually starting a long ocean leg — to South America, to Europe or down the African coast. That is the passage where propeller efficiency matters most, and a polish done in the bay during the bunker call is working for every mile of it. The sheltered crater water makes Mindelo a comfortable place for divers to take a propeller to a full Class A finish rather than a rushed partial job.",
        faq: {
          q: "Is it worth polishing the propeller at Mindelo during a bunker stop?",
          a: "For a vessel starting a long ocean passage, yes — the polished propeller works for the whole leg, and the bunker stop already has her stationary in sheltered water. We fit the polish inside the bunkering window so there is no extra port time.",
        },
      },
      "thruster-cleaning": {
        note:
          "Mindelo's cruise trade has grown fast, and the new cruise terminal opened in June 2025. Cruise ships lean on their bow thrusters for every berthing, often on a tight schedule with passengers waiting, and a thruster that has lost power to fouling shows up at exactly the wrong moment. The same goes for the ferries across to Santo Antão, which berth in the strong trade wind coming down the channel. A thruster clean in Mindelo is quick in the sheltered bay and is planned around the ship's time alongside.",
        faq: {
          q: "Can you clean a cruise ship's thrusters during a call at Mindelo?",
          a: "Yes. The work is planned around the ship's time at the cruise terminal, with the thrusters isolated and tagged out with the bridge. The sheltered bay makes it a straightforward dive, and the thrusters are handed back before departure.",
        },
      },
      "in-water-survey": {
        note:
          "The crater bay at Mindelo gives the best in-water survey conditions in Cape Verde: sheltered from the trade wind sea, deep, and clearer than any mainland African harbour. That matters for class work, because a surveyor accepts in-water findings only when the picture is good enough to judge the structure. Close to the working quays the water is busier, so surveys are usually done at a quiet berth or at anchor further into the bay.",
        faq: {
          q: "Is Mindelo a good place for an in-water class survey?",
          a: "It is the best in Cape Verde. The bay is a sheltered volcanic crater with clear ocean water, which gives the surveyor a good live picture. We plan the survey at a quiet berth or at anchor inside the bay, away from traffic near the working quays.",
        },
      },
      "uwild-inspection": {
        note:
          "Mindelo is the one port in Cape Verde where a dry dock is close at hand: Cabnave, the country's main ship repair yard, is in the same bay. That makes the UWILD decision here a straight comparison rather than a necessity. If the vessel is eligible and the scope is inspection only, UWILD keeps her trading and avoids the yard's queue. If the inspection is likely to find work that needs the ship out of the water, a docking at Cabnave may be the better call — and we would rather say so up front.",
        faq: {
          q: "Should we do UWILD in Mindelo or dock at Cabnave?",
          a: "It depends on what the survey needs. If the vessel is eligible and the scope is inspection only, UWILD keeps her in service and avoids the yard. If repairs below the waterline are likely, docking at Cabnave in the same bay may make more sense. We check eligibility with class and give you an honest comparison before anything is booked.",
        },
      },
    },
  },
  {
    slug: "palmeira-port",
    name: "Palmeira",
    officialName: "Porto da Palmeira",
    aka: ["Porto da Palmeira", "Sal", "Ilha do Sal", "Cabo Verde"],
    unlocode: "CVPAL",
    state: "Sal",
    country: "Cape Verde",
    countryCode: "CV",
    coast: "Sal, Barlavento islands",
    weather: "cape-verde",
    waterBody: "Baía da Palmeira, Atlantic Ocean",
    authority: "ENAPOR – Portos de Cabo Verde",
    type: "State Port",
    condition: "clear-water",
    waiting: "mixed",
    cargoes: ["Fuel imports", "Containers", "General cargo", "Fishing catch"],
    vesselTypes: [
      "Product tankers delivering fuel",
      "Container and RoRo coasters",
      "Inter-island ferries",
      "Fishing vessels",
    ],
    airports: ["Sal (SID)"],
    workAreas: [
      "commercial pier",
      "fuel discharge berth",
      "anchorage in Palmeira bay",
    ],
    conditions:
      "Palmeira is on the west side of Sal, in the lee of an island that is flat, dry and swept by the north-east trade wind for most of the year. The island takes the wind; the bay behind it is calm. With almost no rainfall and no rivers, nothing clouds the water, and visibility here is among the best on the whole coverage list. The main constraint is the size of the port — a small pier that the fuel tankers, coasters and ferries share — so in-water work is planned around the berth schedule or taken at anchor in the bay.",
    profile:
      "Palmeira is the main port of Sal and the third-busiest port in Cape Verde by freight. It is a key fuel import point for the country — handling around a fifth of national energy needs — and it supplies an island whose economy runs on its international airport and resort tourism. The port opened in 1986 and was expanded in 2010 and 2015, with a further extension now planned.",
    hook: "Sal's fuel import port in some of the clearest water on our list",
    neighbours: ["sal-rei-port", "mindelo-port", "praia-port"],
    visibility:
      "excellent: Sal has no rivers and almost no rain, so nothing clouds the water in the bay",
    lineOverrides: HULL_ONLY,
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Much of the traffic at Palmeira is product tankers bringing fuel for Sal — its airport and its resorts — and they tend to come back on a regular pattern. A tanker discharging here is stationary for hours in some of the calmest, clearest water on the Cape Verde coast, which makes it an easy place to clean a hull thoroughly and to film it well. The clean is agreed with the master and the terminal first, because work beside a fuel discharge follows the terminal's safety rules, not ours.",
        faq: {
          q: "Can a tanker's hull be cleaned while she discharges fuel at Palmeira?",
          a: "Only where the terminal's safety rules allow it, and that is agreed before the job. Where in-water work during discharge is not permitted, we clean at anchor in Palmeira bay before or after she comes alongside. The calm, clear water on this side of Sal makes either option a good working environment.",
        },
      },
      "propeller-polishing": {
        note:
          "The tankers and coasters serving Sal run short, regular voyages, and a vessel that spends much of her time on short legs and waiting at anchor lets growth build on the propeller faster than her mileage would suggest. Palmeira's clear water helps: the diver can see the blade surface properly, so the polish is finished to an even standard across the whole blade and the before-and-after record is good enough to use in the performance file.",
        faq: {
          q: "Why polish a propeller at Palmeira rather than at a bigger port?",
          a: "Because the water here is unusually clear and calm, which means a better-finished polish and a better video record. For tankers and coasters on a regular run to Sal, it also fits the call they are already making — no extra port stay needed.",
        },
      },
      "thruster-cleaning": {
        note:
          "Palmeira is a small port with a lot of different users on one short pier — tankers, coasters, RoRo cargo and ferries — so vessels berth tight and depend on their thrusters to do it. Sal's trade wind blows across the island and the bay, and a fouled thruster tunnel shows up when a coaster is trying to hold her bow against it. A thruster clean at the anchorage before berthing gives the thrust back when the tight berthing needs it.",
        faq: {
          q: "Can the thruster be cleaned at anchor before we come alongside at Palmeira?",
          a: "Yes. With the thruster isolated and tagged out, the divers clean the tunnel, blades and gratings at the anchorage in Palmeira bay, and it is back in service before the berthing. The calm water in the bay makes it a quick job.",
        },
      },
      "in-water-survey": {
        note:
          "For a class surveyor, visibility is everything, and Palmeira has more of it than almost any port a vessel is likely to call at in this part of the Atlantic. Sal has no rivers and very little rain, so there is no runoff and no silt to cloud the water. That makes it possible to record wide shots of the hull as well as close detail — the kind of evidence a surveyor can sign off with confidence rather than qualify.",
        faq: {
          q: "What are survey conditions like at Palmeira?",
          a: "Very good. Sal is dry and has no rivers, so the water in the bay is clear and calm, which supports both wide shots and close inspection. It is one of the best places on the Cape Verde coast for an in-water class survey.",
        },
      },
      "uwild-inspection": {
        note:
          "The vessels that keep Sal supplied — tankers and coasters on a regular run — are exactly the ships an owner least wants to take off their route for a dry dock, and there is no docking facility on the island. Where one is eligible, UWILD at Palmeira takes advantage of the clear water to produce a strong inspection record without leaving the trade. Eligibility comes first: small tankers and older vessels have their own rules, and we check them with class before any cost is committed.",
        faq: {
          q: "Is Palmeira a good place for a UWILD inspection?",
          a: "Conditions are excellent — calm, clear water on the lee side of Sal. The first step is eligibility: we check the vessel's age, type and class notation with the class society before anything is booked. If she qualifies, the clear water helps produce a strong inspection record.",
        },
      },
    },
  },
  {
    slug: "sal-rei-port",
    name: "Sal Rei",
    officialName: "Porto de Sal-Rei",
    aka: ["Sal-Rei", "Boa Vista", "Cabo Verde"],
    unlocode: "CVSAR",
    state: "Boa Vista",
    country: "Cape Verde",
    countryCode: "CV",
    coast: "Boa Vista, Barlavento islands",
    weather: "cape-verde",
    waterBody: "Atlantic Ocean, behind the Ilhéu de Sal Rei",
    authority: "ENAPOR – Portos de Cabo Verde",
    type: "State Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: ["Construction materials", "Containers", "General cargo", "Food and supplies"],
    vesselTypes: [
      "General cargo and container coasters",
      "Inter-island ferries",
      "Fishing vessels",
    ],
    airports: ["Boa Vista (BVC)"],
    workAreas: [
      "160-metre wharf behind the breakwater",
      "anchorage off Sal Rei",
    ],
    conditions:
      "Sal Rei's wharf, built in 2015, is 160 metres long with a minimum depth of 7 metres and is protected by a 930-metre breakwater, so the berth itself is sheltered. Outside it, Boa Vista is a low, sandy island ringed by shoals and reefs — its coast is known for its shipwrecks — and the sand the trade wind carries off the island clouds the shallow water near the shore. Vessels that are too big for the wharf lie at anchor off the town.",
    profile:
      "Sal Rei is the port of Boa Vista, the third-largest island in Cape Verde and one of its fastest-growing tourism destinations. The port's traffic is building materials, containers and supplies for the island's resorts, plus the inter-island ferries, and the small Ilhéu de Sal Rei lies about a kilometre offshore.",
    hook: "the supply port of Boa Vista on a reef-lined coast",
    neighbours: ["palmeira-port", "praia-port", "mindelo-port"],
    visibility:
      "good in deeper water but reduced near the shore, where sand blown and washed off the island hangs in the shallows",
    lineOverrides: HULL_ONLY,
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Most of what comes into Sal Rei is on coasters carrying building materials and supplies for Boa Vista's resorts, and a coaster on this kind of island run spends a lot of time slow or stationary in warm water. With only one 160-metre wharf, berth time is short and in demand, so the practical plan is often to clean at anchor off the town before she comes in, then let her work cargo without anyone in the water.",
        faq: {
          q: "Is the hull cleaned alongside or at anchor at Sal Rei?",
          a: "Usually at anchor. There is a single 160-metre wharf, and its time is needed for cargo, so we clean at the anchorage off Sal Rei before the vessel berths. Alongside work is possible where the berth schedule and the port allow it.",
        },
      },
      "propeller-polishing": {
        note:
          "The waters around Boa Vista are shallow and sandy near the coast, and the fine sand the trade wind lifts off the island ends up in the water. For a propeller, sand in the water column adds a slow abrasive wear on top of the usual fouling, so a polish here is also a chance to look carefully at the blade edges for erosion and small damage. Anything found is photographed and reported rather than polished over.",
        faq: {
          q: "Do you check for blade damage when polishing at Sal Rei?",
          a: "Always, and it matters more here. Boa Vista's shallow, sandy coast means sand in the water, which can wear the blade edges. We inspect both faces, the edges and the tips, and any erosion or damage is photographed and reported rather than polished over.",
        },
      },
      "thruster-cleaning": {
        note:
          "The wharf at Sal Rei is short and sits behind a breakwater, so the ferries and coasters that use it have to turn and berth in limited space with the trade wind blowing across the harbour. That is a job for the bow thruster, and it is the job a fouled thruster fails at. A clean at anchor before berthing, with the thruster isolated and tagged out, makes sure the thrust is there when the vessel needs it.",
        faq: {
          q: "Why does thruster condition matter so much at Sal Rei?",
          a: "Because the harbour is tight. Vessels turn and berth at a short wharf behind the breakwater, usually with the trade wind across them, and they rely on the bow thruster to do it. We clean the tunnel, blades and gratings at anchor before berthing.",
        },
      },
      "in-water-survey": {
        note:
          "Boa Vista's reefs and shoals are the reason a survey at Sal Rei is sometimes not routine at all: a vessel that has touched bottom on the approach needs her hull checked before she sails, and the diver's findings are what the owner, the insurer and class will decide on. We can put a diver down quickly for a damage survey as well as for a planned class survey, with live video to the surface and a report the surveyor can use.",
        faq: {
          q: "Can you do an underwater damage survey at Sal Rei after a grounding or a touch?",
          a: "Yes. Boa Vista's coast has many shoals, and after a touch the hull should be checked before the vessel sails. We carry out an underwater damage survey with live video to the surface so the surveyor, the owner and the insurer can see the damage, followed by a full report.",
        },
      },
      "uwild-inspection": {
        note:
          "The coasters serving Boa Vista are often small, older vessels, and UWILD eligibility depends heavily on age, type and class notation. So a UWILD enquiry here starts with those questions rather than with a date. Where a vessel qualifies, doing the inspection at the anchorage off Sal Rei keeps her on the island run instead of sailing off to find a dock, and the sheltered water behind the breakwater gives a steady platform for the dive.",
        faq: {
          q: "Can a small coaster do UWILD at Sal Rei?",
          a: "It can if she is eligible, and for small, older coasters that is the first thing to check. We confirm eligibility with the class society before anything is booked. If she qualifies, the inspection is done at anchor off Sal Rei or at the wharf, depending on the berth schedule.",
        },
      },
    },
  },
  {
    slug: "tarrafal-sao-nicolau-port",
    name: "Tarrafal",
    officialName: "Porto do Tarrafal de São Nicolau",
    aka: ["Tarrafal de São Nicolau", "São Nicolau", "Cabo Verde"],
    unlocode: "CVTAR",
    state: "São Nicolau",
    country: "Cape Verde",
    countryCode: "CV",
    coast: "São Nicolau, Barlavento islands",
    weather: "cape-verde",
    waterBody: "Atlantic Ocean",
    authority: "ENAPOR – Portos de Cabo Verde",
    type: "State Port",
    condition: "clear-water",
    waiting: "berth-driven",
    cargoes: ["Fishing catch and canned tuna", "General cargo", "Food and supplies"],
    vesselTypes: [
      "Tuna fishing vessels",
      "Inter-island ferries",
      "General cargo coasters",
    ],
    airports: ["São Nicolau (SNE)", "São Vicente (VXE)"],
    workAreas: ["port quay", "fishing boat moorings", "anchorage off Tarrafal"],
    conditions:
      "Tarrafal is on the south-west coast of São Nicolau, in the lee of the island's mountains, and the sea bed drops away quickly offshore, so there is deep, clear ocean water close to the port. The trade wind is broken by the island but can come down off the high ground in gusts. The port is small and its quay is shared by ferries, coasters and the fishing fleet, so in-water work is fitted around them or done at anchor off the town.",
    profile:
      "Tarrafal is the main port of São Nicolau and a fishing town above all: the Sucla tuna cannery here is one of the island's largest employers, processing tuna caught in the surrounding waters. Ferries and coasters connect the island to Mindelo and Praia, and the rest of the traffic is the fishing fleet that supplies the cannery.",
    hook: "São Nicolau's tuna port with deep clear water close inshore",
    neighbours: ["mindelo-port", "palmeira-port", "praia-port"],
    visibility:
      "very good, with deep, clear ocean water close to the port and no river runoff",
    lineOverrides: HULL_ONLY,
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Tarrafal's working fleet is fishing vessels supplying the tuna cannery, and fishing boats foul differently from cargo ships: they spend long periods slow or stationary on the fishing grounds, and their hulls carry growth that costs them speed and fuel on the run back to port. Cleaning in Tarrafal's deep, clear water close to the port is straightforward, and for a fishing vessel it is usually done between trips so it costs no fishing time.",
        faq: {
          q: "Do you clean fishing vessel hulls in Tarrafal?",
          a: "Yes — the fishing fleet is the main in-water customer here. We clean between trips, alongside or at anchor off Tarrafal, so the vessel loses no time on the fishing grounds. The deep, clear water close to the port makes it a quick and well-documented job.",
        },
      },
      "propeller-polishing": {
        note:
          "In a fishing port the propeller has a second problem besides growth: lines and netting. A fishing vessel that picks up rope or net around the shaft loses power and risks damaging the seal, and clearing it is a diver's job. At Tarrafal we combine the two — remove anything wrapped around the propeller, shaft and rope guard, check the seal area, then polish the blades — so the vessel goes back out with full power.",
        faq: {
          q: "Can you clear rope or net from a propeller at Tarrafal?",
          a: "Yes, and we check the shaft seal and rope guard while we are there. For a fishing vessel it makes sense to do this together with a propeller polish, so she goes back to sea with a clear shaft and a clean propeller.",
        },
      },
      "thruster-cleaning": {
        note:
          "The inter-island ferries that call at Tarrafal berth at a small quay, often with gusts coming down off São Nicolau's high ground, and they rely on their bow thrusters to hold position. Thrusters on these ferries work hard and are rarely looked at between dockings. A clean during a port stay at Tarrafal — tunnel, blades and gratings — restores the thrust for the next tricky berthing.",
        faq: {
          q: "Which vessels at Tarrafal usually need thruster cleaning?",
          a: "Mainly the inter-island ferries, which berth at a small quay and rely on their bow thrusters, sometimes in gusty conditions. Most fishing vessels here have no thruster. The clean is done during a normal port stay, with the thruster isolated first.",
        },
      },
      "in-water-survey": {
        note:
          "Deep water close to the shore and no river runoff give Tarrafal clear water for survey work. For the ferries and coasters that call here, that means a class in-water survey can be done without moving to a bigger port, provided the surveyor can attend. We agree the programme with class first, and because the port is small we plan the survey around the ferry and fishing traffic so the quay stays clear.",
        faq: {
          q: "Can a class in-water survey be done at Tarrafal, or should we go to Mindelo?",
          a: "It can be done at Tarrafal — the water is deep and clear close to the port. The main question is the surveyor's travel and the quay schedule. If the surveyor is based in Mindelo, combining the survey with a Mindelo call can be simpler; we will advise which is better for your vessel.",
        },
      },
      "uwild-inspection": {
        note:
          "The ships that call regularly at Tarrafal — ferries, coasters and fishing vessels — include many that are either too small for UWILD rules to apply in the usual way or too old to be eligible, so the honest first step here is an eligibility check. Where a ferry or coaster does qualify, the clear water off Tarrafal supports a proper inspection record, and it saves the vessel a trip out of the archipelago to find a dock.",
        faq: {
          q: "Is UWILD available for ferries and coasters calling at Tarrafal?",
          a: "Where the vessel is eligible, yes. Many small and older vessels are not, so we check eligibility with the class society first. If she qualifies, the inspection can be done in Tarrafal's clear water without leaving the archipelago.",
        },
      },
    },
  },
  {
    slug: "vale-dos-cavaleiros-port",
    name: "Vale dos Cavaleiros",
    officialName: "Porto de Vale dos Cavaleiros",
    aka: ["Vale de Cavaleiros", "Fogo", "São Filipe", "Cabo Verde"],
    state: "Fogo",
    country: "Cape Verde",
    countryCode: "CV",
    coast: "Fogo, Sotavento islands",
    weather: "cape-verde",
    waterBody: "Atlantic Ocean",
    authority: "ENAPOR – Portos de Cabo Verde",
    type: "State Port",
    condition: "anchorage",
    waiting: "berth-driven",
    cargoes: ["General cargo", "Construction materials", "Food and supplies"],
    vesselTypes: ["Inter-island ferries", "General cargo coasters"],
    airports: ["São Filipe (SFL)", "Praia (RAI)"],
    workAreas: ["two short piers behind the breakwater", "anchorage off the port"],
    conditions:
      "Vale dos Cavaleiros sits on the exposed west coast of Fogo, about three kilometres north of São Filipe, and the Atlantic swell that reaches this coast is the deciding factor for any in-water work. The port was rebuilt in 2013 with a heavy breakwater and two short piers — 70 and 95 metres long, both about 5 metres deep — which is enough for ferries and coasters but leaves little water under the keel. Larger coasters and any dive that needs room lie off the port at anchor.",
    profile:
      "Vale dos Cavaleiros is the only port on Fogo, the volcanic island crowned by Pico do Fogo. It is the island's lifeline — ferries to Praia and Brava and coasters bringing cargo and supplies — and the crossing from Praia can stretch from three and a half to five hours in rough weather. ENAPOR is preparing a master plan to expand it.",
    hook: "Fogo's only port on an exposed Atlantic coast",
    neighbours: ["furna-port", "praia-port", "mindelo-port"],
    hullFinding:
      "The ferries and coasters serving Fogo are rarely idle for long — they run the island's supply on a tight schedule — so the fouling we find is steady, even growth from constant short trips in warm water rather than the heavy build-up of a long wait. The niches are the exception: thruster tunnels, sea chests and the stern gear collect growth that the hull flow never clears.",
    hullWindow:
      "Not usually at the berth. The piers are short and shallow and are needed for the next ferry or coaster, so hull work is done at anchor off the port — or, for a ferry, during a lay-over — in a window the swell allows.",
    visibility:
      "usually good — it is open ocean water — but swell stirs up the dark volcanic sand in the shallows near the piers",
    lineOverrides: HULL_ONLY,
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "The piers at Vale dos Cavaleiros are only about 5 metres deep, and a ferry or coaster alongside has very little water under her keel — too little for a diver to work the flat bottom safely. So a full hull clean here is done at anchor off the port, in a window the swell allows, and only the vertical sides are practical alongside. Because the Atlantic swell on this coast is the main risk, the job is planned against the forecast with standby built in.",
        faq: {
          q: "Can the hull be cleaned alongside at Vale dos Cavaleiros?",
          a: "Only partly. The berths are about 5 metres deep, which leaves too little clearance under most keels for safe work on the flat bottom. A full clean is done at anchor off the port, in a swell window, with standby time allowed for the weather.",
        },
      },
      "propeller-polishing": {
        note:
          "The ferries serving Fogo run one of the roughest routes in the archipelago, where the crossing from Praia can take up to five hours in heavy weather. Driving through that sea with a rough propeller wastes fuel on every crossing. Because of the shallow berth, polishing is done at anchor off Vale dos Cavaleiros in a calm spell, and the result is recorded so the ferry operator can see the effect in the fuel figures.",
        faq: {
          q: "Where is the propeller polished at Vale dos Cavaleiros?",
          a: "At anchor off the port, because the berths are shallow. We wait for a calm spell in the swell and complete the polish in one dive window, with before-and-after video for the operator's records.",
        },
      },
      "thruster-cleaning": {
        note:
          "Berthing at Vale dos Cavaleiros means bringing a ferry into a small harbour behind a breakwater, onto a short pier, often with swell running outside. That takes a strong bow thruster. A thruster that has lost power to fouling makes every berthing harder and more dependent on the weather. Cleaning the tunnel, blades and gratings restores the thrust — and because the thruster tunnel is higher on the hull than the keel, it can often be worked alongside even when the bottom cannot.",
        faq: {
          q: "Can the thruster be cleaned alongside at Vale dos Cavaleiros even though the berth is shallow?",
          a: "Often, yes. The bow thruster tunnel sits higher than the keel, so it can usually be reached alongside, where the flat bottom cannot. The thruster is isolated first, and if the swell makes the berth unsafe for divers, the job moves to the anchorage.",
        },
      },
      "in-water-survey": {
        note:
          "A class survey needs the diver to cover the whole underwater hull, including the flat bottom, and at Vale dos Cavaleiros that cannot be done alongside because the berths are too shallow. Surveys here are done at anchor off the port, where the swell rather than the water clarity sets the window. Where the timing is tight, it is often better to plan the survey for the vessel's next call at Praia, and we will say so if that is the case.",
        faq: {
          q: "Is Vale dos Cavaleiros suitable for an in-water class survey?",
          a: "It is possible at anchor off the port in a calm window, but not alongside, where the berths are too shallow for work on the flat bottom. If the timing is tight, the vessel's next call at Praia may be the better place, and we will advise honestly which to choose.",
        },
      },
      "uwild-inspection": {
        note:
          "The vessels that serve Fogo are the island's lifeline, and taking one out of service for a docking outside the archipelago leaves a gap in the island's supply. UWILD can avoid that for an eligible vessel. Because of the shallow berth and exposed coast, the inspection itself is planned at anchor in a swell window here, or at Praia if that suits the timetable better — the goal is to keep the ferry on her route.",
        faq: {
          q: "Where would UWILD be done for a ferry serving Fogo?",
          a: "Either at anchor off Vale dos Cavaleiros in a calm window, or at Praia, whichever fits the ferry's timetable and the surveyor's attendance better. We check eligibility with class first, then plan the location around keeping the ferry in service.",
        },
      },
    },
  },
  {
    slug: "furna-port",
    name: "Furna",
    officialName: "Porto da Furna",
    aka: ["Brava", "Fajã d'Água", "Cabo Verde"],
    state: "Brava",
    country: "Cape Verde",
    countryCode: "CV",
    coast: "Brava, Sotavento islands",
    weather: "cape-verde",
    waterBody: "Atlantic Ocean",
    authority: "ENAPOR – Portos de Cabo Verde",
    type: "State Port",
    condition: "anchorage",
    waiting: "berth-driven",
    cargoes: ["General cargo", "Food and supplies"],
    vesselTypes: ["Inter-island ferries", "Small cargo coasters", "Fishing boats"],
    airports: ["São Filipe (SFL) on Fogo, then ferry", "Praia (RAI), then ferry"],
    workAreas: [
      "ferry berth in Furna bay",
      "anchorage off Furna",
      "Fajã d'Água bay on the north-west coast",
    ],
    conditions:
      "Furna is a small natural bay on the north-east coast of Brava, the smallest inhabited island in Cape Verde, and it is exposed to the Atlantic in a way the bigger harbours are not — in 1982 the tropical storm Beryl sent waves of up to ten metres into the bay and destroyed boats and houses. The port was improved in 2000, but it remains a tight berth for the ferries, and swell decides when a diver can work. Fajã d'Água, the island's harbour until 1843, is a sheltered bay a few kilometres away on the north-west coast that is still used as an anchorage.",
    profile:
      "Furna is Brava's only port and, with no scheduled flights to the island, its only link to the rest of the country: ferries to São Filipe on Fogo and to Praia on Santiago, and small coasters bringing everything the island needs. It has been the island's main harbour since 1843, when it took over from Fajã d'Água.",
    hook: "Brava's only link to the outside world",
    neighbours: ["vale-dos-cavaleiros-port", "praia-port", "mindelo-port"],
    hullFinding:
      "The ferries that serve Brava are working vessels on a timetable, not ships waiting at anchor, so hull growth builds steadily between dockings rather than in one long idle spell. What we find most often is heavier growth in the sheltered niches — thruster tunnels, sea chest gratings and around the stern gear — where the flow over the hull never reaches.",
    hullWindow:
      "Not while a ferry is working the berth — the bay is small and the berth is needed for arrivals. Hull work is done at anchor off Furna or in the calmer bay at Fajã d'Água during a lay-over, so the ferry keeps her timetable.",
    visibility:
      "good in calm conditions, since it is clear Atlantic water, but swell working into the small bay stirs the bottom and reduces it",
    lineOverrides: HULL_ONLY,
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Every ferry that serves Brava calls at Furna, and when one of them is out of service the island is cut off. That is the constraint on hull work here: it has to be done without taking the ferry off the timetable, in a small bay where the berth is needed for the next arrival. In practice the clean is done at anchor off Furna, or in the calmer water of Fajã d'Água, during a lay-over — and only when the swell allows a diver to work safely.",
        faq: {
          q: "Where can a ferry's hull be cleaned at Brava?",
          a: "At anchor off Furna, or in the calmer bay at Fajã d'Água, during a lay-over so the ferry keeps her timetable. The berth at Furna is small and needed for arrivals, and swell decides the window, so we plan with standby time allowed.",
        },
      },
      "propeller-polishing": {
        note:
          "The Brava ferries run a short but open-water route to Fogo and a longer one to Praia, both exposed to the trade wind sea, and small ferries feel propeller roughness quickly in fuel and speed. Because Furna itself is exposed, the polish is best planned for a calm day at anchor, or for the ferry's call at Praia or Vale dos Cavaleiros if the forecast at Brava is poor. We plan it around the route, not just one port.",
        faq: {
          q: "Is it better to polish a Brava ferry's propeller at Furna or somewhere else on her route?",
          a: "Whichever port on the route has the best conditions at the time. Furna is exposed, so if the swell is up we may suggest doing it at Praia or Vale dos Cavaleiros instead. The goal is the job done well without taking the ferry out of service.",
        },
      },
      "thruster-cleaning": {
        note:
          "Turning a ferry in Furna's small bay and bringing her onto the berth takes every bit of bow thrust she has, especially with swell working into the bay. A fouled thruster makes that harder and more weather-dependent — and for an island with no other link, a ferry that cannot berth is a real problem. Keeping the thruster clean is part of keeping the service running, and we plan the clean during a lay-over when the bay is calm.",
        faq: {
          q: "Why is thruster condition so important at Furna?",
          a: "Because the bay is small and the ferries have to turn and berth in tight space, often with swell coming in. A strong bow thruster makes that safer and less dependent on the weather. We clean the tunnel, blades and gratings during a lay-over when the bay is calm.",
        },
      },
      "in-water-survey": {
        note:
          "Furna's water is clear Atlantic water, but the bay's exposure means a survey here depends entirely on the swell. For a planned class survey, the more reliable choice is usually a larger port on the ferry's route, such as Praia, where the surveyor can attend easily and the conditions are steadier. Furna and the sheltered bay at Fajã d'Água are better suited to a quick inspection or a damage check when the vessel cannot wait.",
        faq: {
          q: "Can a class in-water survey be done at Brava?",
          a: "It can be done in a calm spell, either at anchor off Furna or at Fajã d'Água. But for a planned class survey, a larger port on the ferry's route, such as Praia, is usually more reliable. Brava is better for a quick inspection or damage check that cannot wait.",
        },
      },
      "uwild-inspection": {
        note:
          "For the ferries that are Brava's only link to the rest of Cape Verde, a docking trip out of the archipelago is costly for the island as well as the owner. UWILD can keep an eligible ferry in service. The inspection itself is usually best done at a larger port on her route where the surveyor can attend and the water is steadier, with Furna and Fajã d'Água as options when the timing requires it.",
        faq: {
          q: "Can UWILD be arranged for a ferry serving Brava?",
          a: "Yes, if she is eligible — we check that with the class society first. The inspection is usually done at a larger port on her route, such as Praia, where conditions are steadier, but it can be done off Furna or at Fajã d'Água in a calm window if the timetable needs it.",
        },
      },
    },
  },
];
