-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for user roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE token_blacklist (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,  -- Store the JWT token
    expires_at TIMESTAMPZ NOT NULL,  -- Token expiration time
    created_at TIMESTAMPZ DEFAULT now()
)

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_roles_name ON roles(role_name);

CREATE INDEX idx_token_blacklist_expires ON token_blacklist (expires_at);