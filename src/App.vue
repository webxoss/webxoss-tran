<script>
import { $get } from './js/utils.js'
import Editor from './components/Editor.vue'
export default {
  name: 'App',
  components: {
    Editor,
  },
  data: () => ({
    loading: true,
    error: false,
    CardInfo: null,
    CardInfo_en: null,

    refer: 'jp',
    lang: '',
    pidInput: 1,
    translation: {},
  }),
  computed: {
    pid() {
      if (this.CardInfo[this.pidInput]) {
        return this.pidInput
      }
      return 1
    },
    card() {
      let CardInfo = {
        jp: this.CardInfo,
        en: this.CardInfo_en,
      }[this.refer] || this.CardInfo
      return CardInfo[this.pid] || this.CardInfo[this.pid]
    },
    translatingCard() {
      if (!this.card) return null
      if (!this.translation[this.pid]) {
        let info = {
          pid: this.card.pid,
          wxid: this.card.wxid,
        }
        Object.keys(this.card)
        .filter(prop => prop.match(/Texts$/))
        .forEach(prop => {
          info[prop] = this.card[prop].map(() => '')
        })
        this.$set(this.translation, this.pid, info)
      }
      return this.translation[this.pid]
    },
    src() {
      return 'https://webxoss.com/images/' + `0000${this.pid}`.slice(-4) + '.jpg'
    },
    fileUrl() {
      let json = JSON.stringify(this.translation)
      let url = `data:application/octet-stream;base64,${btoa(unescape(encodeURIComponent(json)))}`
      return url
    },
  },
  watch: {
    refer() {
      this.save()
    },
    lang() {
      this.save()
    },
    pidInput() {
      this.save()
    },
    translation: {
      deep: true,
      handler() {
        this.save()
      },
    },
  },
  methods: {
    get: $get,
    save() {
      localStorage.setItem('WEBXOSS|translate', JSON.stringify({
        refer: this.refer,
        lang: this.lang,
        pidInput: this.pidInput,
        translation: this.translation,
      }))
    },
    load() {
      try {
        let data = JSON.parse(localStorage.getItem('WEBXOSS|translate'))
        if (data) {
          this.refer = data.refer
          this.lang = data.lang
          this.pidInput = data.pidInput
          this.translation = data.translation
        }
      } catch (e) {}
    },
    loadData() {
      this.loading = true
      return $get('./static/CardInfo.json')
      .then(CardInfo => {
        this.CardInfo = Object.freeze(CardInfo)
        return $get('./static/CardInfo_en.json')
      })
      .then(CardInfo_en => {
        this.CardInfo_en = Object.freeze(CardInfo_en)
        this.loading = false
      })
      .catch(error => {
        this.loading = false
        this.error = true
        console.error(error)
      })
    },
    importFile(event) {
      let file = event.target.files[0]
      if (!file) {
        return
      }
      let reader = new FileReader()
      reader.onload = () => {
        try {
          this.translation = JSON.parse(reader.result)
        } catch (e) {}
      }
      reader.readAsText(file)
    },
  },
  created() {
    this.load()
    this.loadData()
  },
}
</script>

<template>
  <div>
    <h1 :class="$style.title">WEBXOSS | Translate</h1>
    <main :class="$style.main" v-if="!loading && !error">
      <div :class="$style.toolbar">
        <label>
          <span>From</span>
          <select v-model="refer">
            <option value="jp">Japanese</option>
            <option value="en">English</option>
          </select>
        </label>
        <label>
          <span>To</span>
          <input v-model="lang" type="text" maxlength="20" placeholder="Your language">
        </label>
        <span :class="$style.fileInputContainer">
          <button>import</button>
          <input :class="$style.fileInput" @change="importFile" type="file">
        </span>
        <a :href="fileUrl" :download="(lang || 'translation') + '.json'"><button>Export</button></a>
      </div>
      <label>pid: <input :class="[pid !== pidInput ? $style.invalid : '']" v-model.number="pidInput" type="number" min="1"></label>
      <div>wxid: {{ card.wxid }}</div>
      <div :class="$style.columns" v-if="card">
        <section :class="$style.info">
          <img :class="$style.image" :src="src" :alt="card.name" :title="card.name">
        </section>
        <Editor :class="$style.editor" :card="card" :readonly="true"></Editor>
        <Editor :class="$style.editor" :card="translatingCard"></Editor>
      </div>
    </main>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Failed to load. Please <a href=".">refresh</a>. :(</div>
  </div>
</template>

<style src="./common.css"></style>
<style module>
.title {
  margin: .5em 0 0 0;
}
.title {
  text-align: center;
}
.toolbar {
  text-align: center;
}
.main {
  max-width: 60em;
  margin: auto;
}
.columns {
  display: flex;
}
.image {
  width: 15em;
}
.editor {
  flex: 1;
  padding-left: 2em;
}
.invalid {
  color: red;
  background-color: yellow;
}
.fileInputContainer {
  position: relative;
}
.fileInput {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
