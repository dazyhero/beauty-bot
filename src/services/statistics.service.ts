import { FastifyBaseLogger } from 'fastify';
import { Logger } from '../utils/logger';
import { pool } from '../models/statistics.model';

export interface CommandStats {
  userId: number;
  username?: string;
  command: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export class StatisticsService {
  private logger: Logger;

  constructor(logger: FastifyBaseLogger) {
    this.logger = new Logger(logger);
  }

  public async trackCommand(stats: CommandStats): Promise<void> {
    try {
      const query = `
        INSERT INTO bot_statistics 
        (user_id, username, command, timestamp, success, error)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      await pool.query(query, [
        stats.userId,
        stats.username,
        stats.command,
        stats.timestamp,
        stats.success,
        stats.error
      ]);

      this.logger.info('Command tracked', {
        userId: stats.userId,
        username: stats.username,
        command: stats.command,
        success: stats.success
      });
    } catch (error) {
      this.logger.error('Failed to save statistics', error);
    }
  }
}
