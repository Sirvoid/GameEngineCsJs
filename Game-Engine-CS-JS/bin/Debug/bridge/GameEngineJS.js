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
                        this.AddAt(l, parent, ((l.index) | 0));
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
                this.list.insert(index, obj);
                obj._parent = parent;
            },
            Remove: function (obj) {
                this.list.remove(obj);
            },
            Move: function (obj, index) {
                var oldIndex = this.list.indexOf(obj);
                this.list.removeAt(oldIndex);
                this.list.insert(index, obj);
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
            },
            AddChildAt: function (obj, index) {
                this._displayList.AddAt(obj, null, index);
            },
            RemoveChild: function (obj) {
                this._displayList.Remove(obj);
            },
            MoveChild: function (obj, index) {
                this._displayList.Move(obj, index);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.GameObject", {
        statics: {
            fields: {
                IDIncrementer: 0
            },
            ctors: {
                init: function () {
                    this.IDIncrementer = 0;
                }
            }
        },
        fields: {
            position: null,
            size: null,
            angle: 0,
            ID: 0,
            image: null,
            components: null,
            displayList: null,
            _parent: null
        },
        ctors: {
            init: function () {
                var $t;
                this.ID = Bridge.identity(GameEngineJS.GameObjects.GameObject.IDIncrementer, ($t = (GameEngineJS.GameObjects.GameObject.IDIncrementer + 1) | 0, GameEngineJS.GameObjects.GameObject.IDIncrementer = $t, $t));
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
            },
            AddChildAt: function (obj, index) {
                this.displayList.AddAt(obj, this, index);
            },
            RemoveChild: function (obj) {
                this.displayList.Remove(obj);
            },
            MoveChild: function (obj, index) {
                this.displayList.Move(obj, index);
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
            GetLayer: function (name) {
                return this.layers.get(name);
            },
            SetCollision$1: function (layer, x, y, collisionType) {
                this.SetCollision(layer, new GameEngineJS.Maths.Vector2I(x, y), collisionType);
            },
            SetCollision: function (layer, pos, collisionType) {
                this.layers.get(layer).SetCollision(((pos.X) >>> 0), ((pos.Y) >>> 0), collisionType);
            },
            GetCollision$1: function (layer, x, y) {
                return this.GetCollision(layer, new GameEngineJS.Maths.Vector2I(x, y));
            },
            GetCollision: function (layer, pos) {
                return this.layers.get(layer).GetCollision(((pos.X) >>> 0), ((pos.Y) >>> 0));
            },
            SetTile$1: function (layer, x, y, tile) {
                this.SetTile(layer, new GameEngineJS.Maths.Vector2I(x, y), tile);
            },
            SetTile: function (layer, pos, tile) {
                this.layers.get(layer).SetTile(((pos.X) >>> 0), ((pos.Y) >>> 0), tile, false);
            },
            GetTile$1: function (layer, x, y) {
                return this.GetTile(layer, new GameEngineJS.Maths.Vector2I(x, y));
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
            },
            HitTestLayer: function (layer, colliderValue) {
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

                        var totalX = px + b.X;
                        var totalY = py + b.Y;

                        var totalX2 = totalX + b.Z;
                        var totalY2 = totalY + b.W;

                        var left_tile = Bridge.Int.clip32(Math.floor((totalX - layer.position.X) / layer.tilesW));
                        var right_tile = Bridge.Int.clip32(Math.floor((totalX2 - layer.position.X) / layer.tilesW));
                        var top_tile = Bridge.Int.clip32(Math.floor((totalY - layer.position.Y) / layer.tilesH));
                        var bottom_tile = Bridge.Int.clip32(Math.floor((totalY2 - layer.position.Y) / layer.tilesH));

                        for (var y = (top_tile - 1) | 0; y <= ((bottom_tile + 1) | 0); y = (y + 1) | 0) {
                            for (var x = (left_tile - 1) | 0; x <= ((right_tile + 1) | 0); x = (x + 1) | 0) {
                                if (x < 0 || System.Int64(x).gt(System.Int64(layer.sizeX - 1)) || System.Int64(y).gt(System.Int64(layer.sizeY - 1)) || y < 0) {
                                    continue;
                                }
                                var collider = layer.collisionData.get([x, y]);
                                if (collider !== colliderValue) {
                                    continue;
                                }

                                var tileX = System.Int64.toNumber((System.Int64(x).mul(System.Int64(layer.tilesW)))) + layer.position.X;
                                var tileY = System.Int64.toNumber((System.Int64(y).mul(System.Int64(layer.tilesH)))) + layer.position.Y;

                                var tileX2 = tileX + layer.tilesW;
                                var tileY2 = tileY + layer.tilesH;


                                var overX = (totalX < tileX2) && (totalX2 > tileX);
                                var overY = (totalY < tileY2) && (totalY2 > tileY);
                                if (overX && overY) {
                                    return true;
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
            MoveToward: function (pos, speed) {
                this.MoveToward$1(pos.X, pos.Y, speed);
            },
            MoveToward$1: function (x, y, speed) {
                var $t, $t1;
                var dx = x - this.parent.position.X;
                var dy = y - this.parent.position.Y;
                var angle = Math.atan2(dy, dx);

                $t = this.parent.position;
                $t.X += speed * Math.cos(angle);
                $t1 = this.parent.position;
                $t1.Y += speed * Math.sin(angle);
            },
            LookAt: function (pos) {
                this.LookAt$1(pos.X, pos.Y);
            },
            LookAt$1: function (x, y) {
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
            collisionData: null,
            tilesW: 0,
            tilesH: 0,
            sizeX: 0,
            sizeY: 0,
            _sheet: null
        },
        ctors: {
            ctor: function (_index, tileMap) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.index = _index;
                this.tilesW = tileMap._tileSheet.spriteSizeX;
                this.tilesH = tileMap._tileSheet.spriteSizeY;
                this.sizeX = (tileMap._size.X) >>> 0;
                this.sizeY = (tileMap._size.Y) >>> 0;
                this.data = System.Array.create(0, null, System.Int32, this.sizeX, this.sizeY);
                this.collisionData = System.Array.create(0, null, System.Int32, this.sizeX, this.sizeY);

                for (var i = 0; System.Int64(i).lt(System.Int64(this.sizeX)); i = (i + 1) | 0) {
                    for (var j = 0; System.Int64(j).lt(System.Int64(this.sizeY)); j = (j + 1) | 0) {
                        this.data.set([i, j], -1);
                    }
                }

                this.position = tileMap.position;
                this.size = new GameEngineJS.Maths.Vector2(Bridge.Int.umul(this.sizeX, this.tilesW), Bridge.Int.umul(this.sizeY, this.tilesH));

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
                for (var y = 0; y < this.sizeY; y = (y + 1) >>> 0) {
                    for (var x = 0; x < this.sizeX; x = (x + 1) >>> 0) {
                        this.SetTile(x, y, this.data.get([x, y]), true);
                    }
                }
            },
            SetTile: function (x, y, tile, byPassOld) {
                if (!(x >= 0 && x <= this.sizeX && y >= 0 && y <= this.sizeY)) {
                    return;
                }
                var oldTile = this.data.get([x, y]);

                var canvas = this.image;
                var ctx = canvas.getContext("2d");

                if (tile === -1 && oldTile !== -1) {
                    this.data.set([x, y], tile);
                    ctx.clearRect(Bridge.Int.umul(x, this.tilesW), Bridge.Int.umul(y, this.tilesH), this.tilesW, this.tilesH);
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
                    var case_x = System.Int64.toNumber((System.Int64(this.data.get([x, y])).mod(System.Int64(this.tilesW))).mul(System.Int64(this.tilesW)));
                    var case_y = Math.floor(this.data.get([x, y]) / this.tilesW) * this.tilesH;

                    ctx.drawImage(this._sheet.data, case_x, case_y, this.tilesW, this.tilesH, Bridge.Int.umul(x, this.tilesW), Bridge.Int.umul(y, this.tilesH), this.tilesW, this.tilesH);
                }

            },
            GetTile: function (x, y) {
                return this.data.get([x, y]);
            },
            SetCollision: function (x, y, collision) {
                this.collisionData.set([x, y], collision);
            },
            GetCollision: function (x, y) {
                return this.collisionData.get([x, y]);
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvVGlsZU1hcC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yMkkuY3MiLCJNYXRocy9WZWN0b3I0LmNzIiwiU3lzdGVtL01vdXNlLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJDb21wb25lbnRzL0NvbGxpc2lvbi5jcyIsIkNvbXBvbmVudHMvTW92ZW1lbnQuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiLCJHYW1lT2JqZWN0cy9UaWxlTWFwL0xheWVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7OzRCQVEyQkE7O2dCQUNmQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs0QkNFWUE7O2dCQUNyQkEsbUJBQWNBOzs7Ozs7Z0JBSWRBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7O3VDQUlLQTs7Z0JBQ3pCQSxJQUFJQTtvQkFBNkJBOztnQkFDakNBLDBCQUE0QkE7Ozs7d0JBRXhCQSwyQkFBc0RBOzs7O2dDQUVsREE7Ozs7Ozs7d0JBRUpBLHFCQUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDbkJw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QUFRQSxRQUFRQSxhQUFRQSxhQUFRQSxtQkFBSUEsY0FBUUEsbUJBQUlBLGNBQVFBLGFBQVFBOzs7OytCQUs5RUEsR0FBUUE7Z0JBQ3pCQSxPQUFPQSxlQUFLQSxHQUFHQTs7b0NBR1FBLEdBQVFBLEdBQVFBO2dCQUN2Q0Esd0JBQWNBLEdBQUdBLElBQUtBOztvQ0FHQUEsR0FBUUE7Z0JBRTlCQSxPQUFPQSx3QkFBY0EsR0FBR0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgcGFyZW50IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnQoR2FtZU9iamVjdCBfcGFyZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudCA9IF9wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2aXJ0dWFsIHZvaWQgVXBkYXRlKCkge31cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBpbnRlcm5hbCBjbGFzcyBDb21wb25lbnRSZWFkZXJcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudFJlYWRlcihEaXNwbGF5TGlzdCBsaXN0KSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0ID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgdXBkYXRlKCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBkaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmouY29tcG9uZW50cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuVmFsdWUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZWN1cnNpdmVVcGRhdGUob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIHJlY3Vyc2l2ZVVwZGF0ZShHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBpZiAoZGlzcGxheUxpc3QubGlzdC5Db3VudCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoS2V5VmFsdWVQYWlyPHN0cmluZywgQ29tcG9uZW50PiBjb21wb25lbnQgaW4gb2JqMi5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZVVwZGF0ZShvYmoyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDYW1lcmFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHJvdGF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoVmVjdG9yMiBfcG9zaXRpb24sZmxvYXQgX3JvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICByb3RhdGlvbiA9IF9yb3RhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIERpc3BsYXlMaXN0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIExpc3Q8R2FtZU9iamVjdD4gbGlzdCB7IGdldDsgc2V0OyB9ICBcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKFRpbGVNYXAgb2JqLCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChMYXllciBsIGluIG9iai5sYXllcnMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBBZGRBdChsLHBhcmVudCwoaW50KWwuaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaixHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgICAgICBvYmouX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEF0KEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50LCBpbnQgaW5kZXgpIHtcclxuICAgICAgICAgICAgbGlzdC5JbnNlcnQoaW5kZXgsIG9iaik7XHJcbiAgICAgICAgICAgIG9iai5fcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlKEdhbWVPYmplY3Qgb2JqKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmUoR2FtZU9iamVjdCBvYmosIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBvbGRJbmRleCA9IGxpc3QuSW5kZXhPZihvYmopO1xyXG4gICAgICAgICAgICBsaXN0LlJlbW92ZUF0KG9sZEluZGV4KTtcclxuICAgICAgICAgICAgbGlzdC5JbnNlcnQoaW5kZXgsb2JqKTtcclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgTGlzdDxHYW1lT2JqZWN0PiBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fbGlzdD1uZXcgTGlzdDxHYW1lT2JqZWN0PigpIDt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2VuZVxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhIGNhbWVyYSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgX21haW5EaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIERyYXdlciBfZHJhd2VyO1xyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuICAgICAgICBwcml2YXRlIHN0cmluZyBfY29sb3I7XHJcbiAgICAgICAgcHVibGljIE1vdXNlIG1vdXNlIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFNjZW5lKERpc3BsYXlMaXN0IG9iakxpc3Qsc3RyaW5nIGNhbnZhc0lELHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBjYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XHJcbiAgICAgICAgICAgIF9tYWluRGlzcGxheUxpc3QgPSBvYmpMaXN0O1xyXG4gICAgICAgICAgICBfY2FudmFzID0gRG9jdW1lbnQuUXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXCJjYW52YXMjXCIgKyBjYW52YXNJRCk7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIgPSBuZXcgRHJhd2VyKF9jYW52YXMpO1xyXG4gICAgICAgICAgICBfY29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgbW91c2UgPSBuZXcgTW91c2UoX2NhbnZhcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBfZHJhd2VyLkZpbGxTY3JlZW4oX2NvbG9yKTtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmogaW4gX21haW5EaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBfZHJhd2VyLkRyYXcob2JqLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWCwgb2JqLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWSwgb2JqLnNpemUuWCwgb2JqLnNpemUuWSwgb2JqLmFuZ2xlLCBvYmouaW1hZ2UsZmFsc2UsMSk7XHJcbiAgICAgICAgICAgICAgICBEcmF3Q2hpbGQob2JqLG9iai5wb3NpdGlvbi5YLG9iai5wb3NpdGlvbi5ZLG9iai5hbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3Q2hpbGQoR2FtZU9iamVjdCBvYmosZmxvYXQgeCxmbG9hdCB5LGZsb2F0IGFuZ2xlKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3WCA9IHggKyAoZmxvYXQpKE1hdGguQ29zKG9iai5hbmdsZSpNYXRoLlBJLzE4MCkpICogb2JqMi5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdZID0geSArIChmbG9hdCkoTWF0aC5TaW4ob2JqLmFuZ2xlKk1hdGguUEkvMTgwKSkgKiBvYmoyLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld0FuZ2xlID0gb2JqMi5hbmdsZSArIGFuZ2xlO1xyXG5cclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyhuZXdYLCBuZXdZLCBvYmoyLnNpemUuWCwgb2JqMi5zaXplLlksIG5ld0FuZ2xlLCBvYmoyLmltYWdlLCBmYWxzZSwgMSk7XHJcbiAgICAgICAgICAgICAgICBEcmF3Q2hpbGQob2JqMixuZXdYLG5ld1ksbmV3QW5nbGUpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRXZlbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBLZXlCb2FyZEV2ZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5UHJlc3NFdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5UHJlc3NFdmVudCBPbktleVByZXNzRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlEb3duRXZlbnQoc3RyaW5nIGtleSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleURvd25FdmVudCBPbktleURvd25FdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleVVwRXZlbnQoc3RyaW5nIGtleSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVVwRXZlbnQgT25LZXlVcEV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIEtleUJvYXJkRXZlbnQoKSB7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleVByZXNzLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleVByZXNzKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5RG93biwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlEb3duKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5VXAsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5VXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5UHJlc3MoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlQcmVzc0V2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5UHJlc3NFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERvS2V5RG93bihFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5RG93bkV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5RG93bkV2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlVcChFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5VXBFdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleVVwRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLlN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKU1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgR2FtZVxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgRHJhd2VyIGRyYXdlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjaGVkdWxlciBzY2hlZHVsZXIgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTY2VuZSBzY2VuZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIE1vdXNlIG1vdXNlIHsgZ2V0IHsgcmV0dXJuIHNjZW5lLm1vdXNlOyB9IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfZGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBDb21wb25lbnRSZWFkZXIgX2NvbXBvbmVudFJlYWRlcjtcclxuXHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lEKSA6IHRoaXMoY2FudmFzSUQsIFwiI2ZmZlwiKSB7IH1cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQsIHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QgPSBuZXcgRGlzcGxheUxpc3QoKTtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmUoX2Rpc3BsYXlMaXN0LCBjYW52YXNJRCwgY29sb3IpO1xyXG4gICAgICAgICAgICBfY29tcG9uZW50UmVhZGVyID0gbmV3IENvbXBvbmVudFJlYWRlcihfZGlzcGxheUxpc3QpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcclxuICAgICAgICAgICAgc2NoZWR1bGVyLkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKXNjZW5lLlJlZnJlc2gpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pX2NvbXBvbmVudFJlYWRlci51cGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkKG9iaiwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkKG9iaiwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZEF0KEdhbWVPYmplY3Qgb2JqLCBpbnQgaW5kZXgpIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0LkFkZEF0KG9iaiwgbnVsbCwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0LlJlbW92ZShvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTW92ZUNoaWxkKEdhbWVPYmplY3Qgb2JqLCBpbnQgaW5kZXgpIHtcclxuICAgICAgICAgICAgX2Rpc3BsYXlMaXN0Lk1vdmUob2JqLGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW50IElESW5jcmVtZW50ZXIgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgc2l6ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGFuZ2xlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IElEIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIFNwcml0ZVNoZWV0PiBpbWFnZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudHMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4oKTtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgX3BhcmVudDtcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuICAgICAgICBwdWJsaWMgQ29tcG9uZW50IEFkZENvbXBvbmVudChzdHJpbmcgaW5zdGFuY2VOYW1lLCBDb21wb25lbnQgY29tcG9uZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcC5UaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKHRpbGVNYXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKG9iaix0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LkFkZEF0KG9iaiwgdGhpcywgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuTW92ZShvYmosIGluZGV4KTtcclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19JRD1JREluY3JlbWVudGVyKys7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUaWxlTWFwXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBYTUxIdHRwUmVxdWVzdCByZXF1ZXN0O1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBEaWN0aW9uYXJ5PHN0cmluZywgTGF5ZXI+IGxheWVycyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgU3ByaXRlU2hlZXQgX3RpbGVTaGVldDtcclxuICAgICAgICBpbnRlcm5hbCBWZWN0b3IySSBfc2l6ZTtcclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgcG9zaXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVGlsZU1hcChTcHJpdGVTaGVldCB0aWxlU2hlZXQsIFZlY3RvcjIgcG9zLCBWZWN0b3IySSBzaXplKSB7XHJcbiAgICAgICAgICAgIGxheWVycyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGF5ZXI+KCk7XHJcbiAgICAgICAgICAgIF90aWxlU2hlZXQgPSB0aWxlU2hlZXQ7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gcG9zO1xyXG4gICAgICAgICAgICBfc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgTGF5ZXIgQWRkTGF5ZXIoc3RyaW5nIG5hbWUsdWludCBpbmRleCkge1xyXG4gICAgICAgICAgICBsYXllcnNbbmFtZV0gPSBuZXcgTGF5ZXIoaW5kZXgsIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJzW25hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlTGF5ZXIoc3RyaW5nIG5hbWUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW25hbWVdID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllciBHZXRMYXllcihzdHJpbmcgbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJzW25hbWVdO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgU2V0Q29sbGlzaW9uKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5LCBpbnQgY29sbGlzaW9uVHlwZSlcclxue1xyXG4gICAgU2V0Q29sbGlzaW9uKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSksIGNvbGxpc2lvblR5cGUpO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBTZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MsIGludCBjb2xsaXNpb25UeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5TZXRDb2xsaXNpb24oKHVpbnQpcG9zLlgsICh1aW50KXBvcy5ZLCBjb2xsaXNpb25UeXBlKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyBpbnQgR2V0Q29sbGlzaW9uKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5KVxyXG57XHJcbiAgICByZXR1cm4gR2V0Q29sbGlzaW9uKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSkpO1xyXG59ICAgICAgICBwdWJsaWMgaW50IEdldENvbGxpc2lvbihzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbGF5ZXJdLkdldENvbGxpc2lvbigodWludClwb3MuWCwgKHVpbnQpcG9zLlkpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgU2V0VGlsZShzdHJpbmcgbGF5ZXIsIGludCB4LCBpbnQgeSwgaW50IHRpbGUpXHJcbntcclxuICAgIFNldFRpbGUobGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSwgdGlsZSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIFNldFRpbGUoc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MsIGludCB0aWxlKSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tsYXllcl0uU2V0VGlsZSgodWludClwb3MuWCwgKHVpbnQpcG9zLlksIHRpbGUsZmFsc2UpO1xyXG4gICAgICAgIH1cclxucHVibGljIGludCBHZXRUaWxlKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5KVxyXG57XHJcbiAgICByZXR1cm4gR2V0VGlsZShsYXllciwgbmV3IFZlY3RvcjJJKHgsIHkpKTtcclxufSAgICAgICAgcHVibGljIGludCBHZXRUaWxlKHN0cmluZyBsYXllciwgVmVjdG9yMkkgcG9zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbGF5ZXJdLkdldFRpbGUoKHVpbnQpcG9zLlgsICh1aW50KXBvcy5ZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIExvYWRUaWxlZEpzb24oc3RyaW5nIHVybCwgdWludCBudW1iZXJPZkxheWVycykge1xyXG5cclxuICAgICAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgbnVtYmVyT2ZMYXllcnM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgQWRkTGF5ZXIoaStcIlwiLCBpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5PbkxvYWQgKz0gTG9hZFRpbGVkO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lk9wZW4oXCJnZXRcIix1cmwpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LlNlbmQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgTG9hZFRpbGVkKEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgZHluYW1pYyBhID0gSlNPTi5QYXJzZShyZXF1ZXN0LlJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIF9zaXplLlggPSBhLndpZHRoO1xyXG4gICAgICAgICAgICBfc2l6ZS5ZID0gYS5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBhLmxheWVycy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZHluYW1pYyBsYXllcmpzID0gYS5sYXllcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgTGF5ZXIgbGF5ZXIgPSBsYXllcnNbaSArIFwiXCJdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsYXllcmpzID0gbGF5ZXJqcy5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGogPSAwOyBqIDwgbGF5ZXJqcy5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbnQgaW5kZXhYID0gaiAlIF9zaXplLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IGluZGV4WSA9IChpbnQpTWF0aC5GbG9vcigoZmxvYXQpKGogLyBfc2l6ZS5YKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyLlNldFRpbGUoKHVpbnQpaW5kZXhYLCAodWludClpbmRleFksIGxheWVyanNbal0tMSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEcmF3ZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBfY3R4O1xyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgcHVibGljIERyYXdlcihIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2N0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEZpbGxTY3JlZW4oc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFJlY3QoMCwwLF9jYW52YXMuV2lkdGgsX2NhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgRHJhdyhmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCB3LCBmbG9hdCBoLCBkeW5hbWljIGltZylcclxue1xyXG4gICAgRHJhdyh4LCB5LCB3LCBoLCAwLCBpbWcsIGZhbHNlLCAxKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgRHJhdyhmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCB3LCBmbG9hdCBoLCBmbG9hdCByLCBkeW5hbWljIGltZywgYm9vbCBmb2xsb3csIGZsb2F0IGFscGhhKSB7XHJcbiAgICAgICAgICAgIF9jdHguSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF9jYW52YXMuU3R5bGUuSW1hZ2VSZW5kZXJpbmcgPSBJbWFnZVJlbmRlcmluZy5QaXhlbGF0ZWQ7XHJcbiAgICAgICAgICAgIF9jdHguU2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgc3ggPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBzeSA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IHN3ID0gdztcclxuICAgICAgICAgICAgZmxvYXQgc2ggPSBoO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltZyA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLnNwcml0ZVNpemVYICE9IG51bGwgJiYgaW1nLnNwcml0ZVNpemVZICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IGltZzIgPSAoU3ByaXRlU2hlZXQpaW1nO1xyXG4gICAgICAgICAgICAgICAgaWYgKGltZzIuZGF0YS5XaWR0aCA9PSAwKSByZXR1cm47IFxyXG4gICAgICAgICAgICAgICAgc3ggPSAoaW1nMi5jdXJyZW50SW5kZXggJSAoaW1nMi5kYXRhLldpZHRoIC8gaW1nMi5zcHJpdGVTaXplWCkpICogaW1nMi5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgICAgIHN5ID0gKGZsb2F0KU1hdGguRmxvb3IoaW1nMi5jdXJyZW50SW5kZXggLyAoKGRvdWJsZSlpbWcyLmRhdGEuV2lkdGggLyBpbWcyLnNwcml0ZVNpemVYKSkgKiBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICAgICAgc3cgPSBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc2ggPSBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLmRhdGEgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nID0gaW1nLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vT2JqZWN0IFJvdGF0aW9uXHJcbiAgICAgICAgICAgIGZsb2F0IG94ID0geCArICh3IC8gMik7XHJcbiAgICAgICAgICAgIGZsb2F0IG95ID0geSArIChoIC8gMik7XHJcblxyXG4gICAgICAgICAgICBfY3R4LlRyYW5zbGF0ZShveCwgb3kpO1xyXG4gICAgICAgICAgICBfY3R4LlJvdGF0ZSgocikgKiBNYXRoLlBJIC8gMTgwKTsgLy9kZWdyZWVcclxuICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUoLW94LCAtb3kpO1xyXG4gICAgICAgICAgICAvLy0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgIF9jdHguRHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIHgsIHksIHcsIGgpO1xyXG5cclxuICAgICAgICAgICAgX2N0eC5SZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbWFnZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2Uoc3RyaW5nIHNyYykge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKEhUTUxJbWFnZUVsZW1lbnQgaW1nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YSA9IGltZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGVTaGVldFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNwcml0ZVNpemVYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzcHJpdGVTaXplWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgY3VycmVudEluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFNwcml0ZVNoZWV0KHN0cmluZyBzcmMsIHVpbnQgX3Nwcml0ZVNpemVYLCB1aW50IF9zcHJpdGVTaXplWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuICAgICAgICAgICAgc3ByaXRlU2l6ZVggPSBfc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgIHNwcml0ZVNpemVZID0gX3Nwcml0ZVNpemVZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yMlxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyKGZsb2F0IF94ICwgZmxvYXQgX3kpIHtcclxuICAgICAgICAgICAgWCA9IF94O1xyXG4gICAgICAgICAgICBZID0gX3k7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJJXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMkkoaW50IF94LCBpbnQgX3kpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBaIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgVyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3I0KGZsb2F0IF94LCBmbG9hdCBfeSwgZmxvYXQgX3osIGZsb2F0IF93KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWCA9IF94O1xyXG4gICAgICAgICAgICBZID0gX3k7XHJcbiAgICAgICAgICAgIFogPSBfejtcclxuICAgICAgICAgICAgVyA9IF93O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3VzZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgeSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBNb3VzZShIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgVXBkYXRlKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDbGllbnRSZWN0IHJlY3QgPSBfY2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICB4ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFggLSAoZmxvYXQpcmVjdC5MZWZ0O1xyXG4gICAgICAgICAgICB5ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFkgLSAoZmxvYXQpcmVjdC5Ub3A7XHJcbiAgICAgICAgfVxyXG5cbiAgICBcbnByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3g9MDtwcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX195PTA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NoZWR1bGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBMaXN0PEFjdGlvbj4gX2FjdGlvbkxpc3QgPSBuZXcgTGlzdDxBY3Rpb24+KCk7XHJcblxyXG4gICAgICAgIGludGVybmFsIFNjaGVkdWxlcigpIHtcclxuICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoQWN0aW9uIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgX2FjdGlvbkxpc3QuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IG1ldGhvZHMoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEFjdGlvbiBhIGluIF9hY3Rpb25MaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBhKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFdpbmRvdy5SZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFuaW1hdG9yIDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PiBfYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRGcmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBmcHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBwbGF5aW5nIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUpXHJcbntcclxuICAgIEdvdG9BbmRQbGF5KGFuaW1hdGlvbk5hbWUsIDApO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBHb3RvQW5kUGxheShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgaW50IGZyYW1lKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBbmltYXRpb24gPSBhbmltYXRpb25OYW1lO1xyXG4gICAgICAgICAgICBjdXJyZW50RnJhbWUgPSBmcmFtZTtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFN0b3AoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoISgodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdID49IDApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSW1hZ2UpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IHNoZWV0ID0gKFNwcml0ZVNoZWV0KXBhcmVudC5pbWFnZTtcclxuICAgICAgICAgICAgICAgIHNoZWV0LmN1cnJlbnRJbmRleCA9ICh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKSB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KCkge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDx1aW50PiBsaXN0KSB7XHJcbiAgICAgICAgICAgIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiB0ID0gbmV3IExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4+KCk7XHJcbiAgICAgICAgICAgIENyZWF0ZShhbmltYXRpb25OYW1lLCB0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PEltYWdlPiBsaXN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+KCk7XHJcbiAgICAgICAgICAgIHQgPSBsaXN0LkFzPExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICAgICAgQ3JlYXRlKGFuaW1hdGlvbk5hbWUsIHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiBsaXN0KXtcclxuICAgICAgICAgICAgX2FuaW1hdGlvbnNbYW5pbWF0aW9uTmFtZV0gPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZG91YmxlIG5vdyA9IERhdGVUaW1lLk5vdy5TdWJ0cmFjdChEYXRlVGltZS5NaW5WYWx1ZS5BZGRZZWFycygyMDE3KSkuVG90YWxNaWxsaXNlY29uZHM7XHJcbiAgICAgICAgICAgIGRvdWJsZSBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lRnJhbWU7XHJcbiAgICAgICAgICAgIGlmIChkZWx0YSA+IDEwMDAvZnBzKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUrKztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl0uQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghKCh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV0gPj0gMCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZXQuY3VycmVudEluZGV4ID0gKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUZyYW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRBbmltYXRpb249XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fcGxheWluZz1mYWxzZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb2xsaXNpb24gOiBDb21wb25lbnRcclxuICAgIHtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgTGlzdDxWZWN0b3I0PiBfYm94ZXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDb2xsaXNpb24oR2FtZU9iamVjdCBfcGFyZW50KSA6IGJhc2UoX3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9ib3hlcyA9IG5ldyBMaXN0PFZlY3RvcjQ+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRCb3goZmxvYXQgeDEsZmxvYXQgeTEsIGZsb2F0IHdpZHRoLCBmbG9hdCBoZWlnaHQpIHtcclxuICAgICAgICAgICAgX2JveGVzLkFkZChuZXcgVmVjdG9yNCh4MSx5MSx3aWR0aCxoZWlnaHQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25YKGZsb2F0IHgsIEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFkZGluZyA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlQWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRpbmcgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsIHBhcmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlQWRkaW5nID0gKGZsb2F0KShNYXRoLkNvcyhwYXJlbnQuX3BhcmVudC5hbmdsZSAqIE1hdGguUEkgLyAxODApKSAqIHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCA9PSBudWxsKSBhZGRpbmcgKz0gcGFyZW50LnBvc2l0aW9uLlg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gIGFkZGluZyArIGFuZ2xlQWRkaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmbG9hdCBQYXJlbnRQb3NDYWxjdWxhdGlvblkoZmxvYXQgeSwgR2FtZU9iamVjdCBwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKHBhcmVudC5wb3NpdGlvbi5ZLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5TaW4ocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFkZGluZyArIGFuZ2xlQWRkaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgSGl0VGVzdE9iamVjdChHYW1lT2JqZWN0IG9iaikge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgcHggPSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcHkgPSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgcDJ4ID0gb2JqLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeSA9IG9iai5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCAgcGFyZW50KTsgXHJcbiAgICAgICAgICAgICAgICBweSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvYmouX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwMnggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgob2JqLnBvc2l0aW9uLlgsIG9iaik7XHJcbiAgICAgICAgICAgICAgICBwMnkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkob2JqLnBvc2l0aW9uLlksIG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvbXBvbmVudCBjcCBpbiBvYmouY29tcG9uZW50cy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjcC5HZXRUeXBlKCkgPT0gdHlwZW9mKENvbGxpc2lvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb24gYyA9IChDb2xsaXNpb24pY3A7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIyIGluIGMuX2JveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5YICsgcHggPCBiMi5YICsgcDJ4ICsgYjIuWiAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5YICsgYi5aICsgcHggPiBiMi5YICsgcDJ4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlkgKyBweSA8IGIyLlkgKyBiMi5XICsgcDJ5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlcgKyBiLlkgKyBweSAgPiBiMi5ZICsgcDJ5ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RQb2ludChmbG9hdCB4LGZsb2F0IHkpIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcHggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsIHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBweSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPCBiLlggKyBweCArIGIuWiAmJlxyXG4gICAgICAgICAgICAgICAgICAgeCA+IGIuWCArIHB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICB5IDwgYi5ZICsgcHkgKyBiLlcgJiZcclxuICAgICAgICAgICAgICAgICAgIHkgPiBiLlkgKyBweSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RMYXllcihMYXllciBsYXllciwgaW50IGNvbGxpZGVyVmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcHggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsIHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBweSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiIGluIF9ib3hlcylcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWCA9IHB4ICsgYi5YO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgdG90YWxZID0gcHkgKyBiLlk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmxvYXQgdG90YWxYMiA9IHRvdGFsWCArIGIuWjtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWTIgPSB0b3RhbFkgKyBiLlc7XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IGxlZnRfdGlsZSA9IChpbnQpTWF0aC5GbG9vcigodG90YWxYIC0gbGF5ZXIucG9zaXRpb24uWCkgLyBsYXllci50aWxlc1cpO1xyXG4gICAgICAgICAgICAgICAgaW50IHJpZ2h0X3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWDIgLSBsYXllci5wb3NpdGlvbi5YKSAvIGxheWVyLnRpbGVzVyk7XHJcbiAgICAgICAgICAgICAgICBpbnQgdG9wX3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWSAtIGxheWVyLnBvc2l0aW9uLlkpIC8gbGF5ZXIudGlsZXNIKTtcclxuICAgICAgICAgICAgICAgIGludCBib3R0b21fdGlsZSA9IChpbnQpTWF0aC5GbG9vcigodG90YWxZMiAtIGxheWVyLnBvc2l0aW9uLlkpIC8gbGF5ZXIudGlsZXNIKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCB5ID0gdG9wX3RpbGUtMTsgeSA8PSBib3R0b21fdGlsZSsxOyB5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gbGVmdF90aWxlLTE7IHggPD0gcmlnaHRfdGlsZSsxOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPCAwIHx8IHggPiBsYXllci5zaXplWCAtIDEgfHwgeSA+IGxheWVyLnNpemVZIC0gMSB8fCB5IDwgMCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCBjb2xsaWRlciA9IGxheWVyLmNvbGxpc2lvbkRhdGFbeCx5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxpZGVyICE9IGNvbGxpZGVyVmFsdWUpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVggPSAoeCAqIGxheWVyLnRpbGVzVykgKyBsYXllci5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbG9hdCB0aWxlWSA9ICh5ICogbGF5ZXIudGlsZXNIKSArIGxheWVyLnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbG9hdCB0aWxlWDIgPSB0aWxlWCArIGxheWVyLnRpbGVzVztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVkyID0gdGlsZVkgKyBsYXllci50aWxlc0g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2wgb3ZlclggPSAodG90YWxYIDwgdGlsZVgyKSAmJiAodG90YWxYMiA+IHRpbGVYKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbCBvdmVyWSA9ICh0b3RhbFkgPCB0aWxlWTIpICYmICh0b3RhbFkyID4gdGlsZVkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3ZlclggJiYgb3ZlclkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW92ZW1lbnQgOiBDb21wb25lbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTW92ZW1lbnQoR2FtZU9iamVjdCBfcGFyZW50KSA6IGJhc2UoX3BhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBNb3ZlVG93YXJkKFZlY3RvcjIgcG9zLCBmbG9hdCBzcGVlZClcclxue1xyXG4gICAgTW92ZVRvd2FyZChwb3MuWCwgcG9zLlksIHNwZWVkKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgTW92ZVRvd2FyZChmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCBzcGVlZCkge1xyXG4gICAgICAgICAgICBmbG9hdCBkeCA9IHggLSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgZHkgPSB5IC0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlID0gKGZsb2F0KU1hdGguQXRhbjIoZHksIGR4KTtcclxuXHJcbiAgICAgICAgICAgIHBhcmVudC5wb3NpdGlvbi5YICs9IHNwZWVkICogKGZsb2F0KU1hdGguQ29zKGFuZ2xlKTtcclxuICAgICAgICAgICAgcGFyZW50LnBvc2l0aW9uLlkgKz0gc3BlZWQgKiAoZmxvYXQpTWF0aC5TaW4oYW5nbGUpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgTG9va0F0KFZlY3RvcjIgcG9zKVxyXG57XHJcbiAgICBMb29rQXQocG9zLlgsIHBvcy5ZKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgTG9va0F0KGZsb2F0IHgsZmxvYXQgeSkge1xyXG4gICAgICAgICAgICBmbG9hdCB4MiA9IHBhcmVudC5wb3NpdGlvbi5YIC0geDtcclxuICAgICAgICAgICAgZmxvYXQgeTIgPSB5IC0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlID0gKGZsb2F0KU1hdGguQXRhbjIoeDIsIHkyKTtcclxuICAgICAgICAgICAgcGFyZW50LmFuZ2xlID0gYW5nbGUgKiAoZmxvYXQpKDE4MC9NYXRoLlBJKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNwcml0ZSA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICAvL0NvbnN0cnVjdG9yXHJcbiAgICAgICAgcHVibGljIFNwcml0ZShWZWN0b3IyIF9wb3NpdGlvbiwgVmVjdG9yMiBfc2l6ZSwgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gX2ltYWdlKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICBzaXplID0gX3NpemU7XHJcbiAgICAgICAgICAgIGltYWdlID0gX2ltYWdlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTGF5ZXIgOiBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHVpbnQgaW5kZXggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIGludFssXSBkYXRhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBpbnRbLF0gY29sbGlzaW9uRGF0YSB7IGdldDsgc2V0O31cclxuXHJcbiAgICAgICAgcHVibGljIHVpbnQgdGlsZXNXIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHRpbGVzSCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzaXplWCB7IGdldDsgcHJpdmF0ZSBzZXQ7fVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNpemVZIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFNwcml0ZVNoZWV0IF9zaGVldDtcclxuXHJcbiAgICAgICAgcHVibGljIExheWVyKHVpbnQgX2luZGV4LCBUaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgaW5kZXggPSBfaW5kZXg7XHJcbiAgICAgICAgICAgIHRpbGVzVyA9IHRpbGVNYXAuX3RpbGVTaGVldC5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgdGlsZXNIID0gdGlsZU1hcC5fdGlsZVNoZWV0LnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICBzaXplWCA9ICh1aW50KXRpbGVNYXAuX3NpemUuWDtcclxuICAgICAgICAgICAgc2l6ZVkgPSAodWludCl0aWxlTWFwLl9zaXplLlk7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgaW50W3NpemVYLCBzaXplWV07XHJcbiAgICAgICAgICAgIGNvbGxpc2lvbkRhdGEgPSBuZXcgaW50W3NpemVYLCBzaXplWV07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemVYOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2l6ZVk7IGorKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtpLCBqXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRpbGVNYXAucG9zaXRpb247XHJcbiAgICAgICAgICAgIHNpemUgPSBuZXcgVmVjdG9yMihzaXplWCAqIHRpbGVzVywgc2l6ZVkgKiB0aWxlc0gpO1xyXG5cclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzID0gKEhUTUxDYW52YXNFbGVtZW50KURvY3VtZW50LkNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgICAgIGNhbnZhcy5XaWR0aCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlgpO1xyXG4gICAgICAgICAgICBjYW52YXMuSGVpZ2h0ID0gKGludClNYXRoLkZsb29yKHNpemUuWSk7XHJcbiAgICAgICAgICAgIGltYWdlID0gY2FudmFzO1xyXG5cclxuICAgICAgICAgICAgX3NoZWV0ID0gdGlsZU1hcC5fdGlsZVNoZWV0O1xyXG4gICAgICAgICAgICBfc2hlZXQuZGF0YS5PbkxvYWQgKz0gQ29uc3RydWN0O1xyXG5cclxuICAgICAgICB9XHJcbmludGVybmFsIHZvaWQgQ29uc3RydWN0KClcclxue1xyXG4gICAgQ29uc3RydWN0KG5ldyBFdmVudChcIlwiKSk7XHJcbn0gICAgICAgIGludGVybmFsIHZvaWQgQ29uc3RydWN0KEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgZm9yICh1aW50IHkgPSAwOyB5IDwgc2l6ZVk7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh1aW50IHggPSAwOyB4IDwgc2l6ZVg7IHgrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgU2V0VGlsZSh4LHksZGF0YVt4LHldLHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIFNldFRpbGUodWludCB4LCB1aW50IHksIGludCB0aWxlLCBib29sIGJ5UGFzc09sZCkge1xyXG4gICAgICAgICAgICBpZiAoISh4ID49IDAgJiYgeCA8PSBzaXplWCAmJiB5ID49IDAgJiYgeSA8PSBzaXplWSkpIHJldHVybjtcclxuICAgICAgICAgICAgaW50IG9sZFRpbGUgPSBkYXRhW3gsIHldO1xyXG5cclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzID0gKEhUTUxDYW52YXNFbGVtZW50KWltYWdlO1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbGUgPT0gLTEgJiYgb2xkVGlsZSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVt4LCB5XSA9IHRpbGU7XHJcbiAgICAgICAgICAgICAgICBjdHguQ2xlYXJSZWN0KHgqdGlsZXNXLHkqdGlsZXNILHRpbGVzVyx0aWxlc0gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aWxlID09IC0xKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmKG9sZFRpbGUgIT0gdGlsZSB8fCBieVBhc3NPbGQpIHsgXHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgY2FzZV94ID0gKGRhdGFbeCwgeV0gJSB0aWxlc1cpICogdGlsZXNXO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgY2FzZV95ID0gKGZsb2F0KU1hdGguRmxvb3IoKGZsb2F0KWRhdGFbeCwgeV0gLyB0aWxlc1cpICogdGlsZXNIO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5EcmF3SW1hZ2UoX3NoZWV0LmRhdGEsIGNhc2VfeCwgY2FzZV95LCB0aWxlc1csIHRpbGVzSCwgeCAqIHRpbGVzVywgeSAqIHRpbGVzSCwgdGlsZXNXLCB0aWxlc0gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgaW50IEdldFRpbGUodWludCB4LCB1aW50IHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGFbeCwgeV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2b2lkIFNldENvbGxpc2lvbih1aW50IHgsIHVpbnQgeSwgaW50IGNvbGxpc2lvbikge1xyXG4gICAgICAgICAgICBjb2xsaXNpb25EYXRhW3gsIHldID0gY29sbGlzaW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgaW50IEdldENvbGxpc2lvbih1aW50IHgsIHVpbnQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xsaXNpb25EYXRhW3gsIHldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXQp9Cg==
