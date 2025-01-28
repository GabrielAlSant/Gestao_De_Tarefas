const { tarefa, log } = require('../models');
const { EventSourcing } = require('../EventSourcing/EventSourcing'); 

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await tarefa.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const eventSourcing = new EventSourcing(log);

    await eventSourcing.createEvent({
      statusantigo: task.status,
      novostatus: status,
      tarefaId: id,
    });

    task.status = status;
    await task.save();

    res.status(200).json({ message: 'Status atualizado e log registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o status' });
  }
};

module.exports = {
  updateStatus,
};

