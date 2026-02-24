// @ts-nocheck
/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const RESEND_API_KEY = "re_7fz4wmMP_7RjnW88sTyBAuePK3boKT1aa";
const ADMIN_EMAIL = "admin@origen.com";

interface WebhookPayload {
    record: any;
    old_record: any;
    type: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
}

Deno.serve(async (req: Request) => {
    try {
        const payload: WebhookPayload = await req.json();
        console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

        const { record, old_record, type } = payload;

        // Only process updates to the 'orders' table
        if (type !== 'UPDATE') {
            return new Response(JSON.stringify({ message: "Not an update event" }), { status: 200 });
        }

        // Only process if status changed to 'paid'
        if (record.status !== 'paid' || (old_record && old_record.status === 'paid')) {
            return new Response(JSON.stringify({ message: "Status didn't transition to paid" }), { status: 200 });
        }

        const orderId = record.id;
        const userId = record.user_id;

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch User details
        const { data: user, error: userError } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Fetch Order items
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*, product:products(name)')
            .eq('order_id', orderId);

        if (itemsError) {
            console.error("Error fetching items:", itemsError);
            return new Response(JSON.stringify({ error: "Failed to fetch order items" }), { status: 500 });
        }

        const itemsHtml = (items || []).map((item: any) => `
      <li>
        <strong>${item.product?.name || 'Producto'}</strong>: ${item.quantity} x $${item.price}
      </li>
    `).join('');

        const emailContent = `
      <h1>Confirmación de Pedido #${orderId.slice(0, 8).toUpperCase()}</h1>
      <p>Hola ${user.name},</p>
      <p>¡Gracias por tu compra en Origen Café! Hemos recibido tu pago correctamente.</p>
      <h3>Resumen del pedido:</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total pagado: $${record.total}</strong></p>
      <p>Pronto recibirás noticias sobre el envío de tu café premium.</p>
      <br/>
      <p>Atentamente,<br/>El equipo de Origen Café</p>
    `;

        const adminEmailContent = `
      <h1>¡Nueva Venta Realizada!</h1>
      <p>El cliente <strong>${user.name}</strong> (${user.email}) ha realizado un pago.</p>
      <p>ID del Pedido: #${orderId}</p>
      <p><strong>Monto: $${record.total}</strong></p>
      <h3>Productos:</h3>
      <ul>${itemsHtml}</ul>
    `;

        // Send to Client
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Origen Café <onboarding@resend.dev>",
                to: [user.email],
                subject: "Confirmación de Pago - Origen Café",
                html: emailContent,
            }),
        });

        // Send to Admin
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Sistema Origen <onboarding@resend.dev>",
                to: [ADMIN_EMAIL],
                subject: "NOTIFICACIÓN: Nuevo Pedido Pagado",
                html: adminEmailContent,
            }),
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error("Error in Edge Function:", error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), { status: 500 });
    }
});
