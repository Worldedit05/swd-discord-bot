const healthCheck = (message) => {
  require('child_process').exec('git rev-parse HEAD', function(err, stdout) {
    message.channel.send(`Current bot commit hash is: ${stdout.substr(stdout.length - 8)}`);
  });
};

module.exports = healthCheck;
