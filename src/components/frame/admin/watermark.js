let watermark = {}
let isInto = true;
let setWatermark = (text, sourceBody,boolen) => {
    let id = Math.random()*10000+'-'+Math.random()*10000+'/'+Math.random()*10000

    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    let can = document.createElement('canvas')
    can.width = 300
    can.height = 150

    let cans = can.getContext('2d')
    cans.rotate(-20 * Math.PI / 180)
    cans.font = '18px Vedana'
    cans.fillStyle = 'rgba(200, 200, 200, .5)'
    cans.textAlign = 'left'
    cans.rotate(-15 * Math.PI / 180)
    cans.textBaseline = 'Middle'
    cans.fillText(text, can.width / 20, can.height )

    let water_div = document.createElement('div')
    water_div.id = id
    water_div.style.pointerEvents = 'none'
    water_div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    if(isInto || boolen){
       isInto = false;
       if(sourceBody){
           water_div.style.width = '100%'
           water_div.style.height = '100%'
           water_div.style.position = 'absolute'
           water_div.style.top = '0px'
           water_div.style.bottom = '0px'
           water_div.style.left = '0px'
           water_div.style.right = '0px'
           water_div.style.zIndex = '9999'
           sourceBody.appendChild(water_div)
       }else{
           water_div.style.top = '3px'
           water_div.style.left = '0px'
           water_div.style.position = 'a'
           water_div.style.zIndex = '100000'
           water_div.style.width = document.documentElement.clientWidth  + 'px'
           water_div.style.height = document.documentElement.clientHeight  + 'px'
           document.body.appendChild(water_div)
       }
   }


    return id
}

/**
 *  该方法只允许调用一次
 *  @param:
 *  @text == 水印内容
 *  @sourceBody == 水印添加在哪里，不传就是body
 * */
watermark.set = (text, sourceBody,isShow) => {
    let id = setWatermark(text, sourceBody,isShow)
    setInterval(() => {
        if (document.getElementById(id) === null) {
            id = setWatermark(text, sourceBody)
        }
    }, 2000)
    window.onresize = () => {
        setWatermark(text, sourceBody,false)
    }
}

export default watermark