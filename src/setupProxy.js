module.exports = app => {
    app.get('/rmg/info.json', (req, res) => {
        res.send({
            component: 'rmg',
            version: '9.9.9',
            environment: 'DEV',
            instance: 'localhost',
        });
    });
};
