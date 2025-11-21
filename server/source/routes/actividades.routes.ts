import { Router } from 'express'  
import { ActividadesController } from '../controllers/actividadesController'

export class ActividadesRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new ActividadesController() 
        //localhost:3000/actividades/ 
        router.get('/',controller.get) 
        //localhost:3000/actividades/6
        router.get('/:id',controller.getById)      
        //localhost:3000/actividades/tipoActividad/6
        router.get('/tipoActividad/:id',controller.getByTipoActividad)
        
        //localhost:3000/inventario/
        router.post('/',controller.create)

        router.put('/:id',controller.update)

        return router 
    } 
}