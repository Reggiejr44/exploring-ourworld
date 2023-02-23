const { Maps } = require('../models');

const mapsData = [
    {
        city_name: '',
        city_state: '',
        map_coordinates_lat: '',
        map_coordinates_lon: ''
    },
];

const seedMaps = () => Maps.bulkCreate(mapsData);
module.exports = seedMaps;