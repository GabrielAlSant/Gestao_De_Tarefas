const express = require('express');
const { tarefa, comentario, usuario } = require('../models');
const { Observer } = require('../observer/observerComment');




const addcomentario  = async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { texto, usuarioId } = req.body;
    
    try {
        const foundTask = await tarefa.findByPk(taskId);
        if (!foundTask) {
            return res.status(404).send('Tarefa não encontrada.');
        }
        await comentario.create({
            texto,
            tarefaId: taskId,
            usuarioId: usuarioId,
        });

        const observer = new Observer(taskId, usuarioId);

        await observer.notifyUsers();

        res.redirect(`/task/taskdetails/${taskId}`);
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        res.status(500).send('Erro no servidor ao adicionar comentário.');
    }
};


module.exports = {
    addcomentario
};