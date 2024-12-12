import { replyErrorToInteraction } from './errorManagement.js';

/**
 * Checks the role of the interlocutor
 * @param {{}} interaction The interaction object
 * @param {string} roleName The name of the role targeted
 * @returns true = ok | false = not ok
 */
export function checkRole(interaction, roleName) {
    try {
        if (!interaction.member.roles.cache.find(x => x.name === roleName)) {
            replyErrorToInteraction(interaction, "forbiddenCommand", "", true);
            return false;
        }
        return true;
    } catch (error) {
        console.error(`An error was catch in checkRole => ${error}`);
        return false;
    }
}