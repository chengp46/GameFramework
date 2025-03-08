/** 数组工具 */
export class ArrayUtil {
    /**
     * 数组去重，并创建一个新数组返回
     * @param arr  源数组
     * console.log(ArrayUtils.noRepeated([1, 2, 2, 3, 4, 4, 5])); // 输出: [1, 2, 3, 4, 5]
     * const objArr = [ { id: 1, name: "Alice" }, { id: 2, name: "Bob" }, { id: 1, name: "Alice" }, ];
     * console.log(ArrayUtils.noRepeated(objArr, "id")); // 输出: [ { id: 1, name: "Alice" }, { id: 2, name: "Bob" },]
     */
    static noRepeated<T>(arr: T[], key?: keyof T): T[] {
        if (!key) {
            return [...new Set(arr)];
        }
        return [...new Map(arr.map(item => [item[key], item])).values()];
    }

    /**
     * 复制二维数组 适用与基础类型（浅拷贝）
     * @param array 目标数组 
     */
    static copy2DArray<T>(array: T[][]): T[][] {
        return array.map(row => row.slice());
    }

    /**
     * 复制二维数组 适用与基础类型（适用于对象数组）
     * @param array 目标数组 
     */
    static deepCopy2DArray<T>(array: T[][]): T[][] {
        return array.map(row => row.map(item => structuredClone(item)));
    }

    /**
     * Fisher-Yates Shuffle 随机置乱算法
     * @param array 目标数组
     */
    static shuffle<T>(arr: T[]): T[] {
        let newArr = arr.slice(); // 复制数组，避免修改原数组
        for (let i = newArr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // 交换位置
        }
        return newArr;
    }

    /** 删除数组中指定项 */
    static removeItem<T>(array: T[], value: T) {
        return array.filter(item => item !== value);
    }

    /**
     * 合并数组
     * @param array1 目标数组1
     * @param array2 目标数组2
     */
    static combineArrays(array1: any[], array2: any[]): any[] {
        return [...array1, ...array2];
    }

    /**
     * 获取随机数组成员
     * @param array 目标数组
     */
    static getRandomValueInArray(array: any[]): any {
        return array[Math.floor(Math.random() * array.length)];
    }
}
