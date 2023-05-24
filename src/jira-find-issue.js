const JiraApi = require("jira-client");

module.exports = function (RED) {
  function JiraFindIssue(config) {
    RED.nodes.createNode(this, config);
    this.server = RED.nodes.getNode(config.server);
    this.issueNumber = config.issueNumber;
    const node = this;

    node.on("input", (msg) => {
      // Initialize
      const jira = new JiraApi({
        protocol: node.server.protocol,
        host: node.server.address,
        username: node.server.credentials.username,
        password: node.server.credentials.password,
        apiVersion: node.server.apiVersion,
        strictSSL: true,
      });
      const issueNumber = this.issueNumber ? this.issueNumber : msg.issueNumber;
      jira
        .findIssue(issueNumber)
        .then((issue) => {
          node.send({
            ...msg,
            payload: issue,
          });
        })
        .catch((err) => {
          node.error(err.toString(), msg);
        });
    });
  }

  RED.nodes.registerType("jira-find-issue", JiraFindIssue);
};
