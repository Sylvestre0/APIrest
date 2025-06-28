import { Request, Response } from 'express';
import { AlterService } from './service';

const alterService = new AlterService();
export const  updateUser = async  (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { email, password, nome } = req.body;

  try {
    const user = await alterService.updateUser(Number(id), email, password, nome);

    if (!user) {
      throw new Error('Erro ao atualizar o usuário');
    }
    res.status(200).json({ message: 'Alteração feita com sucesso!!', user });
  } catch (err: any) {
    if (err.message === 'Nome inválido' || err.message === 'Email inválido' || err.message === 'Senha inválida') {
       res.status(400).json({ error: err.message });
    } else if (err.message === 'Usuário não encontrado') {
       res.status(404).json({ error: err.message });
    } else if (err.message === 'Nenhuma alteração detectada') {
       res.status(204).json({ error: err.message });
    } else {
       res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {password} = req.body;
  try {
    const user = await alterService.deleteUser(Number(id),password);

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (err: any) {
    if (err.message === 'Usuário não encontrado'){
      res.status(404).json({ error: err.message });
    }
    else if (err.message === 'Senha incorreta'){
      res.status(401).json({ error: err.message });
    } 
    else{
      res.status(500).json({ error: 'Erro ao deletar o usuário.' });
    }
  }
};
