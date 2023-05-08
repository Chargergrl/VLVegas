function CAreYouSurePanel(oParentContainer){
    var _iTypeAlert;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oTextBack;
    var _oText;
    var _oButYes;
    var _oButNo;
    var _oListenerDown;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oListenerDown = _oContainer.on("click",function(){});
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oContainer.addChild(oBg);
        
        _oTextBack = new createjs.Text("", "50px " + FONT_GAME, "#000");
        _oTextBack.textAlign = "center";
        _oTextBack.textBaseline = "alphabetic";
        _oTextBack.x = CANVAS_WIDTH/2;
        _oTextBack.y = 200;
        _oTextBack.lineWidth = 460;
        _oTextBack.lineHeight = 48;
        _oTextBack.outline = 2;
        _oContainer.addChild(_oTextBack);
        
        _oText = new createjs.Text("", "50px " + FONT_GAME, "#d7d5d2");
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        _oText.x = CANVAS_WIDTH/2;
        _oText.y = 200;
        _oText.lineWidth = 460;
        _oText.lineHeight = 48;
        _oContainer.addChild(_oText);
        
        _oButYes = new CGfxButton(CANVAS_WIDTH/2 + 170,344,s_oSpriteLibrary.getSprite("but_yes"),_oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP,this._onReleaseYes,this);
        
        _oButNo = new CGfxButton(CANVAS_WIDTH/2 - 170,344,s_oSpriteLibrary.getSprite("but_no"),_oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP,this._onReleaseNo,this);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.unload = function(){
        _oContainer.off("click",_oListenerDown);
        _oButNo.unload();
        _oButYes.unload();
    };
    
    this.show = function(szText,iType){
        _oTextBack.text = szText;
        _oText.text = szText;
        _iTypeAlert = iType;
        _oContainer.visible = true;
        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500,createjs.Ease.cubicOut);
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this._onReleaseYes = function(){
        if(_aCbCompleted[ON_RELEASE_YES]){
            _aCbCompleted[ON_RELEASE_YES].call(_aCbOwner[ON_RELEASE_YES],_iTypeAlert);
        }
    };
    
    this._onReleaseNo = function(){
        if(_aCbCompleted[ON_RELEASE_NO]){
            _aCbCompleted[ON_RELEASE_NO].call(_aCbOwner[ON_RELEASE_NO],_iTypeAlert);
        }
        _oContainer.visible = false;
    };
    
    _oParentContainer = oParentContainer;
    this._init(oParentContainer);
}