-- Make john.doe@example.com an admin
UPDATE users SET role = 'admin' WHERE email = 'john.doe@example.com';

-- Verify it worked
SELECT
    email,
    CONCAT(first_name, ' ', last_name) as name,
    role,
    CASE
        WHEN role = 'admin' THEN '✅ SUCCESS - Now an admin!'
        ELSE '❌ Still a regular user'
    END as status
FROM users
WHERE email = 'john.doe@example.com';
