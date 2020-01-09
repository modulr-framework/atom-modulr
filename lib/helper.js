
const CLIHelper = require('cli-helper').constructor;
const config = require('./config');

class Helper extends CLIHelper {

    constructor() {
        super();
    }

    getTemplate(name) {
        let tplPath = `${__dirname}/templates/${name}.jst`;
        let ret = null;

        if (this.isFileExists(tplPath)) {
            ret = this.readFile(tplPath);
        }
        return ret;
    }

    getPathInfo(path) {
        const self = this;
        let isFile = this.isFileExists(path);
        let isExists = this.isPathExists(path);

        let ret = {
            path: {
                source: path
            }
        };

        ret.path.filename = (() => {
            if (ret.isDir) { return null; }
            let sp = path.split('/');
            return sp[sp.length - 1];
        })();

        ret.path.dirPath = (!ret.isDir) ? path.replace(`/${ret.path.filename}`, '') : path;

        // search for .modulrc
        ret.path.conf = ((dir) => {
            let currDir = dir;
            let done = false;
            let ret = null;

            while (!done) {
                let cpath = `${currDir}/.modulrc`;
                if (!self.isFileExists(cpath)) {
                    // one level down
                    let sp = currDir.split('/');
                    sp.pop();
                    if (sp.length === 0) {
                        done = true;
                    } else {
                        currDir = sp.join('/');
                    }
                } else {
                    ret = cpath;
                    done = true;
                }
            }
            return ret;
        })(ret.path.dirPath);

        if (ret.path.conf) {
            // get the modulrc config information
            ret.conf = ((confPath) => {
                let info = JSON.parse(self.readFile(confPath));
                return info;
            })(ret.path.conf);

            // set the base app path
            ret.path.baseAppPath = (() => {
                return ret.path.conf.replace('/.modulrc', ret.conf.baseAppPath || atom.config.get('modulr.defaultAppPath'));
            })();

            ret.path.modulePath = (() => {
                let path = null;
                // check if the base app path is a path of the module
                if (ret.path.dirPath.indexOf(ret.path.baseAppPath) > -1) {
                    let moduleName = ret.path.filename.replace(/\.js$/i, '');
                    path = ret.path.dirPath.replace(ret.path.baseAppPath, '');
                    path = [(path.length > 0) ? (path + '/') : '', moduleName].join('');
                    path = path.replace(/^\//, '');
                }
                return path;
            })();

        }


        return ret;
    }


}

module.exports = new Helper;
