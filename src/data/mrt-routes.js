// Singapore MRT Network Data
// Contains all MRT lines, stations, and route coordinates

export const MRT_LINES = {
    NS: {
        name: 'North-South Line',
        color: '#D42E12',
        stations: [
            { code: 'NS1', name: 'Jurong East', lat: 1.3329, lng: 103.7422 },
            { code: 'NS2', name: 'Bukit Batok', lat: 1.3490, lng: 103.7495 },
            { code: 'NS3', name: 'Bukit Gombak', lat: 1.3587, lng: 103.7519 },
            { code: 'NS4', name: 'Choa Chu Kang', lat: 1.38551, lng: 103.74425 }, // Unified with BP1
            { code: 'NS5', name: 'Yew Tee', lat: 1.3973, lng: 103.7475 },
            { code: 'NS7', name: 'Kranji', lat: 1.4251, lng: 103.7620 },
            { code: 'NS8', name: 'Marsiling', lat: 1.4326, lng: 103.7740 },
            { code: 'NS9', name: 'Woodlands', lat: 1.4370, lng: 103.7865 },
            { code: 'NS10', name: 'Admiralty', lat: 1.4406, lng: 103.8009 },
            { code: 'NS11', name: 'Sembawang', lat: 1.4491, lng: 103.8200 },
            { code: 'NS12', name: 'Canberra', lat: 1.4431, lng: 103.8296 },
            { code: 'NS13', name: 'Yishun', lat: 1.4294, lng: 103.8350 },
            { code: 'NS14', name: 'Khatib', lat: 1.4174, lng: 103.8329 },
            { code: 'NS15', name: 'Yio Chu Kang', lat: 1.3818, lng: 103.8449 },
            { code: 'NS16', name: 'Ang Mo Kio', lat: 1.3700, lng: 103.8495 },
            { code: 'NS17', name: 'Bishan', lat: 1.3511, lng: 103.8485 },
            { code: 'NS18', name: 'Braddell', lat: 1.3404, lng: 103.8468 },
            { code: 'NS19', name: 'Toa Payoh', lat: 1.3327, lng: 103.8471 },
            { code: 'NS20', name: 'Novena', lat: 1.3204, lng: 103.8438 },
            { code: 'NS21', name: 'Newton', lat: 1.3138, lng: 103.8378 },
            { code: 'NS22', name: 'Orchard', lat: 1.3043, lng: 103.8321 },
            { code: 'NS23', name: 'Somerset', lat: 1.3006, lng: 103.8388 },
            { code: 'NS24', name: 'Dhoby Ghaut', lat: 1.2991, lng: 103.8458 },
            { code: 'NS25', name: 'City Hall', lat: 1.2931, lng: 103.8520 },
            { code: 'NS26', name: 'Raffles Place', lat: 1.2840, lng: 103.8515 },
            { code: 'NS27', name: 'Marina Bay', lat: 1.2766, lng: 103.8545 },
            { code: 'NS28', name: 'Marina South Pier', lat: 1.2714, lng: 103.8635 },
        ]
    },
    EW: {
        name: 'East-West Line',
        color: '#009645',
        stations: [
            { code: 'EW1', name: 'Pasir Ris', lat: 1.3730, lng: 103.9493 },
            { code: 'EW2', name: 'Tampines', lat: 1.3526, lng: 103.9453 },
            { code: 'EW3', name: 'Simei', lat: 1.3433, lng: 103.9532 },
            { code: 'EW4', name: 'Tanah Merah', lat: 1.3272, lng: 103.9463 },
            { code: 'EW5', name: 'Bedok', lat: 1.3240, lng: 103.9300 },
            { code: 'EW6', name: 'Kembangan', lat: 1.3209, lng: 103.9129 },
            { code: 'EW7', name: 'Eunos', lat: 1.3199, lng: 103.9030 },
            { code: 'EW8', name: 'Paya Lebar', lat: 1.3176, lng: 103.8928 },
            { code: 'EW9', name: 'Aljunied', lat: 1.3164, lng: 103.8829 },
            { code: 'EW10', name: 'Kallang', lat: 1.3114, lng: 103.8714 },
            { code: 'EW11', name: 'Lavender', lat: 1.3073, lng: 103.8631 },
            { code: 'EW12', name: 'Bugis', lat: 1.3009, lng: 103.8560 },
            { code: 'EW13', name: 'City Hall', lat: 1.2931, lng: 103.8520 },
            { code: 'EW14', name: 'Raffles Place', lat: 1.2840, lng: 103.8515 },
            { code: 'EW15', name: 'Tanjong Pagar', lat: 1.2766, lng: 103.8468 },
            { code: 'EW16', name: 'Outram Park', lat: 1.2804, lng: 103.8394 },
            { code: 'EW17', name: 'Tiong Bahru', lat: 1.2861, lng: 103.8270 },
            { code: 'EW18', name: 'Redhill', lat: 1.2894, lng: 103.8168 },
            { code: 'EW19', name: 'Queenstown', lat: 1.2946, lng: 103.8060 },
            { code: 'EW20', name: 'Commonwealth', lat: 1.3024, lng: 103.7984 },
            { code: 'EW21', name: 'Buona Vista', lat: 1.3074, lng: 103.7901 },
            { code: 'EW22', name: 'Dover', lat: 1.3114, lng: 103.7787 },
            { code: 'EW23', name: 'Clementi', lat: 1.3151, lng: 103.7653 },
            { code: 'EW24', name: 'Jurong East', lat: 1.3329, lng: 103.7422 },
            { code: 'EW25', name: 'Chinese Garden', lat: 1.3423, lng: 103.7325 },
            { code: 'EW26', name: 'Lakeside', lat: 1.3444, lng: 103.7210 },
            { code: 'EW27', name: 'Boon Lay', lat: 1.3387, lng: 103.7060 },
            { code: 'EW28', name: 'Pioneer', lat: 1.3375, lng: 103.6973 },
            { code: 'EW29', name: 'Joo Koon', lat: 1.3275, lng: 103.6782 },
            { code: 'EW30', name: 'Gul Circle', lat: 1.3194, lng: 103.6605 },
            { code: 'EW31', name: 'Tuas Crescent', lat: 1.3210, lng: 103.6492 },
            { code: 'EW32', name: 'Tuas West Road', lat: 1.3300, lng: 103.6397 },
            { code: 'EW33', name: 'Tuas Link', lat: 1.3403, lng: 103.6368 },
        ]
    },
    NE: {
        name: 'North-East Line',
        color: '#9900AA',
        stations: [
            { code: 'NE1', name: 'HarbourFront', lat: 1.2654, lng: 103.8209 },
            { code: 'NE3', name: 'Outram Park', lat: 1.2804, lng: 103.8394 },
            { code: 'NE4', name: 'Chinatown', lat: 1.2847, lng: 103.8444 },
            { code: 'NE5', name: 'Clarke Quay', lat: 1.2886, lng: 103.8465 },
            { code: 'NE6', name: 'Dhoby Ghaut', lat: 1.2991, lng: 103.8458 },
            { code: 'NE7', name: 'Little India', lat: 1.3066, lng: 103.8492 },
            { code: 'NE8', name: 'Farrer Park', lat: 1.3124, lng: 103.8538 },
            { code: 'NE9', name: 'Boon Keng', lat: 1.3195, lng: 103.8617 },
            { code: 'NE10', name: 'Potong Pasir', lat: 1.3313, lng: 103.8687 },
            { code: 'NE11', name: 'Woodleigh', lat: 1.3392, lng: 103.8709 },
            { code: 'NE12', name: 'Serangoon', lat: 1.3497, lng: 103.8734 },
            { code: 'NE13', name: 'Kovan', lat: 1.3600, lng: 103.8850 },
            { code: 'NE14', name: 'Hougang', lat: 1.3715, lng: 103.8926 },
            { code: 'NE15', name: 'Buangkok', lat: 1.3831, lng: 103.8930 },
            { code: 'NE16', name: 'Sengkang', lat: 1.39178, lng: 103.89549 }, // Unified with STC
            { code: 'NE17', name: 'Punggol', lat: 1.40537, lng: 103.90230 }, // Unified with PTC
        ]
    },
    CC: {
        name: 'Circle Line',
        color: '#FA9E0D',
        stations: [
            { code: 'CC1', name: 'Dhoby Ghaut', lat: 1.2991, lng: 103.8458 },
            { code: 'CC2', name: 'Bras Basah', lat: 1.2970, lng: 103.8508 },
            { code: 'CC3', name: 'Esplanade', lat: 1.2937, lng: 103.8554 },
            { code: 'CC4', name: 'Promenade', lat: 1.2930, lng: 103.8610 },
            { code: 'CC5', name: 'Nicoll Highway', lat: 1.2999, lng: 103.8636 },
            { code: 'CC6', name: 'Stadium', lat: 1.3028, lng: 103.8754 },
            { code: 'CC7', name: 'Mountbatten', lat: 1.3060, lng: 103.8825 },
            { code: 'CC8', name: 'Dakota', lat: 1.3084, lng: 103.8885 },
            { code: 'CC9', name: 'Paya Lebar', lat: 1.3176, lng: 103.8928 },
            { code: 'CC10', name: 'MacPherson', lat: 1.3267, lng: 103.8899 },
            { code: 'CC11', name: 'Tai Seng', lat: 1.3360, lng: 103.8878 },
            { code: 'CC12', name: 'Bartley', lat: 1.3423, lng: 103.8800 },
            { code: 'CC13', name: 'Serangoon', lat: 1.3497, lng: 103.8734 },
            { code: 'CC14', name: 'Lorong Chuan', lat: 1.3514, lng: 103.8641 },
            { code: 'CC15', name: 'Bishan', lat: 1.3511, lng: 103.8485 },
            { code: 'CC16', name: 'Marymount', lat: 1.3490, lng: 103.8392 },
            { code: 'CC17', name: 'Caldecott', lat: 1.3374, lng: 103.8395 },
            { code: 'CC19', name: 'Botanic Gardens', lat: 1.3224, lng: 103.8153 },
            { code: 'CC20', name: 'Farrer Road', lat: 1.3177, lng: 103.8073 },
            { code: 'CC21', name: 'Holland Village', lat: 1.3120, lng: 103.7962 },
            { code: 'CC22', name: 'Buona Vista', lat: 1.3074, lng: 103.7901 },
            { code: 'CC23', name: 'one-north', lat: 1.2996, lng: 103.7874 },
            { code: 'CC24', name: 'Kent Ridge', lat: 1.2935, lng: 103.7847 },
            { code: 'CC25', name: 'Haw Par Villa', lat: 1.2826, lng: 103.7820 },
            { code: 'CC26', name: 'Pasir Panjang', lat: 1.2760, lng: 103.7912 },
            { code: 'CC27', name: 'Labrador Park', lat: 1.2720, lng: 103.8025 },
            { code: 'CC28', name: 'Telok Blangah', lat: 1.2705, lng: 103.8098 },
            { code: 'CC29', name: 'HarbourFront', lat: 1.2654, lng: 103.8209 },
        ]
    },
    DT: {
        name: 'Downtown Line',
        color: '#005EC4',
        stations: [
            { code: 'DT1', name: 'Bukit Panjang', lat: 1.3784, lng: 103.7633 }, // Unified with BP6
            { code: 'DT2', name: 'Cashew', lat: 1.3690, lng: 103.7644 },
            { code: 'DT3', name: 'Hillview', lat: 1.3625, lng: 103.7675 },
            { code: 'DT5', name: 'Beauty World', lat: 1.3416, lng: 103.7760 },
            { code: 'DT6', name: 'King Albert Park', lat: 1.3356, lng: 103.7830 },
            { code: 'DT7', name: 'Sixth Avenue', lat: 1.3307, lng: 103.7973 },
            { code: 'DT8', name: 'Tan Kah Kee', lat: 1.3259, lng: 103.8073 },
            { code: 'DT9', name: 'Botanic Gardens', lat: 1.3224, lng: 103.8153 },
            { code: 'DT10', name: 'Stevens', lat: 1.3200, lng: 103.8260 },
            { code: 'DT11', name: 'Newton', lat: 1.3138, lng: 103.8378 },
            { code: 'DT12', name: 'Little India', lat: 1.3066, lng: 103.8492 },
            { code: 'DT13', name: 'Rochor', lat: 1.3037, lng: 103.8526 },
            { code: 'DT14', name: 'Bugis', lat: 1.3009, lng: 103.8560 },
            { code: 'DT15', name: 'Promenade', lat: 1.2930, lng: 103.8610 },
            { code: 'DT16', name: 'Bayfront', lat: 1.2815, lng: 103.8590 },
            { code: 'DT17', name: 'Downtown', lat: 1.2794, lng: 103.8527 },
            { code: 'DT18', name: 'Telok Ayer', lat: 1.2821, lng: 103.8486 },
            { code: 'DT19', name: 'Chinatown', lat: 1.2847, lng: 103.8444 },
            { code: 'DT20', name: 'Fort Canning', lat: 1.2924, lng: 103.8443 },
            { code: 'DT21', name: 'Bencoolen', lat: 1.2985, lng: 103.8500 },
            { code: 'DT22', name: 'Jalan Besar', lat: 1.3054, lng: 103.8554 },
            { code: 'DT23', name: 'Bendemeer', lat: 1.3138, lng: 103.8630 },
            { code: 'DT24', name: 'Geylang Bahru', lat: 1.3215, lng: 103.8715 },
            { code: 'DT25', name: 'Mattar', lat: 1.3268, lng: 103.8830 },
            { code: 'DT26', name: 'MacPherson', lat: 1.3267, lng: 103.8899 },
            { code: 'DT27', name: 'Ubi', lat: 1.3299, lng: 103.9000 },
            { code: 'DT28', name: 'Kaki Bukit', lat: 1.3350, lng: 103.9086 },
            { code: 'DT29', name: 'Bedok North', lat: 1.3346, lng: 103.9180 },
            { code: 'DT30', name: 'Bedok Reservoir', lat: 1.3364, lng: 103.9322 },
            { code: 'DT31', name: 'Tampines West', lat: 1.3456, lng: 103.9383 },
            { code: 'DT32', name: 'Tampines', lat: 1.3526, lng: 103.9453 },
            { code: 'DT33', name: 'Tampines East', lat: 1.3561, lng: 103.9545 },
            { code: 'DT34', name: 'Upper Changi', lat: 1.3413, lng: 103.9614 },
            { code: 'DT35', name: 'Expo', lat: 1.3351, lng: 103.9615 },
        ]
    },
    TE: {
        name: 'Thomson-East Coast Line',
        color: '#9D5B25',
        stations: [
            { code: 'TE1', name: 'Woodlands North', lat: 1.4485, lng: 103.7850 },
            { code: 'TE2', name: 'Woodlands', lat: 1.4370, lng: 103.7865 },
            { code: 'TE3', name: 'Woodlands South', lat: 1.4270, lng: 103.7935 },
            { code: 'TE4', name: 'Springleaf', lat: 1.3975, lng: 103.8186 },
            { code: 'TE5', name: 'Lentor', lat: 1.3848, lng: 103.8364 },
            { code: 'TE6', name: 'Mayflower', lat: 1.3718, lng: 103.8380 },
            { code: 'TE7', name: 'Bright Hill', lat: 1.3621, lng: 103.8332 },
            { code: 'TE8', name: 'Upper Thomson', lat: 1.3540, lng: 103.8330 },
            { code: 'TE9', name: 'Caldecott', lat: 1.3374, lng: 103.8395 },
            { code: 'TE11', name: 'Stevens', lat: 1.3200, lng: 103.8260 },
            { code: 'TE12', name: 'Napier', lat: 1.3068, lng: 103.8220 },
            { code: 'TE13', name: 'Orchard Boulevard', lat: 1.3022, lng: 103.8285 },
            { code: 'TE14', name: 'Orchard', lat: 1.3043, lng: 103.8321 },
            { code: 'TE15', name: 'Great World', lat: 1.2933, lng: 103.8357 },
            { code: 'TE16', name: 'Havelock', lat: 1.2871, lng: 103.8380 },
            { code: 'TE17', name: 'Outram Park', lat: 1.2804, lng: 103.8394 },
            { code: 'TE18', name: 'Maxwell', lat: 1.2800, lng: 103.8457 },
            { code: 'TE19', name: 'Shenton Way', lat: 1.2762, lng: 103.8487 },
            { code: 'TE20', name: 'Marina Bay', lat: 1.2766, lng: 103.8545 },
            { code: 'TE22', name: 'Gardens by the Bay', lat: 1.2794, lng: 103.8690 },
            { code: 'TE23', name: 'Tanjong Rhu', lat: 1.2936, lng: 103.8730 },
            { code: 'TE24', name: 'Katong Park', lat: 1.2970, lng: 103.8850 },
            { code: 'TE25', name: 'Tanjong Katong', lat: 1.3050, lng: 103.8940 },
            { code: 'TE26', name: 'Marine Parade', lat: 1.3020, lng: 103.9055 },
            { code: 'TE27', name: 'Marine Terrace', lat: 1.3065, lng: 103.9135 },
            { code: 'TE28', name: 'Siglap', lat: 1.3110, lng: 103.9230 },
            { code: 'TE29', name: 'Bayshore', lat: 1.3140, lng: 103.9390 },
        ]
    },
    CG: {
        name: 'Changi Airport Line',
        color: '#009645', // Same as EW (branch line)
        stations: [
            { code: 'CG', name: 'Tanah Merah', lat: 1.3272, lng: 103.9463 }, // Interchange with EW4
            { code: 'CG1', name: 'Expo', lat: 1.3351, lng: 103.9615 },       // Interchange with DT35
            { code: 'CG2', name: 'Changi Airport', lat: 1.3574, lng: 103.9884 },
        ]
    },
    // LRT Systems
    BP: {
        name: 'Bukit Panjang LRT',
        color: '#748477', // Grey
        isLRT: true,
        // Define exact visual path for BP Line + Loop
        // BP1 -> BP6 -> Loop (BP7..BP13) -> BP6
        loopPath: [
            'BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6',
            'BP7', 'BP8', 'BP9', 'BP10', 'BP11', 'BP12', 'BP13',
            'BP6', // Close the loop back to BP6
            'BP5', 'BP4', 'BP3', 'BP2', 'BP1' // Return to CCK
        ],
        stations: [
            { code: 'BP1', name: 'Choa Chu Kang', lat: 1.38551, lng: 103.74425 }, // Interchange with NS4
            { code: 'BP2', name: 'South View', lat: 1.38031, lng: 103.74522 },
            { code: 'BP3', name: 'Keat Hong', lat: 1.37867, lng: 103.74893 },
            { code: 'BP4', name: 'Teck Whye', lat: 1.37687, lng: 103.75294 },
            { code: 'BP5', name: 'Phoenix', lat: 1.37848, lng: 103.75762 },
            { code: 'BP6', name: 'Bukit Panjang', lat: 1.3784, lng: 103.7633 }, // Interchange with DT1 (Unified coordinates)
            { code: 'BP7', name: 'Petir', lat: 1.37773, lng: 103.76715 },
            { code: 'BP8', name: 'Pending', lat: 1.37597, lng: 103.77138 },
            { code: 'BP9', name: 'Bangkit', lat: 1.38003, lng: 103.77263 },
            { code: 'BP10', name: 'Fajar', lat: 1.38454, lng: 103.77083 },
            { code: 'BP11', name: 'Segar', lat: 1.38768, lng: 103.76951 },
            { code: 'BP12', name: 'Jelapang', lat: 1.38646, lng: 103.76427 },
            { code: 'BP13', name: 'Senja', lat: 1.38272, lng: 103.76240 },
        ]
    },
    SK: {
        name: 'Sengkang LRT',
        color: '#748477', // Grey
        isLRT: true,
        // Define exact visual path for figure-8 loop
        loopPath: [
            'STC', 'SW1', 'SW2', 'SW3', 'SW4', 'SW5', 'SW6', 'SW7', 'SW8', 'STC', // West Loop
            'STC', 'SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'STC'  // East Loop
        ],
        stations: [
            // West Loop
            { code: 'STC', name: 'Sengkang', lat: 1.39178, lng: 103.89549 }, // Transfer station (NE16)
            { code: 'SW1', name: 'Cheng Lim', lat: 1.39633, lng: 103.89381 },
            { code: 'SW2', name: 'Farmway', lat: 1.39720, lng: 103.88880 },
            { code: 'SW3', name: 'Kupang', lat: 1.39852, lng: 103.88126 },
            { code: 'SW4', name: 'Thanggam', lat: 1.39728, lng: 103.87556 },
            { code: 'SW5', name: 'Fernvale', lat: 1.39194, lng: 103.87615 },
            { code: 'SW6', name: 'Layar', lat: 1.39223, lng: 103.88002 },
            { code: 'SW7', name: 'Tongkang', lat: 1.38952, lng: 103.88559 },
            { code: 'SW8', name: 'Renjong', lat: 1.38660, lng: 103.89028 },
            // East Loop  
            { code: 'SE1', name: 'Compassvale', lat: 1.39461, lng: 103.90015 },
            { code: 'SE2', name: 'Rumbia', lat: 1.39107, lng: 103.90563 },
            { code: 'SE3', name: 'Bakau', lat: 1.38830, lng: 103.90532 },
            { code: 'SE4', name: 'Kangkar', lat: 1.38378, lng: 103.90255 },
            { code: 'SE5', name: 'Ranggung', lat: 1.38367, lng: 103.89716 },
        ]
    },
    PG: {
        name: 'Punggol LRT',
        color: '#748477', // Grey
        isLRT: true,
        // Define exact visual path for figure-8 loop
        loopPath: [
            'PTC', 'PW1', 'PW2', 'PW3', 'PW4', 'PW5', 'PW6', 'PW7', 'PTC', // West Loop
            'PTC', 'PE1', 'PE2', 'PE3', 'PE4', 'PE5', 'PE6', 'PE7', 'PTC'  // East Loop
        ],
        stations: [
            // West Loop
            { code: 'PTC', name: 'Punggol', lat: 1.40537, lng: 103.90230 }, // Transfer station (NE17)
            { code: 'PW1', name: 'Sam Kee', lat: 1.40976, lng: 103.90489 },
            { code: 'PW2', name: 'Teck Lee', lat: 1.41280, lng: 103.90655 },
            { code: 'PW3', name: 'Punggol Point', lat: 1.41781, lng: 103.90679 },
            { code: 'PW4', name: 'Samudera', lat: 1.41600, lng: 103.90220 },
            { code: 'PW5', name: 'Nibong', lat: 1.41156, lng: 103.90028 },
            { code: 'PW6', name: 'Sumang', lat: 1.40869, lng: 103.89859 },
            { code: 'PW7', name: 'Soo Teck', lat: 1.40545, lng: 103.89720 },
            // East Loop
            { code: 'PE1', name: 'Cove', lat: 1.39921, lng: 103.90629 },
            { code: 'PE2', name: 'Meridian', lat: 1.39698, lng: 103.90909 },
            { code: 'PE3', name: 'Coral Edge', lat: 1.39371, lng: 103.91259 },
            { code: 'PE4', name: 'Riviera', lat: 1.39455, lng: 103.91636 },
            { code: 'PE5', name: 'Kadaloor', lat: 1.39919, lng: 103.91671 },
            { code: 'PE6', name: 'Oasis', lat: 1.40210, lng: 103.91268 },
            { code: 'PE7', name: 'Damai', lat: 1.40532, lng: 103.90837 },
        ]
    }
};

