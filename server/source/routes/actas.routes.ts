import { Router } from 'express';
import { ActasController } from '../controllers/actasController';

export class ActasRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ActasController();

        // localhost:3000/actas/
        router.get('/', controller.get);

        // localhost:3000/actas/6
        router.get('/:id', controller.getById);

        // localhost:3000/actas/
        router.post('/', controller.create);

        // localhost:3000/actas/6
        router.delete('/:id', controller.delete);

        return router;
    }
}
