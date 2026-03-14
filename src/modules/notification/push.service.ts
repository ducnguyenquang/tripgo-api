import webpush from "web-push";

const vapidPublic = process.env.VAPID_PUBLIC_KEY ?? "";
const vapidPrivate = process.env.VAPID_PRIVATE_KEY ?? "";

if (vapidPublic && vapidPrivate) {
  webpush.setVapidDetails("mailto:support@tripgo.app", vapidPublic, vapidPrivate);
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: string | object
) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  await webpush.sendNotification(subscription, body);
}

import { getSupabase } from "../../db/client.js";

export async function subscribeUser(userId: string, subscription: webpush.PushSubscription) {
  const supabase = getSupabase();
  const { error } = await supabase.from("push_subscriptions").upsert({
    user_id: userId,
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function unsubscribeUser(userId: string, endpoint: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId)
    .eq("endpoint", endpoint);
  if (error) throw error;
}
