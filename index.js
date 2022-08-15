#!/usr/bin/env node
const child_process = require("child_process");

function exec(cmd) {
  child_process.execSync(cmd, { stdio: "inherit" });
}


(function main() {
  if (["main", "qa"].includes(process.env.AWS_BRANCH)) {
    exec("git rm . -rf");
    exec("npm install --location=global jfrog-cli-v2-jf");
    exec(
      "jf config add --user ${JFROG_USER} --password ${JFROG_API_KEY} --artifactory-url ${JFROG_URL} --interactive=false"
    );
    exec('jf rt dl "sls-poc/${PACKAGE_NAME}/-/${PACKAGE_NAME}-${ARTIFACT_VERSION}.tgz"');
    exec("mv ${PACKAGE_NAME}/-/*.tgz .");
    exec("tar zxvf *.tgz"); 
    exec("cp -a package/. .");
    exec("rm -rf package/ ${PACKAGE_NAME}/ ${PACKAGE_NAME}-${ARTIFACT_VERSION}.tgz");
    exec("npm install");
  } else {
    exec("npm ci");
  }
})();