// Generate route polylines from station data
export function generateRouteGeoJSON() {
    const features = [];

    Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
        let coordinates;

        // If exact loop path is defined, use that for the visual line
        if (line.loopPath) {
            coordinates = line.loopPath.map(code => {
                const station = line.stations.find(s => s.code === code);
                return station ? [station.lng, station.lat] : null;
            }).filter(c => c !== null);
        } else {
            // Otherwise use sequential list of stations
            coordinates = line.stations.map(s => [s.lng, s.lat]);
        }

        features.push({
            type: 'Feature',
            properties: {
                line: lineCode,
                name: line.name,
                color: line.color
            },
            geometry: {
                type: 'LineString',
                coordinates
            }
        });
    });

    return {
        type: 'FeatureCollection',
        features
    };
}

// Generate station points GeoJSON
export function generateStationsGeoJSON() {
    const features = [];

    Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
        line.stations.forEach(station => {
            features.push({
                type: 'Feature',
                properties: {
                    code: station.code,
                    name: station.name,
                    line: lineCode,
                    color: line.color
                },
                geometry: {
                    type: 'Point',
                    coordinates: [station.lng, station.lat]
                }
            });
        });
    });

    return {
        type: 'FeatureCollection',
        features
    };
}

// Get line info
export function getLineInfo(lineCode) {
    return MRT_LINES[lineCode] || null;
}

// Get all line codes
export function getAllLineCodes() {
    return Object.keys(MRT_LINES);
}
