//建立客户端实例
    var MQTT = function(options) {
      var defaultOptions = {
        hostname: 'dockerbd.meiflower.top',
        port: 8083,
        ssl: false,
        timeout: 5,
        keepAlive: 100,
        cleanSession: false,
        productTopic: '/World',
        consumerTopic: '/Wx',
        userName: "admin",
        password: "public",
        clientId:"",
        listenSelf:false//当前客户端是否监听自己发出的消息
      };
      this.config = Object.assign({},defaultOptions, options);
      this.client = null;
    //回调函数
     this.initCallback = null;
     this.initConnectCallBack = null;
    }

    /**
     * 创建连接
     */
    MQTT.prototype.onConnect=function(connectcallBack,callBack){
      if (typeof connectcallBack === 'function') {
        this.initConnectCallBack =connectcallBack;
      }
      if (typeof callBack === 'function') {
        this.initCallback = callBack;
      }
      //如果连接已经存在，就不再连接
      if(this.client!=null && this.client.isConnected()){
        this.initConnectCallBack(this.client);
        return;
      }
      this.config.clientId = this.guid();
      this.client = new Paho.MQTT.Client(this.config.hostname, this.config.port, this.config.clientId);
      var options = {
        invocationContext: {
          host: this.config.hostname,
          port: this.config.port,
          path: this.client.path,
          clientId: this.config.clientId
        },
        timeout: this.config.timeout,
        keepAliveInterval: this.config.keepAlive,
        cleanSession: this.config.cleanSession,
        useSSL: this.config.ssl,
        userName: this.config.userName,
        password: this.config.password,
        onSuccess: this.onSubscribe.bind(this),
        onFailure: function (e) {
          console.log(e);
          s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onFailure()}";
          console.log(s);
        }
      };
      this.client.connect(options);
      this.client.onConnectionLost = this.onConnectionLost.bind(this);
      //注册连接断开处理事件
      this.client.onMessageArrived = this.onMessageArrived.bind(this);
      window.client = this.client;
    }
//订阅主题
    MQTT.prototype.onSubscribe=function() {
      console.log("连接成功,订阅："+this.config.consumerTopic)
      this.client.subscribe(this.config.consumerTopic);
      //执行回调函数
      if(typeof this.initConnectCallBack === 'function'){
        this.initConnectCallBack(this.client);
      }
    }
//关闭连接
    MQTT.prototype.onDisconnect=function(){
      console.log("断开连接");
      this.client.disconnect();

    }


//注册消息接收处理事件
    MQTT.prototype.onConnectionLost=function(responseObject) {
      console.log("断开连接");
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        console.log("连接已断开");
        console.log("开始重连");
        this.onConnect(this.initConnectCallBack ,this.initCallback);
      }
    }

    /**
     * 监听消息
     * @param message
     */
    MQTT.prototype.onMessageArrived=function(message) {
      if(this.config.listenSelf){
        //监听当前客户端发出的消息
        if(typeof this.initCallback === 'function'){
          //执行回调函数
          this.initCallback(message.payloadString,this.client);
        }
      }else{
        //不监听当前客户端发出的消息
        if(message.destinationName!=this.config.productTopic){
          if(typeof this.initCallback === 'function'){
            //执行回调函数
            this.initCallback(message.payloadString,this.client);
          }
        }
      }
    }

    /**
     * 发送消息
     */
    MQTT.prototype.send=function(msg) {
      if (Power.isNotNull(msg)) {
        message = new Paho.MQTT.Message(msg);
        message.destinationName = this.config.productTopic;
        if(this.client!=null && this.client.isConnected()){
          console.log(this.config.productTopic+"发送消息："+msg)
          this.client.send(message);
        }else{
          this.onConnect(this.initConnectCallBack ,this.initCallback);
        }

      }
    }
    //用于生成uuid
  MQTT.prototype.S4=function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
  MQTT.prototype.guid=function() {
      return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
    }
export default MQTT;
