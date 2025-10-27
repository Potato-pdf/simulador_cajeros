import  sqlite3  from "sqlite3";
import path from "path";

sqlite3.verbose();

const db_write_path = path.resolve(__dirname, "../../database/write.db");

export const db_write_connection = new sqlite3.Database(db_write_path, (err) => {
  if (err) {
    console.error("Error connecting to the write database:", err.message);
  } else {
    console.log("Connected to the write SQLite database.");
  }
});

