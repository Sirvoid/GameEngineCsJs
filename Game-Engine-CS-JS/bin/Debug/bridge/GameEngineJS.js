/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("GameEngineJS", function ($asm, globals) {
    "use strict";

    Bridge.define("GameEngineJS.Components.Component", {
        fields: {
            parent: null
        },
        ctors: {
            ctor: function (_parent) {
                this.$initialize();
                this.parent = _parent;
            }
        },
        methods: {
            Update: function () { }
        }
    });

    Bridge.define("GameEngineJS.Components.ComponentReader", {
        fields: {
            displayList: null
        },
        ctors: {
            ctor: function (list) {
                this.$initialize();
                this.displayList = list;
            }
        },
        methods: {
            update: function () {
                var $t, $t1;
                $t = Bridge.getEnumerator(this.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj = $t.Current;
                        $t1 = Bridge.getEnumerator(obj.components);
                        try {
                            while ($t1.moveNext()) {
                                var component = $t1.Current;
                                component.value.Update();
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                        this.recursiveUpdate(obj);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            recursiveUpdate: function (obj) {
                var $t, $t1;
                if (this.displayList.list.Count <= 0) {
                    return;
                }
                $t = Bridge.getEnumerator(obj.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj2 = $t.Current;
                        $t1 = Bridge.getEnumerator(obj2.components);
                        try {
                            while ($t1.moveNext()) {
                                var component = $t1.Current;
                                component.value.Update();
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                        this.recursiveUpdate(obj2);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.define("GameEngineJS.Display.Camera", {
        fields: {
            position: null,
            rotation: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.position = new GameEngineJS.Maths.Vector2(0, 0);
                this.rotation = 0;
            },
            $ctor1: function (_position, _rotation) {
                this.$initialize();
                this.position = _position;
                this.rotation = _rotation;
            }
        }
    });

    Bridge.define("GameEngineJS.Display.DisplayList", {
        fields: {
            list: null
        },
        ctors: {
            init: function () {
                this.list = new (System.Collections.Generic.List$1(GameEngineJS.GameObjects.GameObject)).ctor();
            }
        },
        methods: {
            Add$1: function (obj, parent) {
                var $t;
                $t = Bridge.getEnumerator(obj.layers.getValues(), GameEngineJS.GameObjects.TileMap.Layer);
                try {
                    while ($t.moveNext()) {
                        var l = $t.Current;
                        this.AddAt(l, parent, l.index);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            Add: function (obj, parent) {
                this.list.add(obj);
                obj._parent = parent;
            },
            AddAt: function (obj, parent, index) {
                this.list.insert((index | 0), obj);
            }
        }
    });

    Bridge.define("GameEngineJS.Display.Scene", {
        fields: {
            camera: null,
            _mainDisplayList: null,
            _drawer: null,
            _canvas: null,
            _color: null,
            mouse: null
        },
        ctors: {
            ctor: function (objList, canvasID, color) {
                this.$initialize();
                this.camera = new GameEngineJS.Display.Camera.ctor();
                this._mainDisplayList = objList;
                this._canvas = document.querySelector("canvas#" + (canvasID || ""));
                this._drawer = new GameEngineJS.Graphics.Drawer(this._canvas);
                this._color = color;
                this.mouse = new GameEngineJS.System.Mouse(this._canvas);
            }
        },
        methods: {
            Refresh: function () {
                var $t;
                this._drawer.FillScreen(this._color);
                $t = Bridge.getEnumerator(this._mainDisplayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj = $t.Current;
                        this._drawer.Draw$1(obj.position.X - this.camera.position.X, obj.position.Y - this.camera.position.Y, obj.size.X, obj.size.Y, obj.angle, obj.image, false, 1);
                        this.DrawChild(obj, obj.position.X, obj.position.Y, obj.angle);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            DrawChild: function (obj, x, y, angle) {
                var $t;
                $t = Bridge.getEnumerator(obj.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj2 = $t.Current;
                        var newX = x + (Math.cos(obj.angle * Math.PI / 180)) * obj2.position.X - this.camera.position.X;
                        var newY = y + (Math.sin(obj.angle * Math.PI / 180)) * obj2.position.Y - this.camera.position.Y;
                        var newAngle = obj2.angle + angle;

                        this._drawer.Draw$1(newX, newY, obj2.size.X, obj2.size.Y, newAngle, obj2.image, false, 1);
                        this.DrawChild(obj2, newX, newY, newAngle);

                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.define("GameEngineJS.Events.KeyBoardEvent", {
        events: {
            OnKeyPressEvents: null,
            OnKeyDownEvents: null,
            OnKeyUpEvents: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                document.addEventListener("keypress", Bridge.fn.cacheBind(this, this.DoKeyPress));
                document.addEventListener("keydown", Bridge.fn.cacheBind(this, this.DoKeyDown));
                document.addEventListener("keyup", Bridge.fn.cacheBind(this, this.DoKeyUp));
            }
        },
        methods: {
            DoKeyPress: function (e) {
                if (Bridge.staticEquals(this.OnKeyPressEvents, null)) {
                    return;
                }
                this.OnKeyPressEvents(e.key);
            },
            DoKeyDown: function (e) {
                if (Bridge.staticEquals(this.OnKeyDownEvents, null)) {
                    return;
                }
                this.OnKeyDownEvents(e.key);
            },
            DoKeyUp: function (e) {
                if (Bridge.staticEquals(this.OnKeyUpEvents, null)) {
                    return;
                }
                this.OnKeyUpEvents(e.key);
            }
        }
    });

    Bridge.define("GameEngineJS.Game", {
        fields: {
            drawer: null,
            scheduler: null,
            scene: null,
            _displayList: null,
            _componentReader: null
        },
        props: {
            mouse: {
                get: function () {
                    return this.scene.mouse;
                }
            }
        },
        ctors: {
            ctor: function (canvasID) {
                GameEngineJS.Game.$ctor1.call(this, canvasID, "#fff");
            },
            $ctor1: function (canvasID, color) {
                this.$initialize();
                this._displayList = new GameEngineJS.Display.DisplayList();
                this.scene = new GameEngineJS.Display.Scene(this._displayList, canvasID, color);
                this._componentReader = new GameEngineJS.Components.ComponentReader(this._displayList);


                this.scheduler = new GameEngineJS.System.Scheduler();
                this.scheduler.Add(Bridge.fn.cacheBind(this.scene, this.scene.Refresh));
                this.scheduler.Add(Bridge.fn.cacheBind(this._componentReader, this._componentReader.update));
            }
        },
        methods: {
            AddChild$1: function (obj) {
                this._displayList.Add$1(obj, null);
            },
            AddChild: function (obj) {
                this._displayList.Add(obj, null);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.GameObject", {
        fields: {
            position: null,
            size: null,
            angle: 0,
            image: null,
            components: null,
            displayList: null,
            _parent: null
        },
        ctors: {
            init: function () {
                this.components = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.Components.Component))();
                this.displayList = new GameEngineJS.Display.DisplayList();
            }
        },
        methods: {
            AddComponent: function (instanceName, component) {
                this.components.set(instanceName, component);
                return this.components.get(instanceName);
            },
            AddChild$1: function (tileMap) {
                this.displayList.Add$1(tileMap, this);
            },
            AddChild: function (obj) {
                this.displayList.Add(obj, this);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.TileMap.TileMap", {
        fields: {
            request: null,
            layers: null,
            _tileSheet: null,
            _size: null,
            position: null
        },
        ctors: {
            ctor: function (tileSheet, pos, size) {
                this.$initialize();
                this.layers = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.GameObjects.TileMap.Layer))();
                this._tileSheet = tileSheet;
                this.position = pos;
                this._size = size;
            }
        },
        methods: {
            AddLayer: function (name, index) {
                this.layers.set(name, new GameEngineJS.GameObjects.TileMap.Layer(index, this));
                return this.layers.get(name);
            },
            RemoveLayer: function (name) {
                this.layers.set(name, null);
            },
            SetTile: function (layer, pos, tile) {
                this.layers.get(layer).SetTile(((pos.X) >>> 0), ((pos.Y) >>> 0), tile, false);
            },
            GetTile: function (layer, pos) {
                return this.layers.get(layer).GetTile(((pos.X) >>> 0), ((pos.Y) >>> 0));
            },
            LoadTiledJson: function (url, numberOfLayers) {

                for (var i = 0; i < numberOfLayers; i = (i + 1) >>> 0) {
                    this.AddLayer(i + "", i);
                }

                this.request = new XMLHttpRequest();

                this.request.onload = Bridge.fn.combine(this.request.onload, Bridge.fn.cacheBind(this, this.LoadTiled));
                this.request.open("get", url);
                this.request.send();


            },
            LoadTiled: function (e) {
                var a = JSON.parse(this.request.responseText);
                this._size.X = a.width;
                this._size.Y = a.height;

                for (var i = 0; i < a.layers.length; i = (i + 1) >>> 0) {
                    var layerjs = a.layers[i];

                    var layer = this.layers.get(i + "");

                    layerjs = layerjs.data;

                    for (var j = 0; j < layerjs.length; j = (j + 1) | 0) {

                        var indexX = j % this._size.X;
                        var indexY = Bridge.Int.clip32(Math.floor(((Bridge.Int.div(j, this._size.X)) | 0)));

                        layer.SetTile((indexX >>> 0), (indexY >>> 0), ((layerjs[j] - 1) | 0), true);
                    }
                }

            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.Drawer", {
        fields: {
            _ctx: null,
            _canvas: null
        },
        ctors: {
            ctor: function (canvas) {
                this.$initialize();
                this._ctx = canvas.getContext("2d");
                this._canvas = canvas;
            }
        },
        methods: {
            FillScreen: function (color) {
                this._ctx.fillStyle = color;
                this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
            },
            Draw: function (x, y, w, h, img) {
                this.Draw$1(x, y, w, h, 0, img, false, 1);
            },
            Draw$1: function (x, y, w, h, r, img, follow, alpha) {
                this._ctx.imageSmoothingEnabled = false;
                this._canvas.style.imageRendering = "pixelated";
                this._ctx.save();

                var sx = 0;
                var sy = 0;
                var sw = w;
                var sh = h;

                if (img == null) {
                    return;
                }

                if (img.spriteSizeX != null && img.spriteSizeY != null) {
                    var img2 = Bridge.cast(img, GameEngineJS.Graphics.SpriteSheet);
                    if (img2.data.width === 0) {
                        return;
                    }
                    sx = System.Int64.toNumber((System.Int64(img2.currentIndex).mod((System.Int64(img2.data.width).div(System.Int64(img2.spriteSizeX))))).mul(System.Int64(img2.spriteSizeX)));
                    sy = Math.floor(img2.currentIndex / (img2.data.width / img2.spriteSizeX)) * img2.spriteSizeY;
                    sw = img2.spriteSizeX;
                    sh = img2.spriteSizeY;
                }

                if (img.data != null) {
                    img = img.data;
                }

                var ox = x + (w / 2);
                var oy = y + (h / 2);

                this._ctx.translate(ox, oy);
                this._ctx.rotate((r) * Math.PI / 180);
                this._ctx.translate(-ox, -oy);

                this._ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);

                this._ctx.restore();
            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.Image", {
        fields: {
            data: null
        },
        ctors: {
            $ctor1: function (src) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;

            },
            ctor: function (img) {
                this.$initialize();
                this.data = img;
            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.SpriteSheet", {
        fields: {
            data: null,
            spriteSizeX: 0,
            spriteSizeY: 0,
            currentIndex: 0
        },
        ctors: {
            ctor: function (src, _spriteSizeX, _spriteSizeY) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;
                this.spriteSizeX = _spriteSizeX;
                this.spriteSizeY = _spriteSizeY;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector2", {
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function (_x, _y) {
                this.$initialize();
                this.X = _x;
                this.Y = _y;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector2I", {
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function (_x, _y) {
                this.$initialize();
                this.X = _x;
                this.Y = _y;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector4", {
        fields: {
            X: 0,
            Y: 0,
            Z: 0,
            W: 0
        },
        ctors: {
            ctor: function (_x, _y, _z, _w) {
                this.$initialize();
                this.X = _x;
                this.Y = _y;
                this.Z = _z;
                this.W = _w;
            }
        }
    });

    Bridge.define("GameEngineJS.System.Mouse", {
        fields: {
            x: 0,
            y: 0,
            _canvas: null
        },
        ctors: {
            init: function () {
                this.x = 0;
                this.y = 0;
            },
            ctor: function (canvas) {
                this.$initialize();
                this._canvas = canvas;
                document.addEventListener("mousemove", Bridge.fn.cacheBind(this, this.Update));
            }
        },
        methods: {
            Update: function (e) {
                var rect = this._canvas.getBoundingClientRect();
                this.x = e.clientX - rect.left;
                this.y = e.clientY - rect.top;
            }
        }
    });

    Bridge.define("GameEngineJS.System.Scheduler", {
        fields: {
            _actionList: null
        },
        ctors: {
            init: function () {
                this._actionList = new (System.Collections.Generic.List$1(Function)).ctor();
            },
            ctor: function () {
                this.$initialize();
                this.Update();
            }
        },
        methods: {
            Add: function (methods) {
                this._actionList.add(function () {
                    methods();
                });
            },
            Update: function () {
                var $t;
                $t = Bridge.getEnumerator(this._actionList);
                try {
                    while ($t.moveNext()) {
                        var a = $t.Current;
                        a();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                window.requestAnimationFrame(Bridge.fn.cacheBind(this, this.Update));
            }
        }
    });

    Bridge.define("GameEngineJS.Components.Animator", {
        inherits: [GameEngineJS.Components.Component],
        fields: {
            _animations: null,
            currentAnimation: null,
            currentFrame: 0,
            fps: 0,
            playing: false,
            lastTimeFrame: 0
        },
        ctors: {
            init: function () {
                this.currentAnimation = "";
                this.currentFrame = 0;
                this.fps = 1;
                this.playing = false;
                this.lastTimeFrame = 0;
            },
            ctor: function (parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, parent);
                this._animations = new (System.Collections.Generic.Dictionary$2(System.String,System.Collections.Generic.List$1(System.Object)))();
            }
        },
        methods: {
            GotoAndPlay: function (animationName) {
                this.GotoAndPlay$1(animationName, 0);
            },
            GotoAndPlay$1: function (animationName, frame) {
                this.currentAnimation = animationName;
                this.currentFrame = frame;
                this.playing = true;
            },
            GotoAndStop: function (animationName) {
                this.GotoAndStop$1(animationName, 0);
            },
            GotoAndStop$1: function (animationName, frame) {
                this.currentAnimation = animationName;
                this.currentFrame = frame;

                if (!(this._animations.get(this.currentAnimation).getItem(this.currentFrame) >= 0)) {
                    this.parent.image = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                } else {
                    var sheet = this.parent.image;
                    sheet.currentIndex = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                }

                this.playing = false;
            },
            Stop: function () {
                this.playing = false;
            },
            Start: function () {
                this.playing = true;
            },
            Create$2: function (animationName, list) {
                var t = new (System.Collections.Generic.List$1(System.Object)).ctor();
                t = list;
                this.Create(animationName, t);
            },
            Create$1: function (animationName, list) {
                var t = new (System.Collections.Generic.List$1(System.Object)).ctor();
                t = list;
                this.Create(animationName, t);
            },
            Create: function (animationName, list) {
                this._animations.set(animationName, list);
            },
            Update: function () {
                if (!this.playing) {
                    return;
                }

                var now = System.DateTime.subdd(System.DateTime.getNow(), System.DateTime.addYears(System.DateTime.getMinValue(), 2017)).getTotalMilliseconds();
                var delta = now - this.lastTimeFrame;
                if (delta > ((Bridge.Int.div(1000, this.fps)) | 0)) {
                    this.currentFrame = (this.currentFrame + 1) | 0;
                    if (this.currentFrame >= this._animations.get(this.currentAnimation).Count) {
                        this.currentFrame = 0;
                    }

                    if (!(this._animations.get(this.currentAnimation).getItem(this.currentFrame) >= 0)) {
                        this.parent.image = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                    } else {
                        var sheet = this.parent.image;
                        sheet.currentIndex = this._animations.get(this.currentAnimation).getItem(this.currentFrame);
                    }

                    this.lastTimeFrame = now;
                }

            }
        }
    });

    Bridge.define("GameEngineJS.Components.Collision", {
        inherits: [GameEngineJS.Components.Component],
        fields: {
            _boxes: null
        },
        ctors: {
            ctor: function (_parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, _parent);
                this._boxes = new (System.Collections.Generic.List$1(GameEngineJS.Maths.Vector4)).ctor();
            }
        },
        methods: {
            AddBox: function (x1, y1, width, height) {
                this._boxes.add(new GameEngineJS.Maths.Vector4(x1, y1, width, height));
            },
            ParentPosCalculationX: function (x, parent) {
                var adding = 0;
                var angleAdding = 0;

                if (parent._parent != null) {
                    adding = this.ParentPosCalculationX(parent.position.X, parent._parent);
                    angleAdding = (Math.cos(parent._parent.angle * Math.PI / 180)) * x;
                }

                if (parent._parent == null) {
                    adding += parent.position.X;
                }

                return adding + angleAdding;
            },
            ParentPosCalculationY: function (y, parent) {
                var adding = 0;
                var angleAdding = 0;

                if (parent._parent != null) {
                    adding = this.ParentPosCalculationY(parent.position.Y, parent._parent);
                    angleAdding = (Math.sin(parent._parent.angle * Math.PI / 180)) * y;
                }

                if (parent._parent == null) {
                    adding += parent.position.Y;
                }

                return adding + angleAdding;
            },
            HitTestObject: function (obj) {
                var $t, $t1, $t2;

                var px = this.parent.position.X;
                var py = this.parent.position.Y;
                var p2x = obj.position.X;
                var p2y = obj.position.Y;

                if (this.parent._parent != null) {
                    px = this.ParentPosCalculationX(this.parent.position.X, this.parent);
                    py = this.ParentPosCalculationY(this.parent.position.Y, this.parent);
                }

                if (obj._parent != null) {
                    p2x = this.ParentPosCalculationX(obj.position.X, obj);
                    p2y = this.ParentPosCalculationY(obj.position.Y, obj);
                }

                $t = Bridge.getEnumerator(obj.components.getValues(), GameEngineJS.Components.Component);
                try {
                    while ($t.moveNext()) {
                        var cp = $t.Current;
                        if (Bridge.referenceEquals(Bridge.getType(cp), GameEngineJS.Components.Collision)) {
                            var c = Bridge.cast(cp, GameEngineJS.Components.Collision);
                            $t1 = Bridge.getEnumerator(this._boxes);
                            try {
                                while ($t1.moveNext()) {
                                    var b = $t1.Current;
                                    $t2 = Bridge.getEnumerator(c._boxes);
                                    try {
                                        while ($t2.moveNext()) {
                                            var b2 = $t2.Current;
                                            if (b.X + px < b2.X + p2x + b2.Z && b.X + b.Z + px > b2.X + p2x && b.Y + py < b2.Y + b2.W + p2y && b.W + b.Y + py > b2.Y + p2y) {
                                                return true;
                                            }
                                        }
                                    } finally {
                                        if (Bridge.is($t2, System.IDisposable)) {
                                            $t2.System$IDisposable$Dispose();
                                        }
                                    }
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return false;
            },
            HitTestPoint: function (x, y) {
                var $t;

                var px = this.parent.position.X;
                var py = this.parent.position.Y;

                if (this.parent._parent != null) {
                    px = this.ParentPosCalculationX(this.parent.position.X, this.parent);
                    py = this.ParentPosCalculationX(this.parent.position.Y, this.parent);
                }

                $t = Bridge.getEnumerator(this._boxes);
                try {
                    while ($t.moveNext()) {
                        var b = $t.Current;
                        if (x < b.X + px + b.Z && x > b.X + px && y < b.Y + py + b.W && y > b.Y + py) {
                            return true;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return false;
            }
        }
    });

    Bridge.define("GameEngineJS.Components.Movement", {
        inherits: [GameEngineJS.Components.Component],
        ctors: {
            ctor: function (_parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, _parent);
            }
        },
        methods: {
            MoveToward: function (x, y, speed) {
                var $t, $t1;
                var dx = x - this.parent.position.X;
                var dy = y - this.parent.position.Y;
                var angle = Math.atan2(dy, dx);

                $t = this.parent.position;
                $t.X += speed * Math.cos(angle);
                $t1 = this.parent.position;
                $t1.Y += speed * Math.sin(angle);
            },
            LookAt: function (x, y) {
                var x2 = this.parent.position.X - x;
                var y2 = y - this.parent.position.Y;
                var angle = Math.atan2(x2, y2);
                this.parent.angle = angle * 57.29578;
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.Sprite", {
        inherits: [GameEngineJS.GameObjects.GameObject],
        ctors: {
            ctor: function (_position, _size, _image) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.position = _position;
                this.size = _size;
                this.image = _image;
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.TileMap.Layer", {
        inherits: [GameEngineJS.GameObjects.GameObject],
        fields: {
            index: 0,
            data: null,
            _tilesW: 0,
            _tilesH: 0,
            _sizeX: 0,
            _sizeY: 0,
            _sheet: null
        },
        ctors: {
            ctor: function (_index, tileMap) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.index = _index;
                this._tilesW = tileMap._tileSheet.spriteSizeX;
                this._tilesH = tileMap._tileSheet.spriteSizeY;
                this._sizeX = (tileMap._size.X) >>> 0;
                this._sizeY = (tileMap._size.Y) >>> 0;
                this.data = System.Array.create(0, null, System.Int32, this._sizeX, this._sizeY);

                for (var i = 0; System.Int64(i).lt(System.Int64(this._sizeX)); i = (i + 1) | 0) {
                    for (var j = 0; System.Int64(j).lt(System.Int64(this._sizeY)); j = (j + 1) | 0) {
                        this.data.set([i, j], -1);
                    }
                }

                this.position = tileMap.position;
                this.size = new GameEngineJS.Maths.Vector2(Bridge.Int.umul(this._sizeX, this._tilesW), Bridge.Int.umul(this._sizeY, this._tilesH));

                var canvas = Bridge.cast(document.createElement("canvas"), HTMLCanvasElement);
                canvas.width = Bridge.Int.clip32(Math.floor(this.size.X));
                canvas.height = Bridge.Int.clip32(Math.floor(this.size.Y));
                this.image = canvas;

                this._sheet = tileMap._tileSheet;
                this._sheet.data.onload = Bridge.fn.combine(this._sheet.data.onload, Bridge.fn.cacheBind(this, this.Construct$1));

            }
        },
        methods: {
            Construct: function () {
                this.Construct$1(new Event(""));
            },
            Construct$1: function (e) {
                for (var y = 0; y < this._sizeY; y = (y + 1) >>> 0) {
                    for (var x = 0; x < this._sizeX; x = (x + 1) >>> 0) {
                        this.SetTile(x, y, this.data.get([x, y]), true);
                    }
                }
            },
            SetTile: function (x, y, tile, byPassOld) {
                if (!(x >= 0 && x <= this._sizeX && y >= 0 && y <= this._sizeY)) {
                    return;
                }
                var oldTile = this.data.get([x, y]);

                var canvas = this.image;
                var ctx = canvas.getContext("2d");

                if (tile === -1 && oldTile !== -1) {
                    this.data.set([x, y], tile);
                    ctx.clearRect(Bridge.Int.umul(x, this._tilesW), Bridge.Int.umul(y, this._tilesH), this._tilesW, this._tilesH);
                    return;
                }
                if (tile === -1) {
                    return;
                }
                if (oldTile !== tile || byPassOld) {
                    this.data.set([x, y], tile);

                    if (this.image == null) {
                        return;
                    }
                    var case_x = System.Int64.toNumber((System.Int64(this.data.get([x, y])).mod(System.Int64(this._tilesW))).mul(System.Int64(this._tilesW)));
                    var case_y = Math.floor(this.data.get([x, y]) / this._tilesW) * this._tilesH;

                    ctx.drawImage(this._sheet.data, case_x, case_y, this._tilesW, this._tilesH, Bridge.Int.umul(x, this._tilesW), Bridge.Int.umul(y, this._tilesH), this._tilesW, this._tilesH);
                }

            },
            GetTile: function (x, y) {
                return this.data.get([x, y]);
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvVGlsZU1hcC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yMkkuY3MiLCJNYXRocy9WZWN0b3I0LmNzIiwiU3lzdGVtL01vdXNlLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJDb21wb25lbnRzL0NvbGxpc2lvbi5jcyIsIkNvbXBvbmVudHMvTW92ZW1lbnQuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiLCJHYW1lT2JqZWN0cy9UaWxlTWFwL0xheWVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7OzRCQVEyQkE7O2dCQUNmQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs0QkNFWUE7O2dCQUNyQkEsbUJBQWNBOzs7Ozs7Z0JBSWRBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7O3VDQUlLQTs7Z0JBQ3pCQSxJQUFJQTtvQkFBNkJBOztnQkFDakNBLDBCQUE0QkE7Ozs7d0JBRXhCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDbkJw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QUFPQSxXQUFXQSxBQUFPQSxlQUFLQSxHQUFHQSxNQUFLQSxnQkFBV0E7O29CQUVoRUEsY0FBY0Esa0JBQWFBLFFBQVFBLFFBQVFBLGNBQVNBLGNBQVNBLG1CQUFJQSxlQUFTQSxtQkFBSUEsZUFBU0EsY0FBU0E7Ozs7K0JBS25GQSxHQUFRQTtnQkFDekJBLE9BQU9BLGVBQUtBLEdBQUdBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBHYW1lT2JqZWN0IHBhcmVudCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50KEdhbWVPYmplY3QgX3BhcmVudCkge1xyXG4gICAgICAgICAgICBwYXJlbnQgPSBfcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdmlydHVhbCB2b2lkIFVwZGF0ZSgpIHt9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgQ29tcG9uZW50UmVhZGVyXHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgRGlzcGxheUxpc3QgZGlzcGxheUxpc3QgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnRSZWFkZXIoRGlzcGxheUxpc3QgbGlzdCkge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdCA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIHVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmogaW4gZGlzcGxheUxpc3QubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoS2V5VmFsdWVQYWlyPHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnQgaW4gb2JqLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVjdXJzaXZlVXBkYXRlKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCByZWN1cnNpdmVVcGRhdGUoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgaWYgKGRpc3BsYXlMaXN0Lmxpc3QuQ291bnQgPD0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iajIgaW4gb2JqLmRpc3BsYXlMaXN0Lmxpc3QpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iajIuY29tcG9uZW50cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuVmFsdWUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWN1cnNpdmVVcGRhdGUob2JqMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ2FtZXJhXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgcG9zaXRpb24geyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCByb3RhdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBuZXcgVmVjdG9yMigwLDApO1xyXG4gICAgICAgICAgICByb3RhdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKFZlY3RvcjIgX3Bvc2l0aW9uLGZsb2F0IF9yb3RhdGlvbikge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgcm90YXRpb24gPSBfcm90YXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEaXNwbGF5TGlzdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEdhbWVPYmplY3Q+IGxpc3QgeyBnZXQ7IHNldDsgfSAgXHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChUaWxlTWFwIG9iaiwgR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoTGF5ZXIgbCBpbiBvYmoubGF5ZXJzLlZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgQWRkQXQobCxwYXJlbnQsbC5pbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaixHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgICAgICBvYmouX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEF0KEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50LCB1aW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIGxpc3QuSW5zZXJ0KChpbnQpaW5kZXgsIG9iaik7XHJcbiAgICAgICAgfVxyXG5cblxyXG4gICAgXG5wcml2YXRlIExpc3Q8R2FtZU9iamVjdD4gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2xpc3Q9bmV3IExpc3Q8R2FtZU9iamVjdD4oKSA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLlN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NlbmVcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSBjYW1lcmEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG4gICAgICAgIHB1YmxpYyBNb3VzZSBtb3VzZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTY2VuZShEaXNwbGF5TGlzdCBvYmpMaXN0LHN0cmluZyBjYW52YXNJRCxzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgY2FtZXJhID0gbmV3IENhbWVyYSgpO1xyXG4gICAgICAgICAgICBfbWFpbkRpc3BsYXlMaXN0ID0gb2JqTGlzdDtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IERvY3VtZW50LlF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiY2FudmFzI1wiICsgY2FudmFzSUQpO1xyXG4gICAgICAgICAgICBfZHJhd2VyID0gbmV3IERyYXdlcihfY2FudmFzKTtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIG1vdXNlID0gbmV3IE1vdXNlKF9jYW52YXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVmcmVzaCgpIHtcclxuICAgICAgICAgICAgX2RyYXdlci5GaWxsU2NyZWVuKF9jb2xvcik7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIF9tYWluRGlzcGxheUxpc3QubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG9iai5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlgsIG9iai5wb3NpdGlvbi5ZIC0gY2FtZXJhLnBvc2l0aW9uLlksIG9iai5zaXplLlgsIG9iai5zaXplLlksIG9iai5hbmdsZSwgb2JqLmltYWdlLGZhbHNlLDEpO1xyXG4gICAgICAgICAgICAgICAgRHJhd0NoaWxkKG9iaixvYmoucG9zaXRpb24uWCxvYmoucG9zaXRpb24uWSxvYmouYW5nbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRHJhd0NoaWxkKEdhbWVPYmplY3Qgb2JqLGZsb2F0IHgsZmxvYXQgeSxmbG9hdCBhbmdsZSkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iajIgaW4gb2JqLmRpc3BsYXlMaXN0Lmxpc3QpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1ggPSB4ICsgKGZsb2F0KShNYXRoLkNvcyhvYmouYW5nbGUqTWF0aC5QSS8xODApKSAqIG9iajIucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3WSA9IHkgKyAoZmxvYXQpKE1hdGguU2luKG9iai5hbmdsZSpNYXRoLlBJLzE4MCkpICogb2JqMi5wb3NpdGlvbi5ZIC0gY2FtZXJhLnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdBbmdsZSA9IG9iajIuYW5nbGUgKyBhbmdsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBfZHJhd2VyLkRyYXcobmV3WCwgbmV3WSwgb2JqMi5zaXplLlgsIG9iajIuc2l6ZS5ZLCBuZXdBbmdsZSwgb2JqMi5pbWFnZSwgZmFsc2UsIDEpO1xyXG4gICAgICAgICAgICAgICAgRHJhd0NoaWxkKG9iajIsbmV3WCxuZXdZLG5ld0FuZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkV2ZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgS2V5Qm9hcmRFdmVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleVByZXNzRXZlbnQoc3RyaW5nIGtleSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVByZXNzRXZlbnQgT25LZXlQcmVzc0V2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5RG93bkV2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlEb3duRXZlbnQgT25LZXlEb3duRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlVcEV2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlVcEV2ZW50IE9uS2V5VXBFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBLZXlCb2FyZEV2ZW50KCkge1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlQcmVzcywgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlQcmVzcyk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleURvd24sIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5RG93bik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleVVwLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleVVwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVByZXNzKEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5UHJlc3NFdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleVByZXNzRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleURvd24oRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleURvd25FdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleURvd25FdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5VXAoRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVVwRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlVcEV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgRHJhd2VyIGRyYXdlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjaGVkdWxlciBzY2hlZHVsZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2VuZSBzY2VuZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIE1vdXNlIG1vdXNlIHsgZ2V0IHsgcmV0dXJuIHNjZW5lLm1vdXNlOyB9IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfZGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBDb21wb25lbnRSZWFkZXIgX2NvbXBvbmVudFJlYWRlcjtcclxuXHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lEKSA6IHRoaXMoY2FudmFzSUQsIFwiI2ZmZlwiKSB7IH1cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsY2FudmFzSUQsY29sb3IpO1xyXG4gICAgICAgICAgICBfY29tcG9uZW50UmVhZGVyID0gbmV3IENvbXBvbmVudFJlYWRlcihfZGlzcGxheUxpc3QpO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKXNjZW5lLlJlZnJlc2gpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pX2NvbXBvbmVudFJlYWRlci51cGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkKG9iaiwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgc2l6ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGFuZ2xlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnRzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBDb21wb25lbnQ+KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgRGlzcGxheUxpc3QgZGlzcGxheUxpc3QgPSBuZXcgRGlzcGxheUxpc3QoKTtcclxuICAgICAgICBpbnRlcm5hbCBHYW1lT2JqZWN0IF9wYXJlbnQ7XHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuICAgICAgICBwdWJsaWMgQ29tcG9uZW50IEFkZENvbXBvbmVudChzdHJpbmcgaW5zdGFuY2VOYW1lLCBDb21wb25lbnQgY29tcG9uZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcC5UaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKHRpbGVNYXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKG9iaix0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUaWxlTWFwXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBYTUxIdHRwUmVxdWVzdCByZXF1ZXN0O1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBEaWN0aW9uYXJ5PHN0cmluZywgTGF5ZXI+IGxheWVycyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgU3ByaXRlU2hlZXQgX3RpbGVTaGVldDtcclxuICAgICAgICBpbnRlcm5hbCBWZWN0b3IySSBfc2l6ZTtcclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgcG9zaXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVGlsZU1hcChTcHJpdGVTaGVldCB0aWxlU2hlZXQsIFZlY3RvcjIgcG9zLCBWZWN0b3IySSBzaXplKSB7XHJcbiAgICAgICAgICAgIGxheWVycyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGF5ZXI+KCk7XHJcbiAgICAgICAgICAgIF90aWxlU2hlZXQgPSB0aWxlU2hlZXQ7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gcG9zO1xyXG4gICAgICAgICAgICBfc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgTGF5ZXIgQWRkTGF5ZXIoc3RyaW5nIG5hbWUsdWludCBpbmRleCkge1xyXG4gICAgICAgICAgICBsYXllcnNbbmFtZV0gPSBuZXcgTGF5ZXIoaW5kZXgsIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJzW25hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlTGF5ZXIoc3RyaW5nIG5hbWUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW25hbWVdID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldFRpbGUoc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MsIGludCB0aWxlKSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tsYXllcl0uU2V0VGlsZSgodWludClwb3MuWCwgKHVpbnQpcG9zLlksIHRpbGUsZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGludCBHZXRUaWxlKHN0cmluZyBsYXllciwgVmVjdG9yMkkgcG9zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbGF5ZXJdLkdldFRpbGUoKHVpbnQpcG9zLlgsICh1aW50KXBvcy5ZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIExvYWRUaWxlZEpzb24oc3RyaW5nIHVybCwgdWludCBudW1iZXJPZkxheWVycykge1xyXG5cclxuICAgICAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgbnVtYmVyT2ZMYXllcnM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgQWRkTGF5ZXIoaStcIlwiLCBpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5PbkxvYWQgKz0gTG9hZFRpbGVkO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lk9wZW4oXCJnZXRcIix1cmwpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LlNlbmQoKTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIExvYWRUaWxlZChFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGR5bmFtaWMgYSA9IEpTT04uUGFyc2UocmVxdWVzdC5SZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICBfc2l6ZS5YID0gYS53aWR0aDtcclxuICAgICAgICAgICAgX3NpemUuWSA9IGEuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgYS5sYXllcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGR5bmFtaWMgbGF5ZXJqcyA9IGEubGF5ZXJzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIExheWVyIGxheWVyID0gbGF5ZXJzW2kgKyBcIlwiXTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGF5ZXJqcyA9IGxheWVyanMuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCBqID0gMDsgaiA8IGxheWVyanMubGVuZ3RoOyBqKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW50IGluZGV4WCA9IGogJSBfc2l6ZS5YO1xyXG4gICAgICAgICAgICAgICAgICAgIGludCBpbmRleFkgPSAoaW50KU1hdGguRmxvb3IoKGZsb2F0KShqIC8gX3NpemUuWCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsYXllci5TZXRUaWxlKCh1aW50KWluZGV4WCwgKHVpbnQpaW5kZXhZLCBsYXllcmpzW2pdLTEsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRHJhd2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgX2N0eDtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaWxsU2NyZWVuKHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBfY3R4LkZpbGxSZWN0KDAsMCxfY2FudmFzLldpZHRoLF9jYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZHluYW1pYyBpbWcpXHJcbntcclxuICAgIERyYXcoeCwgeSwgdywgaCwgMCwgaW1nLCBmYWxzZSwgMSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgdywgZmxvYXQgaCwgZmxvYXQgciwgZHluYW1pYyBpbWcsIGJvb2wgZm9sbG93LCBmbG9hdCBhbHBoYSkge1xyXG4gICAgICAgICAgICBfY3R4LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfY2FudmFzLlN0eWxlLkltYWdlUmVuZGVyaW5nID0gSW1hZ2VSZW5kZXJpbmcuUGl4ZWxhdGVkO1xyXG4gICAgICAgICAgICBfY3R4LlNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHN4ID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgc3kgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBzdyA9IHc7XHJcbiAgICAgICAgICAgIGZsb2F0IHNoID0gaDtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltZy5zcHJpdGVTaXplWCAhPSBudWxsICYmIGltZy5zcHJpdGVTaXplWSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBpbWcyID0gKFNwcml0ZVNoZWV0KWltZztcclxuICAgICAgICAgICAgICAgIGlmIChpbWcyLmRhdGEuV2lkdGggPT0gMCkgcmV0dXJuOyBcclxuICAgICAgICAgICAgICAgIHN4ID0gKGltZzIuY3VycmVudEluZGV4ICUgKGltZzIuZGF0YS5XaWR0aCAvIGltZzIuc3ByaXRlU2l6ZVgpKSAqIGltZzIuc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgICAgICBzeSA9IChmbG9hdClNYXRoLkZsb29yKGltZzIuY3VycmVudEluZGV4IC8gKChkb3VibGUpaW1nMi5kYXRhLldpZHRoIC8gaW1nMi5zcHJpdGVTaXplWCkpICogaW1nMi5zcHJpdGVTaXplWTtcclxuICAgICAgICAgICAgICAgIHN3ID0gaW1nMi5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgICAgIHNoID0gaW1nMi5zcHJpdGVTaXplWTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGltZy5kYXRhICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZyA9IGltZy5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL09iamVjdCBSb3RhdGlvblxyXG4gICAgICAgICAgICBmbG9hdCBveCA9IHggKyAodyAvIDIpO1xyXG4gICAgICAgICAgICBmbG9hdCBveSA9IHkgKyAoaCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUob3gsIG95KTtcclxuICAgICAgICAgICAgX2N0eC5Sb3RhdGUoKHIpICogTWF0aC5QSSAvIDE4MCk7IC8vZGVncmVlXHJcbiAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKC1veCwgLW95KTtcclxuICAgICAgICAgICAgLy8tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICBfY3R4LkRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCB4LCB5LCB3LCBoKTtcclxuXHJcbiAgICAgICAgICAgIF9jdHguUmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgSW1hZ2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKHN0cmluZyBzcmMpIHtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGRhdGEuU3JjID0gc3JjO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJbWFnZShIVE1MSW1hZ2VFbGVtZW50IGltZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HcmFwaGljc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlU2hlZXRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzcHJpdGVTaXplWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc3ByaXRlU2l6ZVkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IGN1cnJlbnRJbmRleCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGVTaGVldChzdHJpbmcgc3JjLCB1aW50IF9zcHJpdGVTaXplWCwgdWludCBfc3ByaXRlU2l6ZVkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcbiAgICAgICAgICAgIHNwcml0ZVNpemVYID0gX3Nwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICBzcHJpdGVTaXplWSA9IF9zcHJpdGVTaXplWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCBfeCAsIGZsb2F0IF95KSB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3IySVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBZIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjJJKGludCBfeCwgaW50IF95KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWCA9IF94O1xyXG4gICAgICAgICAgICBZID0gX3k7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3I0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFcgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yNChmbG9hdCBfeCwgZmxvYXQgX3ksIGZsb2F0IF96LCBmbG9hdCBfdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgICAgICBaID0gX3o7XHJcbiAgICAgICAgICAgIFcgPSBfdztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW91c2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgTW91c2UoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFVwZGF0ZShFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2xpZW50UmVjdCByZWN0ID0gX2NhbnZhcy5HZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgeCA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRYIC0gKGZsb2F0KXJlY3QuTGVmdDtcclxuICAgICAgICAgICAgeSA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRZIC0gKGZsb2F0KXJlY3QuVG9wO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX194PTA7cHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feT0wO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjaGVkdWxlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgTGlzdDxBY3Rpb24+IF9hY3Rpb25MaXN0ID0gbmV3IExpc3Q8QWN0aW9uPigpO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBTY2hlZHVsZXIoKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEFjdGlvbiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgIF9hY3Rpb25MaXN0LkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBtZXRob2RzKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChBY3Rpb24gYSBpbiBfYWN0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgYSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBXaW5kb3cuUmVxdWVzdEFuaW1hdGlvbkZyYW1lKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pVXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRvciA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4gX2FuaW1hdGlvbnMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgY3VycmVudEFuaW1hdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBjdXJyZW50RnJhbWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgZnBzIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgcGxheWluZyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBsYXN0VGltZUZyYW1lID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIEFuaW1hdG9yKEdhbWVPYmplY3QgcGFyZW50KSA6IGJhc2UocGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2FuaW1hdGlvbnMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kUGxheShhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgR290b0FuZFN0b3Aoc3RyaW5nIGFuaW1hdGlvbk5hbWUpXHJcbntcclxuICAgIEdvdG9BbmRTdG9wKGFuaW1hdGlvbk5hbWUsIDApO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSwgaW50IGZyYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEoKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXSA+PSAwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICBzaGVldC5jdXJyZW50SW5kZXggPSAodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKCkge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydCgpIHtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8dWludD4gbGlzdCkge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4gdCA9IG5ldyBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4oKTtcclxuICAgICAgICAgICAgdCA9IGxpc3QuQXM8TGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDxJbWFnZT4gbGlzdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiB0ID0gbmV3IExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4+KCk7XHJcbiAgICAgICAgICAgIENyZWF0ZShhbmltYXRpb25OYW1lLCB0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4gbGlzdCl7XHJcbiAgICAgICAgICAgIF9hbmltYXRpb25zW2FuaW1hdGlvbk5hbWVdID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIG92ZXJyaWRlIHZvaWQgVXBkYXRlKCkge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGRvdWJsZSBub3cgPSBEYXRlVGltZS5Ob3cuU3VidHJhY3QoRGF0ZVRpbWUuTWluVmFsdWUuQWRkWWVhcnMoMjAxNykpLlRvdGFsTWlsbGlzZWNvbmRzO1xyXG4gICAgICAgICAgICBkb3VibGUgZGVsdGEgPSBub3cgLSBsYXN0VGltZUZyYW1lO1xyXG4gICAgICAgICAgICBpZiAoZGVsdGEgPiAxMDAwL2Zwcykge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEZyYW1lKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lID49IF9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dLkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEZyYW1lID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoISgodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdID49IDApKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5pbWFnZSA9IChJbWFnZSlfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgU3ByaXRlU2hlZXQgc2hlZXQgPSAoU3ByaXRlU2hlZXQpcGFyZW50LmltYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoZWV0LmN1cnJlbnRJbmRleCA9ICh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGFzdFRpbWVGcmFtZSA9IG5vdztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19jdXJyZW50QW5pbWF0aW9uPVwiXCI7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRGcmFtZT0wO3ByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19mcHM9MTtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3BsYXlpbmc9ZmFsc2U7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb2xsaXNpb24gOiBDb21wb25lbnRcclxuICAgIHtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgTGlzdDxWZWN0b3I0PiBfYm94ZXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDb2xsaXNpb24oR2FtZU9iamVjdCBfcGFyZW50KSA6IGJhc2UoX3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9ib3hlcyA9IG5ldyBMaXN0PFZlY3RvcjQ+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRCb3goZmxvYXQgeDEsZmxvYXQgeTEsIGZsb2F0IHdpZHRoLCBmbG9hdCBoZWlnaHQpIHtcclxuICAgICAgICAgICAgX2JveGVzLkFkZChuZXcgVmVjdG9yNCh4MSx5MSx3aWR0aCxoZWlnaHQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25YKGZsb2F0IHgsIEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFkZGluZyA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlQWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRpbmcgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsIHBhcmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlQWRkaW5nID0gKGZsb2F0KShNYXRoLkNvcyhwYXJlbnQuX3BhcmVudC5hbmdsZSAqIE1hdGguUEkgLyAxODApKSAqIHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCA9PSBudWxsKSBhZGRpbmcgKz0gcGFyZW50LnBvc2l0aW9uLlg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gIGFkZGluZyArIGFuZ2xlQWRkaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmbG9hdCBQYXJlbnRQb3NDYWxjdWxhdGlvblkoZmxvYXQgeSwgR2FtZU9iamVjdCBwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKHBhcmVudC5wb3NpdGlvbi5ZLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5TaW4ocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFkZGluZyArIGFuZ2xlQWRkaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgSGl0VGVzdE9iamVjdChHYW1lT2JqZWN0IG9iaikge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgcHggPSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcHkgPSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgcDJ4ID0gb2JqLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeSA9IG9iai5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCAgcGFyZW50KTsgXHJcbiAgICAgICAgICAgICAgICBweSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvYmouX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwMnggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgob2JqLnBvc2l0aW9uLlgsIG9iaik7XHJcbiAgICAgICAgICAgICAgICBwMnkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkob2JqLnBvc2l0aW9uLlksIG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvbXBvbmVudCBjcCBpbiBvYmouY29tcG9uZW50cy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjcC5HZXRUeXBlKCkgPT0gdHlwZW9mKENvbGxpc2lvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb24gYyA9IChDb2xsaXNpb24pY3A7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIyIGluIGMuX2JveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5YICsgcHggPCBiMi5YICsgcDJ4ICsgYjIuWiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5YICsgYi5aICsgcHggPiBiMi5YICsgcDJ4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlkgKyBweSA8IGIyLlkgKyBiMi5XICsgcDJ5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlcgKyBiLlkgKyBweSAgPiBiMi5ZICsgcDJ5ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RQb2ludChmbG9hdCB4LGZsb2F0IHkpIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcHggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsIHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBweSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPCBiLlggKyBweCArIGIuWiAmJlxyXG4gICAgICAgICAgICAgICAgICAgeCA+IGIuWCArIHB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICB5IDwgYi5ZICsgcHkgKyBiLlcgJiZcclxuICAgICAgICAgICAgICAgICAgIHkgPiBiLlkgKyBweSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW92ZW1lbnQgOiBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTW92ZW1lbnQoR2FtZU9iamVjdCBfcGFyZW50KSA6IGJhc2UoX3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlVG93YXJkKGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHNwZWVkKSB7XHJcbiAgICAgICAgICAgIGZsb2F0IGR4ID0geCAtIHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBkeSA9IHkgLSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpTWF0aC5BdGFuMihkeSwgZHgpO1xyXG5cclxuICAgICAgICAgICAgcGFyZW50LnBvc2l0aW9uLlggKz0gc3BlZWQgKiAoZmxvYXQpTWF0aC5Db3MoYW5nbGUpO1xyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWSArPSBzcGVlZCAqIChmbG9hdClNYXRoLlNpbihhbmdsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBMb29rQXQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcbiAgICAgICAgICAgIGZsb2F0IHgyID0gcGFyZW50LnBvc2l0aW9uLlggLSB4O1xyXG4gICAgICAgICAgICBmbG9hdCB5MiA9IHkgLSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpTWF0aC5BdGFuMih4MiwgeTIpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYW5nbGUgPSBhbmdsZSAqIChmbG9hdCkoMTgwL01hdGguUEkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgU3ByaXRlKFZlY3RvcjIgX3Bvc2l0aW9uLCBWZWN0b3IyIF9zaXplLCBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIFNwcml0ZVNoZWV0PiBfaW1hZ2UpIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBfcG9zaXRpb247XHJcbiAgICAgICAgICAgIHNpemUgPSBfc2l6ZTtcclxuICAgICAgICAgICAgaW1hZ2UgPSBfaW1hZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBMYXllciA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgdWludCBpbmRleCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludFssXSBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1aW50IF90aWxlc1c7XHJcbiAgICAgICAgcHJpdmF0ZSB1aW50IF90aWxlc0g7XHJcbiAgICAgICAgcHJpdmF0ZSB1aW50IF9zaXplWDtcclxuICAgICAgICBwcml2YXRlIHVpbnQgX3NpemVZO1xyXG5cclxuICAgICAgICBwcml2YXRlIFNwcml0ZVNoZWV0IF9zaGVldDtcclxuXHJcbiAgICAgICAgcHVibGljIExheWVyKHVpbnQgX2luZGV4LCBUaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgaW5kZXggPSBfaW5kZXg7XHJcbiAgICAgICAgICAgIF90aWxlc1cgPSB0aWxlTWFwLl90aWxlU2hlZXQuc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgIF90aWxlc0ggPSB0aWxlTWFwLl90aWxlU2hlZXQuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgIF9zaXplWCA9ICh1aW50KXRpbGVNYXAuX3NpemUuWDtcclxuICAgICAgICAgICAgX3NpemVZID0gKHVpbnQpdGlsZU1hcC5fc2l6ZS5ZO1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IGludFtfc2l6ZVgsIF9zaXplWV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9zaXplWDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IF9zaXplWTsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2ksIGpdID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGlsZU1hcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IG5ldyBWZWN0b3IyKF9zaXplWCAqIF90aWxlc1csIF9zaXplWSAqIF90aWxlc0gpO1xyXG5cclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzID0gKEhUTUxDYW52YXNFbGVtZW50KURvY3VtZW50LkNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgICAgIGNhbnZhcy5XaWR0aCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlgpO1xyXG4gICAgICAgICAgICBjYW52YXMuSGVpZ2h0ID0gKGludClNYXRoLkZsb29yKHNpemUuWSk7XHJcbiAgICAgICAgICAgIGltYWdlID0gY2FudmFzO1xyXG5cclxuICAgICAgICAgICAgX3NoZWV0ID0gdGlsZU1hcC5fdGlsZVNoZWV0O1xyXG4gICAgICAgICAgICBfc2hlZXQuZGF0YS5PbkxvYWQgKz0gQ29uc3RydWN0O1xyXG5cclxuICAgICAgICB9XHJcbmludGVybmFsIHZvaWQgQ29uc3RydWN0KClcclxue1xyXG4gICAgQ29uc3RydWN0KG5ldyBFdmVudChcIlwiKSk7XHJcbn0gICAgICAgIGludGVybmFsIHZvaWQgQ29uc3RydWN0KEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgZm9yICh1aW50IHkgPSAwOyB5IDwgX3NpemVZOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAodWludCB4ID0gMDsgeCA8IF9zaXplWDsgeCsrKXtcclxuICAgICAgICAgICAgICAgICAgICBTZXRUaWxlKHgseSxkYXRhW3gseV0sdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgU2V0VGlsZSh1aW50IHgsIHVpbnQgeSwgaW50IHRpbGUsIGJvb2wgYnlQYXNzT2xkKSB7XHJcbiAgICAgICAgICAgIGlmICghKHggPj0gMCAmJiB4IDw9IF9zaXplWCAmJiB5ID49IDAgJiYgeSA8PSBfc2l6ZVkpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGludCBvbGRUaWxlID0gZGF0YVt4LCB5XTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlID09IC0xICYmIG9sZFRpbGUgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbeCwgeV0gPSB0aWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LkNsZWFyUmVjdCh4Kl90aWxlc1cseSpfdGlsZXNILF90aWxlc1csX3RpbGVzSCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRpbGUgPT0gLTEpIHJldHVybjtcclxuICAgICAgICAgICAgaWYob2xkVGlsZSAhPSB0aWxlIHx8IGJ5UGFzc09sZCkgeyBcclxuICAgICAgICAgICAgICAgIGRhdGFbeCwgeV0gPSB0aWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbWFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBjYXNlX3ggPSAoZGF0YVt4LCB5XSAlIF90aWxlc1cpICogX3RpbGVzVztcclxuICAgICAgICAgICAgICAgIGZsb2F0IGNhc2VfeSA9IChmbG9hdClNYXRoLkZsb29yKChmbG9hdClkYXRhW3gsIHldIC8gX3RpbGVzVykgKiBfdGlsZXNIO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5EcmF3SW1hZ2UoX3NoZWV0LmRhdGEsIGNhc2VfeCwgY2FzZV95LCBfdGlsZXNXLCBfdGlsZXNILCB4ICogX3RpbGVzVywgeSAqIF90aWxlc0gsIF90aWxlc1csIF90aWxlc0gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgaW50IEdldFRpbGUodWludCB4LCB1aW50IHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbeCwgeV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
