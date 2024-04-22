import {defineConfig} from 'vite'
import tailwindcss from 'tailwindcss';

export default defineConfig({
    plugins: [tailwindcss],
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                tarif: 'tarif.html',
                cabinet: 'cabinet.html',
                auth: 'auth.html',
            },
        }
    }
})
