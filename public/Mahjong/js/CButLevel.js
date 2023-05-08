function CButLevel(iXPos,iYPos,oSprite,szName,szDifficulty,szFont,szColor,iFontSize,oParentContainer){
    var _bDisable;
    var _iWidth;
    var _iHeight;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams;
    var _oButton;
    var _oButtonBg;
    var _oTextName;
    var _oTextDiff;
    var _oParentContainer;
    
    this._init =function(iXPos,iYPos,oSprite,szName,szDifficulty,szFont,szColor,iFontSize){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        _oButton.cursor = "pointer";
        _oParentContainer.addChild(_oButton);

        _oButtonBg = createBitmap( oSprite);
        _oButton.addChild(_oButtonBg);
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;

        _oTextName = new createjs.Text(szName.toUpperCase(),iFontSize+"px "+szFont, szColor);
        _oTextName.textAlign = "center";
        _oTextName.textBaseline = "alphabetic";  
        _oTextName.x = oSprite.width/2;
        _oTextName.y = _iHeight - 13;
        _oTextName.shadow = new createjs.Shadow("#000000", 2, 2, 4);
        _oButton.addChild(_oTextName);
       
        _oTextDiff = new createjs.Text(szDifficulty.toUpperCase(),iFontSize+"px "+szFont, szColor);
        _oTextDiff.textAlign = "center";
        _oTextDiff.textBaseline = "alphabetic";  
        _oTextDiff.x = oSprite.width/2;
        _oTextDiff.shadow = new createjs.Shadow("#000000", 2, 2, 4);
        _oTextDiff.y = 30;
        _oButton.addChild(_oTextDiff);

        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown");
       _oButton.off("pressup");
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.enable = function(){
        _bDisable = false;
        _oButtonBg.filters = [];

        _oButtonBg.cache(0,0,_iWidth,_iHeight);
    };
    
    this.disable = function(){
        _bDisable = true;
        var matrix = new createjs.ColorMatrix().adjustSaturation(-100);
        _oButtonBg.filters = [
                 new createjs.ColorMatrixFilter(matrix)
        ];
        _oButtonBg.cache(0,0,_iWidth,_iHeight);	
    };
    
    this._initListener = function(){
       oParent = this;

       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("click",1,false);
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.changeText = function(szText){
        _oTextName.text = szText;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iXPos,iYPos,oSprite,szName,szDifficulty,szFont,szColor,iFontSize,oParentContainer);
    
    return this;
    
}