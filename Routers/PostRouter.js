const express = require('express');
const PostController = require('../Controllers/PostController');

const router = express.Router();

// Создание нового поста
router.post('/posts', PostController.createPost);

// Получение всех постов
router.get('/posts', PostController.getAllPosts);

// Получение поста по ID
router.get('/posts/:id', PostController.getPostById);

// Обновление поста
router.put('/posts/:id', PostController.updatePost);

// Удаление поста
router.delete('/posts/:id', PostController.deletePost);

module.exports = router;