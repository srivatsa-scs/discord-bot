let raids = new Map();
raids.set(1, {
	name: 'Spirit Vale',
	id: 'spirit_vale',
	boss: [
		{ name: 'Vale Guardian', id: 'vale_guardian' },
		{ name: 'Spirit Woods', id: 'spirit_woods' },
		{ name: 'Gorseval', id: 'gorseval' },
		{ name: 'Sabetha', id: 'sabetha' },
	],
});
raids.set(2, {
	name: 'Salvation Pass',
	id: 'salvation_pass',
	boss: [
		{ name: 'Slothasor', id: 'slothasor' },
		{ name: 'Bandit Trio', id: 'bandit_trio' },
		{ name: 'Matthias', id: 'matthias' },
	],
});
raids.set(3, {
	name: 'Stronghold of the Faithful',
	id: 'stronghold_of_the_faithful',
	boss: [
		{ name: 'Escort', id: 'escort' },
		{ name: 'Keep Construct', id: 'keep_construct' },
		{ name: 'Xera', id: 'xera' },
	],
});
raids.set(4, {
	name: 'Bastion of the Penitent',
	id: 'bastion_of_the_penitent',
	boss: [
		{ name: 'Cairn', id: 'cairn' },
		{ name: 'Mursaat Overseer', id: 'mursaat_overseer' },
		{ name: 'Samarog', id: 'samarog' },
		{ name: 'Deimos', id: 'deimos' },
	],
});
raids.set(5, {
	name: 'Hall of Chains',
	id: 'hall_of_chains',
	boss: [
		{ name: 'Soulless Horror', id: 'soulless_horror' },
		{ name: 'River of Souls', id: 'river_of_souls' },
		{ name: 'Statues of Grenth', id: 'statues_of_grenth' },
		{ name: 'Dhuum', id: 'voice_in_the_void' },
	],
});
raids.set(6, {
	name: 'Mythwright Gambit',
	id: 'mythwright_gambit',
	boss: [
		{ name: 'Conjured Amalgamate', id: 'conjured_amalgamate' },
		{ name: 'Twin Largos', id: 'twin_largos' },
		{ name: 'Qadim', id: 'qadim' },
	],
});
raids.set(7, {
	name: 'The Key of Ahdashim',
	id: 'the_key_of_ahdashim',
	boss: [
		{ name: 'Gate', id: 'gate' },
		{ name: 'Adina', id: 'adina' },
		{ name: 'Sabir', id: 'sabir' },
		{ name: 'Qadim the Peerless', id: 'qadim_the_peerless' },
	],
});

let totalRaids: Array<string> = [
	'vale_guardian',
	'spirit_woods',
	'gorseval',
	'sabetha',

	'slothasor',
	'bandit_trio',
	'matthias',

	'escort',
	'keep_construct',
	'twisted_castle',
	'xera',

	'cairn',
	'mursaat_overseer',
	'samarog',
	'deimos',

	'soulless_horror',
	'river_of_souls',
	'statues_of_grenth',
	'voice_in_the_void',

	'conjured_amalgamate',
	'twin_largos',
	'qadim',

	'gate',
	'adina',
	'sabir',
	'qadim_the_peerless',
];

export default totalRaids;
