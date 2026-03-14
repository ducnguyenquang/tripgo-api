import { getSupabase } from "../../db/client.js";
import { nanoid } from "nanoid";

const TOKEN_EXPIRY_HOURS = 72;

export async function generateInvite(tripId: string, createdBy: string) {
  const supabase = getSupabase();
  const token = nanoid(32);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  const { data, error } = await supabase
    .from("invites")
    .insert({
      trip_id: tripId,
      token,
      created_by: createdBy,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return { ...data, token };
}

export async function validateInvite(token: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("invites")
    .select("*, trips(*)")
    .eq("token", token)
    .single();
  if (error || !data) return null;
  if (new Date(data.expires_at) < new Date()) return null;
  return data;
}

export async function acceptInvite(token: string, userId: string) {
  const invite = await validateInvite(token);
  if (!invite) throw new Error("Invalid or expired invite");

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("trip_members")
    .insert({
      trip_id: invite.trip_id,
      user_id: userId,
      role: "member",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
