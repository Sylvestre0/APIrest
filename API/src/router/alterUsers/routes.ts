import { Router } from 'express';
import { updateUser, deleteUser} from './controller';

const router = Router();

router.put('/alterUsers/:id', updateUser);
router.delete('/deleteUsers/:id', deleteUser);

export default router;
