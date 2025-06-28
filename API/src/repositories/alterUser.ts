import { Pool } from "pg";
import database from "@/config/database";
import { typeUser } from "@/models/userModel";

export class UserRepository {
  private database: Pool;

  constructor() {
    this.database = database;
  }

  async findById(id: number): Promise<typeUser | null>{
    const { rows } = await this.database.query('SELECT name,email, passwordhash FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async updateUser(id: number, email:string, passwordHash:string, name:string,): Promise<typeUser | null>{
    const queryText = 'UPDATE users SET name = $1, email = $2, passwordhash = $3 WHERE id = $4 RETURNING *';
    const { rows } = await this.database.query(queryText, [name,email, passwordHash, id]);
    return rows[0] || null;
  }

  async deleteUser(id: number): Promise<typeUser | null>{
    const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await this.database.query(queryText, [id]);
    return rows[0] || null;
  }
}