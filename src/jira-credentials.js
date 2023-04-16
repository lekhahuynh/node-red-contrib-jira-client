module.exports = function (RED) {
  function JiraClientConfigNode(config) {
    RED.nodes.createNode(this, config);
    this.protocol = config.protocol;
    this.address = config.address;
    this.apiVersion = config.apiVersion;
    this.strictSSL = config.strictSSL;
  }

  RED.nodes.registerType("jira-credentials", JiraClientConfigNode, {
    credentials: {
      user: { type: "text" },
      pass: { type: "password" },
    },
  });
};
