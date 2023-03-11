import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
	plugins: [sveltekit(),viteCommonjs()],
	optimizeDeps:{
		esbuildOptions:{
		  plugins:[
			esbuildCommonjs(['moment']) 
		  ]
		}
	  }
});
