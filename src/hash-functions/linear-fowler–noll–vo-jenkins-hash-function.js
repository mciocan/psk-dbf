const fowlerNollVo1a = require("./fowler–noll–vo-1a");
const jenkins = require("./jenkins");

function LinearFowlerNollVoJenkinsHashFunction(data, index, options) {
  const { m } = options;
  return (fowlerNollVo1a(data) + index * jenkins(data)) % m;
}

module.exports = LinearFowlerNollVoJenkinsHashFunction;
