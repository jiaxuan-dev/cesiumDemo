const TiandituMapsStyleUrl = {}
const TiandituMapsStyleLayer = {}
const TiandituMapsStyleID = {}
const TiandituMapsStyleFormat = {}
const TiandituMapsStyleEPSG = {}
const TiandituMapsStyleLabels = {}
/**
 * @module 天地图底图服务
 * @author HXL
 * @description 基于WebMapTileServiceImageryProvider封装相关参数
 * */
class TiandituImageryProvider {
  constructor(options) {
    Object.keys(TiandituMapsStyle).forEach(key => {
      TiandituMapsStyleUrl[TiandituMapsStyle[key]] = 'http://{s}.tianditu.gov.cn/' + TiandituMapsStyle[key] + '/wmts?service=wmts'
      TiandituMapsStyleLayer[TiandituMapsStyle[key]] = TiandituMapsStyle[key].slice(0, 3)
      TiandituMapsStyleID[TiandituMapsStyle[key]] = TiandituMapsStyle[key].slice(4)
      TiandituMapsStyleFormat[TiandituMapsStyle[key]] = 'tiles'

      if (TiandituMapsStyleID[TiandituMapsStyle[key]] === 'w') {
        TiandituMapsStyleEPSG[TiandituMapsStyle[key]] = '900913' // 墨卡托投影坐标系
      } else {
        TiandituMapsStyleEPSG[TiandituMapsStyle[key]] = '4490' // 经纬度坐标系
      }
      switch (TiandituMapsStyle[key]) {
        case 'img_w':
        case 'img_c':
        case 'cia_w':
        case 'cia_c':
        case 'cta_w':
        case 'cta_c':
          TiandituMapsStyleLabels[TiandituMapsStyle[key]] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
          break
        case 'vec_w':
        case 'vec_c':
        case 'cva_w':
        case 'cva_c':
          TiandituMapsStyleLabels[TiandituMapsStyle[key]] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
          break
        case 'ter_w':
        case 'ter_c':
          TiandituMapsStyleLabels[TiandituMapsStyle[key]] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
          break
        case 'eia_w':
        case 'eia_c':
        case 'eva_w':
        case 'eva_c':
          TiandituMapsStyleLabels[TiandituMapsStyle[key]] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
          break
      }
    })
    const {
      defaultValue,
      WebMercatorTilingScheme,
      GeographicTilingScheme
    } = Cesium;
    this.m_token = options.token
    this.m_mapStyle = defaultValue(options.mapStyle, TiandituMapsStyle.IMG_W);
    this.m_layer = defaultValue(options.layer, TiandituMapsStyleLayer[this.m_mapStyle])
    this.m_style = defaultValue(options.style, 'default')
    this.m_tileMatrixSetID = defaultValue(options.tileMatrixSetID, TiandituMapsStyleID[this.m_mapStyle])
    this.m_tileMatrixLabels = defaultValue(options.tileMatrixLabels, TiandituMapsStyleLabels[this.m_mapStyle])
    this.m_format = defaultValue(options.format, TiandituMapsStyleFormat[this.m_mapStyle])
    this.m_epsgCode = TiandituMapsStyleEPSG[this.m_mapStyle]
    this.m_tilingScheme = this.m_epsgCode === '900913' ? new WebMercatorTilingScheme() : new GeographicTilingScheme()
    this.m_tileWidth = defaultValue(options.tileWidth, 256)
    this.m_tileHeight = defaultValue(options.tileHeight, 256)
    this.m_minimumLevel = defaultValue(options.minimumLevel, 1)
    this.m_maximumLevel = defaultValue(options.maximumLevel, TiandituMapsStyleLabels[this.m_mapStyle].length)
    this.m_subdomains = defaultValue(options.subdomains, ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'])
    this.m_url = TiandituMapsStyleUrl[this.m_mapStyle] + '&request=GetTile&version=1.0.0' + '&LAYER=' + this.m_layer + '&style=' + this.m_style + '&tileMatrixSet=' + this.m_tileMatrixSetID + '&format=' + this.m_format + '&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' + '&tk=' + this.m_token;
    // http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&tk=您的密钥
  };

  initImagery() {
    const para = {
      credit: new Cesium.Credit('Tianditu-' + this.m_mapStyle),
      url: this.m_url,
      layer: this.m_layer,
      style: this.m_style,
      format: this.m_format,
      tileMatrixSetID: this.m_tileMatrixSetID,
      subdomains: this.m_subdomains,
      tilingScheme: this.m_tilingScheme,
      // tileMatrixLabels: this.m_tileMatrixLabels,
      minimumLevel: this.m_minimumLevel,
      maximumLevel: this.m_maximumLevel
    }
    if (this.m_tileMatrixSetID === 'c') {
      Object.assign(para, {
        tileMatrixLabels: this.m_tileMatrixLabels
      })
    }

    return new Cesium.WebMapTileServiceImageryProvider(para)
  }
}
const TiandituMapsStyle = {
  IMG_W: 'img_w', // 影像底图 球面墨卡托投影
  IMG_C: 'img_c', // 影像底图 经纬度投影
  CIA_W: 'cia_w', // 影像注记 球面墨卡托投影
  CIA_C: 'cia_c', // 影像注记 经纬度投影
  VEC_W: 'vec_w', // 矢量底图 球面墨卡托投影
  VEC_C: 'vec_c', // 矢量底图 经纬度投影
  TER_W: 'ter_w', // 地形晕渲
  TER_C: 'ter_c',
  CVA_W: 'cva_w', // 矢量注记 球面墨卡托投影
  CVA_C: 'cva_c', // 矢量注记 经纬度投影
  CTA_W: 'cta_w', // 地形注记
  CTA_C: 'cta_c',
  EIA_W: 'eia_w',
  EIA_C: 'eia_c',
  EVA_W: 'eva_w',
  EVA_C: 'eva_c'
}
export default TiandituImageryProvider
