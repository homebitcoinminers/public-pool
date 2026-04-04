import { HighScoreService } from './ORM/high-scores/high-score.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

import { BlocksService } from './ORM/blocks/blocks.service';
import { ClientStatisticsService } from './ORM/client-statistics/client-statistics.service';
import { ClientService } from './ORM/client/client.service';
import { BitcoinRpcService } from './services/bitcoin-rpc.service';

@Controller()
export class AppController {

  private uptime = new Date();

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly clientService: ClientService,
    private readonly clientStatisticsService: ClientStatisticsService,
    private readonly blocksService: BlocksService,
    private readonly bitcoinRpcService: BitcoinRpcService,
    private readonly highScoreService: HighScoreService
  ) { }

  @Get('info')
  public async info() {


    const CACHE_KEY = 'SITE_INFO';
    const cachedResult = await this.cacheManager.get(CACHE_KEY);

    if (cachedResult != null) {
      return cachedResult;
    }


    const blockData = await this.blocksService.getFoundBlocks();
    const userAgents = await this.clientService.getUserAgents();

    const data = {
      blockData,
      userAgents,
      uptime: this.uptime
    };

    //1 min
    await this.cacheManager.set(CACHE_KEY, data, 1 * 60 * 1000);

    return data;

  }

  @Get('network')
  public async network() {
    const miningInfo = await firstValueFrom(this.bitcoinRpcService.newBlock$);
    return miningInfo;
  }
  @Get('pool')
public async pool() {
  const CACHE_KEY = 'POOL_INFO';
  const cachedResult = await this.cacheManager.get(CACHE_KEY);

  if (cachedResult != null) {
    return cachedResult;
  }

  const [miningInfo, userAgents, blocksFound, totalMiners] = await Promise.all([
    firstValueFrom(this.bitcoinRpcService.newBlock$),
    this.clientService.getUserAgents(),
    this.blocksService.getFoundBlocks(),
    this.clientService.connectedClientCount()
  ]);

  const totalHashRate = userAgents.reduce((sum, ua) => sum + Number(ua.totalHashRate), 0);

  const data = {
    totalHashRate,
    blockHeight: miningInfo.blocks,
    totalMiners,
    blocksFound,
    fee: 0
  };

  // 1 min cache
  await this.cacheManager.set(CACHE_KEY, data, 1 * 60 * 1000);

  return data;
}
  @Get('scores')
  public async scores() {
    const CACHE_KEY = 'SCORES';
    const cachedResult = await this.cacheManager.get(CACHE_KEY);

    if (cachedResult != null) {
        return cachedResult;
    }

    const scores = await this.highScoreService.getTopScores(20);

    await this.cacheManager.set(CACHE_KEY, scores, 10 * 60 * 1000);

    return scores;
}

  @Get('info/chart')
  public async infoChart() {


    const CACHE_KEY = 'SITE_HASHRATE_GRAPH';
    const cachedResult = await this.cacheManager.get(CACHE_KEY);

    if (cachedResult != null) {
      return cachedResult;
    }

    const chartData = await this.clientStatisticsService.getChartDataForSite();

    //10 min
    await this.cacheManager.set(CACHE_KEY, chartData, 10 * 60 * 1000);

    return chartData;


  }

}
