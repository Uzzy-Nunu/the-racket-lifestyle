import { NextResponse } from "next/server";
import { orderPaidSchema } from "@/lib/validation";
export async function POST(request: Request) { try { const configuredSecret = process.env.N8N_SHARED_SECRET; const receivedSecret = request.headers.get("x-n8n-secret"); if (!configuredSecret || receivedSecret !== configuredSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const payload = orderPaidSchema.parse(await request.json()); // TODO: Load authoritative order data from Supabase; queue an idempotent fulfillment task. Never trust money or state from n8n.
return NextResponse.json({ accepted: true, event: payload.event, orderId: payload.order_id }, { status: 202 }); } catch { return NextResponse.json({ error: "Invalid order-paid event" }, { status: 400 }); } }
