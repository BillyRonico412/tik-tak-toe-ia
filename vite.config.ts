import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
// biome-ignore lint/style/noDefaultExport: Necessary for Vite configuration
export default defineConfig({
	plugins: [viteReact(), tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
})
