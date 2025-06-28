import { UserRepository } from '@/repositories/alterUser';
import { hashPassword } from '@/helpers/hashHelper';
import { isValidEmail, isValidName, isValidPassword } from '@/helpers/validationHelper';

export class AlterService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async updateUser(id: number, email: string, password: string, name: string) {
    // Validação dos dados
    if (!isValidName(name)) {
      throw new Error('Nome inválido');
    }
    if (!isValidEmail(email)) {
      throw new Error('Email inválido');
    }
    if (!isValidPassword(password)) {
      throw new Error('Senha inválida');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    const passwordHash = hashPassword(password);

    if(existingUser.email === email &&
       existingUser.name === name &&
       existingUser.passwordhash === passwordHash
    ){
      throw new Error('Nenhuma alteração detectada');
    }

    const updatedUser = await this.userRepository.updateUser(id, email, passwordHash, name);

    if (!updatedUser) {
      throw new Error('Erro ao atualizar o usuário');
    }

    return updatedUser;
  }

  async deleteUser(id: number,password:string) {
    const passwordHash = hashPassword(password);
    const existingUser = await this.userRepository.findById(id);
    
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }
    if (existingUser?.passwordhash === passwordHash) {
      throw new Error('Senha incorreta');
    }
    
    const deleteUser = await this.userRepository.deleteUser(id);
    return deleteUser;
  }
}
