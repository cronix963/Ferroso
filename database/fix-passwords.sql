-- Fix password hashes for Supabase production DB
UPDATE users SET password_hash = '$2b$10$dE7kHORurC50Yjfh0NEoFuAH9fKvfn0.8GS/fQoyWxjob2oe.nGUW' WHERE email = 'admin@ferrotech.bo';
UPDATE users SET password_hash = '$2b$10$pA3pJJi0Rdq/Fz0Rlx.H7.7x9NImO8wDBtmEM8r25u8FkDrwaISaG' WHERE email = 'vendedor@ferrotech.bo';
