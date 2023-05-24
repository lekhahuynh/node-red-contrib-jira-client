const JiraApi = require("jira-client");

module.exports = function (RED) {
  function JiraSearch(config) {
    RED.nodes.createNode(this, config);
    this.server = RED.nodes.getNode(config.server);
    const { jiraQuery, startAt, maxResults, fields, expand } = config;
    this.jiraQuery = jiraQuery;
    this.options = {
      startAt,
      maxResults,
      fields,
      expand,
    };
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
      const jiraQuery = this.jiraQuery ? this.jiraQuery : msg.jiraQuery;
      const options = this.options ? this.options : msg.options;

      jira
        .searchJira(jiraQuery, options)
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

  RED.nodes.registerType("jira-search", JiraSearch);
};
