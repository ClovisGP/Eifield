import french from './../languages/fr.json' assert { type: 'json' };
import english from './../languages/en.json' assert { type: 'json' };

/**
 * Get the right translation
 * @param {string}  The language code like 'fr'
 * @param {string} key The key of the translation
 * @returns The string with the transalation
 */
export default function getTranslation(
    data,
    key
) {
    try {
        const keyToCompare = data.locale
            ? data.locale
            : data.guildLocale
                ? data.guildLocale
                : "en-US";

        if (keyToCompare.toLocaleLowerCase() === 'fr') {
            return french[key];
        } else {
            return english[key];
        }
    } catch (error) {
        console.error(`An error was catch in replyErrorToInteraction => ${error}`);
        return 'TRANSLATION ERROR';
    }
}