import { Router } from 'express'  
import { InventarioController } from '../controllers/inventarioController'

export class InventarioRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new InventarioController() 
        //localhost:3000/categoria/ 
        router.get('/',controller.get) 
        //localhost:3000/categoria/6
        router.get('/:id',controller.getById)      
        //localhost:3000/categoria/6
        router.get('/categoria/:id',controller.getByCategoria)      
        return router 
    } 
}