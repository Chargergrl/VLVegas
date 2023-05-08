function CWinPanel(){
    var _oScoreText;
    var _oBestScoreText;
    var _oButHome;
    var _oButShuffle;
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
        
        var oCongratsTextOutline = new createjs.Text(TEXT_CONGRATS,"50px "+FONT_GAME, "#000");
        oCongratsTextOutline.x = CANVAS_WIDTH/2;
        oCongratsTextOutline.y = CANVAS_HEIGHT/2 - 100;
        oCongratsTextOutline.textAlign = "center";
        oCongratsTextOutline.outline = 2;
        _oContainer.addChild(oCongratsTextOutline);
        
        var oCongratsText = new createjs.Text(TEXT_CONGRATS,"50px "+FONT_GAME, "#d7d5d2");
        oCongratsText.x = CANVAS_WIDTH/2;
        oCongratsText.y = CANVAS_HEIGHT/2 - 100;
        oCongratsText.textAlign = "center";
        _oContainer.addChild(oCongratsText);
        
        _oScoreText = new createjs.Text(TEXT_FINAL_SCORE,"40px "+FONT_GAME, "#fff");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = CANVAS_HEIGHT/2 - 20;
        _oScoreText.textAlign = "center";
        _oContainer.addChild(_oScoreText);
        
        _oBestScoreText = new createjs.Text(TEXT_BEST_SCORE,"40px "+FONT_GAME, "#fff");
        _oBestScoreText.x = CANVAS_WIDTH/2;
        _oBestScoreText.y = CANVAS_HEIGHT/2 + 20;
        _oBestScoreText.textAlign = "center";
        _oContainer.addChild(_oBestScoreText);
        
        _oButHome = new CTextButton(CANVAS_WIDTH/2 - 140,CANVAS_HEIGHT/2 + 100,s_oSpriteLibrary.getSprite("but_generic_small"),TEXT_EXIT,FONT_GAME,"#d7d5d2",20,_oContainer);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onExit,this);
        
        _oButShuffle = new CTextButton(CANVAS_WIDTH/2 + 140,CANVAS_HEIGHT/2 + 100,s_oSpriteLibrary.getSprite("but_generic_small"),TEXT_SHUFFLE,FONT_GAME,"#d7d5d2",20,_oContainer);
        _oButShuffle.addEventListener(ON_MOUSE_UP,this._onShuffle,this);
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButShuffle.unload();
        _oContainer.off("click",_oListenerDown);
    };
    
    this.show = function(iScore,iBestScore){
        _oScoreText.text = TEXT_FINAL_SCORE + ": "+iScore;
        _oBestScoreText.text = TEXT_BEST_SCORE + ": "+iBestScore;
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500,createjs.Ease.cubicOut).call(function(){$(s_oMain).trigger("show_interlevel_ad");});
        
        $(s_oMain).trigger("save_score",iScore);
        $(s_oMain).trigger("share_event",iScore);
    };

    this._onShuffle = function(){
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500,createjs.Ease.cubicOut).call(function(){_oContainer.visible = false;s_oGame.onShuffleBoard();});
    };

    this._onExit = function(){
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500,createjs.Ease.cubicOut).call(function(){_oContainer.visible = false;s_oMain.gotoMenu();});
    };

    this.init();  
}