function getDatabaseURI() {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }
  const mongo = {
    user: process.env.MONGO_USERNAME || 'notificacionestoc',
    pass: process.env.MONGO_PASSWORD || 'MyKkQhkPyUEIATjC2BkC',
    host: process.env.MONGO_HOST || '34.135.75.208',
    port: process.env.MONGO_PORT || 48613,
    db: 'notificacionestoc',
  };
  return process.env.USE_LOCAL_DB
    ? `mongodb://localhost:27017/notificacionestocdev`
    : `mongodb://${mongo.user}:${mongo.pass}@${mongo.host}:${mongo.port}\
/notificacionestoc?authSource=tocusers`;
}

export default {
  name: 'api-notificaciones',
  version: '2.0.0',
  port: process.env.PORT || '2999',
  databaseURI: getDatabaseURI(),
  databaseAttempts: 20,
  advisorSecret: 'SsSadvisorSecret',
};
