-- Insert roles
INSERT INTO roles (role_name, description) 
VALUES
    ('customer', 'Regular application user'),
    ('owner', 'Court owner with admin privileges'),
    ('staff', 'Court staff with limited access');
ON CONFLICT (role_name) DO NOTHING;

-- Insert admin user -- still working
INSERT INTO users ( username, full_name, email, password_hash, phone_number)
VALUES (
    'admin', -- admin username
    'Admin user', -- admin fullname
    'admin email',
    'admin bcrypt hash password',
    'admin phone number'
)
ON CONFLICT (email) DO NOTHING;

