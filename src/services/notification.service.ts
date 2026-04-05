import { Injectable, OnModuleInit } from '@nestjs/common';
import { Block } from 'bitcoinjs-lib';
import { DiscordService } from './discord.service';
import { TelegramService } from './telegram.service';

@Injectable()
export class NotificationService implements OnModuleInit {

    constructor(
        private readonly telegramService: TelegramService,
        private readonly discordService: DiscordService
    ) { }

    async onModuleInit(): Promise<void> {
        await this.discordService.notifyRestarted();
    }

    public async notifySubscribersBlockFound(address: string, height: number, block: Block, message: string) {
        await this.discordService.notifySubscribersBlockFound(height, block, message);
        await this.telegramService.notifySubscribersBlockFound(address, height, block, message);
    }

    public async notifyNewWorkerHighScore(clientName: string, userAgent: string, difficulty: number) {
        await this.discordService.notifyNewWorkerHighScore(clientName, userAgent, difficulty);
    }

    public async notifyNewDeviceHighScore(userAgent: string, difficulty: number) {
        await this.discordService.notifyNewDeviceHighScore(userAgent, difficulty);
    }
}