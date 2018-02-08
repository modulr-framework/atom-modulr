'use babel';

import ModulrView from './modulr-view';
import ModulrGenerator from './modulr-generator';
import { CompositeDisposable } from 'atom';
import path from 'path';
import Helper from './helper';
import config from './config';

export default {

  modulrView: null,
  modalPanel: null,
  subscriptions: null,

  config: config.settings,

  activate(state) {
    // atom.notifications.addSuccess('Modulr plugin activated');

    this.modulrGenerator = new ModulrGenerator();

    // this.modulrView = new ModulrView(state.modulrViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.modulrView.getElement(),
    //   visible: false
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'modulr:toggle': () => this.toggle(),
      'modulr:genDefine': () => this.genDefine(),
      'modulr:genConfig': () => this.genConfig()
    }));
  },

  deactivate() {
      atom.notifications.addWarning('Modulr plugin deactivated');
    this.subscriptions.dispose();
    // this.modalPanel.destroy();
    // this.modulrView.destroy();
  },

  serialize() {
    return {
      //modulrViewState: this.modulrView.serialize()
    };
  },

  toggle() {
    console.log('Modulr was toggled!');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  },

  genDefine() {
      let editor = atom.workspace.getActivePaneItem();
      let path = editor.getPath();

      if (!editor.isEmpty()) {
          return atom.notifications.addWarning('You can only insert on empty files..');
      }

      if (Helper.isFileExists(path)) {
        let markup = this.modulrGenerator.defineModule(editor);
        if (markup) {
            editor.insertText(markup);
        } else {
            atom.notifications.addWarning('cannot find modulr config..');
        }
      } else {
        atom.notifications.addWarning('file does not exist yet!');
      }
  },

  genConfig() {
    let editor = atom.workspace.getActiveTextEditor();
    let uid = '[PUT_UID_HERE]';
    if (!editor.isEmpty()) {
        return atom.notifications.addWarning('You can only insert text on empty files..');
    }
    editor.insertText(this.modulrGenerator.defineConfig(uid));
    // console.log('todo: generate .modulrc');
  }

};
