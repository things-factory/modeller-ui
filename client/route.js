export default function route(page) {
  switch (page) {
    case 'modeller-ui-main':
      import('./pages/main')
      return page
  }
}
