"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
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
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
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
        onLanguageChanged(args) {
            console.log('index 收到语言切换广播：', args);
        }
    },
    ready() {
        var _a, _b, _c, _d;
        this.$.loadBtn.disabled = true;
        (_a = this.$.txtResPath) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
            this.$.loadBtn.disabled = false;
        });
        (_b = this.$.imageResPath) === null || _b === void 0 ? void 0 : _b.addEventListener('change', () => {
            this.$['loadBtn'].disabled = false;
        });
        (_c = this.$.loadBtn) === null || _c === void 0 ? void 0 : _c.addEventListener('confirm', () => {
            this.$['loadBtn'].disabled = true;
            const ImagePath = this.$.imageResPath.value.trim();
            const resPath = this.$.txtResPath.value.trim();
            console.log(`资源路径为:txtPath:${resPath}  imagePath:${ImagePath}`);
            Editor.Message.send('game-framwork', 'load-Json-Data', { txtPath: resPath, imagePath: ImagePath });
        });
        (_d = this.$.applyBtn) === null || _d === void 0 ? void 0 : _d.addEventListener('confirm', () => {
            console.log(`langSelect:${this.$.langSelect.value}`);
            Editor.Message.broadcast('game-framwork:updateLanguage', {
                language: this.$.langSelect.value
            });
        });
    },
    beforeClose() {
    },
    close() { },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx1Q0FBd0M7QUFDeEMsK0JBQTRCO0FBQzVCOzs7R0FHRztBQUNILHlGQUF5RjtBQUN6RixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMvRixLQUFLLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUN4RixDQUFDLEVBQUU7UUFDQyxVQUFVLEVBQUUsYUFBYTtRQUN6QixZQUFZLEVBQUUsZUFBZTtRQUM3QixPQUFPLEVBQUUsV0FBVztRQUNwQixRQUFRLEVBQUUsWUFBWTtRQUN0QixVQUFVLEVBQUUsY0FBYztLQUM3QjtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUs7UUFFTCxDQUFDO1FBQ0QsaUJBQWlCLENBQUMsSUFBUztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUM7S0FDSjtJQUNELEtBQUs7O1FBQ0EsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUE2QixDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdEQsTUFBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsMENBQUUsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUM5QyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQTZCLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLDBDQUFFLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDaEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQXVCLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLDBDQUFFLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDNUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQXVCLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN6RCxNQUFNLFNBQVMsR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQWlDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pFLE1BQU0sT0FBTyxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBK0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsT0FBTyxlQUFlLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDaEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN2RyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLDBDQUFFLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFlLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBZ0MsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLDhCQUE4QixFQUFFO2dCQUNyRCxRQUFRLEVBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFnQyxDQUFDLEtBQUs7YUFDM0QsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsV0FBVztJQUVYLENBQUM7SUFDRCxLQUFLLEtBQUssQ0FBQztDQUNkLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElOb2RlIH0gZnJvbSAnQGNvY29zL2NyZWF0b3ItdHlwZXMvZWRpdG9yL3BhY2thZ2VzL3NjZW5lL0B0eXBlcy9wdWJsaWMnO1xyXG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcy1leHRyYSc7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuLyoqXHJcbiAqIEB6aCDlpoLmnpzluIzmnJvlhbzlrrkgMy4zIOS5i+WJjeeahOeJiOacrOWPr+S7peS9v+eUqOS4i+aWueeahOS7o+eggVxyXG4gKiBAZW4gWW91IGNhbiBhZGQgdGhlIGNvZGUgYmVsb3cgaWYgeW91IHdhbnQgY29tcGF0aWJpbGl0eSB3aXRoIHZlcnNpb25zIHByaW9yIHRvIDMuM1xyXG4gKi9cclxuLy8gRWRpdG9yLlBhbmVsLmRlZmluZSA9IEVkaXRvci5QYW5lbC5kZWZpbmUgfHwgZnVuY3Rpb24ob3B0aW9uczogYW55KSB7IHJldHVybiBvcHRpb25zIH1cclxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3IuUGFuZWwuZGVmaW5lKHtcclxuICAgIGxpc3RlbmVyczoge1xyXG4gICAgICAgIHNob3coKSB7IGNvbnNvbGUubG9nKCdzaG93Jyk7IH0sXHJcbiAgICAgICAgaGlkZSgpIHsgY29uc29sZS5sb2coJ2hpZGUnKTsgfSxcclxuICAgIH0sXHJcbiAgICB0ZW1wbGF0ZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3RlbXBsYXRlL2RlZmF1bHQvaW5kZXguaHRtbCcpLCAndXRmLTgnKSxcclxuICAgIHN0eWxlOiByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9zdGF0aWMvc3R5bGUvZGVmYXVsdC9pbmRleC5jc3MnKSwgJ3V0Zi04JyksXHJcbiAgICAkOiB7XHJcbiAgICAgICAgdHh0UmVzUGF0aDogJyN0eHRSZXNQYXRoJyxcclxuICAgICAgICBpbWFnZVJlc1BhdGg6ICcjaW1hZ2VSZXNQYXRoJyxcclxuICAgICAgICBsb2FkQnRuOiAnI2xvYWQtYnRuJyxcclxuICAgICAgICBhcHBseUJ0bjogJyNhcHBseS1idG4nLFxyXG4gICAgICAgIGxhbmdTZWxlY3Q6ICcjbGFuZy1zZWxlY3QnLFxyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuICAgICAgICBoZWxsbygpIHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkxhbmd1YWdlQ2hhbmdlZChhcmdzOiBhbnkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2luZGV4IOaUtuWIsOivreiogOWIh+aNouW5v+aSre+8micsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICAodGhpcy4kLmxvYWRCdG4gYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLiQudHh0UmVzUGF0aD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAodGhpcy4kLmxvYWRCdG4gYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kLmltYWdlUmVzUGF0aD8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAodGhpcy4kWydsb2FkQnRuJ10gYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kLmxvYWRCdG4/LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbmZpcm0nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICh0aGlzLiRbJ2xvYWRCdG4nXSBhcyBIVE1MQnV0dG9uRWxlbWVudCkuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBJbWFnZVBhdGggPSAodGhpcy4kLmltYWdlUmVzUGF0aCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZS50cmltKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc1BhdGggPSAodGhpcy4kLnR4dFJlc1BhdGggYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUudHJpbSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg6LWE5rqQ6Lev5b6E5Li6OnR4dFBhdGg6JHtyZXNQYXRofSAgaW1hZ2VQYXRoOiR7SW1hZ2VQYXRofWApO1xyXG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5zZW5kKCdnYW1lLWZyYW13b3JrJywgJ2xvYWQtSnNvbi1EYXRhJywgeyB0eHRQYXRoOiByZXNQYXRoLCBpbWFnZVBhdGg6IEltYWdlUGF0aCB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiQuYXBwbHlCdG4/LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbmZpcm0nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBsYW5nU2VsZWN0OiR7KHRoaXMuJC5sYW5nU2VsZWN0IGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZX1gKTtcclxuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2UuYnJvYWRjYXN0KCdnYW1lLWZyYW13b3JrOnVwZGF0ZUxhbmd1YWdlJywge1xyXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6ICh0aGlzLiQubGFuZ1NlbGVjdCBhcyBIVE1MU2VsZWN0RWxlbWVudCkudmFsdWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgYmVmb3JlQ2xvc2UoKSB7XHJcblxyXG4gICAgfSxcclxuICAgIGNsb3NlKCkgeyB9LFxyXG59KTtcclxuIl19