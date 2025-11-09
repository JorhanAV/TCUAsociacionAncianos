import { Router } from 'express'  
import { HistorialInventarioController } from '../controllers/historialInventarioController'

export class HistorialInventarioRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new HistorialInventarioController() 
        //localhost:3000/historial/ 
        router.get('/',controller.get) 
        //localhost:3000/historial/6
        router.get('/:id',controller.getById)      
        //localhost:3000/historial/movimiento/6
        router.get('/movimiento/:id',controller.getByMovimiento)
        
        //localhost:3000/historial/
        router.post('/',controller.create)

        router.put('/:id',controller.update)

        return router 
    } 
}