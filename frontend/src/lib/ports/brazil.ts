/**
 * Brazilian port coverage — list only, no landing pages.
 *
 * Deliberately not a `Port[]`. The India and UAE sets carry hand-written
 * working conditions, permitting authority and cargo profile for every entry,
 * and that is what makes a port landing page worth publishing. We do not have
 * that depth for all 33 Brazilian ports yet, and publishing 33 pages of
 * templated filler would put the whole programme at risk rather than just the
 * new pages.
 *
 * So Brazil gets one country page that is honest about what it is, listing
 * the ports we cover. Promote entries into a full `Port[]` in ./brazil.ts as
 * the operational detail for each becomes available.
 *
 * Source: the UN/LOCODE list in `Port Coverage.xlsx` at the repo root.
 */

export type ListedPort = { name: string; unlocode: string; note?: string };

export const brazilPorts: ListedPort[] = [
  { name: "Santos", unlocode: "BRSSZ", note: "Containers, sugar, grain, soya" },
  { name: "Paranagua", unlocode: "BRPNG", note: "Grain, soya, sugar, fertiliser" },
  { name: "Rio Grande", unlocode: "BRRIG", note: "Grain, containers, fertiliser" },
  { name: "Itaqui", unlocode: "BRITQ", note: "Iron ore, grain, fuel" },
  { name: "Ponta Da Madeira", unlocode: "BRPMA", note: "Iron ore export terminal" },
  { name: "Tubarao", unlocode: "BRTUB", note: "Iron ore and pellets" },
  { name: "Praia Mole", unlocode: "BRPRM", note: "Coal, coke and steel" },
  { name: "Vitoria", unlocode: "BRVIX", note: "General cargo, steel, containers" },
  { name: "Sepetiba", unlocode: "BRGUI", note: "Iron ore, coal, containers" },
  { name: "Itaguai", unlocode: "BRSPB", note: "Iron ore and containers" },
  { name: "Rio De Janeiro", unlocode: "BRRIO", note: "Containers, general cargo, offshore" },
  { name: "Sao Sebastiao", unlocode: "BRSSO", note: "Crude and products" },
  { name: "Sao Francisco Do Sul", unlocode: "BRSFS", note: "Grain, soya, containers" },
  { name: "Itapoa", unlocode: "BRIOA", note: "Containers" },
  { name: "Imbituba", unlocode: "BRIBB", note: "Containers, coal, general cargo" },
  { name: "Porto Alegre", unlocode: "BRPOA", note: "River port, general cargo" },
  { name: "Aratu", unlocode: "BRARB", note: "Chemicals, fertiliser, bulk" },
  { name: "Admiral Barroso", unlocode: "BRSSB", note: "Iron ore and bulk terminal" },
  { name: "Usiba", unlocode: "BRPSB", note: "Steel raw materials" },
  { name: "Ilheus", unlocode: "BRIOS", note: "Cocoa, general cargo" },
  { name: "Portocel", unlocode: "BRPCL", note: "Pulp and paper export" },
  { name: "Recife", unlocode: "BRREC", note: "Sugar, containers, general cargo" },
  { name: "Pecem", unlocode: "BRPEC", note: "Steel, containers, fuel" },
  { name: "Mucuripe", unlocode: "BRMUE", note: "Fuel, general cargo" },
  { name: "Camocim", unlocode: "BRCMC", note: "Coastal and general cargo" },
  { name: "Sao Luis", unlocode: "BRSLZ", note: "Bulk and general cargo" },
  { name: "Alumar", unlocode: "BRALU", note: "Bauxite and alumina terminal" },
  { name: "Belem", unlocode: "BRBEL", note: "River port, general cargo" },
  { name: "Vila Do Conde", unlocode: "BRVDC", note: "Bauxite, alumina, containers" },
  { name: "Barcarena", unlocode: "BRBCA", note: "Alumina, grain, containers" },
  { name: "Santarem", unlocode: "BRSTM", note: "Amazon grain terminal" },
  { name: "Itacoatiara", unlocode: "BRITA", note: "Amazon grain terminal" },
  { name: "Altamira", unlocode: "BRATM", note: "Amazon river cargo" },
];
