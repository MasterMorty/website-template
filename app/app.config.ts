export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'neutral',
    },
    dashboardSidebar: {
      slots: {
        root: 'transition-all duration-400 ease-in-out',
      }
    }
  }
})