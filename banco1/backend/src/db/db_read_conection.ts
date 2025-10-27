import  sqlite3  from "sqlite3";
import path from "path";

sqlite3.verbose();

const db_read_path = path.resolve(__dirname, "../../database/read.db");

export const db_read_connection = new sqlite3.Database(db_read_path, (err) => {
  if (err) {
    console.error("Error connecting to the read database:", err.message);
  } else {
    console.log("Connected to the read SQLite database.");
  }
});

