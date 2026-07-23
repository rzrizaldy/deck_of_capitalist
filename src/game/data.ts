import type { CardTemplate, Consumable, GroupKey, HandKey, MarketModifier, Tycoon } from './types';

export const GROUPS: Record<GroupKey, { label: string; setSize: number; color: string; ink: string }> = {
  RESIDENTIAL: { label: 'Hunian', setSize: 10, color: '#b85d5a', ink: '#fff3df' },
  COMMERCIAL: { label: 'Komersial', setSize: 10, color: '#ca8d2d', ink: '#241604' },
  INDUSTRIAL: { label: 'Industri', setSize: 10, color: '#7858b7', ink: '#f4efff' },
  UTILITY: { label: 'Utilitas', setSize: 10, color: '#5d8797', ink: '#081a21' },
  TRANSPORT: { label: 'Transport', setSize: 10, color: '#319b76', ink: '#021c12' },
};

export const HANDS: Record<HandKey, { name: string; multiplier: number; description: string }> = {
  HIGH_ASSET: { name: 'High Asset', multiplier: 1, description: 'Gak ada pola; rank tertinggi yang jalan.' },
  PAIR: { name: 'Pair', multiplier: 2, description: 'Dua aset rank sama.' },
  TWO_PAIRS: { name: 'Two Pairs', multiplier: 3, description: 'Dua pasang rank beda.' },
  THREE_KIND: { name: 'Three of a Kind', multiplier: 4, description: 'Tiga aset rank sama.' },
  STRAIGHT: { name: 'Straight', multiplier: 6, description: 'Lima rank berurutan, kelas bebas.' },
  FLUSH: { name: 'Flush', multiplier: 7, description: 'Empat atau lima aset satu kelas.' },
  FULL_HOUSE: { name: 'Full House', multiplier: 9, description: 'Tiga sama plus satu pasang.' },
  FOUR_KIND: { name: 'Four of a Kind', multiplier: 12, description: 'Empat aset rank sama.' },
  STRAIGHT_FLUSH: { name: 'Straight Flush', multiplier: 16, description: 'Lima rank berurutan, satu kelas.' },
};

/** Market events are public constraints, not surprise punishments. */
export const MARKET_MODIFIERS: MarketModifier[] = [
  { id: 'BANJIR', name: 'Banjir', summary: 'Aset Hunian mati di pasar ini.', art: 'banjir' },
  { id: 'MACET', name: 'Macet', summary: 'Aset Transport cuma setengah chip di pasar ini.', art: 'macet' },
  { id: 'MATI_LAMPU', name: 'Mati Lampu', summary: 'Aset Utilitas mati di pasar ini.', art: 'mati-lampu' },
  { id: 'GANJIL_GENAP', name: 'Ganjil-Genap', summary: 'Cuma aset chip ganjil yang jalan di pasar ini.', art: 'ganjil-genap', parity: 'odd' },
  { id: 'SIDAK', name: 'Sidak', summary: 'Efek taipan off di pasar ini.', art: 'sidak' },
  { id: 'MUSIM_KAWIN', name: 'Musim Kawin', summary: 'Chip Komersial dobel; aset lain −20%.', art: 'musim-kawin' },
  { id: 'REKLAMASI', name: 'Reklamasi', summary: 'Tiga aset acak disingkirkan cuma buat pasar ini.', art: 'reklamasi' },
];

export const CONSUMABLES: Consumable[] = [
  { id: 'SERTIFIKAT', name: 'Sertifikat', description: 'Ubah satu aset terpilih ke grup berikutnya.', cost: 3, art: 'sertifikat' },
  { id: 'NOTARIS', name: 'Notaris', description: 'Salin satu aset terpilih ke buangan.', cost: 4, art: 'notaris' },
  { id: 'PUNGLI', name: 'Pungli', description: 'Acak ulang event pasar. Reklamasi gak ikut.', cost: 3, art: 'pungli' },
  { id: 'UANG_PELICIN', name: 'Uang Pelicin', description: 'Dapat satu tangan ekstra cuma buat pasar ini.', cost: 4, art: 'uang-pelicin' },
  { id: 'SITA', name: 'Sita', description: 'Musnahkan tepat tiga aset terpilih dari tanganmu.', cost: 4, art: 'sita' },
];

