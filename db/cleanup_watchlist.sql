-- Cleanup script for watchlist data integrity
-- This script helps identify and fix issues with watchlist entries

-- 1. Check for watchlist entries with NULL or invalid user_id
SELECT 'Entries with NULL user_id:' as check_type, COUNT(*) as count
FROM watchlist
WHERE user_id IS NULL;

SELECT 'Entries with invalid user_id (not in users table):' as check_type, COUNT(*) as count
FROM watchlist w
LEFT JOIN users u ON w.user_id = u.id
WHERE u.id IS NULL;

-- 2. Show watchlist entries per user
SELECT 
    u.id as user_id,
    u.username,
    COUNT(w.id) as watchlist_count
FROM users u
LEFT JOIN watchlist w ON u.id = w.user_id
GROUP BY u.id, u.username
ORDER BY watchlist_count DESC;

-- 3. Show all watchlist entries with user info (for manual review)
SELECT 
    w.id,
    w.user_id,
    u.username,
    w.movie_id,
    w.movie_title,
    w.created_at
FROM watchlist w
LEFT JOIN users u ON w.user_id = u.id
ORDER BY w.created_at DESC;

-- 4. DELETE entries with NULL user_id (uncomment to run)
-- DELETE FROM watchlist WHERE user_id IS NULL;

-- 5. DELETE entries with invalid user_id (uncomment to run)
-- DELETE FROM watchlist w
-- WHERE NOT EXISTS (
--     SELECT 1 FROM users u WHERE u.id = w.user_id
-- );

