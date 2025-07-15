'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = exports.template = void 0;
exports.update = update;
exports.ready = ready;
exports.template = `
    <div class="component-container">
        <ui-prop readonly>
            <ui-label slot="label">Path</ui-label>
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
exports.$ = {
    key: ".key",
    value: ".value",
    apply: "#apply",
    language: "#language",
    // imageName: "#imageName",
    // bundle: "#bundle"
};
function update(dump) {
    var _a, _b, _c;
    console.log('dump:', dump);
    this.dump = dump;
    this.$.key.value = dump.value.key.value;
    this.$.value.value = dump.value.value.value;
    this.$.language = (_a = this.dump) === null || _a === void 0 ? void 0 : _a.value.language.value;
    this.$.imageName = (_b = this.dump) === null || _b === void 0 ? void 0 : _b.value.imageName.value;
    this.$.bundleName = (_c = this.dump) === null || _c === void 0 ? void 0 : _c.value.bundleName.value;
}
async function ready() {
    var _a, _b, _c, _d;
    if ((_a = this.dump) === null || _a === void 0 ? void 0 : _a.value) {
        this.$.key.value = (_b = this.dump) === null || _b === void 0 ? void 0 : _b.value.key.value;
        this.$.value.value = (_c = this.dump) === null || _c === void 0 ? void 0 : _c.value.value.value;
        this.$.language.value = (_d = this.dump) === null || _d === void 0 ? void 0 : _d.value.language.value;
        //this.$.imageName.value = this.dump?.value.imageName.value;
        // await Editor.Message.send("scene", "execute-component-method", {
        //     uuid: this.dump.value.uuid.value, name: "updateData",
        //     args: [this.$.key.value, this.$.value.value]
        // });
    }
    let jsonData = new Map();
    const data = await Editor.Message.request('game-framwork', 'get-Image');
    for (const key in data) {
        jsonData.set(data[key].key, data[key]);
    }
    this.$.apply.addEventListener("confirm", async () => {
        let key = this.$.key.value;
        let str = jsonData.get(key);
        let strData = str ? str.path : 'no found!';
        this.$.value.value = strData;
        await Editor.Message.send("scene", "execute-component-method", {
            uuid: this.dump.value.uuid.value, name: "updateData",
            args: [this.$.key.value, str]
        });
        await Editor.Message.request('scene', 'soft-reload');
        await Editor.Message.send('scene', 'refresh-scene');
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTDEwbi1TcHJpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvY29tcG9uZW50cy9MMTBuLVNwcml0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQXlEYix3QkFRQztBQUVELHNCQThCQztBQTVGWSxRQUFBLFFBQVEsR0FBRzs7Ozs7Ozs7Ozs7O0NBWXZCLENBQUM7QUFFRixPQUFPLENBQUMsS0FBSyxHQUFHOzs7Ozs7Q0FNZixDQUFDO0FBQ1csUUFBQSxDQUFDLEdBQUc7SUFDYixHQUFHLEVBQUUsTUFBTTtJQUNYLEtBQUssRUFBRSxRQUFRO0lBQ2YsS0FBSyxFQUFFLFFBQVE7SUFDZixRQUFRLEVBQUUsV0FBVztJQUNyQiwyQkFBMkI7SUFDM0Isb0JBQW9CO0NBQ3ZCLENBQUM7QUF3QkYsU0FBZ0IsTUFBTSxDQUFrQixJQUFTOztJQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3hDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDNUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsTUFBQSxJQUFJLENBQUMsSUFBSSwwQ0FBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUNsRCxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxNQUFBLElBQUksQ0FBQyxJQUFJLDBDQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQ3BELElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLE1BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7QUFDMUQsQ0FBQztBQUVNLEtBQUssVUFBVSxLQUFLOztJQUN2QixJQUFJLE1BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsS0FBSyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDOUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDeEQsNERBQTREO1FBQzVELG1FQUFtRTtRQUNuRSw0REFBNEQ7UUFDNUQsbURBQW1EO1FBQ25ELE1BQU07SUFDVixDQUFDO0lBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQUN0QyxNQUFNLElBQUksR0FBd0IsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDN0YsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNyQixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNoRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUMzQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQzdCLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFO1lBQzNELElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxZQUFZO1lBQ3BELElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7U0FDaEMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckQsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFHUCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHsgSU5vZGUgfSBmcm9tIFwiQGNvY29zL2NyZWF0b3ItdHlwZXMvZWRpdG9yL3BhY2thZ2VzL3NjZW5lL0B0eXBlcy9wdWJsaWNcIjtcclxuXHJcbnR5cGUgU2VsZWN0b3I8JD4gPSB7ICQ6IFJlY29yZDxrZXlvZiAkLCBhbnkgfCBudWxsPiB9XHJcbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtY29udGFpbmVyXCI+XHJcbiAgICAgICAgPHVpLXByb3AgcmVhZG9ubHk+XHJcbiAgICAgICAgICAgIDx1aS1sYWJlbCBzbG90PVwibGFiZWxcIj5QYXRoPC91aS1sYWJlbD5cclxuICAgICAgICAgICAgPHVpLWlucHV0IHNsb3Q9XCJjb250ZW50XCIgY2xhc3M9XCJ2YWx1ZVwiPjwvdWktaW5wdXQ+XHJcbiAgICAgICAgPC91aS1wcm9wPlxyXG4gICAgICAgIDx1aS1wcm9wIGNsYXNzPVwicHJpbWFyeVwiPlxyXG4gICAgICAgICAgICA8dWktbGFiZWwgc2xvdD1cImxhYmVsXCI+S2V5PC91aS1sYWJlbD5cclxuICAgICAgICAgICAgPHVpLWlucHV0IHNsb3Q9XCJjb250ZW50XCIgY2xhc3M9XCJrZXlcIj48L3VpLWlucHV0PlxyXG4gICAgICAgIDwvdWktcHJvcD5cclxuICAgICAgICA8dWktYnV0dG9uIHR5cGU9XCJkZWZhdWx0XCIgaWQ9XCJhcHBseVwiPuabtOaWsDwvdWktYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcbmA7XHJcblxyXG5leHBvcnRzLnN0eWxlID0gYFxyXG4gICAgI2FwcGx5e1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIG1hcmdpbjogMTJweDtcclxuICAgICAgICBoZWlnaHQ6MjVweDtcclxuICAgIH1cclxuYDtcclxuZXhwb3J0IGNvbnN0ICQgPSB7XHJcbiAgICBrZXk6IFwiLmtleVwiLFxyXG4gICAgdmFsdWU6IFwiLnZhbHVlXCIsXHJcbiAgICBhcHBseTogXCIjYXBwbHlcIixcclxuICAgIGxhbmd1YWdlOiBcIiNsYW5ndWFnZVwiLFxyXG4gICAgLy8gaW1hZ2VOYW1lOiBcIiNpbWFnZU5hbWVcIixcclxuICAgIC8vIGJ1bmRsZTogXCIjYnVuZGxlXCJcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUxvY2FsaXplZEltYWdlIHtcclxuICAgIGtleT86IHN0cmluZztcclxuICAgIHBhdGg/OiBzdHJpbmc7XHJcbiAgICBiTGFuZ3VhZ2U/OiBib29sZWFuO1xyXG4gICAgaW1hZ2VOYW1lPzogc3RyaW5nO1xyXG4gICAgYnVuZGxlTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuLy90eXBlIFBhbmVsVGhpcyA9IFNlbGVjdG9yPHR5cGVvZiAkPiAmIHsgZHVtcDogYW55IH07XHJcbnR5cGUgUGFuZWxUaGlzID0ge1xyXG4gICAgJDoge1xyXG4gICAgICAgIGtleTogSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICB2YWx1ZTogSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBhcHBseTogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgbGFuZ3VhZ2U6IG51bWJlcjtcclxuICAgICAgICBpbWFnZU5hbWU6IHN0cmluZztcclxuICAgICAgICBidW5kbGVOYW1lOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgZHVtcDogYW55O1xyXG4gICAgb25MYW5ndWFnZUNoYW5nZWQ/OiAoYXJnczogYW55KSA9PiB2b2lkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZSh0aGlzOiBQYW5lbFRoaXMsIGR1bXA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ2R1bXA6JywgZHVtcCk7XHJcbiAgICB0aGlzLmR1bXAgPSBkdW1wO1xyXG4gICAgdGhpcy4kLmtleS52YWx1ZSA9IGR1bXAudmFsdWUua2V5LnZhbHVlO1xyXG4gICAgdGhpcy4kLnZhbHVlLnZhbHVlID0gZHVtcC52YWx1ZS52YWx1ZS52YWx1ZTtcclxuICAgIHRoaXMuJC5sYW5ndWFnZSA9IHRoaXMuZHVtcD8udmFsdWUubGFuZ3VhZ2UudmFsdWU7XHJcbiAgICB0aGlzLiQuaW1hZ2VOYW1lID0gdGhpcy5kdW1wPy52YWx1ZS5pbWFnZU5hbWUudmFsdWU7XHJcbiAgICB0aGlzLiQuYnVuZGxlTmFtZSA9IHRoaXMuZHVtcD8udmFsdWUuYnVuZGxlTmFtZS52YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWR5KHRoaXM6IGFueSkge1xyXG4gICAgaWYgKHRoaXMuZHVtcD8udmFsdWUpIHtcclxuICAgICAgICB0aGlzLiQua2V5LnZhbHVlID0gdGhpcy5kdW1wPy52YWx1ZS5rZXkudmFsdWU7XHJcbiAgICAgICAgdGhpcy4kLnZhbHVlLnZhbHVlID0gdGhpcy5kdW1wPy52YWx1ZS52YWx1ZS52YWx1ZTtcclxuICAgICAgICB0aGlzLiQubGFuZ3VhZ2UudmFsdWUgPSB0aGlzLmR1bXA/LnZhbHVlLmxhbmd1YWdlLnZhbHVlO1xyXG4gICAgICAgIC8vdGhpcy4kLmltYWdlTmFtZS52YWx1ZSA9IHRoaXMuZHVtcD8udmFsdWUuaW1hZ2VOYW1lLnZhbHVlO1xyXG4gICAgICAgIC8vIGF3YWl0IEVkaXRvci5NZXNzYWdlLnNlbmQoXCJzY2VuZVwiLCBcImV4ZWN1dGUtY29tcG9uZW50LW1ldGhvZFwiLCB7XHJcbiAgICAgICAgLy8gICAgIHV1aWQ6IHRoaXMuZHVtcC52YWx1ZS51dWlkLnZhbHVlLCBuYW1lOiBcInVwZGF0ZURhdGFcIixcclxuICAgICAgICAvLyAgICAgYXJnczogW3RoaXMuJC5rZXkudmFsdWUsIHRoaXMuJC52YWx1ZS52YWx1ZV1cclxuICAgICAgICAvLyB9KTtcclxuICAgIH1cclxuICAgIGxldCBqc29uRGF0YSA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XHJcbiAgICBjb25zdCBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gYXdhaXQgRWRpdG9yLk1lc3NhZ2UucmVxdWVzdCgnZ2FtZS1mcmFtd29yaycsICdnZXQtSW1hZ2UnKTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcclxuICAgICAgICBqc29uRGF0YS5zZXQoZGF0YVtrZXldLmtleSwgZGF0YVtrZXldKTtcclxuICAgIH1cclxuICAgIHRoaXMuJC5hcHBseS5hZGRFdmVudExpc3RlbmVyKFwiY29uZmlybVwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGtleSA9IHRoaXMuJC5rZXkudmFsdWU7XHJcbiAgICAgICAgbGV0IHN0ciA9IGpzb25EYXRhLmdldChrZXkpO1xyXG4gICAgICAgIGxldCBzdHJEYXRhID0gc3RyID8gc3RyLnBhdGggOiAnbm8gZm91bmQhJztcclxuICAgICAgICB0aGlzLiQudmFsdWUudmFsdWUgPSBzdHJEYXRhO1xyXG4gICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnNlbmQoXCJzY2VuZVwiLCBcImV4ZWN1dGUtY29tcG9uZW50LW1ldGhvZFwiLCB7XHJcbiAgICAgICAgICAgIHV1aWQ6IHRoaXMuZHVtcC52YWx1ZS51dWlkLnZhbHVlLCBuYW1lOiBcInVwZGF0ZURhdGFcIixcclxuICAgICAgICAgICAgYXJnczogW3RoaXMuJC5rZXkudmFsdWUsIHN0cl1cclxuICAgICAgICB9KTtcclxuICAgICAgICBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdzb2Z0LXJlbG9hZCcpO1xyXG4gICAgICAgIGF3YWl0IEVkaXRvci5NZXNzYWdlLnNlbmQoJ3NjZW5lJywgJ3JlZnJlc2gtc2NlbmUnKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbn0iXX0=