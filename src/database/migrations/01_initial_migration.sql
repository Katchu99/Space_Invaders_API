CREATE TABLE users (
                      id TEXT PRIMARY KEY,
                      username TEXT NOT NULL,
                      password TEXT NOT NULL
);

CREATE TABLE topHighscores (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id TEXT NOT NULL,
                            highscore INTEGER NOT NULL,
                            FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE personalHighscore (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                   user_id TEXT NOT NULL,
                                   highscore TEXT NOT NULL,
                                   FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE tokenBlacklist (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    token TEXT NOT NULL,
                                    expirationTime INTEGER NOT NULL
);