import { Router } from "express";
import postCtrl from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/imgUpload.js";

const route = Router();

route.get("/", verifyToken, postCtrl.getPosts);
route.get("/user", verifyToken, postCtrl.getPostsLogin);
route.get("/:id", verifyToken, postCtrl.listOne);
route.delete("/:id", verifyToken, postCtrl.delete);
route.put("/:id", verifyToken, upload.single("img"), postCtrl.update);
route.post("/", verifyToken, upload.single("img"), postCtrl.add);

export default route;