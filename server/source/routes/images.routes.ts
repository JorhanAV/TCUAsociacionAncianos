import { Router } from 'express'
import { ImageController } from '../controllers/imageController'
import uploadFiles from '../middleware/ImageConfig';


export class ImageRoutes {
    static get routes(): Router {
        const router= Router()
        const controller=new ImageController()
        
        router.post("/upload", controller.upload);
        router.patch('/update/:id', controller.updateFile);
        router.get("/files", controller.getListFiles);
        router.get("/files/:name", controller.download);
        router.post('/perfil/:id/foto', controller.updatePerfilFoto);
        return router
    }
  

}