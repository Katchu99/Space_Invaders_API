CREATE TABLE users (
                      id TEXT PRIMARY KEY AUTOINCREMENT,
                      username TEXT NOT NULL,
                      password TEXT NOT NULL
);

CREATE TABLE highscores (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER NOT NULL,
                            highscore INTEGER NOT NULL,
                            FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE personalHighscore (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                   user_id INTEGER NOT NULL,
                                   highscore INTEGER NOT NULL,
                                   FOREIGN KEY (user_id) REFERENCES user(id)
);
