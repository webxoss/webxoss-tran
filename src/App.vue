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
    pid: 1,
    translation: {},
  }),
  computed: {
    card() {
      let CardInfo = {
        jp: this.CardInfo,
        en: this.CardInfo_en,
      }[this.refer] || this.CardInfo
      return CardInfo[this.pid] || null
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
  },
  methods: {
    get: $get,
    loadData() {
      this.loading = true
      return $get('/static/CardInfo.json')
      .then(CardInfo => {
        this.CardInfo = Object.freeze(CardInfo)
        return $get('/static/CardInfo_en.json')
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
  },
  created() {
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
        <!-- <input type="file"> -->
        <button>Export</button>
      </div>
      <label>pid: <input v-model.number="pid" type="number"></label>
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
</style>