const ASSET_CLASSES: Array<{ group: GroupKey; assets: Array<{ name: string; artId?: string }> }> = [
  { group: 'RESIDENTIAL', assets: [
    { name: 'Kampung Pesisir', artId: 'kampung-pesisir' }, { name: 'Rusun Pinggir Rel', artId: 'rusun-pinggir-rel' }, { name: 'Kontrakan Cipinang', artId: 'kontrakan-cipinang' }, { name: 'Perumahan Bekasi', artId: 'perumahan-bekasi' }, { name: 'Komplek Cibubur', artId: 'komplek-cibubur' },
    { name: 'Kemang Townhouse', artId: 'kemang' }, { name: 'Pondok Indah', artId: 'pondok-indah' }, { name: 'Menteng', artId: 'menteng' }, { name: 'Pantai Indah Kapuk', artId: 'pantai-indah-kapuk' }, { name: 'Superblok SCBD', artId: 'scbd' },
  ] },
  { group: 'COMMERCIAL', assets: [
    { name: 'Warung Tenda', artId: 'warung-tenda' }, { name: 'Kios Pasar', artId: 'kios-pasar' }, { name: 'Ruko Depok', artId: 'ruko-depok' }, { name: 'Ruko BSD', artId: 'bsd' }, { name: 'Kafe Kemang', artId: 'kemang' },
    { name: 'Blok M Plaza', artId: 'blok-m-plaza' }, { name: 'Senopati Strip', artId: 'senopati' }, { name: 'Kuningan Tower', artId: 'kuningan' }, { name: 'Sudirman Exchange', artId: 'sudirman' }, { name: 'SCBD District', artId: 'scbd' },
  ] },
  { group: 'INDUSTRIAL', assets: [
    { name: 'Gudang Dadap', artId: 'gudang-dadap' }, { name: 'Pabrik Cikarang', artId: 'pabrik-cikarang' }, { name: 'Kawasan Karawang', artId: 'kawasan-karawang' }, { name: 'Pelabuhan Tanjung Priok', artId: 'pelabuhan-tanjung-priok' }, { name: 'Smelter Sulawesi', artId: 'smelter-sulawesi' },
    { name: 'Kilang Balikpapan', artId: 'balikpapan' }, { name: 'Batam Freeport', artId: 'batam' }, { name: 'Kawasan Kendal', artId: 'kawasan-kendal' }, { name: 'Morowali Estate', artId: 'morowali-estate' }, { name: 'Nusantara Megaproject', artId: 'nusantara-megaproject' },
  ] },
  { group: 'UTILITY', assets: [
    { name: 'Sumur Kampung', artId: 'sumur-kampung' }, { name: 'PDAM Cabang', artId: 'pdam' }, { name: 'Gardu PLN', artId: 'pln' }, { name: 'Menara BTS', artId: 'menara-bts' }, { name: 'IPAL Kota', artId: 'ipal-kota' },
    { name: 'Bendungan Jatiluhur', artId: 'bendungan-jatiluhur' }, { name: 'Jaringan Serat', artId: 'jaringan-serat' }, { name: 'Pembangkit Gas', artId: 'pembangkit-gas' }, { name: 'PLTA Cirata', artId: 'plta-cirata' }, { name: 'Grid Nusantara', artId: 'grid-nusantara' },
  ] },
  { group: 'TRANSPORT', assets: [
    { name: 'Angkot Terminal', artId: 'angkot-terminal' }, { name: 'Stasiun KRL', artId: 'gambir' }, { name: 'Pelabuhan Merak', artId: 'pelabuhan-merak' }, { name: 'Tol Cipularang', artId: 'tol-cipularang' }, { name: 'MRT Jakarta', artId: 'mrt' },
    { name: 'Bandara Soetta', artId: 'soetta' }, { name: 'Whoosh Rail', artId: 'whoosh' }, { name: 'Pelabuhan Batam', artId: 'batam' }, { name: 'Trans-Sumatra', artId: 'trans-sumatra' }, { name: 'Jaringan Logistik Nusantara', artId: 'jaringan-logistik-nusantara' },
  ] },
];

