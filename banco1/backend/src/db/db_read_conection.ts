import  sqlite3  from "sqlite3";
import path from "path";

sqlite3.verbose();

const db_path = path.resolve(__dirname, "../../database/db.db");

export const db_read_connection = new sqlite3.Database(db_path, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

