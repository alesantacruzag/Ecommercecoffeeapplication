// @ts-nocheck
/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') ?? '';
const ADMIN_EMAIL = "alesantacruzag@gmail.com";
const ADMIN_NAME = "Admin Origen Café";

interface WebhookPayload {
  record: any;
  old_record: any;
  type: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
}

async function sendEmail(to: string, toName: string, subject: string, html: string): Promise<any> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Origen Café", email: "alesantacruzag@gmail.com" },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });
  const body = await res.json();
  console.log(`Brevo response to ${to}:`, res.status, JSON.stringify(body));
  return { status: res.status, ok: res.ok, body };
}

Deno.serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();
    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    const { record, old_record, type } = payload;

    if (type !== 'UPDATE') {
      return new Response(JSON.stringify({ message: "Not an update event" }), { status: 200 });
    }

    if (record.status !== 'paid' || (old_record && old_record.status === 'paid')) {
      return new Response(JSON.stringify({ message: "Status didn't transition to paid" }), { status: 200 });
    }

    const orderId = record.id;
    const userId = record.user_id;

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    console.log("Sending confirmation to:", user.email);

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*, product:products(name)')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error("Error fetching items:", itemsError);
      return new Response(JSON.stringify({ error: "Failed to fetch order items" }), { status: 500 });
    }

    const itemsHtml = (items || []).map((item: any) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.product?.name || 'Producto'}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${Number(item.price).toFixed(2)}</td>
          </tr>`).join('');

    const customerEmail = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
          <div style="background:#F72585;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <img src="https://origen-cafe.com/logo.png" alt="Origen Café" style="max-height:60px;max-width:200px;object-fit:contain" />
          </div>
          <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
            <h2 style="color:#F72585">¡Confirmación de Pedido! 🎉</h2>
            <p>Hola <strong>${user.name}</strong>,</p>
            <p>¡Gracias por tu compra! Hemos recibido tu pago correctamente.</p>
            <h3 style="color:#F72585">Pedido #${orderId.slice(0, 8).toUpperCase()}</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:#F3F3F3">
                  <th style="padding:8px;text-align:left">Producto</th>
                  <th style="padding:8px;text-align:center">Cant.</th>
                  <th style="padding:8px;text-align:right">Precio</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p style="text-align:right;font-size:18px;font-weight:bold;color:#F72585">Total: $${Number(record.total).toFixed(2)}</p>
            <p>Pronto recibirás tu café premium. ¡Gracias por elegirnos!</p>
            <p style="color:#888;font-size:12px">Atentamente,<br/>El equipo de Origen Café</p>
          </div>
        </div>`;

    const adminEmail = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#F72585">🛒 Nueva Venta Realizada</h2>
          <p><strong>Cliente:</strong> ${user.name} &lt;${user.email}&gt;</p>
          <p><strong>Pedido:</strong> #${orderId}</p>
          <p><strong>Total:</strong> $${Number(record.total).toFixed(2)}</p>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#F3F3F3">
                <th style="padding:8px;text-align:left">Producto</th>
                <th style="padding:8px;text-align:center">Cant.</th>
                <th style="padding:8px;text-align:right">Precio</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>`;

    const [clientResult, adminResult] = await Promise.all([
      sendEmail(user.email, user.name, `✅ Confirmación de Pago - Origen Café #${orderId.slice(0, 8).toUpperCase()}`, customerEmail),
      sendEmail(ADMIN_EMAIL, ADMIN_NAME, `🛒 Nuevo Pedido Pagado - $${Number(record.total).toFixed(2)}`, adminEmail),
    ]);

    return new Response(JSON.stringify({
      success: true,
      customerEmail: { to: user.email, status: clientResult.status, ok: clientResult.ok },
      adminEmail: { to: ADMIN_EMAIL, status: adminResult.status, ok: adminResult.ok },
    }), { status: 200 });

  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), { status: 500 });
  }
});
