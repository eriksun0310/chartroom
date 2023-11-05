module.exports = {
  plugins: [
    // 處理線上編譯壓縮
    require('cssnano')({
      preset: 'default',
    }),
    require('tailwindcss'),
    require('autoprefixer')
  ]
}