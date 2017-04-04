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
}
</script>

<template>
  <section :class="$style.editor">
    <label>
      <span>name:</span>
      <input type="text" :readonly="readonly" :value="card.name">
    </label>
    <div v-for="keyValue in keyValues">
      <div>{{ keyValue.key }}:</div>
      <textarea
        v-for="text in keyValue.value"
        :value="text"
        :readonly="readonly"
        rows="4">
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
