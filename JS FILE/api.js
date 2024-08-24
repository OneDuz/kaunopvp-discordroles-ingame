const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const DISCORD_TOKEN = '';
const DISCORD_GUILD_ID = '1197984929317924935';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ]
});


client.login(DISCORD_TOKEN);

app.use(express.json());

const rolesHierarchy = {
    '1200576567345160359': { name: 'ikurejas', rank: 1 },
    '1200576570180513892': { name: 'pgr admin', rank: 2 },
    '1200576571325558854': { name: 'vyr admin', rank: 3 },
    '1200576573179428864': { name: 'admin', rank: 4 },
    '1200576568746070029': { name: 'coder', rank: 5 },
    '1200576574517416126': { name: 'mod', rank: 6 },
    '1203345342129635328': { name: 'support', rank: 7 },
    '1200576579307327558': { name: 'pc check', rank: 8 },
    '1201965269765853184': { name: 'tik tok', rank: 9 },
};

app.post('/discordRoles', async (req, res) => {
    const discordId = req.body.discordId;
    try {
        const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
        const member = await guild.members.fetch(discordId);
        let highestRole = null;

        member.roles.cache.forEach(role => {
            console.log(`Checking role: ${role.name} with ID: ${role.id}`);
            const roleData = rolesHierarchy[role.id];
            if (roleData) {
                console.log(`Found in hierarchy: ${roleData.name} with rank: ${roleData.rank}`);
                if (!highestRole || roleData.rank < highestRole.rank) {
                    highestRole = roleData;
                    console.log(`New highest role: ${highestRole.name}`);
                }
            }
        });
        

        if (highestRole) {
            const highestRoleId = Object.keys(rolesHierarchy).find(key => rolesHierarchy[key] === highestRole);
            const discordName = member.user.displayName;
            console.log(discordName)
            res.json({ roleId: highestRoleId, roleName: highestRole.name, discordName: discordName });
        } else {
            res.status(404).send('No matching roles found');
        }
    } catch (error) {
        console.error('Error fetching Discord roles:', error);
        res.status(500).send('Internal Server Error');
    }
});


const PORT = 8900;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
