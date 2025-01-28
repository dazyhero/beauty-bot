import { Update } from 'telegraf/types';

export class TelegramUpdateUtils {
  public static getUpdateType(update: Update): string {
    if ('message' in update) return 'message';
    if ('callback_query' in update) return 'callback_query';
    if ('inline_query' in update) return 'inline_query';
    if ('channel_post' in update) return 'channel_post';
    if ('edited_message' in update) return 'edited_message';
    if ('edited_channel_post' in update) return 'edited_channel_post';
    if ('chosen_inline_result' in update) return 'chosen_inline_result';
    if ('poll' in update) return 'poll';
    if ('poll_answer' in update) return 'poll_answer';
    if ('my_chat_member' in update) return 'my_chat_member';
    if ('chat_member' in update) return 'chat_member';
    if ('chat_join_request' in update) return 'chat_join_request';
    return 'unknown';
  }

  public static getChatId(update: Update): number | undefined {
    if ('message' in update) return update.message.chat.id;
    if ('callback_query' in update) return update.callback_query.message?.chat.id;
    if ('channel_post' in update) return update.channel_post.chat.id;
    if ('edited_message' in update) return update.edited_message.chat.id;
    if ('edited_channel_post' in update) return update.edited_channel_post.chat.id;
    if ('my_chat_member' in update) return update.my_chat_member.chat.id;
    if ('chat_member' in update) return update.chat_member.chat.id;
    if ('chat_join_request' in update) return update.chat_join_request.chat.id;
    return undefined;
  }
}

