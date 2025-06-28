import { Router } from 'express';
import { duvida } from './controller';

const router = Router();

router.post('/ask', duvida)

export default router;