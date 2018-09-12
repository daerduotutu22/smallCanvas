//index.js
//获取应用实例
const app = getApp()
var ctx = null;
var isButtonDown = false;//是否在绘制中

var brush_or_eraser = 'brush';
var r = 10;
var startX = 0,startY = 0;

Page({
  data: {
    canvasWidth:0,
    canvasHeight:0,
    pen:{
      lineWidth:10,
      color:'red'
    }
  },
  initCanvas:function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          'canvasWidth': res.windowWidth,
          'canvasHeight': res.windowHeight - 50
        })
      },
    })
    ctx = wx.createCanvasContext('myCanvas');
    ctx.beginPath();
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth);
  },
  canvasStart:function(event){
    startX = event.changedTouches[0].x;
    startY = event.changedTouches[0].y;

    if (brush_or_eraser == 'brush'){
      isButtonDown = true; //表示正在绘画中
    }else{
      ctx.setFillStyle('lightcyan');
      ctx.save();
      ctx.beginPath();
      ctx.arc(event.changedTouches[0].x, event.changedTouches[0].y, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.draw(true);
      ctx.restore();
    }

  },
  canvasMove: function (event){
    var startX1 = event.changedTouches[0].x;
    var startY1 = event.changedTouches[0].y;

    if (brush_or_eraser == 'brush'){
      if (isButtonDown) {
        ctx.setStrokeStyle(this.data.pen.color);
        ctx.setLineWidth(this.data.pen.lineWidth);
      };


    }else{
      ctx.setStrokeStyle('lightcyan');
      ctx.setLineWidth(20);
     
    }
    ctx.save();
    
    ctx.moveTo(startX, startY);  //把路径移动到画布中的指定点，但不创建线条
    ctx.lineTo(startX1, startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
    ctx.stroke();  //对当前路径进行描边

    ctx.draw(true);
    ctx.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息

    startX = startX1;
    startY = startY1;
  },

  canvasEnd: function (event){
    if (brush_or_eraser == 'brush'){
      isButtonDown = false;
    }
  },
  changeBrush:function(){
    brush_or_eraser = 'brush';
  },
  changeEraser:function(){
    brush_or_eraser = 'eraser';
  },
  clearAll:function(){
    
    ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    ctx.draw();
  },
  changeBrushThickness:function(e){
    this.setData({
      'pen.lineWidth':e.currentTarget.dataset.thickness
    })
  },
  changeBrushColor:function(e){
    this.setData({
      'pen.color': e.currentTarget.dataset.color
    })
  },
  onLoad: function () {
    this.initCanvas();
  }
})
