import { INode } from '@cocos/creator-types/editor/packages/scene/@types/public';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: readFileSync(join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        txtResPath: '#txtResPath',
        imageResPath: '#imageResPath',
        loadBtn: '#load-btn',
        applyBtn: '#apply-btn',
        langSelect: '#lang-select',
    },
    methods: {
        hello() {

        },
        onLanguageChanged(args: any) {
            console.log('index 收到语言切换广播：', args);
        }
    },
    ready() {
        (this.$.loadBtn as HTMLButtonElement).disabled = true;
        this.$.txtResPath?.addEventListener('change', () => {
            (this.$.loadBtn as HTMLButtonElement).disabled = false;
        });
        this.$.imageResPath?.addEventListener('change', () => {
            (this.$['loadBtn'] as HTMLButtonElement).disabled = false;
        });
        this.$.loadBtn?.addEventListener('confirm', () => {
            (this.$['loadBtn'] as HTMLButtonElement).disabled = true;
            const ImagePath = (this.$.imageResPath as HTMLInputElement).value.trim();
            const resPath = (this.$.txtResPath as HTMLInputElement).value.trim();
            console.log(`资源路径为:txtPath:${resPath}  imagePath:${ImagePath}`);
            Editor.Message.send('game-framwork', 'load-Json-Data', { txtPath: resPath, imagePath: ImagePath });
        });
        this.$.applyBtn?.addEventListener('confirm', () => {
            console.log(`langSelect:${(this.$.langSelect as HTMLSelectElement).value}`);
            Editor.Message.broadcast('game-framwork:updateLanguage', {
                language: (this.$.langSelect as HTMLSelectElement).value
            });
        });
    },
    beforeClose() {

    },
    close() { },
});
