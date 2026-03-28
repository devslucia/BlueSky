-- Seed data for BlueSky Stock Management Application
-- Run this SQL in Supabase SQL Editor

-- Insert sample products
INSERT INTO products (name, category, quantity, cost_price, sale_price, min_stock, supplier) VALUES
('Pantalla iPhone 13', 'screen', 5, 80.00, 150.00, 3, 'TechParts'),
('Pantalla Samsung S22', 'screen', 2, 70.00, 140.00, 3, 'TechParts'),
('Batería iPhone 12', 'battery', 10, 25.00, 50.00, 5, 'BatteryPro'),
('Batería Samsung A52', 'battery', 3, 20.00, 45.00, 5, 'BatteryPro'),
('Cargador Rápido 20W', 'charger', 15, 8.00, 25.00, 10, 'AccessWorld'),
('Cable USB-C', 'accessories', 20, 3.00, 15.00, 10, 'AccessWorld'),
('Carámara iPhone 11', 'parts', 4, 40.00, 80.00, 2, 'TechParts'),
('Altavoz Samsung S21', 'parts', 2, 30.00, 60.00, 2, 'TechParts'),
('Protector Pantalla', 'accessories', 50, 1.00, 8.00, 20, 'AccessWorld'),
('Herramienta Apertura', 'accessories', 8, 5.00, 15.00, 3, 'ToolSupply')
ON CONFLICT DO NOTHING;

-- Insert sample repairs
INSERT INTO repairs (customer_name, phone_model, issue, status, labor_cost, price_charged, date_in, date_out, total_profit) VALUES
('Juan Pérez', 'iPhone 13', 'Pantalla rota', 'completed', 30.00, 120.00, '2026-03-01', '2026-03-02', 90.00),
('María García', 'Samsung S22', 'Cambio de batería', 'completed', 25.00, 80.00, '2026-03-05', '2026-03-05', 55.00),
('Carlos López', 'iPhone 12', 'Problema de carga', 'in-progress', 20.00, 60.00, '2026-03-15', NULL, 40.00),
('Ana Martínez', 'Samsung A52', 'Pantalla dañada', 'pending', 35.00, 150.00, '2026-03-20', NULL, 115.00),
('Pedro Sánchez', 'iPhone 11', 'Carámara no funciona', 'completed', 40.00, 100.00, '2026-03-10', '2026-03-12', 60.00)
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('technician_percent', '40'),
('secretary_percent', '30'),
('owner_percent', '30')
ON CONFLICT (key) DO NOTHING;
