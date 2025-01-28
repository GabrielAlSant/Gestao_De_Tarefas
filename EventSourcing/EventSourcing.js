class EventSourcing {
    constructor(logModel) {
      this.logModel = logModel;
    }
  
    async createEvent(eventData) {
      try {
        await this.logModel.create(eventData);
      } catch (error) {
        console.error('Erro ao registrar evento:', error);
        throw new Error('Falha ao registrar o evento');
      }
    }
  }

  module.exports = { EventSourcing };