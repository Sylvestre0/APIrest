import { Pool } from "pg";
import database from "@/config/database";
import { typeUser } from "@/models/userModel";

export class UserRepository {
  private database: Pool;

  constructor() {
    this.database = database;
  }

  async addUser(name: string,email: string,passwordHash: string,googleId: string,): Promise<typeUser> {
    const queryText = "INSERT INTO users(name, email, passwordhash, googleid) VALUES($1, $2, $3, $4) RETURNING *";
    const { rows } = await this.database.query(queryText, [name,email,passwordHash,googleId]);
    return rows[0];
  }

  async getUserByEmail(email: string): Promise<typeUser | null> {
    const { rows } = await this.database.query('SELECT name,email, passwordhash FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  async getUsers(): Promise<typeUser[]>{
    const queryText = 'SELECT id,name,email, passwordhash FROM users';
    const { rows } = await this.database.query(queryText);
    return rows;
  }
}