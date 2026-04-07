export default {
  pages: [
    'pages/index/index',
    'pages/temples/list/index',
    'pages/temples/detail/index',
    'pages/incense/index/index'
  ],
  subPackages: [
    {
      root: 'packageMap',
      pages: ['pages/map/index', 'pages/map/province/index']
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Temple',
    navigationBarTextStyle: 'black'
  }
}
