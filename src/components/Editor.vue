<script>
export default {
  props: ['card', 'readonly'],
  computed: {
    keyValues() {
      let keyValues = []
      for (let key in this.card) {
        if (key.match(/Texts$/)) {
          keyValues.push({
            key,
            value: this.card[key],
          })
        }
      }
      return keyValues
    },
  },
  methods: {
    onfocus(event) {
      if (this.readonly) {
        event.target.select()
      }
    },
  },
}
</script>

<template>
  <section :class="$style.editor">
    <label>
      <span>name:</span>
      <input
        type="text"
        :readonly="readonly"
        v-model="card.name"
        @focus="onfocus">
    </label>
    <div v-for="keyValue in keyValues">
      <div>{{ keyValue.key }}:</div>
      <textarea
        v-for="(text, index) in keyValue.value"
        :readonly="readonly"
        rows="4"
        v-model="keyValue.value[index]"
        @focus="onfocus">
      </textarea>
    </div>
  </section>
</template>

<style module>
.editor {
  & input,
  & textarea {
    display: block;
    box-sizing: border-box;
    width: 95%;
    margin-bottom: .5em;
  }
  & textarea {
    resize: vertical;
  }
}
</style>
