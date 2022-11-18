import {
    deleteImageToCloudinary,
    uploadImageToCloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/Response.js";
import { postModel } from "../models/post.model.js";

const postCtrl = {};

postCtrl.getPosts = async(req, res) => {
    try {
        const post = await postModel.find().populate("user").sort("-createdAt");
        response(res, 200, true, post, "Lista de Posts");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

postCtrl.getPostsLogin = async(req, res) => {
    try {
        const post = await postModel
            .find({ user: req.userId })
            .populate("user", { password: 0 })
            .sort("-createdAt");
        response(res, 200, true, post, "Lista de Posts del usuario logueado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

postCtrl.listOne = async(req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);
        if (!post) {
            return response(res, 404, false, "", "Registro no Encontrado");
        }

        response(res, 200, true, post, "Registro Encontrado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
postCtrl.add = async(req, res) => {
    try {
        const { title, description } = req.body;
        const newPost = new postModel({
            title,
            description,
            user: req.userId,
        });

        // req.file && newPost.setImg(req.file.filename);

        if (req.file) {
            const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
            newPost.setImg({ secure_url, public_id });
        }
        await postModel.create(newPost);
        response(res, 201, true, newPost, "Post Creado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

postCtrl.delete = async(req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);
        if (!post) {
            return response(res, 404, false, "", "Registro no Encontrado");
        }

        if (post.public_id) {
            await deleteImageToCloudinary(post.public_id);
        }
        // post.nameImage && deleteImage(post.nameImage);

        await post.deleteOne();
        response(res, 200, true, "", "Registro Eliminado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

postCtrl.update = async(req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);
        if (!post) {
            return response(res, 404, false, "", "Registro Enocntrado");
        }

        if (req.file) {
            // post.nameImage && deleteImage(post.nameImage);
            // post.setImg(req.file.filename)

            if (post.public_id) {
                await deleteImageToCloudinary(post.public_id);
            }

            const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
            post.setImg({ secure_url, public_id });

            await post.save();
        }
        await post.updateOne(req.body);
        response(res, 200, true, "", "Registro Actualizado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

export default postCtrl;