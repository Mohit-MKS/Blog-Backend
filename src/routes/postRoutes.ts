import { Router } from "express";
import postController from "../controllers/postController";
import { isAuth } from "../middlewares/authMiddleware";
import postValidators from "../validators/postValidators";
import { upload } from "../middlewares/fileMiddlewares";


const router = Router();
router.post('/', isAuth, upload.single('file'), postValidators.validatePost, postController.addPost)
router.get('/', isAuth, postController.getPosts)
router.put('/:postId', isAuth, upload.single('file'), postValidators.validateUpdatePost, postController.updatePost)
router.delete('/:postId', isAuth, postValidators.validateDeletePost, postController.deletePost)

export = router;