const Config = require("../config.json");
const ConfigUsers = Config['users'];

module.exports = {

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    getAvatar: async function (client, username) {
        var userID = ConfigUsers[username];
        var avatarURL;

        if(userID && userID != "") {
            await client.fetchUser(userID).then(myUser => {
                var avatar = myUser.avatarURL;
                avatarURL = avatar.substr(0, avatar.length-4) + "32";
            });
        }

        return avatarURL
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
}