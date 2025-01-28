const { usuario, tarefa } = require('../models'); 

const home = async function (req, res) {
    try {
        const usuarios = await usuario.findAll({
            include: [
                {
                    model: tarefa,
                    as: 'tarefa', 
                },
            ],
        });

        const totalUsuarios = usuarios.length;

        const usuariosComTarefas = usuarios.map(usuario => {
            const tarefas = usuario.tarefa || []; 

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

        res.render('user/home/index', {
            user: 'N/I',
            usuarios: usuariosComTarefas,
            totalUsuarios,
            totalTasks,
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).send('Erro ao buscar dados do sistema.');
    }
};

const oneUsertask = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const user = await usuario.findByPk(userId, {
            include: {
                model: tarefa,
                as: 'tarefa',
                include: { model: usuario, as: 'usuario' }
            }
        });

        res.render('user/usertasks', {
            title: user ? `Tarefas de ${user.nome}` : 'Usuário Não Encontrado',
            user: user.nome,
            tasks: user ? user.tarefa : [],
            totalTasks: user ? user.tarefa.length : 0
        });
    } catch (error) {
        console.error('Erro ao buscar tarefas do usuário:', error);
        res.status(500).send('Erro no servidor');
    }
};

const createUserPage = async (req, res) => {
    const usuarios = await usuario.findAll({
        include: [
            {
                model: tarefa,
                as: 'tarefa', 
            },
        ],
    });

    const totalUsuarios = usuarios.length;

    const usuariosComTarefas = usuarios.map(usuario => {
        const tarefas = usuario.tarefa || [];

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

    res.render('user/createuser', {
        usuarios: usuariosComTarefas,
        totalUsuarios,
        totalTasks});
};

const createUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const newUser = await usuario.create({ nome, email, senha });
        res.redirect(`/user/tasks/${newUser.id}`); 
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).send('Erro no servidor');
    }
};


const loginPage = async (req, res) => {
    try {
        const users = await usuario.findAll({ attributes: ['id', 'nome'] });
        res.render('user/login', { users });
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
      }
};

const login = async (req, res) =>{
    try {
        const userPego = await usuario.findByPk(req.body.usuarioId);
        console.log("foi")

        console.log(req.body.senha)
        if (userPego.senha != req.body.senha) {
            return res.json({ success: false });
        }

        const userInfo = {
            id: userPego.id,
            nome: userPego.nome
          };

        console.log("deu certo")

        return  res.json({ success: true, user: userInfo });
        
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    }

module.exports = {
    home,
    oneUsertask,
    createUser,
    createUserPage,
    loginPage, 
    login
};