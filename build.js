const targz = require("targz");
const fse = require("fs-extra");
const path = require("path");

const packageDir = "tmp/package";

function copyFiles(srcDir, destDir, files) {
  return Promise.all(
    files.map((f) => {
      return fse.copyFile(path.join(srcDir, f), path.join(destDir, f));
    })
  );
}

async function buildPackage() {
  return new Promise((resolve, reject) => {
    // compress files into tar.gz archive
    targz.compress(
      {
        src: "tmp",
        dest: "dist/node-red-contrib-jira-client.tgz",
      },
      function (err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.info("Build package success!");
          resolve();
        }
      }
    );
  });
}

async function copyPackage() {
  //copy directory content including subfolders
  await fse.copy("icons", packageDir + "/icons");
  await fse.copy("src", packageDir + "/src");

  await copyFiles("./", packageDir, [
    ".gitignore",
    "CHANGELOG.md",
    "LICENSE",
    "package.json",
    "README.md",
  ]);
  console.info("copyPackage done");
}

async function clearTmp() {
  // Remove folder
  await fse.emptyDir("dist");
  await fse.emptyDir("tmp");

  console.info("clearTmp done");
}

async function main() {
  await clearTmp();
  await copyPackage();
  // Run build
  await buildPackage();

  await fse.emptyDir("tmp");
}

main();
