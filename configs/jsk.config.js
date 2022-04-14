module.exports = {
  name: "jsk-std",
  mode: "node",
  profile: {
    author: "lynnkoo",
    repository: "https://github.com/jsk-stuido/jsk-std",
    license: "MIT"
  },
  templates: [
    "github:jsk-studio/jsk-cli-repo#main"
  ],
  workspaces: {
    packages: "tsc"
  }
}
