import { Telegraf } from 'telegraf';
import { Command } from './types';
import { StartCommand } from './start.command';
import { AnalyzeCommand } from './analyze.command';
import { FastifyBaseLogger } from 'fastify';

export class CommandRegistry {
  private commands: Command[];

  constructor(private readonly logger: FastifyBaseLogger) {
    this.commands = [
      new StartCommand(),
      new AnalyzeCommand(this.logger),
    ];
  }
  public registerCommands(bot: Telegraf): void {
    for (const command of this.commands) {
      if (command.command === 'text') {
        bot.on(command.command, (ctx) => command.handler(ctx));
      } else {
        bot.command(command.command, (ctx) => command.handler(ctx));
      }
    }
  }

  public getCommandDescriptions(): { command: string; description: string }[] {
    return this.commands
      .filter(cmd => cmd.command !== 'text')
      .map(({ command, description }) => ({
        command,
        description,
      }));
  }
}

