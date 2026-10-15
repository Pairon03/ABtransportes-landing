import { createApp } from 'vue'
import App from './App.vue'

// Fontes servidas pelo próprio site (sem depender do Google Fonts).
// Barlow nasceu das placas de estrada e dos ônibus: combina com transporte.
import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/barlow/latin-600.css'
import '@fontsource/barlow/latin-700.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource/barlow-condensed/latin-800.css'
import '@fontsource/barlow-condensed/latin-800-italic.css'

import './assets/main.css'

createApp(App).mount('#app')
