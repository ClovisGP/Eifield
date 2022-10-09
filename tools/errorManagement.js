const ErrorDescription = {
    1: "Erreur : Le messsage a été écrit par un autre bot.",
    2: "Erreur : La syntaxe pour la commande dice n'est pas bonne.",
    3: "Erreur : Le nombre de dés doit être compris entre 1 et 40.",
    4: "Erreur : Vous n'avez pas accès à cette commande/option.",
    5: "Erreur : La date entrée pour l'argument **end** est invalide.",
    6: "Erreur : La date entrée pour l'argument **begin** est invalide.",
    7: "Erreur : L'option tactical-strike nécessite l'argument begin.",
    8: "Erreur : La date **end** ne doit pas être plus récente ou la même que **begin**.",
    9: "Erreur : Une erreur s'est produite lors de la suppression d'un message, celà peut se produire si le message est vieux.",
    10: "Erreur : Le nombre de message doit être compris entre 0 et 20, le message de la commande n'est pas compter dans ce chiffre..",
}

module.exports = {
    writeErrorMsg: function(msgToReply, codeError) {
        msgToReply.reply(ErrorDescription[codeError])
            .then(message => {
                setTimeout(() => message.delete(), 25000)
            });
        console.log("ERROR : " + codeError + " - " + ErrorDescription[codeError])
    },
};