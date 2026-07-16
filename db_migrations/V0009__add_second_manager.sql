INSERT INTO managers (email, password_hash, name)
VALUES ('lishneva.elena@dymovceramic.ru', 'pbkdf2_sha256$100000$b32693e988e75e9cf059992e3bd041cd$d5bdeb764f17b9b7ebaa29ac5111ddd294d24f997d952c15d1ae3d67f1a4b8d9', 'Елена')
ON CONFLICT (email) DO NOTHING;