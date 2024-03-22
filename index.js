const { Client, Discord } = require('discord.js');
const client = new Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent] });

const logsChannel = 'Your Channel ID';

client.on('raw', async packet => {
    if (!['MESSAGE_CREATE', 'MESSAGE_UPDATE'].includes(packet.t)) return;
    const { d: data } = packet;

    if (data.poll) {
        //console.log('Question:', data.poll.question);
        //console.log('Answers:', data.poll.answers);
        //If you need them for another thing or better logs you can use them ^^

        const channel = await client.channels.fetch(data.channel_id);
        const message = await channel.messages.fetch(data.id);

        message.delete()
            .then(() => {
                console.log(`Deleted poll from channel ${channel.name}`);
                const logsChannel = client.channels.cache.get(logsChannel);
                if (logsChannel) {
                    logsChannel.send(`Poll deleted from <#${channel.id}>: **${data.poll.question.text}**`);
                } else {
                    console.log(`Logs channel not found.`);
                }
            })
            .catch(console.error);
    }
});

client.login('your token');
