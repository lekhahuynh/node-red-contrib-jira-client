const JiraApi = require("jira-client");

module.exports = function (RED) {
  function JiraClientFindIssue(config) {
    RED.nodes.createNode(this, config);
    this.server = RED.nodes.getNode(config.server);
    this.issueNumber = config.issueNumber;
    const node = this;

    node.on("input", (msg) => {
      // Initialize
      const jira = new JiraApi({
        protocol: node.server.protocol,
        host: node.server.address,
        username: node.server.credentials.user,
        password: node.server.credentials.pass,
        apiVersion: node.server.apiVersion,
        strictSSL: true,
      });
      const issueNumber = this.issueNumber;
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

  RED.nodes.registerType("jira-find-issue", JiraClientFindIssue);
};
