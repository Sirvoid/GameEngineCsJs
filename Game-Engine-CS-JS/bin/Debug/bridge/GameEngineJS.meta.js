Bridge.assembly("GameEngineJS", function ($asm, globals) {
    "use strict";


    var $m = Bridge.setMetadata,
        $n = ["System","GameEngineJS.GameObjects","GameEngineJS.Graphics","GameEngineJS.System","GameEngineJS.Display","GameEngineJS.Components","System.Collections.Generic","GameEngineJS.Maths"];
    $m("GameEngineJS.Game", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[0].String],"pi":[{"n":"canvasID","pt":$n[0].String,"ps":0}],"sn":"ctor"},{"a":2,"n":".ctor","t":1,"p":[$n[0].String,$n[0].String],"pi":[{"n":"canvasID","pt":$n[0].String,"ps":0},{"n":"color","pt":$n[0].String,"ps":1}],"sn":"$ctor1"},{"a":2,"n":"AddChild","t":8,"pi":[{"n":"obj","pt":$n[1].GameObject,"ps":0}],"sn":"AddChild","rt":$n[0].Void,"p":[$n[1].GameObject]},{"a":2,"n":"drawer","t":16,"rt":$n[2].Drawer,"g":{"a":2,"n":"get_drawer","t":8,"rt":$n[2].Drawer,"fg":"drawer"},"s":{"a":2,"n":"set_drawer","t":8,"p":[$n[2].Drawer],"rt":$n[0].Void,"fs":"drawer"},"fn":"drawer"},{"a":2,"n":"mouse","t":16,"rt":$n[3].Mouse,"g":{"a":2,"n":"get_mouse","t":8,"rt":$n[3].Mouse,"fg":"mouse"},"fn":"mouse"},{"a":2,"n":"scene","t":16,"rt":$n[4].Scene,"g":{"a":2,"n":"get_scene","t":8,"rt":$n[4].Scene,"fg":"scene"},"s":{"a":2,"n":"set_scene","t":8,"p":[$n[4].Scene],"rt":$n[0].Void,"fs":"scene"},"fn":"scene"},{"a":2,"n":"scheduler","t":16,"rt":$n[3].Scheduler,"g":{"a":2,"n":"get_scheduler","t":8,"rt":$n[3].Scheduler,"fg":"scheduler"},"s":{"a":2,"n":"set_scheduler","t":8,"p":[$n[3].Scheduler],"rt":$n[0].Void,"fs":"scheduler"},"fn":"scheduler"},{"a":1,"n":"_componentReader","t":4,"rt":$n[5].ComponentReader,"sn":"_componentReader"},{"a":1,"n":"_displayList","t":4,"rt":$n[4].DisplayList,"sn":"_displayList"}]}; }, $n);
    $m("GameEngineJS.System.Mouse", function () { return {"att":1048577,"a":2,"m":[{"a":4,"n":".ctor","t":1,"p":[HTMLCanvasElement],"pi":[{"n":"canvas","pt":HTMLCanvasElement,"ps":0}],"sn":"ctor"},{"a":1,"n":"Update","t":8,"pi":[{"n":"e","pt":Event,"ps":0}],"sn":"Update","rt":$n[0].Void,"p":[Event]},{"a":2,"n":"x","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_x","t":8,"rt":$n[0].Single,"fg":"x","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_x","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"x"},"fn":"x"},{"a":2,"n":"y","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_y","t":8,"rt":$n[0].Single,"fg":"y","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_y","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"y"},"fn":"y"},{"a":1,"n":"__Property__Initializer__x","t":4,"rt":$n[0].Single,"sn":"__Property__Initializer__x","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"__Property__Initializer__y","t":4,"rt":$n[0].Single,"sn":"__Property__Initializer__y","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_canvas","t":4,"rt":HTMLCanvasElement,"sn":"_canvas"}]}; }, $n);
    $m("GameEngineJS.System.Scheduler", function () { return {"att":1048577,"a":2,"m":[{"a":4,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Add","t":8,"pi":[{"n":"methods","pt":Function,"ps":0}],"sn":"Add","rt":$n[0].Void,"p":[Function]},{"a":2,"n":"Update","t":8,"sn":"Update","rt":$n[0].Void},{"a":1,"n":"_actionList","t":4,"rt":$n[6].List$1(Function),"sn":"_actionList"}]}; }, $n);
    $m("GameEngineJS.Maths.Vector2", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[0].Single,$n[0].Single],"pi":[{"n":"_x","pt":$n[0].Single,"ps":0},{"n":"_y","pt":$n[0].Single,"ps":1}],"sn":"ctor"},{"a":2,"n":"X","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_X","t":8,"rt":$n[0].Single,"fg":"X","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_X","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"X"},"fn":"X"},{"a":2,"n":"Y","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_Y","t":8,"rt":$n[0].Single,"fg":"Y","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_Y","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"Y"},"fn":"Y"}]}; }, $n);
    $m("GameEngineJS.Maths.Vector4", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[0].Single,$n[0].Single,$n[0].Single,$n[0].Single],"pi":[{"n":"_x","pt":$n[0].Single,"ps":0},{"n":"_y","pt":$n[0].Single,"ps":1},{"n":"_z","pt":$n[0].Single,"ps":2},{"n":"_w","pt":$n[0].Single,"ps":3}],"sn":"ctor"},{"a":2,"n":"W","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_W","t":8,"rt":$n[0].Single,"fg":"W","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_W","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"W"},"fn":"W"},{"a":2,"n":"X","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_X","t":8,"rt":$n[0].Single,"fg":"X","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_X","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"X"},"fn":"X"},{"a":2,"n":"Y","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_Y","t":8,"rt":$n[0].Single,"fg":"Y","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_Y","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"Y"},"fn":"Y"},{"a":2,"n":"Z","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_Z","t":8,"rt":$n[0].Single,"fg":"Z","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_Z","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"Z"},"fn":"Z"}]}; }, $n);
    $m("GameEngineJS.Graphics.Drawer", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[HTMLCanvasElement],"pi":[{"n":"canvas","pt":HTMLCanvasElement,"ps":0}],"sn":"ctor"},{"a":2,"n":"Draw","t":8,"pi":[{"n":"x","pt":$n[0].Single,"ps":0},{"n":"y","pt":$n[0].Single,"ps":1},{"n":"w","pt":$n[0].Single,"ps":2},{"n":"h","pt":$n[0].Single,"ps":3},{"n":"img","pt":System.Object,"ps":4}],"sn":"Draw","rt":$n[0].Void,"p":[$n[0].Single,$n[0].Single,$n[0].Single,$n[0].Single,System.Object]},{"a":2,"n":"Draw","t":8,"pi":[{"n":"x","pt":$n[0].Single,"ps":0},{"n":"y","pt":$n[0].Single,"ps":1},{"n":"w","pt":$n[0].Single,"ps":2},{"n":"h","pt":$n[0].Single,"ps":3},{"n":"r","pt":$n[0].Single,"ps":4},{"n":"img","pt":System.Object,"ps":5},{"n":"follow","pt":$n[0].Boolean,"ps":6},{"n":"alpha","pt":$n[0].Single,"ps":7}],"sn":"Draw$1","rt":$n[0].Void,"p":[$n[0].Single,$n[0].Single,$n[0].Single,$n[0].Single,$n[0].Single,System.Object,$n[0].Boolean,$n[0].Single]},{"a":2,"n":"FillScreen","t":8,"pi":[{"n":"color","pt":$n[0].String,"ps":0}],"sn":"FillScreen","rt":$n[0].Void,"p":[$n[0].String]},{"a":1,"n":"_canvas","t":4,"rt":HTMLCanvasElement,"sn":"_canvas"},{"a":1,"n":"_ctx","t":4,"rt":CanvasRenderingContext2D,"sn":"_ctx"}]}; }, $n);
    $m("GameEngineJS.Graphics.Image", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[0].String],"pi":[{"n":"src","pt":$n[0].String,"ps":0}],"sn":"ctor"},{"a":2,"n":"data","t":16,"rt":HTMLImageElement,"g":{"a":2,"n":"get_data","t":8,"rt":HTMLImageElement,"fg":"data"},"s":{"a":2,"n":"set_data","t":8,"p":[HTMLImageElement],"rt":$n[0].Void,"fs":"data"},"fn":"data"}]}; }, $n);
    $m("GameEngineJS.Display.Camera", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":".ctor","t":1,"p":[$n[7].Vector2,$n[0].Single],"pi":[{"n":"_position","pt":$n[7].Vector2,"ps":0},{"n":"_rotation","pt":$n[0].Single,"ps":1}],"sn":"$ctor1"},{"a":2,"n":"position","t":16,"rt":$n[7].Vector2,"g":{"a":2,"n":"get_position","t":8,"rt":$n[7].Vector2,"fg":"position"},"s":{"a":2,"n":"set_position","t":8,"p":[$n[7].Vector2],"rt":$n[0].Void,"fs":"position"},"fn":"position"},{"a":2,"n":"rotation","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_rotation","t":8,"rt":$n[0].Single,"fg":"rotation","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_rotation","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"rotation"},"fn":"rotation"}]}; }, $n);
    $m("GameEngineJS.Display.DisplayList", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Add","t":8,"pi":[{"n":"obj","pt":$n[1].GameObject,"ps":0},{"n":"parent","pt":$n[1].GameObject,"ps":1}],"sn":"Add","rt":$n[0].Void,"p":[$n[1].GameObject,$n[1].GameObject]},{"a":2,"n":"list","t":16,"rt":$n[6].List$1(GameEngineJS.GameObjects.GameObject),"g":{"a":2,"n":"get_list","t":8,"rt":$n[6].List$1(GameEngineJS.GameObjects.GameObject),"fg":"list"},"s":{"a":2,"n":"set_list","t":8,"p":[$n[6].List$1(GameEngineJS.GameObjects.GameObject)],"rt":$n[0].Void,"fs":"list"},"fn":"list"},{"a":1,"n":"__Property__Initializer__list","t":4,"rt":$n[6].List$1(GameEngineJS.GameObjects.GameObject),"sn":"__Property__Initializer__list"}]}; }, $n);
    $m("GameEngineJS.Display.Scene", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[4].DisplayList,$n[0].String,$n[0].String],"pi":[{"n":"objList","pt":$n[4].DisplayList,"ps":0},{"n":"canvasID","pt":$n[0].String,"ps":1},{"n":"color","pt":$n[0].String,"ps":2}],"sn":"ctor"},{"a":1,"n":"DrawChild","t":8,"pi":[{"n":"obj","pt":$n[1].GameObject,"ps":0},{"n":"x","pt":$n[0].Single,"ps":1},{"n":"y","pt":$n[0].Single,"ps":2},{"n":"angle","pt":$n[0].Single,"ps":3}],"sn":"DrawChild","rt":$n[0].Void,"p":[$n[1].GameObject,$n[0].Single,$n[0].Single,$n[0].Single]},{"a":2,"n":"Refresh","t":8,"sn":"Refresh","rt":$n[0].Void},{"a":2,"n":"camera","t":16,"rt":$n[4].Camera,"g":{"a":2,"n":"get_camera","t":8,"rt":$n[4].Camera,"fg":"camera"},"s":{"a":2,"n":"set_camera","t":8,"p":[$n[4].Camera],"rt":$n[0].Void,"fs":"camera"},"fn":"camera"},{"a":2,"n":"mouse","t":16,"rt":$n[3].Mouse,"g":{"a":2,"n":"get_mouse","t":8,"rt":$n[3].Mouse,"fg":"mouse"},"s":{"a":2,"n":"set_mouse","t":8,"p":[$n[3].Mouse],"rt":$n[0].Void,"fs":"mouse"},"fn":"mouse"},{"a":1,"n":"_canvas","t":4,"rt":HTMLCanvasElement,"sn":"_canvas"},{"a":1,"n":"_color","t":4,"rt":$n[0].String,"sn":"_color"},{"a":1,"n":"_drawer","t":4,"rt":$n[2].Drawer,"sn":"_drawer"},{"a":1,"n":"_mainDisplayList","t":4,"rt":$n[4].DisplayList,"sn":"_mainDisplayList"}]}; }, $n);
    $m("GameEngineJS.GameObjects.GameObject", function () { return {"att":1048705,"a":2,"m":[{"a":3,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"AddChild","t":8,"pi":[{"n":"obj","pt":$n[1].GameObject,"ps":0}],"sn":"AddChild","rt":$n[0].Void,"p":[$n[1].GameObject]},{"a":2,"n":"AddComponent","t":8,"pi":[{"n":"instanceName","pt":$n[0].String,"ps":0},{"n":"component","pt":$n[5].Component,"ps":1}],"sn":"AddComponent","rt":$n[5].Component,"p":[$n[0].String,$n[5].Component]},{"a":2,"n":"angle","t":16,"rt":$n[0].Single,"g":{"a":2,"n":"get_angle","t":8,"rt":$n[0].Single,"fg":"angle","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_angle","t":8,"p":[$n[0].Single],"rt":$n[0].Void,"fs":"angle"},"fn":"angle"},{"a":2,"n":"image","t":16,"rt":System.Object,"g":{"a":2,"n":"get_image","t":8,"rt":System.Object,"fg":"image"},"s":{"a":2,"n":"set_image","t":8,"p":[System.Object],"rt":$n[0].Void,"fs":"image"},"fn":"image"},{"a":2,"n":"position","t":16,"rt":$n[7].Vector2,"g":{"a":2,"n":"get_position","t":8,"rt":$n[7].Vector2,"fg":"position"},"s":{"a":2,"n":"set_position","t":8,"p":[$n[7].Vector2],"rt":$n[0].Void,"fs":"position"},"fn":"position"},{"a":2,"n":"size","t":16,"rt":$n[7].Vector2,"g":{"a":2,"n":"get_size","t":8,"rt":$n[7].Vector2,"fg":"size"},"s":{"a":2,"n":"set_size","t":8,"p":[$n[7].Vector2],"rt":$n[0].Void,"fs":"size"},"fn":"size"},{"a":4,"n":"_parent","t":4,"rt":$n[1].GameObject,"sn":"_parent"},{"a":2,"n":"components","t":4,"rt":$n[6].Dictionary$2(System.String,GameEngineJS.Components.Component),"sn":"components"},{"a":4,"n":"displayList","t":4,"rt":$n[4].DisplayList,"sn":"displayList"}]}; }, $n);
    $m("GameEngineJS.GameObjects.Sprite", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[7].Vector2,$n[7].Vector2,System.Object],"pi":[{"n":"_position","pt":$n[7].Vector2,"ps":0},{"n":"_size","pt":$n[7].Vector2,"ps":1},{"n":"_image","pt":System.Object,"ps":2}],"sn":"ctor"}]}; }, $n);
    $m("GameEngineJS.Events.KeyBoardEvent", function () { return {"nested":[Function,Function,Function],"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"DoKeyDown","t":8,"pi":[{"n":"e","pt":Event,"ps":0}],"sn":"DoKeyDown","rt":$n[0].Void,"p":[Event]},{"a":1,"n":"DoKeyPress","t":8,"pi":[{"n":"e","pt":Event,"ps":0}],"sn":"DoKeyPress","rt":$n[0].Void,"p":[Event]},{"a":1,"n":"DoKeyUp","t":8,"pi":[{"n":"e","pt":Event,"ps":0}],"sn":"DoKeyUp","rt":$n[0].Void,"p":[Event]},{"a":2,"n":"OnKeyDownEvents","t":2,"ad":{"a":2,"n":"add_OnKeyDownEvents","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnKeyDownEvents","rt":$n[0].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnKeyDownEvents","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnKeyDownEvents","rt":$n[0].Void,"p":[Function]}},{"a":2,"n":"OnKeyPressEvents","t":2,"ad":{"a":2,"n":"add_OnKeyPressEvents","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnKeyPressEvents","rt":$n[0].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnKeyPressEvents","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnKeyPressEvents","rt":$n[0].Void,"p":[Function]}},{"a":2,"n":"OnKeyUpEvents","t":2,"ad":{"a":2,"n":"add_OnKeyUpEvents","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnKeyUpEvents","rt":$n[0].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnKeyUpEvents","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnKeyUpEvents","rt":$n[0].Void,"p":[Function]}}]}; }, $n);
    $m("GameEngineJS.Components.Animator", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[1].GameObject],"pi":[{"n":"parent","pt":$n[1].GameObject,"ps":0}],"sn":"ctor"},{"a":2,"n":"Create","t":8,"pi":[{"n":"animationName","pt":$n[0].String,"ps":0},{"n":"list","pt":$n[6].List$1(GameEngineJS.Graphics.Image),"ps":1}],"sn":"Create","rt":$n[0].Void,"p":[$n[0].String,$n[6].List$1(GameEngineJS.Graphics.Image)]},{"a":2,"n":"GotoAndPlay","t":8,"pi":[{"n":"animationName","pt":$n[0].String,"ps":0}],"sn":"GotoAndPlay","rt":$n[0].Void,"p":[$n[0].String]},{"a":2,"n":"GotoAndPlay","t":8,"pi":[{"n":"animationName","pt":$n[0].String,"ps":0},{"n":"frame","pt":$n[0].Int32,"ps":1}],"sn":"GotoAndPlay$1","rt":$n[0].Void,"p":[$n[0].String,$n[0].Int32]},{"a":2,"n":"GotoAndStop","t":8,"pi":[{"n":"animationName","pt":$n[0].String,"ps":0}],"sn":"GotoAndStop","rt":$n[0].Void,"p":[$n[0].String]},{"a":2,"n":"GotoAndStop","t":8,"pi":[{"n":"animationName","pt":$n[0].String,"ps":0},{"n":"frame","pt":$n[0].Int32,"ps":1}],"sn":"GotoAndStop$1","rt":$n[0].Void,"p":[$n[0].String,$n[0].Int32]},{"a":2,"n":"Start","t":8,"sn":"Start","rt":$n[0].Void},{"a":2,"n":"Stop","t":8,"sn":"Stop","rt":$n[0].Void},{"ov":true,"a":4,"n":"Update","t":8,"sn":"Update","rt":$n[0].Void},{"a":1,"n":"_animations","t":16,"rt":$n[6].Dictionary$2(System.String,System.Collections.Generic.List$1(GameEngineJS.Graphics.Image)),"g":{"a":1,"n":"get__animations","t":8,"rt":$n[6].Dictionary$2(System.String,System.Collections.Generic.List$1(GameEngineJS.Graphics.Image)),"fg":"_animations"},"s":{"a":1,"n":"set__animations","t":8,"p":[$n[6].Dictionary$2(System.String,System.Collections.Generic.List$1(GameEngineJS.Graphics.Image))],"rt":$n[0].Void,"fs":"_animations"},"fn":"_animations"},{"a":2,"n":"currentAnimation","t":16,"rt":$n[0].String,"g":{"a":2,"n":"get_currentAnimation","t":8,"rt":$n[0].String,"fg":"currentAnimation"},"s":{"a":2,"n":"set_currentAnimation","t":8,"p":[$n[0].String],"rt":$n[0].Void,"fs":"currentAnimation"},"fn":"currentAnimation"},{"a":2,"n":"currentFrame","t":16,"rt":$n[0].Int32,"g":{"a":2,"n":"get_currentFrame","t":8,"rt":$n[0].Int32,"fg":"currentFrame","box":function ($v) { return Bridge.box($v, System.Int32);}},"s":{"a":2,"n":"set_currentFrame","t":8,"p":[$n[0].Int32],"rt":$n[0].Void,"fs":"currentFrame"},"fn":"currentFrame"},{"a":2,"n":"fps","t":16,"rt":$n[0].Int32,"g":{"a":2,"n":"get_fps","t":8,"rt":$n[0].Int32,"fg":"fps","box":function ($v) { return Bridge.box($v, System.Int32);}},"s":{"a":2,"n":"set_fps","t":8,"p":[$n[0].Int32],"rt":$n[0].Void,"fs":"fps"},"fn":"fps"},{"a":1,"n":"__Property__Initializer__currentAnimation","t":4,"rt":$n[0].String,"sn":"__Property__Initializer__currentAnimation"},{"a":1,"n":"__Property__Initializer__currentFrame","t":4,"rt":$n[0].Int32,"sn":"__Property__Initializer__currentFrame","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"__Property__Initializer__fps","t":4,"rt":$n[0].Int32,"sn":"__Property__Initializer__fps","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_playing","t":4,"rt":$n[0].Boolean,"sn":"_playing","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"lastTimeFrame","t":4,"rt":$n[0].Double,"sn":"lastTimeFrame","box":function ($v) { return Bridge.box($v, System.Double, System.Double.format, System.Double.getHashCode);}}]}; }, $n);
    $m("GameEngineJS.Components.Collision", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[1].GameObject],"pi":[{"n":"_parent","pt":$n[1].GameObject,"ps":0}],"sn":"ctor"},{"a":2,"n":"AddBox","t":8,"pi":[{"n":"x1","pt":$n[0].Single,"ps":0},{"n":"y1","pt":$n[0].Single,"ps":1},{"n":"width","pt":$n[0].Single,"ps":2},{"n":"height","pt":$n[0].Single,"ps":3}],"sn":"AddBox","rt":$n[0].Void,"p":[$n[0].Single,$n[0].Single,$n[0].Single,$n[0].Single]},{"a":2,"n":"HitTestObject","t":8,"pi":[{"n":"obj","pt":$n[1].GameObject,"ps":0}],"sn":"HitTestObject","rt":$n[0].Boolean,"p":[$n[1].GameObject],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"HitTestPoint","t":8,"pi":[{"n":"x","pt":$n[0].Single,"ps":0},{"n":"y","pt":$n[0].Single,"ps":1}],"sn":"HitTestPoint","rt":$n[0].Boolean,"p":[$n[0].Single,$n[0].Single],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"ParentPosCalculationX","t":8,"pi":[{"n":"x","pt":$n[0].Single,"ps":0},{"n":"parent","pt":$n[1].GameObject,"ps":1}],"sn":"ParentPosCalculationX","rt":$n[0].Single,"p":[$n[0].Single,$n[1].GameObject],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"ParentPosCalculationY","t":8,"pi":[{"n":"y","pt":$n[0].Single,"ps":0},{"n":"parent","pt":$n[1].GameObject,"ps":1}],"sn":"ParentPosCalculationY","rt":$n[0].Single,"p":[$n[0].Single,$n[1].GameObject],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_boxes","t":4,"rt":$n[6].List$1(GameEngineJS.Maths.Vector4),"sn":"_boxes","ro":true}]}; }, $n);
    $m("GameEngineJS.Components.Component", function () { return {"att":1048577,"a":2,"m":[{"a":4,"n":".ctor","t":1,"p":[$n[1].GameObject],"pi":[{"n":"_parent","pt":$n[1].GameObject,"ps":0}],"sn":"ctor"},{"v":true,"a":4,"n":"Update","t":8,"sn":"Update","rt":$n[0].Void},{"a":4,"n":"parent","t":16,"rt":$n[1].GameObject,"g":{"a":4,"n":"get_parent","t":8,"rt":$n[1].GameObject,"fg":"parent"},"s":{"a":4,"n":"set_parent","t":8,"p":[$n[1].GameObject],"rt":$n[0].Void,"fs":"parent"},"fn":"parent"}]}; }, $n);
    $m("GameEngineJS.Components.ComponentReader", function () { return {"att":1048576,"a":4,"m":[{"a":4,"n":".ctor","t":1,"p":[$n[4].DisplayList],"pi":[{"n":"list","pt":$n[4].DisplayList,"ps":0}],"sn":"ctor"},{"a":1,"n":"recursiveUpdate","t":8,"pi":[{"n":"obj","pt":$n[1].GameObject,"ps":0}],"sn":"recursiveUpdate","rt":$n[0].Void,"p":[$n[1].GameObject]},{"a":4,"n":"update","t":8,"sn":"update","rt":$n[0].Void},{"a":4,"n":"displayList","t":16,"rt":$n[4].DisplayList,"g":{"a":4,"n":"get_displayList","t":8,"rt":$n[4].DisplayList,"fg":"displayList"},"s":{"a":4,"n":"set_displayList","t":8,"p":[$n[4].DisplayList],"rt":$n[0].Void,"fs":"displayList"},"fn":"displayList"}]}; }, $n);
});
