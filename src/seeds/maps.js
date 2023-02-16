const { Maps } = require('../models');

const mapsData = [
    {
        city_name: 'DEFAULT',
        city_state: 'DEFAULT',
        map_coordinates_lat: '31.1957',
        map_coordinates_lon: '-98.7181'
    },
];

const seedMaps = () => Maps.bulkCreate(mapsData);
module.exports = seedMaps;