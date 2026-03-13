<template>
  <form-detail :is-edit='false'></form-detail>
</template>

<script>
import FormDetail from './components/setdictionaryDetail'

export default {
  name: 'addForm',
  components: { FormDetail },
  methods: {
    handleSave() {}
  }
}
</script>

