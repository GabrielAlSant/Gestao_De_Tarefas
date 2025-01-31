const { tarefa, comentario } = require('../models');
const { getIO } = require('../bin/socket');

class Observer {
    constructor(tarefaId) {
        this.tarefaId = tarefaId;
    }
    async notifyUsers() {
        const io = getIO();
        try {
            const tarefaDados = await tarefa.findByPk(this.tarefaId);
            if (!tarefaDados) throw new Error('Tarefa não encontrada.');
            const comentarios = await comentario.findAll({ where: { tarefaId: this.tarefaId } });
            const usuariosNotificados = new Set(
                comentarios.map(comment => comment.usuarioId)
            );
            usuariosNotificados.add(tarefaDados.usuarioId);

            usuariosNotificados.forEach(userId => {
                if (userId) {
                    io.to(`user-${userId}`).emit('newComment', {
                        message: 'Novo comentário na tarefa de número: ' + this.tarefaId + ', titulo:' + tarefaDados.titulo + '.',
                        tarefaId: this.tarefaId,
                    });
                }
            });
        } catch (error) {
            console.error('Erro ao notificar usuários:', error.message);
        }
    }
}

module.exports = { Observer };
