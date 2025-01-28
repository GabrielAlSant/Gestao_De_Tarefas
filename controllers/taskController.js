const { usuario, tarefa, comentario, log } = require('../models'); 
const { Sequelize } = require('sequelize');


const alltask = async (req, res) => {
    try {
        const allTasksArray = await tarefa.findAll({
            include: { model: usuario, as: 'usuario' } 
        });
        const totalTasks = allTasksArray.length;

        res.render('task/tasks', {
            title: 'Todas as Tarefas',
            tasks: allTasksArray,
            totalTasks
        });
    } catch (error) {
        console.error('Erro ao buscar todas as tarefas:', error);
        res.status(500).send('Erro no servidor1');
    }
};

const searchtask = async (req, res) => {
    const searchQuery = req.query.task?.toLowerCase() || '';
    try {
        const filteredTasks = await tarefa.findAll({
            where: {
                titulo: { [Sequelize.Op.iLike]: `%${searchQuery}%` }
            },
            include: { model: usuario, as: 'usuario' }
        });

        res.render('task/search', {
            title: `Resultados para "${searchQuery}"`,
            tasks: filteredTasks,
            totalTasks: filteredTasks.length
        });
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).send('Erro no servidor2');
    }
};


const taskdetails = async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    try {
        const foundTask = await tarefa.findByPk(taskId, {
            include: [
                { model: usuario, as: 'usuario' },
                { model: comentario, as: 'comentario', include: { model: usuario, as: 'usuario' }}
            ]
        });
        const logs = await log.findAll({
            where: { tarefaId: taskId },
            order: [['createdAt', 'DESC']]
        });

        logs.forEach(log => {
            log.formattedCreatedAt = log.createdAt.toLocaleString('pt-BR', {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        });
        const users = await usuario.findAll();

        res.render('task/taskdetails', {
            title: foundTask ? `Tarefa ID ${taskId}` : 'Tarefa Não Encontrada',
            task: foundTask,
            users,
            logs
        });
    } catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        res.status(500).send('Erro no servidor');
    }
};


const createTaskPage = async (req, res) => {
    try {
        const usuarios = await usuario.findAll({
            include: [
                {
                    model: tarefa,
                    as: 'tarefa', // Confere com o alias na associação
                },
            ],
        });

        const totalUsuarios = usuarios.length;

        const usuariosComTarefas = usuarios.map(usuario => {
            const tarefas = usuario.tarefa || []; // Garante que 'tarefa' seja um array

            const tarefasConcluidas = tarefas.filter(tarefa => tarefa.status === 'Concluída').length;
            const tarefasEmAndamento = tarefas.filter(tarefa => tarefa.status === 'Em andamento').length;
            const tarefasNaoIniciadas = tarefas.filter(tarefa => tarefa.status === 'Não iniciada').length;

            return {
                ...usuario.toJSON(),
                resumoTarefas: {
                    concluidas: tarefasConcluidas,
                    emAndamento: tarefasEmAndamento,
                    naoIniciadas: tarefasNaoIniciadas,
                },
            };
        });

        const totalTasks = usuariosComTarefas.reduce((sum, user) => sum + (user.tarefa?.length || 0), 0);

        const users = await usuario.findAll();
        res.render('task/create', { 
            users, 
            usuarios: usuariosComTarefas,
            totalUsuarios,
            totalTasks
         });
    } catch (error) {
        console.error('Erro ao carregar formulário de criação de tarefa:', error);
        res.status(500).send('Erro no servidor5');
    }
};

const createTask = async (req, res) => {
    const { titulo, descricao, status, usuarioId } = req.body;

    if (!titulo || !descricao || !status || !usuarioId) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
        const newTask = await tarefa.create({
            titulo,
            descricao,
            status,
            usuarioId: parseInt(usuarioId, 10)
        });
        res.redirect(`/user/tasks/${usuarioId}`);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).send('Erro no servidor.6');
    }
};

module.exports = {
    alltask,
    searchtask,
    taskdetails,
    createTaskPage,
    createTask
};
