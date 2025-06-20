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
    },
    methods: {
        hello() {
        },
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
        });
    },
    beforeClose() { },
    close() { },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvcGFuZWxzL2RlZmF1bHQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBd0M7QUFDeEMsK0JBQTRCO0FBQzVCOzs7R0FHRztBQUNILHlGQUF5RjtBQUN6RixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLFNBQVMsRUFBRTtRQUNQLElBQUksS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFDRCxRQUFRLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMvRixLQUFLLEVBQUUsSUFBQSx1QkFBWSxFQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx5Q0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUN4RixDQUFDLEVBQUU7UUFDQyxVQUFVLEVBQUUsYUFBYTtRQUN6QixZQUFZLEVBQUUsZUFBZTtRQUM3QixPQUFPLEVBQUUsV0FBVztRQUNwQixRQUFRLEVBQUUsWUFBWTtLQUN6QjtJQUNELE9BQU8sRUFBRTtRQUNMLEtBQUs7UUFFTCxDQUFDO0tBQ0o7SUFDRCxLQUFLOztRQUNBLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBNkIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3RELE1BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLDBDQUFFLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDOUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUE2QixDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSwwQ0FBRSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ2hELElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUF1QixDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTywwQ0FBRSxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1lBQzVDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUF1QixDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDekQsTUFBTSxTQUFTLEdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFpQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6RSxNQUFNLE9BQU8sR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQStCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLE9BQU8sZUFBZSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDdkcsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSwwQ0FBRSxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBRWxELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELFdBQVcsS0FBSyxDQUFDO0lBQ2pCLEtBQUssS0FBSyxDQUFDO0NBQ2QsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XHJcbi8qKlxyXG4gKiBAemgg5aaC5p6c5biM5pyb5YW85a65IDMuMyDkuYvliY3nmoTniYjmnKzlj6/ku6Xkvb/nlKjkuIvmlrnnmoTku6PnoIFcclxuICogQGVuIFlvdSBjYW4gYWRkIHRoZSBjb2RlIGJlbG93IGlmIHlvdSB3YW50IGNvbXBhdGliaWxpdHkgd2l0aCB2ZXJzaW9ucyBwcmlvciB0byAzLjNcclxuICovXHJcbi8vIEVkaXRvci5QYW5lbC5kZWZpbmUgPSBFZGl0b3IuUGFuZWwuZGVmaW5lIHx8IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkgeyByZXR1cm4gb3B0aW9ucyB9XHJcbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yLlBhbmVsLmRlZmluZSh7XHJcbiAgICBsaXN0ZW5lcnM6IHtcclxuICAgICAgICBzaG93KCkgeyBjb25zb2xlLmxvZygnc2hvdycpOyB9LFxyXG4gICAgICAgIGhpZGUoKSB7IGNvbnNvbGUubG9nKCdoaWRlJyk7IH0sXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGU6IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3N0YXRpYy90ZW1wbGF0ZS9kZWZhdWx0L2luZGV4Lmh0bWwnKSwgJ3V0Zi04JyksXHJcbiAgICBzdHlsZTogcmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vc3RhdGljL3N0eWxlL2RlZmF1bHQvaW5kZXguY3NzJyksICd1dGYtOCcpLFxyXG4gICAgJDoge1xyXG4gICAgICAgIHR4dFJlc1BhdGg6ICcjdHh0UmVzUGF0aCcsXHJcbiAgICAgICAgaW1hZ2VSZXNQYXRoOiAnI2ltYWdlUmVzUGF0aCcsXHJcbiAgICAgICAgbG9hZEJ0bjogJyNsb2FkLWJ0bicsXHJcbiAgICAgICAgYXBwbHlCdG46ICcjYXBwbHktYnRuJyxcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgaGVsbG8oKSB7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcmVhZHkoKSB7XHJcbiAgICAgICAgKHRoaXMuJC5sb2FkQnRuIGFzIEhUTUxCdXR0b25FbGVtZW50KS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy4kLnR4dFJlc1BhdGg/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcclxuICAgICAgICAgICAgKHRoaXMuJC5sb2FkQnRuIGFzIEhUTUxCdXR0b25FbGVtZW50KS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuJC5pbWFnZVJlc1BhdGg/LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcclxuICAgICAgICAgICAgKHRoaXMuJFsnbG9hZEJ0biddIGFzIEhUTUxCdXR0b25FbGVtZW50KS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuJC5sb2FkQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjb25maXJtJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAodGhpcy4kWydsb2FkQnRuJ10gYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc3QgSW1hZ2VQYXRoID0gKHRoaXMuJC5pbWFnZVJlc1BhdGggYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUudHJpbSgpO1xyXG4gICAgICAgICAgICBjb25zdCByZXNQYXRoID0gKHRoaXMuJC50eHRSZXNQYXRoIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLnRyaW0oKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYOi1hOa6kOi3r+W+hOS4ujp0eHRQYXRoOiR7cmVzUGF0aH0gIGltYWdlUGF0aDoke0ltYWdlUGF0aH1gKTtcclxuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2Uuc2VuZCgnZ2FtZS1mcmFtd29yaycsICdsb2FkLUpzb24tRGF0YScsIHsgdHh0UGF0aDogcmVzUGF0aCwgaW1hZ2VQYXRoOiBJbWFnZVBhdGggfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kLmFwcGx5QnRuPy5hZGRFdmVudExpc3RlbmVyKCdjb25maXJtJywgKCkgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBiZWZvcmVDbG9zZSgpIHsgfSxcclxuICAgIGNsb3NlKCkgeyB9LFxyXG59KTtcclxuIl19