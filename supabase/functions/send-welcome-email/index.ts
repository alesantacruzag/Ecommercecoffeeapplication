
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const RESEND_API_KEY = "re_7fz4wmMP_7RjnW88sTyBAuePK3boKT1aa";

Deno.serve(async (req) => {
    try {
        const payload = await req.json();
        console.log("Received registration webhook:", JSON.stringify(payload, null, 2));

        const { record, type } = payload;

        if (type !== 'INSERT') {
            return new Response(JSON.stringify({ message: "Not an insert event" }), { status: 200 });
        }

        const { email, name, role } = record;

        if (!email) {
            console.error("No email in record");
            return new Response(JSON.stringify({ error: "No email provided" }), { status: 400 });
        }

        const welcomeContent = `
      <div style="font-family: sans-serif; color: #333;">
        <h1 style="color: #F72585;">¡Bienvenido a Origen Café, ${name}!</h1>
        <p>Estamos emocionados de tenerte con nosotros.</p>
        <p>En Origen Café, nos dedicamos a llevar el mejor café premium directamente desde el caficultor hasta tu taza.</p>
        
        ${role === 'CAFICULTOR' ?
                `<p>Como administrador/caficultor, ahora puedes gestionar tus productos y pedidos desde el panel de administración.</p>` :
                `<p>Ya puedes explorar nuestro catálogo y descubrir las mejores variedades de café colombiano.</p>`
            }

        <p>Esperamos que disfrutes de la experiencia.</p>
        <br/>
        <p>Atentamente,<br/><strong>El equipo de Origen Café</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">Esta es una notificación automática, por favor no respondas a este correo.</p>
      </div>
    `;

        // Send Welcome Email via Resend
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Origen Café <onboarding@resend.dev>",
                to: [email],
                subject: `¡Bienvenido a Origen Café, ${name}!`,
                html: welcomeContent,
            }),
        });

        const resData = await res.json();
        console.log("Resend API response:", resData);

        return new Response(JSON.stringify({ success: true, resendId: resData.id }), { status: 200 });

    } catch (error) {
        console.error("Error in Welcome Edge Function:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
