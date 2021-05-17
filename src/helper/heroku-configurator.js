const 
    Haikunator = require('haikunator'),
    Heroku = require('heroku-client');

 class HerokuConfigurator {

generateHerokuAppName = async () => {
    const haikunator = new Haikunator({
        defaults: { 
            tokenLength: 8
        }
    });
    return haikunator.haikunate();
    }
createHerokuApp = async () => {
    try {
    const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN})
    let appName =  await this.generateHerokuAppName();
    const herokuApp = await heroku.request({ method: 'POST', path: '/apps', body: {name: appName, region: 'eu', stack: 'container'} });
    return herokuApp;
    } catch (error) {
        console.log('error', error);
    }
}
}

 module.exports = HerokuConfigurator;
