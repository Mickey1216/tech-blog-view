import dayjs from 'dayjs';
import { ArrayBuffer } from 'spark-md5';

// 定义debounce和throttle的函数类型
type DebounceOrThrottle = <T extends (...args: any) => any>(
  callback: T,
  interval?: number
) => (this: any, ...args: Parameters<T>) => unknown;
// 节流
export const throttle: DebounceOrThrottle = (callback, interval = 1000 / 60) => {
  let pre = 0;
  return function (...args) {
    let now = Date.now();
    if (now - pre > interval) {
      window.requestAnimationFrame(() => {
        pre = now;
        callback.apply(this, args);
      });
    }
  };
};
// 防抖
export const debounce: DebounceOrThrottle = (callback, interval = 1000 / 60) => {
  let timeOut: NodeJS.Timeout;
  return function (...args) {
    timeOut && clearTimeout(timeOut); // 清除之前的定时器
    timeOut = setTimeout(() => {
      window.requestAnimationFrame(() => {
        callback.apply(this, args);
      });
    }, interval);
  };
};

// 1.先将base64转换为blob
export const dataURLtoBlob = (dataStr: string) => {
  let arr = dataStr.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
};
// 2.再将blob转换为file
export const blobToFile = (theBlob: Blob, fileName: string = 'file') => {
  return new File([theBlob], fileName, {
    type: theBlob.type,
    lastModified: Date.now()
  });
};

interface ChangeBufferResolve {
  buffer: globalThis.ArrayBuffer;
  HASH: string;
  suffix: string;
  filename: string;
}
export const changeBuffer = (file: File) => {
  // 生成ArrayBuffer，可配合生成MD5值
  return new Promise<ChangeBufferResolve>((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);

    fr.onload = (ev) => {
      const buffer = ev.target!.result;
      if (!buffer || typeof buffer === 'string') return reject();

      const spark = new ArrayBuffer();
      spark.append(buffer);
      const HASH = spark.end();
      const suffix = getSuffix(file.name);
      return resolve({ buffer, HASH, suffix, filename: `${HASH}.${suffix}` });
    };
  });
};
// 获取后缀名
export const getSuffix = (name: string) => {
  return name.substring(name.lastIndexOf('.') + 1);
};

// 获取文件名
export const articleDateInitHandle = <T extends { createTime: string | Dayjs; updateTime: string | Dayjs; }>(origin: T) => {
  origin.createTime = dayjs(origin.createTime);
  origin.updateTime = dayjs(origin.updateTime);
  return origin;
};
