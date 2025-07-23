<template>
  <div class="custom-audio">
    <button class="audio-btn" @click="togglePlay">
      <span v-if="!playing" class="icon">▶</span>
      <span v-else class="icon">⏸</span>
    </button>
    <span class="audio-time">{{ formatTime(currentTime) }}/{{ formatTime(duration) }}</span>
    <div class="audio-slider">
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.1"
        v-model.number="sliderTime"
        @input="onSliderInput"
        @change="onSliderChange"
      />
      <div class="audio-slider-bg">
        <div class="audio-slider-bar" :style="{ width: sliderPercent + '%' }"></div>
      </div>
    </div>
    <!-- 隐藏原生audio -->
    <audio ref="audio" :src="url" style="display:none" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="onEnded" />
  </div>
</template>

<script>
export default {
  name: 'CustomAudio',
  props: {
    url: { type: String, required: true },
  },
  data() {
    return {
      playing: false,
      currentTime: 0,
      duration: 0,
      sliderTime: 0,
      seeking: false,
    };
  },
  computed: {
    sliderPercent() {
      return this.duration ? (this.sliderTime / this.duration) * 100 : 0;
    },
  },
  watch: {
    currentTime(val) {
      if (!this.seeking) this.sliderTime = val;
    },
    url() {
      this.reset();
    },
  },
  methods: {
    togglePlay() {
      const { audio } = this.$refs;
      if (this.playing) {
        audio.pause();
      } else {
        audio.play();
      }
      this.playing = !this.playing;
    },
    onTimeUpdate(e) {
      this.currentTime = e.target.currentTime;
      if (!this.seeking) this.sliderTime = this.currentTime;
    },
    onLoadedMetadata(e) {
      this.duration = e.target.duration;
    },
    onEnded() {
      this.playing = false;
      this.currentTime = 0;
      this.sliderTime = 0;
      if (this.$refs.audio) {
        this.$refs.audio.currentTime = 0;
      }
    },
    onSliderInput(e) {
      this.seeking = true;
      this.sliderTime = parseFloat(e.target.value);
    },
    onSliderChange(e) {
      const { audio } = this.$refs;
      audio.currentTime = parseFloat(e.target.value);
      this.currentTime = audio.currentTime;
      this.seeking = false;
    },
    formatTime(sec) {
      if (!sec && sec !== 0) return '00:00';
      const m = Math.floor(sec / 60)
        .toString()
        .padStart(2, '0');
      const s = Math.floor(sec % 60)
        .toString()
        .padStart(2, '0');
      return `${m}:${s}`;
    },
    reset() {
      this.playing = false;
      this.currentTime = 0;
      this.duration = 0;
      this.sliderTime = 0;
      this.seeking = false;
      if (this.$refs.audio) {
        this.$refs.audio.pause();
        this.$refs.audio.currentTime = 0;
      }
    },
  },
};
</script>

<style scoped>
.custom-audio {
  display: flex;
  align-items: center;
  width: 100%;
}
.audio-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2196f3;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
  cursor: pointer;
  outline: none;
  transition: background 0.2s;
}
.audio-btn:hover {
  background: #42a5f5;
}
.icon {
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.audio-time {
  font-size: 14px;
  color: #444;
  margin-right: 12px;
  min-width: 80px;
}
.audio-slider {
  flex: 1;
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
}
.audio-slider input[type='range'] {
  width: 100%;
  height: 4px;
  background: transparent;
  appearance: none;
  outline: none;
  position: absolute;
  top: 5px;
  left: 0;
  margin: 0;
  z-index: 2;
}
.audio-slider input[type='range']::-webkit-slider-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2196f3;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.2);
  cursor: pointer;
  appearance: none;
}
.audio-slider input[type='range']::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2196f3;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.2);
  cursor: pointer;
}
.audio-slider input[type='range']::-ms-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2196f3;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.2);
  cursor: pointer;
}
.audio-slider input[type='range']::-webkit-slider-runnable-track {
  height: 4px;
  background: transparent;
}
.audio-slider input[type='range']::-ms-fill-lower,
.audio-slider input[type='range']::-ms-fill-upper {
  background: transparent;
}
.audio-slider-bg {
  width: 100%;
  height: 4px;
  background: #eceff1;
  border-radius: 2px;
  position: absolute;
  top: 10px;
  left: 0;
  z-index: 1;
}
.audio-slider-bar {
  height: 4px;
  background: #2196f3;
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
