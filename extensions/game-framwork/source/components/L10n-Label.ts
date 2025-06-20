'use strict';

import { INode } from "@cocos/creator-types/editor/packages/scene/@types/public";

type Selector<$> = { $: Record<keyof $, any | null> }
export const template = `
    <div class="component-container">
        <ui-prop readonly>
            <ui-label slot="label">String</ui-label>
            <ui-input slot="content" class="value"></ui-input>
        </ui-prop>
        <ui-prop class="primary">
            <ui-label slot="label">Key</ui-label>
            <ui-input slot="content" class="key"></ui-input>
        </ui-prop>
        <ui-button type="default" id="apply">更新</ui-button>
    </div>
`;

exports.style = `
    #apply{
        width: 100%;
        margin: 12px;
        height:25px;
    }
`;
export const $ = {
    key: ".key",
    value: ".value",
    apply: "#apply"
};


type PanelThis = Selector<typeof $> & { dump: any };

export function update(this: PanelThis, dump: any) {
    //console.log('dump:', dump);
    this.dump = dump;
    this.$.key.value = dump.value.key.value;
    this.$.value.value = dump.value.value.value;
}

export async function ready(this: any) {
    if (this.dump?.value) {
        this.$.key.value = this.dump?.value.key.value;
        this.$.value.value = this.dump?.value.value.value;
        await Editor.Message.send("scene", "execute-component-method", {
            uuid: this.dump.value.uuid.value, name: "updateData",
            args: [this.$.key.value, this.$.value.value]
        });
    }
    let jsonData = new Map<string, any>();
    const data: Record<string, any> = await Editor.Message.request('game-framwork', 'get-text');
    for (const key in data) {
        jsonData.set(data[key].key, data[key]);
    }
    this.$.apply.addEventListener("confirm", async () => {
        let key = this.$.key.value;
        let str = jsonData.get(key);
        let strData = str ? str.zh : 'no found!';
        this.$.value.value = strData;
        await Editor.Message.send("scene", "execute-component-method", {
            uuid: this.dump.value.uuid.value, name: "updateData",
            args: [key, this.$.value.value]
        });
		await Editor.Message.request('scene', 'soft-reload');
        await Editor.Message.send('scene', 'refresh-scene');
        this.dispatch('change');
    });
}