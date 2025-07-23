// 音乐库模块 API 请求
import uploadMusic from '@/api/app/qiniuUploadMusic';
import request from '@/utils/request';

// 音乐库相关API
export const musicLibraryAPI = {
  // 上传音乐文件到七牛云
  uploadMusicFile: (file, serviceName = 'music', domainPram = 'https://ustatic.hudongmiao.com/') => {
    return new Promise((resolve, reject) => {
      // 检查文件类型 - 支持多种MIME类型和文件扩展名
      const allowedMimeTypes = [
        'audio/mpeg', // MP3的标准MIME类型
        'audio/mp3', // 某些浏览器的MP3 MIME类型
        'audio/wav',
        'audio/ogg',
        'audio/m4a',
        'audio/aac',
        'audio/x-m4a', // 某些系统的M4A MIME类型
        'audio/mp4', // 某些系统的MP4音频 MIME类型
      ];

      const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];

      // 检查MIME类型
      const isValidMimeType = allowedMimeTypes.includes(file.type);

      // 检查文件扩展名
      const fileName = file.name.toLowerCase();
      const isValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

      if (!isValidMimeType && !isValidExtension) {
        reject(new Error('不支持的音乐文件格式，请上传 MP3、WAV、OGG、M4A 或 AAC 格式'));
        return;
      }

      // 检查文件大小 (限制为 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        reject(new Error('音乐文件大小不能超过 50MB'));
        return;
      }

      // 使用七牛云上传音频文件（不压缩）
      uploadMusic(file, serviceName, 1, domainPram)
        .then((res) => {
          resolve({
            success: true,
            data: {
              fileUrl: res.key,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              uploadTime: new Date().toISOString(),
            },
          });
        })
        .catch((err) => {
          reject(new Error(`音乐文件上传失败: ${err.message}`));
        });
    });
  },

  // 新增：上传音乐文件并可选择同步到音乐库/收藏
  uploadMusicWithSync: (params) => {
    const { splid, url, name, tags = [], duration, syncToLibrary = false, syncToFavorites = false } = params;
    return request.post('/api/music/upload', {
      url, // 七牛云返回的音乐地址
      name, // 音乐名称
      tags, // 标签数组字符串，使用逗号分隔
      duration, // 音乐时长
      splid,
      syncToLibrary, // 是否同步到公共音乐库
      syncToFavorites, // 是否同步到我的收藏
    });
  },

  // 获取音乐库列表，支持搜索和标签筛选
  getMusicLibraryList: (params = {}) => {
    const { currentPage = 1, showCount = 10, keyword, tags } = params;
    const queryParams = { currentPage, showCount };
    if (keyword) queryParams.keyword = keyword;
    if (tags) queryParams.tags = tags;
    return request.get('/api/music/library', { params: queryParams });
  },

  // 获取音乐标签列表
  getMusicTags: () => {
    return request.get('/api/music/tags');
  },
};

// 活动播放列表相关API
export const activityPlaylistAPI = {
  // 获取指定活动的播放列表
  getActivityPlaylist: (params = {}) => {
    const { currentPage = 1, showCount = 10, splid } = params;
    const queryParams = { currentPage, showCount };
    if (splid) queryParams.splid = splid;
    return request.get('/api/music/activity', { params: queryParams });
  },

  // 向活动播放列表添加一首歌曲
  addSongToActivityPlaylist: (activityId, musicId) => request.post('/api/music/activity', { musicId, splid: activityId }),

  // 从活动播放列表中删除歌曲
  removeFromActivityPlaylist: (playlistItemId) => request.delete(`/api/music/activity/${playlistItemId}`),

  // 更新播放列表顺序（新版，使用sort参数，POST方式）
  /**
   * 对活动播放列表进行排序
   * @param {string} sort - 音乐ID顺序字符串，多个ID用英文逗号分隔，如："25,22,20,26",这个id是activeId，不是musicId
   * 传递示例：{ sort: "25,22,20,26" }
   * @returns {Promise}
   */
  sortPlaylist: (sort) => request.post('/api/music/order', { sort }),
};

// 收藏相关API
export const favoriteAPI = {
  // 获取收藏列表
  getFavoriteList: (params = {}) => {
    const { currentPage = 1, showCount = 10, keyword, tags } = params;
    const queryParams = { currentPage, showCount };
    if (keyword) queryParams.keyword = keyword;
    if (tags) queryParams.tags = tags;
    return request.get('/api/music/favorites', { params: queryParams });
  },

  // 将音乐库歌曲添加到“我的收藏”
  addToFavorites: (musicId) => request.post('/api/music/favorites', { musicId }),

  // 从“我的收藏”中移除
  removeFavoriteById: (musicId) => request.delete(`/api/music/favorites/${musicId}`),

  // 修改收藏音乐名称
  updateFavoriteName: (musicId, name) => request.put(`/api/music/favorites/${musicId}`, { name }),
};
