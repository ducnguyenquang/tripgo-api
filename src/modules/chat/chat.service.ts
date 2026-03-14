import { getSupabase } from "../../db/client.js";
import { uploadFile } from "../../lib/r2.js";
import type { CreateMessageInput } from "./chat.schema.js";
import { nanoid } from "nanoid";

export async function getMessages(channelId: string, cursor?: string, limit = 50) {
  const supabase = getSupabase();
  let query = supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createMessage(channelId: string, userId: string, input: CreateMessageInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      channel_id: channelId,
      user_id: userId,
      content: input.content,
      image_url: input.imageUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadImage(buffer: Buffer, contentType: string): Promise<string> {
  const key = `chat/${nanoid()}`;
  return uploadFile(key, buffer, contentType);
}
