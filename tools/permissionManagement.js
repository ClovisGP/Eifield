import { writeErrorMsg } from './errorManagement.js';

export function checkRole(interaction, roleName) {
    if (!interaction.member.roles.cache.find(x => x.name === roleName)) {
        writeErrorMsg(interaction, 3);
        return false;
    }
    return true;
}