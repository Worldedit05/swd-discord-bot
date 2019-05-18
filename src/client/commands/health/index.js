const healthCheck = (message) => {
  if (!process.env.HEROKU_SLUG_COMMIT) {
    require('child_process').exec('git rev-parse HEAD', function(err, stdout) {
      message.channel.send(`Current bot commit hash is: ${stdout.substr(stdout.length - 8)}`);
    });
  }
  const healthText = `\`\`\`yaml
AppID: ${process.env.HEROKU_APP_ID}
App Name: ${process.env.HEROKU_APP_NAME}
Release Created Date: ${process.env.HEROKU_RELEASE_CREATED_AT}
Release Version: ${process.env.HEROKU_RELEASE_VERSION}
Commit: ${process.env.HEROKU_SLUG_COMMIT}
\`\`\``;

  return message.channel.send(healthText);
};

module.exports = healthCheck;
