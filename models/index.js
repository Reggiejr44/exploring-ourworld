const User = require('./user');
const Marker = require('./marker');
const Maps = require('./maps');

User.hasMany(Marker, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Marker.belongsTo(User, {
    foreignKey: 'user_id'
});

Maps.hasMany(Marker, {
    foreignKey: 'map_id'
});

module.exports = { User, Marker, Maps };