/**
 * 日志管理器
 * 用于统一日志输出格式
 */
export class LogManager {

    private static createLogger(method: 'log' | 'debug' | 'info' | 'warn' | 'error', level: string, color: string): (...args: any[]) => void {
        return window.console[method].bind(
            window.console,
            `%c【${level}】`,
            `color: white; background-color: ${color}; font-weight: bold; font-size: 14px;`
        );
    }

    /** 用于输出调试信息 */
    static debug = LogManager.createLogger('log', '调试', '#007BFF');

    /** 用于输出一般信息 */
    static info = LogManager.createLogger('info', '信息', '#28A745');

    /** 用于输出警告信息 */
    static warn = LogManager.createLogger('warn', '警告', '#FFC107');

    /** 用于输出错误信息 */
    static err = LogManager.createLogger('error', '错误', '#DC3545');

    /**
     * 输出框架版本信息
     */
    static version(ver: string, date: string) {
        const styles = [
            "background: #fd6623; padding:5px 0; border: 5px;",
            "background: #272c31; color: #fafafa; padding:5px 0;",
            "background: #39a3e4; padding:5px 0;",
            "background: #ffffff; color: #000000; padding:5px 0;"
        ];

        const message = `%c    %c    cocos小白框架 ${ver} ${date}    %c    %c`;

        window.console.log(message, ...styles);
    }
}

