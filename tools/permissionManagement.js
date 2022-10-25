const errorManagement = require('./errorManagement');

module.exports = {
    checkRole: function(interaction, roleName) {
        if (!interaction.member.roles.cache.find(x => x.name === roleName)) {
            errorManagement.writeErrorMsg(interaction, 3);
            return false;
        }
        return true;
    },
}