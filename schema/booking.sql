CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  custom_event VARCHAR(150),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time VARCHAR(20),
  end_time VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  address TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
