// 定时任务封装
export const timeoutTask = (task, time) => {
  const tmpTimeout = setTimeout(() => {
    task();
    clearTimeout(tmpTimeout);
  }, time);
};

// 判断url是http还是https
export const judgeIsHttps = () => (window.location.protocol === 'https:' ? '1' : '0');
/* eslint-disable */
// 判断是否在Iframe中打开
export const isIframeEnv = () => {
  let tmpFlag = false;
  if (self != top) {
    tmpFlag = true;
  }
  console.log('判断是否是桌面应用程序打开', tmpFlag);
  return tmpFlag;
};

// 生成随机id(随机字母加当前时间戳构成)
export const generateRandomId = (pLen) => {
  let tmpId = '';
  const charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
  const tmpLen1 = charStr.length;
  const tmplen2 = pLen || 6; // 生成的id字母部分的长度，默认长度为6
  for (let i = 0; i < tmplen2; i += 1) {
    tmpId += charStr.charAt(Math.floor(Math.random() * tmpLen1));
  }
  tmpId += new Date().getTime();
  return tmpId;
};

// 图片压缩
export const compressImage = (key, file) => {
  return new Promise((resolve, reject) => {
    const compressConfig = getImageCompressionConfigByKey(key);
    // 不执行压缩逻辑
    if (!compressConfig || String(compressConfig.ratio) === '0') {
      reject();
      return;
    }
    // 执行压缩逻辑
    const maxWidth = compressConfig.maxWidth;
    const maxHeight = compressConfig.maxHeight;
    const quality = compressConfig.ratio;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function() {
        let width = img.width;
        let height = img.height;
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(width / aspectRatio);
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height * aspectRatio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          function(blob) {
            // 从Blob创建一个新的File对象
            const compressedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality,
        );
      };
      img.onerror = function() {
        reject();
      };
    };
    reader.onerror = function() {
      reject();
    };
  });
};

// 获取缓存中的图片压缩配置
export const getImageCompressionConfigByKey = (key) => {
  let config = null;
  // 所有情况的默认值
  const DEFAULTVALUES = [
    {
      maxWidth: 1920,
      maxHeight: 1080,
      ratio: 0.7,
    },
    {
      maxWidth: 750,
      maxHeight: 1334,
      ratio: 0.7,
    },
    {
      maxWidth: 500,
      maxHeight: 400,
      ratio: 0.7,
    },
  ];

  // type和默认值的映射关系
  const TYPE_DEFAULTVAALUE_MAP = {
    screen: DEFAULTVALUES[0],
    h5: DEFAULTVALUES[1],
    mpCover: DEFAULTVALUES[1],
    mpCard: DEFAULTVALUES[2],
  };
  const imageCompressConfigStr = localStorage.getItem('imageCompressConfig');
  if (imageCompressConfigStr) {
    const imageCompressConfigObj = JSON.parse(imageCompressConfigStr);
    config = imageCompressConfigObj[key] ? imageCompressConfigObj[key] : null;
  } else if (TYPE_DEFAULTVAALUE_MAP[key]) {
    config = TYPE_DEFAULTVAALUE_MAP[key];
  }
  return config;
};
