

const settings = {
    "defaultAppPath": {
      "description": "The default base path for your app if not defined on the .modulrc file",
      "type": "string",
      "default": "/app"
    }
};


const config = {
    settings: settings,
    info: {}
};

for (let id in settings) {
    config.info[id] = settings[id]['default'];
}

module.exports = config;
