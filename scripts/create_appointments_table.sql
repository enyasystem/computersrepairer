-- Create appointments table for booking system
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  service_type VARCHAR(100) NOT NULL,
  device_type VARCHAR(100),
  device_model VARCHAR(255),
  issue_description TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  appointment_type VARCHAR(50) NOT NULL DEFAULT 'consultation', -- 'consultation', 'drop-off', 'pickup'
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(customer_email);
