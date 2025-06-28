import { Router } from 'express';
import { register, login, getAllUsers } from './controller';

const router = Router();

router.post('/login', login)
router.post('/register',register)
router.get('/allUsers', getAllUsers)

export default router;