import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Block } from 'bitcoinjs-lib';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, TextChannel } from 'discord.js';

interface IDiscordCommand {
    data: SlashCommandBuilder;
    execute(interaction: any): Promise<void>;
}

const subscribeCommand = {
    data: new SlashCommandBuilder()
        .setName('subscribe')
        .setDescription('Subscribes you to specified address'),
    async execute(interaction) {
        await interaction.reply('Work In Progress');
    }
}

const commands = [
    subscribeCommand
]

@Injectable()
export class DiscordService implements OnModuleInit {

    private token: string;
    private clientId: string;
    private guildId: string;
    private channelId: string;

    private bot: Client;
    private commandCollection: Collection<string, IDiscordCommand>;

    constructor(private readonly configService: ConfigService) {
        if (process.env.NODE_APP_INSTANCE == null || process.env.NODE_APP_INSTANCE == '0') {
            this.token = this.configService.get('DISCORD_BOT_TOKEN');
            this.clientId = this.configService.get('DISCORD_BOT_CLIENTID');
            this.guildId = this.configService.get('DISCORD_BOT_GUILD_ID');
            this.channelId = this.configService.get('DISCORD_BOT_CHANNEL_ID')

            if (this.token == null || this.token.length < 1 ||
                this.clientId == null || this.clientId.length < 1 ||
                this.guildId == null || this.guildId.length < 1 ||
                this.channelId == null || this.channelId.length < 1
            ) {
                return;
            }

            console.log('discord init')

            this.commandCollection = new Collection();
            commands.forEach(command => {
                this.commandCollection.set(command.data.name, command);
            });
            this.bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
            this.bot.login(this.token);
        }
    }

    async onModuleInit(): Promise<void> {
        if (process.env.NODE_APP_INSTANCE == null || process.env.NODE_APP_INSTANCE == '0') {
            if (this.bot == null) {
                return;
            }

            await this.registerCommands();

            this.bot.on(Events.InteractionCreate, async interaction => {
                if (!interaction.isChatInputCommand()) return;

                const command = this.commandCollection.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(error);
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                    }
                }
            });
        }
    }

    private async registerCommands() {
        if (process.env.NODE_APP_INSTANCE == null || process.env.NODE_APP_INSTANCE == '0') {
            const rest = new REST().setToken(this.token);
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
                const data = await rest.put(
                    Routes.applicationGuildCommands(this.clientId, this.guildId),
                    { body: commands.map(c => c.data.toJSON()) },
                ) as any;
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        }
    }

    private formatDifficulty(difficulty: number): string {
        if (difficulty >= 1e12) return `${(difficulty / 1e12).toFixed(2)}T`;
        if (difficulty >= 1e9) return `${(difficulty / 1e9).toFixed(2)}G`;
        if (difficulty >= 1e6) return `${(difficulty / 1e6).toFixed(2)}M`;
        if (difficulty >= 1e3) return `${(difficulty / 1e3).toFixed(2)}K`;
        return difficulty.toFixed(2);
    }

    public async notifyRestarted() {
        if (process.env.NODE_APP_INSTANCE == null || process.env.NODE_APP_INSTANCE == '0') {
            if (this.bot == null) return;
            const guild = await this.bot.guilds.fetch(this.guildId);
            const channel = await guild.channels.fetch(this.channelId) as TextChannel;
            channel.send(`🔄 Pool Server Restarted.`);
        }
    }

    public async notifySubscribersBlockFound(height: number, block: Block, message: string) {
        if (process.env.NODE_APP_INSTANCE == null || process.env.NODE_APP_INSTANCE == '0') {
            if (this.bot == null) return;
            const guild = await this.bot.guilds.fetch(this.guildId);
            const channel = await guild.channels.fetch(this.channelId) as TextChannel;
            channel.send(`⛏️ **BLOCK FOUND!** Height: **${height}** - Result: ${message}`);
        }
    }

    public async notifyNewWorkerHighScore(clientName: string, userAgent: string, difficulty: number) {
        if (process.env.NODE_APP_INSTANCE == null || process.env.NODE_APP_INSTANCE == '0') {
            if (this.bot == null) return;
            const guild = await this.bot.guilds.fetch(this.guildId);
            const channel = await guild.channels.fetch(this.channelId) as TextChannel;
            channel.send(`🏆 New Worker High Score! Worker: **${clientName}** (${userAgent}) - Difficulty: **${this.formatDifficulty(difficulty)}**`);
        }
    }

    public async notifyNewDeviceHighScore(userAgent: string, difficulty: number) {
        if (process.env.NODE_APP_INSTANCE == null || process.env.NODE_APP_INSTANCE == '0') {
            if (this.bot == null) return;
            const guild = await this.bot.guilds.fetch(this.guildId);
            const channel = await guild.channels.fetch(this.channelId) as TextChannel;
            channel.send(`🖥️ New Device High Score! Device: **${userAgent}** - Difficulty: **${this.formatDifficulty(difficulty)}**`);
        }
    }
}