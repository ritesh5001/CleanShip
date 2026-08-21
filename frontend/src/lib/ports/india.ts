/**
 * Indian port coverage — the data layer behind every port landing page.
 *
 * Source: the UN/LOCODE port list in `Port Coverage.xlsx` at the repo root,
 * filtered to India. Everything else on each entry (authority, water body,
 * cargo profile, diving conditions, mobilisation airport) was written per
 * port, not templated — that is deliberate. A set of 190-odd landing pages
 * that differ only by a find-and-replace on the port name is a doorway-page
 * pattern and Google treats it as one. What makes these pages defensible is
 * that the port sections are genuinely different from each other, so the
 * quality of THIS file is the quality of the whole programme.
 *
 * When real job records, photographs and berth-level notes arrive, they
 * belong here too — every page picks them up automatically.
 */

import type { Port } from "./types";

export type IndiaPort = Port;

export const indiaPorts: Port[] = [
  {
    slug: "belekeri-port",
    name: "Belekeri",
    aka: ["Belikeri", "Belekeri Port"],
    unlocode: "INBLK",
    state: "Karnataka",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea",
    authority: "Karnataka Maritime Board",
    type: "State Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: ["Iron ore", "Manganese ore", "Bauxite", "Coal"],
    vesselTypes: [
      "Handysize and Supramax bulk carriers",
      "Lighterage barges and tugs",
    ],
    airports: ["Hubballi (HBX)", "Goa (GOI)"],
    workAreas: ["outer anchorage", "lighterage transfer position"],
    conditions:
      "Belekeri is an open roadstead, so underwater work is done with the vessel riding to her anchor rather than alongside a berth. The south-west monsoon between June and September closes the practical season, and cleaning is planned into the fair-weather months either side of it. Visibility in the Arabian Sea here is workable outside the monsoon, but ore dust suspended around active lighterage cuts it sharply, so divers work up-current of the transfer barges wherever the anchorage allows.",
    profile:
      "Belekeri is a state-run ore port in Uttara Kannada district that works through anchorage lighterage rather than deep-water berths. Bulk carriers loading iron ore and manganese sit off the port for extended periods while barges shuttle cargo out to them, and that long idle time at anchor in warm coastal water is exactly the pattern that lets hull fouling establish before the vessel ever sails.",
    hook: "an ore lighterage anchorage on the Karnataka coast",
    holdNote:
      "Ore fines are the whole job here. Belekeri loads through barges, so the holds take repeated part-loads over a longer exposure than a single berth call would give, and the fines work deep into the frames and tank-top margins. Anything going on to a clean cargo needs the full chemical treatment and rinse, and the long wait at anchorage is the time to do it.",
    neighbours: ["karwar-port", "mormugao-port", "mangalore-port"],
  },
  {
    slug: "bhavnagar-port",
    name: "Bhavnagar",
    aka: ["Bhavnagar Port", "Bhaunagar"],
    unlocode: "INBHU",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Gulf of Khambhat",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "tidal-silt",
    waiting: "mixed",
    cargoes: ["Coal", "Timber", "Salt", "Cement", "Project cargo"],
    vesselTypes: [
      "Handysize bulk carriers",
      "General cargo ships",
      "Coastal and recycling-bound tonnage",
    ],
    airports: ["Bhavnagar (BHU)", "Ahmedabad (AMD)"],
    workAreas: ["lock-gated basin berths", "outer anchorage"],
    conditions:
      "The Gulf of Khambhat carries one of the largest tidal ranges anywhere in India, and the streams that go with it run hard past the approach. Dive windows at Bhavnagar are therefore short and tied to slack water rather than to the cargo plan. The water is heavily silt-laden, so underwater visibility is routinely close to zero and hull work is executed by touch under continuous surface supervision, with video recorded as the file record rather than as the diver's means of navigation.",
    profile:
      "Bhavnagar is a Gujarat Maritime Board port at the head of the Gulf of Khambhat, working a lock-gated basin alongside an outer anchorage. It sits beside the Alang-Sosiya recycling belt, so the traffic mixes working coasters and bulk carriers with vessels making their final voyage — two very different underwater maintenance conversations in the same port.",
    hook: "the extreme tidal range at the head of the Gulf of Khambhat",
    holdNote:
      "Bhavnagar sits beside the Alang-Sosiya recycling belt, so a share of the hold work here is last-cargo cleaning on tonnage making its final voyage — a different specification from a grain clean, and one where the yard, not a charterer, sets what counts as clean.",
    neighbours: ["pipavav-port", "magdalla-port", "dahej-port"],
  },
  {
    slug: "chennai-port",
    name: "Chennai",
    officialName: "Chennai Port",
    aka: ["Madras", "Chennai Port Trust"],
    unlocode: "INMAA",
    state: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Chennai Port Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "Automobiles and RoRo",
      "General and project cargo",
      "Granite",
    ],
    vesselTypes: [
      "Container ships on liner rotations",
      "Pure car and truck carriers",
      "General cargo ships",
    ],
    airports: ["Chennai (MAA)"],
    workAreas: [
      "Bharathi Dock and Jawahar Dock berths",
      "Ambedkar Dock",
      "outer anchorage",
    ],
    conditions:
      "Chennai is an artificial harbour behind long breakwaters, so work alongside is sheltered from the open Bay of Bengal and normally runs straight through cargo operations without touching the berth window. Visibility inside the basin is moderate and drops after heavy rain runs off the city. The north-east monsoon from October to December brings the swell and cyclonic weather that governs the outer anchorage, and berth pressure means dive slots at Chennai are often taken overnight.",
    profile:
      "Chennai is the largest container port on India's east coast and the automobile gateway for the southern manufacturing belt. Liner container ships and car carriers work to fixed rotations here, which makes hull cleaning and propeller polishing a scheduled item that has to fit inside an existing cargo window rather than extend it.",
    hook: "a sheltered artificial harbour on the Bay of Bengal",
    holdNote:
      "Chennai runs containers, cars and project cargo rather than dirty bulk, so hold work here is bilges, tank tops, cell guides and lashing gear — steady maintenance scope on liner tonnage rather than a residue clean against a fixture.",
    neighbours: ["ennore-port", "krishnapatnam-port", "tuticorin-port"],
  },
  {
    slug: "cochin-port",
    name: "Cochin",
    officialName: "Cochin Port (Kochi)",
    aka: ["Kochi", "Cochin Port Trust"],
    unlocode: "INCOK",
    state: "Kerala",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea and the Vembanad backwaters",
    authority: "Cochin Port Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Containers",
      "Crude, POL and LNG",
      "Fertiliser",
      "Edible oil",
      "Cruise",
    ],
    vesselTypes: [
      "Container ships",
      "Crude and product tankers",
      "LNG carriers",
      "Cruise ships",
      "Offshore support vessels",
    ],
    airports: ["Kochi (COK)"],
    workAreas: [
      "Vallarpadam container terminal",
      "Willingdon Island berths",
      "Puthuvypeen terminals",
      "outer anchorage",
    ],
    conditions:
      "Cochin is a natural harbour behind Willingdon Island and is genuinely sheltered, so alongside work is comfortable for most of the year and swell only becomes a factor at the outer anchorage during the south-west monsoon. The harbour is brackish, silty and under continuous maintenance dredging, so visibility is moderate at best. The bigger operational point is biological: warm, nutrient-rich backwater means growth returns quickly here, and cleaning intervals that hold on the dry Gujarat coast are too long for Cochin.",
    profile:
      "Cochin is Kerala's principal port and the container and cruise gateway for the south-west coast, with Cochin Shipyard and a busy offshore support base in the same body of water. That mix puts liner tonnage on a schedule and offshore vessels between charters into the same anchorage, and both are regular users of in-water cleaning and survey.",
    hook: "warm backwater that regrows fouling faster than owners expect",
    tankNote:
      "Cochin handles crude, product, LNG and edible oil through separate terminals, and each sets its own conditions for tank work alongside. Where the terminal will not permit it, the work is planned for the anchorage or the outward passage.",
    holdNote:
      "Cochin mixes container tonnage with fertiliser and agricultural parcels, so the hold work splits two ways: cell guides, bilge wells and tank tops on the box ships, and residue removal on the bulk callers. Fertiliser is the harder of the two — hygroscopic, corrosive to coatings if left damp, and an outright failure ahead of a food-grade fixture.",
    neighbours: ["mangalore-port", "tuticorin-port", "mormugao-port"],
  },
  {
    slug: "dahanu-port",
    name: "Dahanu",
    aka: ["Dahanu Port", "Dahanu anchorage"],
    unlocode: "INDHU",
    state: "Maharashtra",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea",
    authority: "Maharashtra Maritime Board",
    type: "State Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: ["Thermal coal", "General bulk"],
    vesselTypes: [
      "Handysize and Supramax bulk carriers",
      "Lighterage barges and tugs",
    ],
    airports: ["Mumbai (BOM)"],
    workAreas: ["outer anchorage", "lighterage transfer position"],
    conditions:
      "Dahanu works as an open anchorage on the Palghar coast north of Mumbai, so every dive is done with the vessel at anchor and no shelter from swell. The south-west monsoon effectively closes the season between June and September. Coal dust from barge transfer settles down through the water column around the working area, so visibility drops sharply near an active discharge and the dive plan puts the team clear of the transfer side of the hull wherever the anchorage and the wind allow.",
    profile:
      "Dahanu is a lighterage anchorage serving the thermal power station on the Palghar coast, working coal parcels out to barges rather than over a deep-water berth. Vessels sit at anchor through long discharge cycles, and that is precisely when fouling gets its opportunity — the hull is warm, static and in nutrient-rich coastal water for days at a time.",
    hook: "long idle discharge cycles at an open coal anchorage",
    holdNote:
      "Coal is the only residue that matters here. Discharge is by grab into barges over several days, so coal dust films every surface and settles again after each sweep — the cleaning is done once discharge is genuinely finished, not between grabs. Vessels leaving Dahanu for a clean fixture need the full wash and rinse sequence.",
    neighbours: ["mumbai-port", "nhava-sheva-port", "magdalla-port"],
  },
  {
    slug: "dahej-port",
    name: "Dahej",
    aka: ["Dahej Port", "Dahej LNG terminal"],
    unlocode: "INDAH",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Gulf of Khambhat",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "tidal-silt",
    waiting: "berth-driven",
    cargoes: [
      "LNG",
      "Liquid chemicals",
      "Coal",
      "Fertiliser",
      "Steel and project cargo",
    ],
    vesselTypes: [
      "LNG carriers",
      "Chemical and product tankers",
      "Bulk carriers",
    ],
    airports: ["Vadodara (BDQ)", "Surat (STV)"],
    workAreas: ["LNG jetty", "liquid chemical terminal", "solid cargo berths"],
    conditions:
      "Dahej sits in the Gulf of Khambhat, where the tidal range is extreme and the streams run hard, so diving is cut to slack-water windows and planned strictly against the tide table rather than the berth schedule. The water is heavily silted and visibility is habitually very low, which makes this a touch-and-supervision job with video kept for the record. Gas and chemical terminals add a permit layer on top of port clearance, so the terminal operator has to be in the approval chain from the start, not brought in at the gangway.",
    profile:
      "Dahej is Gujarat's principal LNG and liquid chemical gateway, with a solid cargo terminal alongside it serving the Bharuch industrial belt. Gas carriers and chemical tankers working to strict terminal windows dominate the traffic, so an underwater scope here is sized to the slot that exists, and anything that will not fit is staged for the next call.",
    hook: "gas and chemical terminal windows in a hard-running tidal gulf",
    holdNote:
      "The solid cargo side of Dahej runs coal and fertiliser through the same holds as steel and project cargo, and that sequence is the awkward one. Coal dust and fertiliser residue both have to come out completely before a clean cargo, while dunnage and lashing waste from project cargo is a different job needing different people.",
    tankNote:
      "Dahej is LNG and liquid chemicals, so the certification chain runs ahead of the cleaning itself: gas-freeing, marine chemist attendance and enclosed-space entry certificates are the critical path, and the terminal sits in the approval chain from the start. Chemical grade changes here are set by the next charterer's acceptance criteria, not by a standard wash.",
    neighbours: ["hazira-port", "magdalla-port", "bhavnagar-port"],
  },
  {
    slug: "dhamra-port",
    name: "Dhamra",
    aka: ["Dhamra Port", "Dhamara"],
    unlocode: "INDMA",
    state: "Odisha",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Dhamra Port Company",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: ["Thermal and coking coal", "Iron ore", "Limestone", "LNG"],
    vesselTypes: [
      "Capesize and Panamax bulk carriers",
      "LNG carriers",
    ],
    airports: ["Bhubaneswar (BBI)"],
    workAreas: ["deep-draft bulk berths", "outer anchorage"],
    conditions:
      "Dhamra is a deep-draft port that regularly takes Capesize tonnage, so a hull job here is a large-area job and needs dive planning and crew sizing to match — an optimistic single-shift estimate is how these turn into overruns. The Bay of Bengal cyclone seasons in April to June and again from October to December govern the anchorage window. Water off the Dhamra river mouth carries estuarine silt that keeps visibility low, so working alongside is the better option whenever the berth slot allows it.",
    profile:
      "Dhamra is a privately operated deep-water port on the Odisha coast built around dry bulk, feeding coal and iron ore into the eastern steel and power belt. The Capesize and Panamax bulk carriers calling here carry the largest wetted hull areas of any traffic in India, which is also where the absolute fuel saving from a clean hull is largest.",
    hook: "Capesize dry bulk tonnage on the Odisha coast",
    holdNote:
      "Coal and iron ore in Capesize quantities is the worst-case hold brief and it is the standing one at Dhamra: coal dust films every surface while ore fines pack into the frames and the tank-top margins. On tonnage this size the hold area alone makes it a riding-crew job rather than a berth-window one.",
    tankNote:
      "The liquid side at Dhamra is LNG, which puts the work on the gas side of the trade — inerting, gas-freeing and certification rather than washing. Conventional tank scope here is bunker and slop work on the bulk carriers calling for coal and ore.",
    neighbours: ["paradip-port", "haldia-port", "kolkata-port"],
  },
  {
    slug: "ennore-port",
    name: "Ennore",
    officialName: "Kamarajar Port (Ennore)",
    aka: ["Kamarajar Port", "Ennore Port"],
    unlocode: "INENR",
    state: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Kamarajar Port Limited",
    type: "Major Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Thermal coal",
      "Automobiles and RoRo",
      "LNG",
      "POL",
      "General cargo",
    ],
    vesselTypes: [
      "Bulk carriers",
      "Pure car and truck carriers",
      "LNG carriers",
      "Product tankers",
    ],
    airports: ["Chennai (MAA)"],
    workAreas: ["coal berths", "RoRo berths", "liquid terminals", "anchorage"],
    conditions:
      "Ennore is a modern breakwater harbour just north of Chennai, so alongside work is sheltered and normally runs in parallel with cargo operations. The north-east monsoon from October to December sets the anchorage window; outside it the Bay of Bengal here is generally workable. Coal handling puts fine dust into the harbour water, so visibility around the bulk berths is materially lower than at the RoRo and liquid terminals a few hundred metres away — worth knowing before a survey scope is priced.",
    profile:
      "Kamarajar Port at Ennore is the dedicated coal and automobile port serving Chennai's industrial hinterland, and it took over the dirty bulk traffic that used to run through Chennai Port itself. Coal carriers on repeat voyages and car carriers on liner schedules are the two profiles most often booked for underwater work here.",
    hook: "coal and car carrier traffic north of Chennai",
    holdNote:
      "Ennore is a coal port first, so coal dust and the residue driven into the tank-top margins are the recurring job. The car carrier and RoRo tonnage calling here is a different scope entirely — deck cleaning, lashing waste and ramp areas rather than hold washing — and it is worth being clear which one you are asking for.",
    tankNote:
      "Ennore handles LNG and product parcels, and the terminals set their own conditions for tank work alongside. Where the berth will not carry it the work moves to the anchorage or the outward passage, and the slop reception is booked either way rather than assumed.",
    neighbours: ["chennai-port", "krishnapatnam-port", "kakinada-port"],
  },
  {
    slug: "gangavaram-port",
    name: "Gangavaram",
    aka: ["Gangavaram Port"],
    unlocode: "INGGV",
    state: "Andhra Pradesh",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Gangavaram Port Limited",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Thermal and coking coal",
      "Iron ore",
      "Bauxite",
      "Limestone",
      "Fertiliser",
      "Steel",
    ],
    vesselTypes: [
      "Capesize and Panamax bulk carriers",
      "General cargo ships",
    ],
    airports: ["Visakhapatnam (VTZ)"],
    workAreas: ["deep-draft bulk berths", "outer anchorage"],
    conditions:
      "Gangavaram is a deep-draft all-weather port immediately south of Visakhapatnam, and its natural depth means fully laden Capesize vessels are worked alongside rather than at anchor — an advantage for hull cleaning, because a berthed vessel gives the team a stable platform and a predictable window. The site is sheltered enough to work through most of the year, with cyclone season the main interruption. Bulk dust settles in the basin, so visibility at the ore and coal berths runs lower than in the outer roads.",
    profile:
      "Gangavaram is a privately operated deep-water bulk port on the Andhra coast, built to take fully laden Capesize tonnage for the steel, power and alumina industries. It shares an approach with Visakhapatnam, where Cleanship keeps an operating base, so a single mobilisation frequently covers vessels at both ports on the same trip.",
    hook: "deep-draft Capesize berths sharing the Visakhapatnam approach",
    holdNote:
      "Gangavaram loads and discharges bauxite, limestone and ore alongside coal, and bauxite is the one that surprises owners: it is fine, red and it stains, so it needs chemical treatment and rinsing rather than sweeping. Capesize hold areas make this a job to plan in days, not shifts.",
    neighbours: ["visakhapatnam-port", "kakinada-port", "paradip-port"],
  },
  {
    slug: "haldia-port",
    name: "Haldia",
    officialName: "Haldia Dock Complex, Syama Prasad Mookerjee Port",
    aka: ["Haldia Dock Complex", "Haldia Port"],
    unlocode: "INHAL",
    state: "West Bengal",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Hooghly River",
    authority: "Syama Prasad Mookerjee Port, Kolkata",
    type: "Major Port",
    condition: "riverine",
    waiting: "mixed",
    cargoes: [
      "POL and petrochemicals",
      "Coking coal",
      "Containers",
      "Fertiliser",
      "Steel",
    ],
    vesselTypes: [
      "Product and chemical tankers",
      "Bulk carriers",
      "Feeder container ships",
    ],
    airports: ["Kolkata (CCU)"],
    workAreas: ["dock complex berths", "oil jetties", "river anchorage"],
    conditions:
      "Haldia is a riverine port on the Hooghly, and the river runs a strong tidal stream carrying a very heavy silt load. Underwater visibility is effectively nil for most of the year, so cleaning and inspection are worked by touch under close surface supervision with dive windows cut to the slack either side of the tide. River sediment also settles on horizontal surfaces between cleans, so what the divers find on the flat bottom at Haldia is different in kind from a coastal port — sediment over growth rather than growth alone.",
    profile:
      "Haldia is the deep-water dock complex of the Kolkata port system, near the mouth of the Hooghly, where draft restrictions further upriver make it the practical limit for larger tonnage. Tankers and coal carriers serving the eastern refining and steel belt make up most of the traffic.",
    hook: "strong tidal stream and near-zero visibility on the Hooghly",
    tankNote:
      "Haldia serves the eastern petrochemical belt, so the grades are varied and the cleaning specification changes with almost every voyage. Slop reception and disposal are arranged through the dock complex ahead of arrival.",
    holdNote:
      "Coking coal and fertiliser are the standing residues at Haldia, and the river adds a complication the coastal ports do not have. Humidity here is high year-round, so holds washed late and shut up damp will not dry — and a damp hold fails a grain inspection regardless of how clean it looks.",
    neighbours: ["kolkata-port", "paradip-port", "dhamra-port"],
  },
  {
    slug: "hazira-port",
    name: "Hazira",
    aka: ["Hazira Port", "Surat"],
    unlocode: "INHZR",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Gulf of Khambhat",
    authority: "Gujarat Maritime Board",
    type: "Private Port",
    condition: "tidal-silt",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "Steel and steel raw materials",
      "LNG",
      "RoRo",
      "Project cargo",
    ],
    vesselTypes: [
      "Container ships",
      "Bulk carriers",
      "LNG carriers",
      "Car carriers",
    ],
    airports: ["Surat (STV)", "Vadodara (BDQ)"],
    workAreas: ["container terminal", "steel raw material berths", "LNG jetty"],
    conditions:
      "Hazira works the outer part of the Gulf of Khambhat, so the tidal stream is strong and the water silty, though conditions are less extreme than at the head of the gulf. Dive windows are still planned to slack water, and visibility is low enough that hull work is executed by feel with video kept as the record. The terminals run tight windows, so scope, crew size and tooling are agreed and staged before anyone enters the water.",
    profile:
      "Hazira is Surat's deep-water port, combining a container terminal, steel raw-material berths and an LNG terminal in a single industrial complex. Liner container tonnage and bulk carriers feeding the steel plant are the two profiles most often booked for underwater work here.",
    hook: "tight terminal windows on the outer Gulf of Khambhat",
    holdNote:
      "Hazira feeds a steel plant, so the residues are ore fines, coke and scrap dust, and the holds usually come back to a steel raw material cargo rather than a clean one. That lowers the standard required and raises the value of working it into the discharge sequence.",
    tankNote:
      "Hazira's liquid traffic is LNG and terminal-controlled, so the tank scope here is mostly bunker and slop tank work on the container and bulk tonnage rather than cargo tank grade changes. Terminal windows are tight, so it is planned for the anchorage from the outset.",
    neighbours: ["magdalla-port", "dahej-port", "mundra-port"],
  },
  {
    slug: "jakhau-port",
    name: "Jakhau",
    aka: ["Jakhau Port", "Jakhau Bandar"],
    unlocode: "INJAK",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea off the Kutch coast",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "tidal-silt",
    waiting: "long-wait",
    cargoes: ["Fishing catch", "Coastal general cargo", "Salt"],
    vesselTypes: [
      "Fishing vessels and trawlers",
      "Coastal barges and small general cargo craft",
      "Support and workboats",
    ],
    airports: ["Bhuj (BHJ)", "Kandla (IXY)"],
    workAreas: ["creek jetty", "offshore anchorage"],
    conditions:
      "Jakhau is a small tidal creek port on the Kutch coast with limited depth alongside, so underwater work on anything larger than a workboat is normally done at the anchorage rather than inside the creek. The water is shallow, silty and strongly tidal, which keeps visibility low and ties the dive plan to the tide rather than the working day. Craft that sit here through long idle periods carry heavy fouling, particularly on flat bottoms, sea chests and inlet gratings.",
    profile:
      "Jakhau is a minor Gujarat Maritime Board port on the Kutch coast, working fishing and small coastal traffic rather than deep-sea tonnage. Underwater work here is usually on support craft, barges and vessels lying off the coast, and it is most often taken as part of a wider Kutch mobilisation covering Mundra and Kandla in the same trip.",
    hook: "shallow tidal creek working on the Kutch coast",
    /* Fishing and small coastal craft dominate. A cargo hold cleaning page
       for Jakhau would be a page no reader could need, so the derived line
       is turned off rather than published thin. */
    lineOverrides: { "hold-cleaning": false },
    neighbours: ["mundra-port", "kandla-port", "navlakhi-port"],
  },
  {
    slug: "kakinada-port",
    name: "Kakinada",
    officialName: "Kakinada Deep Water Port and Anchorage Port",
    aka: ["Kakinada Seaport", "Cocanada"],
    unlocode: "INKAK",
    state: "Andhra Pradesh",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Kakinada Seaports and the Andhra Pradesh Maritime Board",
    type: "State Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: [
      "Agricultural bulk and rice",
      "Fertiliser",
      "Edible oil",
      "Cement",
      "Offshore project cargo",
    ],
    vesselTypes: [
      "Handysize and Supramax bulk carriers",
      "Product and chemical tankers",
      "Offshore support vessels",
    ],
    airports: ["Rajahmundry (RJA)", "Visakhapatnam (VTZ)"],
    workAreas: [
      "deep water port berths",
      "anchorage port lighterage position",
      "outer anchorage",
    ],
    conditions:
      "Kakinada runs a deep-water port and an older anchorage port side by side, so the dive plan depends entirely on which one the vessel is worked at — alongside inside the deep-water basin, or fully at anchor off the anchorage port with barges alongside. The Bay of Bengal cyclone seasons in spring and late autumn set the outer window. Godavari delta water is silty and warm, so visibility is modest and marine growth returns fast between cleans.",
    profile:
      "Kakinada is the agricultural bulk and fertiliser gateway for the Godavari delta and a shore base for offshore activity in the Krishna-Godavari basin. Bulk carriers on grain and fertiliser parcels and offshore support vessels between charters are the two profiles that most often need underwater work here.",
    hook: "a deep-water port and a lighterage anchorage working side by side",
    holdNote:
      "Kakinada moves agricultural bulk and fertiliser through the same holds, and that sequence is the classic contamination risk: fertiliser residue into a food-grade cargo fails inspection outright. The cleaning standard here is set by the next fixture, not the last one.",
    tankNote:
      "Kakinada moves edible oil parcels, which carry the strictest specifications in the trade: prior-cargo restrictions and wall-wash results set the standard, and a tank that looks clean can still fail on analysis. The offshore support fleet based here adds mud, brine and base oil tank work on an entirely different cycle.",
    neighbours: ["visakhapatnam-port", "gangavaram-port", "krishnapatnam-port"],
  },
  {
    slug: "kandla-port",
    name: "Kandla",
    officialName: "Deendayal Port (Kandla)",
    aka: ["Deendayal Port", "Kandla Port Trust"],
    unlocode: "INIXY",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Gulf of Kutch",
    authority: "Deendayal Port Authority",
    type: "Major Port",
    condition: "tidal-silt",
    waiting: "mixed",
    cargoes: [
      "POL and edible oils",
      "Fertiliser and raw materials",
      "Grain",
      "Salt",
      "Timber",
      "Containers",
    ],
    vesselTypes: [
      "Product and chemical tankers",
      "Bulk carriers",
      "General cargo ships",
    ],
    airports: ["Kandla (IXY)", "Bhuj (BHJ)"],
    workAreas: ["Kandla creek berths", "oil jetties", "outer anchorage"],
    conditions:
      "Kandla sits at the head of a creek off the Gulf of Kutch, where tidal streams run hard and the water carries a heavy silt load. Dive windows are worked to slack water and visibility is low, so cleaning is executed by touch with continuous surface supervision and video kept as the record rather than as the diver's guide. Vessels frequently wait at the outer anchorage before a berth slot comes free, and that waiting time in warm gulf water is where most of the fouling is picked up.",
    profile:
      "Kandla, officially Deendayal Port, is among the highest-tonnage ports in India and the principal liquid and dry bulk gateway for the north and west of the country. Tankers on edible oil and POL parcels and bulk carriers on fertiliser and grain make up most of the traffic. Cleanship keeps an operating base at Kandla, so divers, compressors and cleaning gear are held locally rather than flown in against a berth window.",
    hook: "India's highest-tonnage bulk and liquid gateway",
    holdNote:
      "Kandla runs grain, fertiliser and salt through the same berths, and fertiliser residues are the difficult ones: hygroscopic, corrosive to coatings and unforgiving if a grain cargo follows. Grain-clean standards here are worked to a surveyor attendance, so the cleaning plan is built backwards from the inspection, not forwards from the discharge.",
    tankNote:
      "Kandla is India’s principal edible oil terminal, so prior-cargo restrictions and wall-wash results drive the tank cleaning specification far more than the visual standard does. Slop handling and disposal are arranged with the terminal ahead of the call rather than negotiated once the tanks are open.",
    neighbours: ["mundra-port", "navlakhi-port", "okha-port"],
    base: true,
  },
  {
    slug: "karwar-port",
    name: "Karwar",
    aka: ["Karwar Port", "Kaarwar"],
    unlocode: "INKRW",
    state: "Karnataka",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea",
    authority: "Karnataka Maritime Board",
    type: "State Port",
    condition: "clear-water",
    waiting: "mixed",
    cargoes: [
      "Iron ore and bauxite",
      "Coal",
      "Sugar",
      "General and project cargo",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "General cargo ships",
      "Support and naval auxiliary craft",
    ],
    airports: ["Goa (GOI)", "Hubballi (HBX)"],
    workAreas: ["berths inside the bay", "anchorage"],
    conditions:
      "Karwar is a sheltered bay port with good natural protection, so both alongside and anchorage work are practical outside the south-west monsoon. Water clarity here is markedly better than at the silt-laden Gujarat and Bengal ports, which changes what the job can deliver: video-documented inspection at Karwar produces evidence a surveyor can actually read, rather than a record of a black frame. The monsoon between June and September remains the limiting factor on the calendar.",
    profile:
      "Karwar is a state port in Uttara Kannada working bulk and general cargo, close to the naval base at Kadamba. Its comparatively clear Arabian Sea water makes it one of the better Indian ports for in-water class survey and UWILD work as well as for straightforward cleaning.",
    hook: "clear sheltered bay water suited to in-water survey",
    holdNote:
      "Karwar loads ore and bauxite alongside sugar, which is the sequence that catches people out: raw sugar is a food-grade cargo and will not tolerate a trace of mineral fines in the frames. The full sequence is needed, and the sheltered bay makes it practical to do it properly at anchor rather than against a berth clock.",
    neighbours: ["belekeri-port", "mormugao-port", "mangalore-port"],
  },
  {
    slug: "kolkata-port",
    name: "Kolkata",
    officialName: "Syama Prasad Mookerjee Port, Kolkata",
    aka: ["Calcutta", "SMP Kolkata", "Kolkata Port Trust"],
    unlocode: "INCCU",
    state: "West Bengal",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Hooghly River",
    authority: "Syama Prasad Mookerjee Port, Kolkata",
    type: "Major Port",
    condition: "riverine",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "General and project cargo",
      "Fertiliser",
      "Food grain",
      "Coal",
    ],
    vesselTypes: [
      "Feeder container ships",
      "General cargo ships",
      "Coastal tonnage",
    ],
    airports: ["Kolkata (CCU)"],
    workAreas: ["Kidderpore and Netaji Subhas dock berths", "river moorings"],
    conditions:
      "Kolkata lies roughly 200 kilometres up the Hooghly, so vessels arrive draft-restricted and the tidal stream past the berths runs hard. Silt makes underwater visibility effectively zero, and every dive is planned to the slack around high water with the vessel secured and river traffic accounted for in the permit. Freshwater influence upriver also changes the fouling species compared with the coastal ports — the growth is often softer but covers more of the hull, which affects tooling selection more than owners expect.",
    profile:
      "Kolkata is India's oldest operating major port and the only true riverine one, serving eastern India and the landlocked neighbours through feeder and general cargo tonnage. Between the draft restriction, the current and the visibility, it is the most technically demanding underwater working environment on this coast.",
    hook: "the most demanding underwater working environment in India",
    holdNote:
      "Vessels arrive at Kolkata draft-restricted and often part-loaded, which changes the hold cleaning job: fewer holds worked at once, more sequencing around remaining cargo, and a long river passage either side that a riding crew can use productively.",
    neighbours: ["haldia-port", "dhamra-port", "paradip-port"],
  },
  {
    slug: "krishnapatnam-port",
    name: "Krishnapatnam",
    aka: ["Krishnapatnam Port", "Krishnapattanam"],
    unlocode: "INKRI",
    state: "Andhra Pradesh",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Krishnapatnam Port Company",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Thermal coal",
      "Iron ore",
      "Containers",
      "Fertiliser",
      "Edible oil",
    ],
    vesselTypes: [
      "Capesize and Panamax bulk carriers",
      "Container ships",
    ],
    airports: ["Chennai (MAA)", "Tirupati (TIR)"],
    workAreas: ["deep-draft bulk berths", "container berths", "anchorage"],
    conditions:
      "Krishnapatnam is a deep-draft artificial harbour behind long breakwaters, so cleaning alongside is sheltered and practical for most of the year, and the cyclone seasons are the main interruption at the anchorage. Coal and ore handling reduces visibility inside the basin, so hull work at the bulk berths is planned as a low-visibility job even though the site itself is calm — a distinction that matters when a client expects survey-grade video from a coal berth.",
    profile:
      "Krishnapatnam is a privately operated deep-water port in Nellore district built primarily around imported thermal coal for the southern power belt, with container and fertiliser volumes alongside it. Large bulk carriers on repeat coal voyages make it a port where hull and propeller condition show up directly in the fuel bill.",
    hook: "deep-draft coal berths behind long breakwaters",
    holdNote:
      "Imported thermal coal dominates, so coal dust is the standing residue — and the fertiliser and edible oil parcels moving through the same port mean the following cargo is often one that will not tolerate any of it. The deep-draft berths take large tonnage, so the hold area is significant even where the residue itself is straightforward.",
    tankNote:
      "Edible oil and liquid fertiliser parcels move through Krishnapatnam alongside the coal, so the tank work here is wall-wash specification jobs on smaller product tonnage. Slop reception is arranged with the port before the tanks are opened, not after.",
    neighbours: ["chennai-port", "ennore-port", "kakinada-port"],
  },
  {
    slug: "magdalla-port",
    name: "Magdalla",
    aka: ["Magdalla Port", "Surat Magdalla"],
    unlocode: "INMDA",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Tapi estuary, Gulf of Khambhat",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "riverine",
    waiting: "mixed",
    cargoes: [
      "Coal",
      "Steel and scrap",
      "Timber",
      "Edible oil",
      "General cargo",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "General cargo ships",
      "Coastal tankers",
    ],
    airports: ["Surat (STV)", "Vadodara (BDQ)"],
    workAreas: ["river jetties", "outer anchorage"],
    conditions:
      "Magdalla lies on the Tapi estuary, so it combines a strong tidal stream with river silt and limited depth — dive windows are short, tied to the tide and worked in near-zero visibility. The depth restriction does have one upside for the diving side: the tonnage calling here is smaller, so any single hull job has a manageable wetted area. Larger vessels are worked at the outer anchorage instead of alongside.",
    profile:
      "Magdalla is Surat's older river port on the Tapi, handling coal, steel and general cargo for the local industrial belt alongside the deeper terminals at Hazira. Traffic is smaller tonnage on short coastal and regional voyages rather than liner or deep-sea calls.",
    hook: "short tide-bound windows on the Tapi estuary",
    holdNote:
      "Scrap and steel are the difficult residues at Magdalla rather than the bulk: loose metal, cut wire and dunnage in the frames and bilge wells, which has to be picked out by hand before any washing is worth starting. Holds here are smaller, which at least keeps the job proportionate to the tonnage.",
    tankNote:
      "Tank work at Magdalla is coastal product and edible oil tonnage on short regional voyages, so the cycle is fast and the grade changes frequent. The river berths are depth-limited, so the tanks are smaller — which makes hand work a larger share of the total than machine washing.",
    neighbours: ["hazira-port", "dahej-port", "bhavnagar-port"],
  },
  {
    slug: "mangalore-port",
    name: "Mangalore",
    officialName: "New Mangalore Port (Mangaluru)",
    aka: ["New Mangalore Port", "Mangaluru", "NMPT"],
    unlocode: "INIXE",
    state: "Karnataka",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea",
    authority: "New Mangalore Port Authority",
    type: "Major Port",
    condition: "clear-water",
    waiting: "berth-driven",
    cargoes: [
      "Crude and POL",
      "LPG",
      "Iron ore pellets",
      "Fertiliser and raw materials",
      "Containers",
      "Edible oil",
    ],
    vesselTypes: [
      "Crude and product tankers",
      "LPG carriers",
      "Bulk carriers",
      "Feeder container ships",
    ],
    airports: ["Mangaluru (IXE)"],
    workAreas: ["liquid berths", "dry bulk berths", "outer anchorage"],
    conditions:
      "New Mangalore is a breakwater harbour with reasonably clear Arabian Sea water, so in-water inspection here yields video that is genuinely usable for a class file rather than a formality. The south-west monsoon from June to September is the limiting season for anchorage work, while the basin stays workable longer. Tanker and LPG berths bring terminal permit requirements on top of the port's diving permission, so the approval chain runs through the terminal as well as the harbour master.",
    profile:
      "New Mangalore is a major port built around liquid bulk — crude for the local refinery, LPG and edible oil — with iron ore pellets and containers alongside. Tanker tonnage working to tight terminal windows dominates, so an underwater scope here is normally sized to fit a single berth slot end to end.",
    hook: "clear Arabian Sea water at a liquid bulk major port",
    tankNote:
      "New Mangalore is a refinery and LPG port, so the grades are heavy and the gas-freeing requirement is real rather than nominal. Marine chemist attendance and enclosed-space entry certification are arranged as part of the scope.",
    holdNote:
      "Iron ore pellets and fertiliser are the recurring residues, and the pellet fines are the ones that stain. Most tonnage here works to tight terminal windows, so the practical answer is usually a riding crew finishing on the outward passage rather than a shore gang trying to hold a berth.",
    neighbours: ["cochin-port", "karwar-port", "mormugao-port"],
  },
  {
    slug: "mormugao-port",
    name: "Mormugao",
    officialName: "Mormugao Port (Goa)",
    aka: ["Marmagao", "Murmugao", "Goa Port"],
    unlocode: "INMRM",
    state: "Goa",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea at the mouth of the Zuari",
    authority: "Mormugao Port Authority",
    type: "Major Port",
    condition: "clear-water",
    waiting: "mixed",
    cargoes: ["Coal", "Iron ore", "Containers", "POL", "Cruise"],
    vesselTypes: [
      "Panamax and Capesize bulk carriers",
      "Container ships",
      "Cruise ships",
      "Ore barges and tugs",
    ],
    airports: ["Goa (GOI)"],
    workAreas: ["inner harbour berths", "breakwater berths", "anchorage"],
    conditions:
      "Mormugao is a natural harbour at the mouth of the Zuari with breakwater protection, so alongside work is sheltered, and the Arabian Sea water outside is clear enough for high-quality survey video outside the monsoon. The south-west monsoon closes the outer anchorage between June and September. Ore and coal handling in the inner harbour drops visibility locally around the bulk berths, so the same port can give two quite different working conditions on the same day.",
    profile:
      "Mormugao is Goa's major port, historically an iron ore export terminal and now working coal imports, containers and a growing cruise call list. The mix of large bulk carriers and river barge traffic means underwater work here ranges from Capesize hulls down to small craft propellers.",
    hook: "clear water at Goa's natural harbour",
    holdNote:
      "Mormugao's iron ore heritage still shows in the holds: ore fines and red staining are the standing job, now alongside imported coal. Barge-fed loading extends the exposure, so the fines get further into the frames than a single berth call would ever put them.",
    tankNote:
      "The liquid side at Mormugao is product parcels and bunkers rather than crude, so the work is grade changes and fuel tank cleaning. Barge and small-craft tank work runs as a steady second stream alongside it.",
    neighbours: ["karwar-port", "panaji-port", "belekeri-port"],
  },
  {
    slug: "muldwarka-port",
    name: "Muldwarka",
    aka: ["Muldwarka Port", "Kodinar"],
    unlocode: "INMDK",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea off Saurashtra",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: ["Cement and clinker", "Coal", "Gypsum"],
    vesselTypes: [
      "Coastal cement carriers",
      "Handysize bulk carriers",
      "Barges and tugs",
    ],
    airports: ["Diu (DIU)", "Rajkot (RAJ)"],
    workAreas: ["jetty berth", "offshore anchorage"],
    conditions:
      "Muldwarka is an open jetty port on the Saurashtra coast with little natural shelter, so underwater work depends on sea state and is planned outside the south-west monsoon. Arabian Sea water here is comparatively clear, which helps inspection work considerably. Vessels on short coastal cement runs call frequently and, because they spend most of their time in warm coastal water at low speed, accumulate fouling faster between dockings than their trading pattern suggests.",
    profile:
      "Muldwarka is a captive bulk terminal near Kodinar serving the cement industry, working clinker, cement and coal over a jetty rather than through an enclosed basin. Traffic is dominated by coastal cement carriers on short, repeated voyages — a fleet where regular hull and propeller work pays back quickly.",
    hook: "coastal cement tonnage on repeated short voyages",
    holdNote:
      "Cement and clinker are the residues here and they are the unforgiving kind, because they set. A hold washed late after a clinker cargo needs mechanical removal rather than a hose, so on the short coastal runs out of Muldwarka the cleaning is planned for immediately after discharge, never for the next port.",
    neighbours: ["pipavav-port", "porbandar-port", "okha-port"],
  },
  {
    slug: "mumbai-port",
    name: "Mumbai",
    officialName: "Mumbai Port",
    aka: ["Bombay", "MbPT", "Mumbai Port Trust"],
    unlocode: "INBOM",
    state: "Maharashtra",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea, Mumbai harbour",
    authority: "Mumbai Port Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "long-wait",
    cargoes: [
      "POL",
      "General and project cargo",
      "Steel",
      "Cruise",
      "Offshore support",
    ],
    vesselTypes: [
      "Crude and product tankers",
      "General cargo ships",
      "Offshore support vessels",
      "Cruise ships",
      "Harbour craft and tugs",
    ],
    airports: ["Mumbai (BOM)"],
    workAreas: [
      "Indira and Jawahar dock berths",
      "Jawahar Dweep and Pir Pau oil jetties",
      "harbour anchorages",
    ],
    conditions:
      "Mumbai harbour is well sheltered behind the mainland and the island, so anchorage work runs through most of the year with the south-west monsoon the main interruption. Harbour water is silty and traffic is dense, so dives are planned around vessel movements with a clear permit agreed with the master and the port. Long waits at the harbour anchorages are routine, and that idle time in warm harbour water is where the heaviest fouling in the region develops.",
    profile:
      "Mumbai Port handles liquid bulk at Jawahar Dweep, general and project cargo in the docks, and serves as the shore base for offshore activity in the Bombay High field. The offshore support fleet working out of here is one of the most regular users of in-water cleaning and survey anywhere in India.",
    hook: "sheltered harbour anchorages that grow heavy fouling",
    tankNote:
      "Liquid bulk at Mumbai works through Jawahar Dweep and Pir Pau, and tank cleaning at those jetties is governed by terminal rules rather than port rules. Slop reception, gas-freeing and any hot work permit are agreed with the terminal before the vessel sails in.",
    holdNote:
      "Mumbai is general and project cargo rather than dirty bulk, so the hold job here is dunnage, lashing waste, rust scale, bilge wells and tank tops — preparation for the next fixture rather than recovery from the last. The long harbour anchorage waits are what make it practical to do properly.",
    neighbours: ["nhava-sheva-port", "dahanu-port", "ratnagiri-port"],
  },
  {
    slug: "mundra-port",
    name: "Mundra",
    aka: ["Mundra Port", "Adani Mundra"],
    unlocode: "INMUN",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Gulf of Kutch",
    authority: "Mundra Port and the Gujarat Maritime Board",
    type: "Private Port",
    condition: "tidal-silt",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "Thermal coal",
      "Crude and POL",
      "Fertiliser",
      "Edible oil",
      "Project cargo",
    ],
    vesselTypes: [
      "Large container ships",
      "Capesize and Panamax bulk carriers",
      "Crude and product tankers",
    ],
    airports: ["Mundra", "Bhuj (BHJ)", "Kandla (IXY)"],
    workAreas: [
      "container terminals",
      "bulk and coal berths",
      "liquid terminals",
      "outer anchorage",
    ],
    conditions:
      "Mundra takes some of the largest tonnage calling anywhere in India, so a hull clean here is a big-area job that needs realistic planning rather than an optimistic single shift. The Gulf of Kutch tidal stream is strong and the water silty, so windows are worked around slack and visibility is low throughout. Terminal windows are tight and productivity-driven, which means the scope and the crew size are fixed before mobilisation and any contingency is agreed in advance, not negotiated at the gangway.",
    profile:
      "Mundra is India's largest commercial port by volume, a privately operated deep-water complex on the Kutch coast handling containers, coal, crude and liquid bulk. The container tonnage calling here is the largest in the country, which makes it the port where the absolute fuel value of a clean hull and a polished propeller is highest.",
    hook: "the largest tonnage calling anywhere in India",
    holdNote:
      "Mundra turns tonnage fast and the berth productivity targets are real, so hold cleaning here is either worked into the discharge sequence hold by hold or taken by a riding crew on the passage out. A shore gang waiting for all holds to be empty is a shore gang waiting past the berth window.",
    tankNote:
      "Mundra handles crude and product parcels on tight terminal windows, so tank work is planned as a passage or anchorage job unless the terminal has explicitly approved it alongside.",
    neighbours: ["kandla-port", "navlakhi-port", "jakhau-port"],
  },
  {
    slug: "navlakhi-port",
    name: "Navlakhi",
    aka: ["Navlakhi Port", "Navalakhi"],
    unlocode: "INNAV",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Gulf of Kutch",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "tidal-silt",
    waiting: "mixed",
    cargoes: ["Coal", "Bauxite", "Salt", "Fertiliser", "Agricultural bulk"],
    vesselTypes: [
      "Handysize bulk carriers",
      "Barges and coastal tonnage",
    ],
    airports: ["Rajkot (RAJ)", "Kandla (IXY)"],
    workAreas: ["tidal jetty berths", "lightening anchorage"],
    conditions:
      "Navlakhi is a tidal port at the head of the Gulf of Kutch, so depth alongside is tide-dependent and the streams through the approach run hard. Silt keeps visibility very low and dive windows short, planned to slack water. Larger vessels are lightened at anchor before coming in, so a good proportion of the underwater work here is done off the port rather than at the jetty, and the mobilisation plan has to cover both.",
    profile:
      "Navlakhi is a Gujarat Maritime Board port near Morbi handling coal, bauxite and salt for the ceramics and industrial belt inland. Traffic is smaller bulk tonnage and barges rather than deep-sea liner ships, and work here is usually combined with a Kandla or Mundra call in the same mobilisation.",
    hook: "tide-dependent jetty working at the head of the Gulf of Kutch",
    holdNote:
      "Navlakhi runs coal and bauxite through the same holds as salt and agricultural parcels, which is precisely the contamination sequence that fails inspections. Tonnage here is smaller and lightening at anchor is common, so a gang can work the emptied holds while the vessel is still discharging.",
    neighbours: ["kandla-port", "mundra-port", "okha-port"],
  },
  {
    slug: "nhava-sheva-port",
    name: "Nhava Sheva",
    officialName: "Jawaharlal Nehru Port (JNPA)",
    aka: ["JNPT", "JNPA", "Jawaharlal Nehru Port"],
    unlocode: "INNSA",
    state: "Maharashtra",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea, Mumbai harbour",
    authority: "Jawaharlal Nehru Port Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: ["Containers", "Liquid bulk", "Project cargo"],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Product tankers",
    ],
    airports: ["Mumbai (BOM)"],
    workAreas: ["container terminal berths", "liquid berth", "harbour anchorage"],
    conditions:
      "Nhava Sheva sits inside Mumbai harbour, so it is sheltered and anchorage work runs through most of the year with the south-west monsoon the main interruption. Container terminal windows are tight and productivity-driven, so a hull clean has to be scoped to run in parallel with cargo work and never to hold the berth. Harbour water is silty with moderate to low visibility, so survey-grade video is planned for, not assumed.",
    profile:
      "Nhava Sheva, officially Jawaharlal Nehru Port, is India's largest container port and the main box gateway for western India. Liner container ships run fixed rotations here, which makes propeller polishing and hull cleaning a scheduled maintenance item on a known interval rather than an emergency response to a speed complaint.",
    hook: "India's largest container port on a fixed liner rotation",
    holdNote:
      "Nhava Sheva is a container port, so hold work here means cell guides, bilge wells, hold bilges and tank tops rather than a bulk residue clean — a rope-access and confined-space job much more often than a shore gang one.",
    tankNote:
      "Liquid bulk is a small part of a container port, so tank work at Nhava Sheva is mostly bunker, slop and fuel tank cleaning on box ships and harbour craft rather than cargo grade changes. Container berth windows will not carry it, so it is planned for the anchorage.",
    neighbours: ["mumbai-port", "dahanu-port", "ratnagiri-port"],
  },
  {
    slug: "okha-port",
    name: "Okha",
    aka: ["Okha Port", "Okha Bandar"],
    unlocode: "INOKH",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Entrance to the Gulf of Kutch",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "clear-water",
    waiting: "mixed",
    cargoes: [
      "Salt",
      "Bauxite",
      "Bentonite",
      "General cargo",
      "Coastal fuel",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "Coastal tankers",
      "Barges and support craft",
    ],
    airports: ["Porbandar (PBD)", "Jamnagar (JGA)"],
    workAreas: ["jetty berths", "anchorage off the port"],
    conditions:
      "Okha lies at the western entrance to the Gulf of Kutch, where the water is noticeably clearer than at the head of the gulf and inspection video is genuinely usable. Tidal streams through the entrance are still strong, so dives are worked to slack. Depth alongside is limited, so larger tonnage is worked at anchor off the port rather than at the jetty.",
    profile:
      "Okha is a Gujarat Maritime Board port at the tip of the Saurashtra peninsula, working salt, bauxite and bentonite along with coastal traffic. It also serves as a shelter and bunkering call for vessels entering the Gulf of Kutch, which puts idle tonnage within reach of a dive team already working the Kandla and Mundra range.",
    hook: "clearer water at the Gulf of Kutch entrance",
    holdNote:
      "Salt and bentonite are the standing residues at Okha and both are hygroscopic: they cake into the frames and tank-top corners and go hard if the holds are shut up damp. Bentonite in particular has to come out completely before anything food-grade, and it does not come out by sweeping.",
    tankNote:
      "Tank work at Okha is coastal fuel tonnage and support craft — bunker and slop tanks rather than cargo grade changes. Depth alongside is limited, so anything larger is worked at the anchorage off the port.",
    neighbours: ["kandla-port", "porbandar-port", "navlakhi-port"],
  },
  {
    slug: "panaji-port",
    name: "Panaji",
    officialName: "Panaji Port (Mandovi River, Goa)",
    aka: ["Panjim", "Mandovi"],
    unlocode: "INPAN",
    state: "Goa",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Mandovi River",
    authority: "Captain of Ports, Goa",
    type: "State Port",
    condition: "riverine",
    waiting: "mixed",
    cargoes: [
      "River barge traffic",
      "General and project cargo",
      "Passenger and cruise",
    ],
    vesselTypes: [
      "Ore barges and tugs",
      "Coastal general cargo craft",
      "Passenger and river cruise vessels",
    ],
    airports: ["Goa (GOI)"],
    workAreas: ["river jetties", "barge moorings"],
    conditions:
      "Panaji works the Mandovi, so the conditions are riverine — tidal stream, heavy freshwater influence through the monsoon and limited depth. Visibility swings sharply with the season and the river discharge, from workable in the dry months to effectively nil after heavy rain. Most underwater work here is on barges, tugs and small craft rather than deep-sea tonnage, which means shorter dives but frequent propeller, rudder and inlet clearance work.",
    profile:
      "Panaji is Goa's river port on the Mandovi, historically the barge route carrying ore down to Mormugao and now working general cargo and passenger and cruise craft. The working fleet is small tonnage that spends long periods in warm, nutrient-rich river water — a fouling environment that punishes long intervals between cleans.",
    hook: "warm river water and a small-craft working fleet",
    holdNote:
      "Work at Panaji is barge and small-craft holds rather than deep-sea tonnage — ore residue, river silt and general cargo dunnage, in spaces small enough that the job is measured in hours rather than days. Access and rigging are usually the limiting factor here, not the residue.",
    neighbours: ["mormugao-port", "karwar-port", "ratnagiri-port"],
  },
  {
    slug: "paradip-port",
    name: "Paradip",
    officialName: "Paradip Port",
    aka: ["Paradeep", "Paradip Port Trust"],
    unlocode: "INPRT",
    state: "Odisha",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Paradip Port Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Thermal and coking coal",
      "Iron ore",
      "Crude and POL",
      "Fertiliser",
      "Containers",
    ],
    vesselTypes: [
      "Capesize and Panamax bulk carriers",
      "Crude and product tankers",
    ],
    airports: ["Bhubaneswar (BBI)"],
    workAreas: ["dry bulk berths", "oil jetty", "outer anchorage"],
    conditions:
      "Paradip is a deep-draft artificial harbour taking Capesize tonnage, so hull jobs here are large and need proper crew sizing rather than an optimistic estimate. The Bay of Bengal cyclone seasons are the governing risk at the anchorage, and the harbour itself can build swell in bad weather. Bulk handling puts coal and ore dust into the basin, so visibility at the dry bulk berths is habitually poor and any survey scope should be priced on that basis.",
    profile:
      "Paradip is Odisha's major port and one of India's highest-tonnage dry bulk ports, serving the eastern steel, power and refining belt. Large bulk carriers and crude tankers on repeat voyages make it a port where hull and propeller condition translate directly into voyage economics.",
    hook: "one of India's highest-tonnage dry bulk ports",
    holdNote:
      "Coal and iron ore move through Paradip in volume, and the two together are the worst-case hold cleaning brief: coal dust films every surface while ore fines pack into the frames and the tank-top margins. Anything following into a grain or clean cargo needs the full sequence, not a sweep.",
    tankNote:
      "Paradip handles crude and product parcels for the eastern refining belt, so sludge volume governs the job rather than the wash itself: what comes out of a crude tank here is a disposal problem before it is a cleaning one. Licensed reception is booked before the tanks are opened.",
    neighbours: ["dhamra-port", "haldia-port", "visakhapatnam-port"],
  },
  {
    slug: "pipavav-port",
    name: "Pipavav",
    officialName: "Pipavav Port (Pipavav Bandar)",
    aka: ["Pipavav Bandar", "Gujarat Pipavav Port", "APM Terminals Pipavav"],
    unlocode: "INPAV",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea off Saurashtra",
    authority: "Gujarat Pipavav Port Limited",
    type: "Private Port",
    condition: "clear-water",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "Dry bulk",
      "RoRo and automobiles",
      "Liquid bulk",
      "Fertiliser",
    ],
    vesselTypes: [
      "Container ships",
      "Pure car and truck carriers",
      "Bulk carriers",
      "Product tankers",
    ],
    airports: ["Diu (DIU)", "Rajkot (RAJ)"],
    workAreas: ["container berths", "bulk berths", "RoRo berth", "anchorage"],
    conditions:
      "Pipavav is a sheltered all-weather port on the Saurashtra coast, with water clearer than the Gulf of Khambhat and Gulf of Kutch ports and a tidal stream that is manageable rather than governing. That combination makes it one of the more comfortable Indian ports for in-water class survey and UWILD work as well as for cleaning. Terminal windows on the container and RoRo berths are tight, so the scope is fixed before the divers mobilise.",
    profile:
      "Pipavav is a privately operated all-weather port on the Gujarat coast handling containers, RoRo and dry bulk, with a rail link into the northern hinterland. It draws liner container and car carrier traffic on fixed rotations, which is the kind of predictable calling pattern that suits planned underwater maintenance.",
    hook: "clear all-weather water on the Saurashtra coast",
    holdNote:
      "Pipavav mixes container and RoRo tonnage with dry bulk and fertiliser, so the hold scope splits by caller: cell guides, bilge wells and tank tops on the box ships, full residue removal on the bulk. Terminal windows are tight on both, so the work is sized and staged before anyone boards.",
    tankNote:
      "The liquid side at Pipavav is product and chemical parcels on smaller tonnage, with the terminal setting the conditions for work alongside. The port's sheltered all-weather water makes the anchorage a reliable fallback where the berth will not carry it.",
    neighbours: ["bhavnagar-port", "muldwarka-port", "mundra-port"],
  },
  {
    slug: "porbandar-port",
    name: "Porbandar",
    aka: ["Porbandar Port", "Porbandar Bandar"],
    unlocode: "INPBD",
    state: "Gujarat",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea",
    authority: "Gujarat Maritime Board",
    type: "State Port",
    condition: "clear-water",
    waiting: "mixed",
    cargoes: [
      "Bauxite",
      "Clinker and cement",
      "Soda ash",
      "Fishing catch",
      "Coastal fuel",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "Coastal tankers",
      "Fishing and support craft",
    ],
    airports: ["Porbandar (PBD)", "Jamnagar (JGA)"],
    workAreas: ["breakwater harbour berths", "outer anchorage"],
    conditions:
      "Porbandar is a breakwater harbour on the open Saurashtra coast with comparatively clear Arabian Sea water, which makes video inspection genuinely worth commissioning here. The south-west monsoon between June and September is the limiting season. Depth alongside is limited, so larger tonnage is worked at the anchorage outside the harbour and the dive plan has to account for the swell that reaches it.",
    profile:
      "Porbandar is a Gujarat Maritime Board port working bauxite, soda ash and cement alongside one of the larger fishing fleets on the coast. It is also a Coast Guard base and a regular shelter and crew-change call for coastal traffic, which puts a steady stream of idle tonnage within reach.",
    hook: "clear water on the open Saurashtra coast",
    holdNote:
      "Bauxite, clinker and soda ash are the standing residues, and soda ash is the one to watch — it is alkaline, it attacks coatings if it is left, and it draws moisture out of the air. Holds here are washed promptly after discharge rather than carried to the next port.",
    tankNote:
      "Tank work at Porbandar is coastal fuel and support craft — bunker, slop and fuel tanks rather than cargo grade changes — with the fishing fleet adding a steady stream of small-tank work. Larger tonnage is worked at the anchorage outside the harbour.",
    neighbours: ["okha-port", "muldwarka-port", "pipavav-port"],
  },
  {
    slug: "ratnagiri-port",
    name: "Ratnagiri",
    aka: ["Ratnagiri Port", "Konkan coast"],
    unlocode: "INRTC",
    state: "Maharashtra",
    country: "India",
    countryCode: "IN",
    coast: "West Coast",
    weather: "india-west",
    waterBody: "Arabian Sea, Konkan coast",
    authority: "Maharashtra Maritime Board",
    type: "State Port",
    condition: "clear-water",
    waiting: "long-wait",
    cargoes: ["Coal", "Bauxite", "General cargo", "Fishing catch"],
    vesselTypes: [
      "Handysize bulk carriers",
      "Coastal tonnage",
      "Fishing and support craft",
    ],
    airports: ["Ratnagiri", "Mumbai (BOM)", "Goa (GOI)"],
    workAreas: ["inner harbour berths", "anchorage", "Jaigad terminal nearby"],
    conditions:
      "Ratnagiri works a sheltered bay on the Konkan coast with reasonably clear water outside the monsoon, which suits inspection and survey work as well as cleaning. The south-west monsoon between June and September closes most of the season. Depth in the inner harbour is limited, so deep-sea tonnage is worked at the anchorage and the swell reaching it sets the practical window.",
    profile:
      "Ratnagiri is a Maharashtra Maritime Board port on the Konkan coast working coal and general cargo alongside a substantial fishing fleet, and it sits close to the bulk terminal at Jaigad. Traffic is coastal and regional rather than liner, so underwater work is usually planned against a lay-up or waiting period rather than a berth window.",
    hook: "clear Konkan bay water outside the monsoon",
    holdNote:
      "Coal and bauxite are the recurring residues at Ratnagiri, on smaller tonnage that often waits at anchorage between fixtures. That waiting time is the opportunity: the holds can be worked properly at anchor rather than squeezed against a berth that was never going to be held open for them.",
    neighbours: ["mormugao-port", "mumbai-port", "panaji-port"],
  },
  {
    slug: "tuticorin-port",
    name: "Tuticorin",
    officialName: "V. O. Chidambaranar Port (Tuticorin)",
    aka: ["Thoothukudi", "VOC Port", "Tuticorin Port Trust"],
    unlocode: "INTUT",
    state: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Gulf of Mannar",
    authority: "V. O. Chidambaranar Port Authority",
    type: "Major Port",
    condition: "clear-water",
    waiting: "mixed",
    cargoes: [
      "Containers",
      "Thermal coal",
      "Industrial salt",
      "Sugar",
      "Fertiliser",
      "Granite",
    ],
    vesselTypes: [
      "Feeder container ships",
      "Panamax and Handymax bulk carriers",
      "General cargo ships",
    ],
    airports: ["Thoothukudi (TCR)", "Madurai (IXM)"],
    workAreas: ["container berths", "coal berths", "outer anchorage"],
    conditions:
      "Tuticorin is an artificial breakwater harbour on the Gulf of Mannar, and the water there is among the clearest at any Indian commercial port — which makes it particularly well suited to in-water class survey, UWILD and documented inspection. The north-east monsoon from October to December sets the anchorage window. The other side of that warm southern water is biological: fouling establishes quickly here, so cleaning intervals need to be shorter than owners typically plan for.",
    profile:
      "V. O. Chidambaranar Port at Tuticorin is the principal port of southern Tamil Nadu, working containers, coal, salt and sugar, and it is the closest Indian major port to the Colombo transhipment route. Feeder container ships and bulk carriers on short regional voyages dominate the traffic.",
    hook: "the clearest working water of any Indian major port",
    holdNote:
      "Industrial salt and raw sugar dominate here, and both are hygroscopic — residues cake into frames, brackets and tank-top corners and go hard if the holds are shut up damp. Cleaning is worked before the residue sets, not after.",
    neighbours: ["cochin-port", "chennai-port", "krishnapatnam-port"],
  },
  {
    slug: "visakhapatnam-port",
    name: "Visakhapatnam",
    officialName: "Visakhapatnam Port",
    aka: ["Vizag", "Vishakhapatnam", "VPA", "Visakhapatnam Port Trust"],
    unlocode: "INVTZ",
    state: "Andhra Pradesh",
    country: "India",
    countryCode: "IN",
    coast: "East Coast",
    weather: "india-east",
    waterBody: "Bay of Bengal",
    authority: "Visakhapatnam Port Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Iron ore and pellets",
      "Coking and thermal coal",
      "Crude and POL",
      "Containers",
      "Fertiliser",
      "Alumina",
    ],
    vesselTypes: [
      "Capesize and Panamax bulk carriers",
      "Crude and product tankers",
      "Container ships",
      "Offshore and naval auxiliary craft",
    ],
    airports: ["Visakhapatnam (VTZ)"],
    workAreas: ["inner harbour berths", "outer harbour", "anchorage"],
    conditions:
      "Visakhapatnam has the deepest natural harbour on India's east coast, with an inner harbour that is very well sheltered and an outer harbour built for large bulk tonnage. That shelter means alongside dive work runs through most of the year, with the cyclone seasons the main interruption at the anchorage. Inner harbour water is silty with moderate to low visibility while the outer harbour is generally clearer, so the same port supports both touch-work cleaning and usable survey video depending on where the vessel lies.",
    profile:
      "Visakhapatnam is the principal major port on the Andhra coast, handling iron ore, coal, crude and containers, with Hindustan Shipyard and a naval dockyard in the same waters. Cleanship keeps an operating base at Visakhapatnam, so divers, compressors and cleaning gear are held locally rather than flown in against a berth window.",
    hook: "the deepest natural harbour on the east coast",
    holdNote:
      "Iron ore, alumina and coal are the standing residues at Visakhapatnam, and the red staining from ore fines is the one owners underestimate — it needs chemical treatment and rinsing, not sweeping. Cleanship holds an operating base here, so a gang can be on board the same day.",
    tankNote:
      "Crude and product parcels move through Visakhapatnam alongside the dry bulk, and the operating base means tank cleaning crews, pumps and slop handling are arranged locally rather than mobilised against a berth window.",
    neighbours: ["gangavaram-port", "kakinada-port", "paradip-port"],
    base: true,
  },
];

/* -------------------------------------------------------------------- */
/* Lookups                                                              */
/* -------------------------------------------------------------------- */

export { portLabel } from "./types";

const bySlug = new Map(indiaPorts.map((port) => [port.slug, port]));

export function getIndiaPort(slug: string): Port | undefined {
  return bySlug.get(slug);
}

/** Ports grouped by state, largest group first, for the national hubs. */
export function portsByState(ports: Port[] = indiaPorts) {
  const order: string[] = [];
  const groups = new Map<string, Port[]>();

  for (const port of ports) {
    if (!groups.has(port.state)) {
      groups.set(port.state, []);
      order.push(port.state);
    }
    groups.get(port.state)!.push(port);
  }

  return order
    .map((state) => ({ state, ports: groups.get(state)! }))
    .sort(
      (a, b) =>
        b.ports.length - a.ports.length || a.state.localeCompare(b.state),
    );
}
