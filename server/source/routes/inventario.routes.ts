import { Router } from 'express'  
import { InventarioController } from '../controllers/inventarioController'

export class InventarioRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new InventarioController() 
        //localhost:3000/inventario/ 
        router.get('/',controller.get) 
        //localhost:3000/inventario/6
        router.get('/:id',controller.getById)      
        //localhost:3000/inventario/categoria/6
        router.get('/categoria/:id',controller.getByCategoria)
        
        //localhost:3000/inventario/
        router.post('/',controller.create)

        router.put('/:id',controller.update)

        return router 
    } 
}