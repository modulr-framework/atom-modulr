'use babel';

import Helper from './helper';
import config from './config';

const fs = require('fs');
const _ = require('lodash');

export default class ModulrGenerator {

    constructor() {

    }

    defineConfig(uid) {
        let tpl = _.template(Helper.getTemplate('conf'));
        return tpl({ uid: uid });
    }

    getConfig(path) {
        return Helper.getPathInfo(path);
    }

    defineModule(editor) {
        let origPath = editor.getPath();
        let info = this.getConfig(origPath);
        let ret = null;
        if (info.conf && info.conf.uid && info.path.modulePath) {
            // get template
            let tpl = _.template(Helper.getTemplate('define'));
            ret = tpl({
                path: [info.conf.uid, info.path.modulePath].join(':')
            });
        }
        return ret;


    }

}
