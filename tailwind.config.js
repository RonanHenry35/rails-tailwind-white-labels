/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    './app/views/**/*.html',
    './app/views/**/*.html.slim',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        "primary-600": "var(--color-primary-600)",
        "primary-700": "var(--color-primary-700)",
      },
      fontFamily: {
        "title-1": "var(--font-title-1)"
      }
    },
  },
}
