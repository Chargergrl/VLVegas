function CGameOverPanel(){
    
    var _oScoreText;
    var _oButHome;
    var _oButShuffle;
    var _oButRestart;
    var _oListenerDown;
    var _oContainer;
    
    this.init = function(){
        _oContainer = new createjs.Container()
        _oListenerDown = _oContainer.on("click",function(){});
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);

        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(oBg);
        
        var oTextOutline = new createjs.Text(TEXT_NO_TILES,"40px "+FONT_GAME, "#000");
        oTextOutline.x = CANVAS_WIDTH/2;
        oTextOutline.y = CANVAS_HEIGHT/2 - 120;
        oTextOutline.textAlign = "center";
        oTextOutline.outline = 2;
        _oContainer.addChild(oTextOutline);
        
        var oText = new createjs.Text(TEXT_NO_TILES,"40px "+FONT_GAME, "#d7d5d2");
        oText.x = CANVAS_WIDTH/2;
        oText.y = CANVAS_HEIGHT/2 - 120;
        oText.textAlign = "center";
        _oContainer.addChild(oText);
        
        _oScoreText = new createjs.Text(TEXT_FINAL_SCORE,"30px "+FONT_GAME, "#fff");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = CANVAS_HEIGHT/2 - 80;
        _oScoreText.textAlign = "center";
        _oContainer.addChild(_oScoreText);
        
        var oSpriteBut = s_oSpriteLibrary.getSprite("but_generic_small");
        _oButShuffle = new CTextButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 100,oSpriteBut,TEXT_SHUFFLE,FONT_GAME,"#d7d5d2",20,_oContainer);
        _oButShuffle.addEventListener(ON_MOUSE_UP,this._onShuffle,this);
        
        _oButRestart = new CTextButton(CANVAS_WIDTH/2,_oButShuffle.getY() - oSpriteBut.height,oSpriteBut,TEXT_RESTART,FONT_GAME,"#d7d5d2",20,_oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _oButHome = new CTextButton(CANVAS_WIDTH/2,_oButRestart.getY() - oSpriteBut.height,oSpriteBut,TEXT_EXIT,FONT_GAME,"#d7d5d2",20,_oContainer);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onExit,this);
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButShuffle.unload();
        _oButRestart.unload();
        _oContainer.off("click",_oListenerDown);
    };
    
    this.show = function(iScore){
        _oScoreText.text = TEXT_FINAL_SCORE + ": "+iScore;
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500,createjs.Ease.cubicOut).call(function(){$(s_oMain).trigger("show_interlevel_ad");});
        
        $(s_oMain).trigger("save_score",iScore);
        $(s_oMain).trigger("share_event",iScore);
    };

    this._onShuffle = function(){
        s_oGame.onShuffleBoard();
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500,createjs.Ease.cubicOut).call(function(){_oContainer.visible = false;});
    };

    this._onExit = function(){
        _oContainer.visible = false;
        s_oMain.gotoMenu();
    };

    this._onRestart = function(){
        s_oGame.onRestartBoard();
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500,createjs.Ease.cubicOut).call(function(){_oContainer.visible = false;});
    };
    
    this.init();  
}