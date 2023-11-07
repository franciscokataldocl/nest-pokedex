

export const EnvConfig = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3001,
    defaultLimit: process.env.DEFAULT_LIMIT || 7 ,
    defaultOffset: process.env.DEFAULT_LIMIT || 0
});

//se importa en app.module.ts