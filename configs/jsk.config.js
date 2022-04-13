
module.exports = {
  name: 'jsk-std',
  workspaces: {
    packages: 'node',
  },
  profile: {
    author: "lynnkoo",
    repository: 'https://github.com/lynnkoo/js-basic-kit',
    description: "jsk cli",
    license: "MIT",
  },
  templates: [
    'github:jsk-studio/jsk-cli-repo#main',
  ],
  scripts: {
    'build:xxxx': 'npm run build:xxxxx',
  },
}