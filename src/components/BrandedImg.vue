<script setup>
import { useBrandedImage } from '../composables/useBrandedImage'

// <img> que recebe a logo da empresa por cima dos veículos (ver src/brand.js)
const props = defineProps({ path: { type: String, required: true } })
const src = useBrandedImage(() => props.path)
</script>

<template>
  <img :src="src">
</template>
