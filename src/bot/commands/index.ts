import { Telegraf } from 'telegraf';
import { Command } from './types';
import { StartCommand } from './start.command';

export class CommandRegistry {
  private commands: Command[] = [
    new StartCommand(),
  ];

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