export const CARD_TEMPLATES: CardTemplate[] = ASSET_CLASSES.flatMap(({ group, assets }) =>
  Array.from({ length: 10 }, (_, index) => {
    const rank = index + 1;
    const asset = assets[index];
    return { id: `${group.toLowerCase()}-${rank}`, name: asset.name, artId: asset.artId, chips: rank * 5, rank, group };
  }),
);
export const STARTING_DUPLICATES: string[] = [];

const TYCOON_ROSTER: Tycoon[] = [
  { id: 'pak-notaris', name: 'Pak Notaris', description: '×1.5 multiplier. Berkasnya selalu lolos.', cost: 8, effect: { kind: 'xmult_flat', amount: 1.5 } },
  { id: 'makelar-tanah', artId: 'red-baron', name: 'Makelar Tanah', description: '+3 multiplier untuk tiap aset Hunian.', cost: 5, effect: { kind: 'mult_per_group', group: 'RESIDENTIAL', amount: 3 } },
  { id: 'oknum', artId: 'insider', name: 'Oknum', description: '×1.35 multiplier. Inspeksi pura-pura tidak melihat.', cost: 9, effect: { kind: 'xmult_flat', amount: 1.35 } },
  { id: 'anak-pejabat', artId: 'banker', name: 'Anak Pejabat', description: 'Semua harga Pasar Malam 40% lebih murah.', cost: 7, effect: { kind: 'shop_discount', amount: 0.6 } },
  { id: 'bos-proyek', artId: 'power-player', name: 'Bos Proyek', description: '+25 chip untuk tiap aset Industri.', cost: 6, effect: { kind: 'chips_per_group', group: 'INDUSTRIAL', amount: 25 } },
  { id: 'juragan-kos', artId: 'heritage-trust', name: 'Juragan Kos', description: '+20 chip untuk tiap aset Hunian.', cost: 6, effect: { kind: 'chips_per_group', group: 'RESIDENTIAL', amount: 20 } },
  { id: 'sultan-andara', artId: 'blue-chip', name: 'Sultan Andara', description: '×2 multiplier saat aset Komersial ikut dimainkan.', cost: 10, effect: { kind: 'xmult_per_group', group: 'COMMERCIAL', amount: 2 } },
  { id: 'tukang-palak', artId: 'lone-wolf', name: 'Tukang Palak', description: '+4 multiplier untuk tiap aset Komersial.', cost: 6, effect: { kind: 'mult_per_group', group: 'COMMERCIAL', amount: 4 } },
  { id: 'pak-rt', artId: 'green-corridor', name: 'Pak RT', description: 'Batas bunga naik menjadi $10.', cost: 5, effect: { kind: 'interest_cap', amount: 10 } },
  { id: 'investor-bodong', artId: 'diversifier', name: 'Investor Bodong', description: '×2.25 pada Koridor Prime. Percaya brosurnya.', cost: 8, effect: { kind: 'xmult_per_hand', hand: 'STRAIGHT_FLUSH', amount: 2.25 } },
  { id: 'raja-kavling', artId: 'red-baron', name: 'Raja Kavling', description: '×1.35 multiplier untuk tiap aset Hunian.', cost: 8, effect: { kind: 'xmult_per_group', group: 'RESIDENTIAL', amount: 1.35 } },
  { id: 'ibu-ibu-arisan', artId: 'heritage-trust', name: 'Ibu-Ibu Arisan', description: '+70 chip pada Pasangan.', cost: 5, effect: { kind: 'chips_for_hand', hand: 'PAIR', amount: 70 } },
  { id: 'mafia-parkir', artId: 'lone-wolf', name: 'Mafia Parkir', description: '×1.8 multiplier saat hanya memainkan satu kartu.', cost: 5, effect: { kind: 'xmult_hand_size', size: 1, amount: 1.8 } },
  { id: 'bandar-tol', artId: 'rail-magnate', name: 'Bandar Tol', description: '+3 multiplier untuk tiap aset Transport.', cost: 7, effect: { kind: 'mult_per_group', group: 'TRANSPORT', amount: 3 } },
  { id: 'pengusaha-kafe', artId: 'green-corridor', name: 'Pengusaha Kafe', description: '+22 chip untuk tiap aset Komersial.', cost: 6, effect: { kind: 'chips_per_group', group: 'COMMERCIAL', amount: 22 } },
  { id: 'penguasa-sudirman', artId: 'green-corridor', name: 'Penguasa Sudirman', description: '+4 multiplier untuk tiap aset Komersial.', cost: 7, effect: { kind: 'mult_per_group', group: 'COMMERCIAL', amount: 4 } },
  { id: 'tuan-tanah', artId: 'blue-chip', name: 'Tuan Tanah', description: '×2 multiplier pada Kawasan Lengkap.', cost: 9, effect: { kind: 'xmult_per_hand', hand: 'FULL_HOUSE', amount: 2 } },
  { id: 'pialang-saham', artId: 'banker', name: 'Pialang Saham', description: '×1.6 multiplier. Semuanya sudah masuk harga.', cost: 8, effect: { kind: 'xmult_flat', amount: 1.6 } },
  { id: 'bos-pelabuhan', artId: 'rail-magnate', name: 'Bos Pelabuhan', description: '+30 chip untuk tiap aset Transport.', cost: 7, effect: { kind: 'chips_per_group', group: 'TRANSPORT', amount: 30 } },
  { id: 'sultan-kontainer', artId: 'power-player', name: 'Sultan Kontainer', description: '+45 chip untuk tiap aset Utilitas.', cost: 6, effect: { kind: 'chips_per_group', group: 'UTILITY', amount: 45 } },
  { id: 'ibu-cosplay', artId: 'diversifier', name: 'Ibu Cosplay', description: '×1.9 multiplier pada Satu Kelas.', cost: 8, effect: { kind: 'xmult_per_hand', hand: 'FLUSH', amount: 1.9 } },
  { id: 'raja-petak', artId: 'red-baron', name: 'Raja Petak', description: '+90 chip pada Dua Pasang.', cost: 6, effect: { kind: 'chips_for_hand', hand: 'TWO_PAIRS', amount: 90 } },
  { id: 'kolektor-ruko', artId: 'blue-chip', name: 'Kolektor Ruko', description: '×1.5 multiplier untuk tiap aset Komersial.', cost: 9, effect: { kind: 'xmult_per_group', group: 'COMMERCIAL', amount: 1.5 } },
  { id: 'juragan-bali', artId: 'green-corridor', name: 'Juragan Bali', description: '+24 chip untuk tiap aset Hunian.', cost: 6, effect: { kind: 'chips_per_group', group: 'RESIDENTIAL', amount: 24 } },
];

/**
 * A contract is always a meaningful investment. Conditional effects form the
 * build; the visible core multiplier makes buying into it compound over a run.
 */
const TYCOON_CORE_MULTIPLIER = 1.39;

export const TYCOONS: Tycoon[] = TYCOON_ROSTER.map((tycoon) => ({
  ...tycoon,
  cost: Math.max(3, Math.floor(tycoon.cost * 0.6)),
  xmult: tycoon.xmult ?? TYCOON_CORE_MULTIPLIER,
  description: `${tycoon.description} Inti ×${TYCOON_CORE_MULTIPLIER}.`,
}));
