-- Migration: Performance, Security, and Email Notifications
-- Date: 2026-02-24

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Performance: Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- 3. Security: Optimize RLS policies by using subqueries for auth.uid()
-- Orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Order Items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_id AND user_id = (SELECT auth.uid())
  )
);

-- Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- 4. Cleanup redundant indexes if they exist
DROP INDEX IF EXISTS public.idx_kv_store_key_5b1b408c;

-- 5. Webhook logic for Emails

-- Order Paid Function
CREATE OR REPLACE FUNCTION public.handle_order_paid_webhook()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status <> 'paid')) THEN
    PERFORM
      net.http_post(
        url := (SELECT value FROM public.kv_store_5b1b408c WHERE key = 'supabase_url') || '/functions/v1/send-order-confirmation-v1',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object(
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA,
          'record', row_to_json(NEW)::jsonb,
          'old_record', row_to_json(OLD)::jsonb
        )
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Order Paid Trigger
DROP TRIGGER IF EXISTS on_order_paid_trigger ON public.orders;
CREATE TRIGGER on_order_paid_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_paid_webhook();

-- Welcome Email Function
CREATE OR REPLACE FUNCTION public.handle_user_welcome_webhook()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM
      net.http_post(
        url := (SELECT value FROM public.kv_store_5b1b408c WHERE key = 'supabase_url') || '/functions/v1/send-welcome-email-v1',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object(
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA,
          'record', row_to_json(NEW)::jsonb
        )
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Welcome Email Trigger
DROP TRIGGER IF EXISTS on_user_signup_trigger ON public.profiles;
CREATE TRIGGER on_user_signup_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_welcome_webhook();
