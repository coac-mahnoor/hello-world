const express = require('express');
const app = express()
const port = 3000;
const HerokuConfigurator = require('./helper/heroku-configurator')
const { exec } = require('child_process');

app.get('/', (req, res) => res.send('Welcome!'));
app.post('/deploy', async (req, res) => {
    try {
        const gitPkgRepo = 'docker.pkg.github.com/coac-gmbh/microbrains/coac-microbrains:1.0';
        const herokuConfigurator = new HerokuConfigurator();
        const herokuApplication = await herokuConfigurator.createHerokuApp();
        const applicationName = herokuApplication.name;
        const applicationURL= herokuApplication.web_url || '';
        if (applicationName && applicationURL) {
            return new Promise((resolve, reject) => {
                exec(`docker login https://docker.pkg.github.com -u coac-mahnoor --password-stdin ${process.env.GITHUB_AUTH_TOKEN}`);
                exec(`docker pull ${gitPkgRepo}`);
                exec(`docker login registry.heroku.com -u coac-mahnoor --password ${process.env.HEROKU_API_TOKEN}`);
                exec(`docker tag ${gitPkgRepo} registry.heroku.com/${applicationName}/web`);
                exec(`docker push registry.heroku.com/${applicationName}/web`, (error, stdout, stderr) => {
                 if (error) {
                  reject(error)
                 }
                 resolve(stdout? applicationURL : stderr);
                });
               });
        }
    } catch (error) {
        console.log(error);
    }
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))