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
            ctor: function (parent) {
                this.$initialize();
                this.parent = parent;
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
            Update: function () {
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
                        this.RecursiveUpdate(obj);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            RecursiveUpdate: function (obj) {
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
                        this.RecursiveUpdate(obj2);
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
                this.position = new GameEngineJS.Maths.Vector2.$ctor1(0, 0);
                this.rotation = 0;
            },
            $ctor1: function (position, rotation) {
                this.$initialize();
                this.position = position;
                this.rotation = rotation;
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
            mouse: null,
            _mainDisplayList: null,
            _drawer: null,
            _canvas: null,
            _color: null
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
                        this._drawer.Draw(obj.position.X - this.camera.position.X, obj.position.Y - this.camera.position.Y, obj.size.X, obj.size.Y, obj.angle, obj.image, false, 1);
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
                        var newX = x + (Math.cos(obj.angle * Math.PI / 180)) + obj2.position.X - this.camera.position.X;
                        var newY = y + (Math.sin(obj.angle * Math.PI / 180)) + obj2.position.Y - this.camera.position.Y;
                        var newAngle = obj2.angle + angle;

                        this._drawer.Draw(newX, newY, obj2.size.X, obj2.size.Y, newAngle, obj2.image, false, 1);
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
                this.scheduler.Add(Bridge.fn.cacheBind(this._componentReader, this._componentReader.Update));
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
            /**
             * Position of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function position
             * @type GameEngineJS.Maths.Vector2
             */
            position: null,
            /**
             * Size of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function size
             * @type GameEngineJS.Maths.Vector2
             */
            size: null,
            /**
             * Object Angle in degrees.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function angle
             * @type number
             */
            angle: 0,
            /**
             * Unique ID of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function ID
             * @type number
             */
            ID: 0,
            /**
             * Image of the GameObject.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function image
             * @type System.Object
             */
            image: null,
            /**
             * List of the object components.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @type System.Collections.Generic.Dictionary$2
             */
            components: null,
            /**
             * Game Object type.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function type
             * @type string
             */
            type: null,
            displayList: null,
            _parent: null
        },
        ctors: {
            init: function () {
                var $t;
                this.ID = Bridge.identity(GameEngineJS.GameObjects.GameObject.IDIncrementer, ($t = (GameEngineJS.GameObjects.GameObject.IDIncrementer + 1) | 0, GameEngineJS.GameObjects.GameObject.IDIncrementer = $t, $t));
                this.components = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.Components.Component))();
                this.type = "Unknown";
                this.displayList = new GameEngineJS.Display.DisplayList();
            }
        },
        methods: {
            /**
             * Add/Link a component to this GameObject.
             *
             * @instance
             * @public
             * @this GameEngineJS.GameObjects.GameObject
             * @memberof GameEngineJS.GameObjects.GameObject
             * @param   {string}                               instanceName    
             * @param   {GameEngineJS.Components.Component}    component
             * @return  {GameEngineJS.Components.Component}
             */
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
            Draw: function (x, y, w, h, r, img, follow, alpha) {
                if (follow === void 0) { follow = false; }
                if (alpha === void 0) { alpha = 1.0; }
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
            ctor: function (src, spriteSizeX, spriteSizeY) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;
                this.spriteSizeX = spriteSizeX;
                this.spriteSizeY = spriteSizeY;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector2", {
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.X = 0;
                this.Y = 0;
            },
            $ctor1: function (X, Y) {
                this.$initialize();
                this.X = X;
                this.Y = Y;
            }
        }
    });

    Bridge.define("GameEngineJS.Maths.Vector2I", {
        fields: {
            X: 0,
            Y: 0
        },
        ctors: {
            ctor: function (X, Y) {
                this.$initialize();
                this.X = X;
                this.Y = Y;
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
            ctor: function (X, Y, Z, W) {
                this.$initialize();
                this.X = X;
                this.Y = Y;
                this.Z = Z;
                this.W = W;
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
            ctor: function (parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, parent);
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
            ctor: function (position, size, image) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.position = position;
                this.size = size;
                this.image = image;
                this.type = "Sprite";
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.TextArea", {
        inherits: [GameEngineJS.GameObjects.GameObject],
        fields: {
            text: null,
            color: null,
            /**
             * In pixels, Example: 14
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.TextArea
             * @function fontSize
             * @type number
             */
            fontSize: 0,
            /**
             * Example: Arial
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.TextArea
             * @function font
             * @type string
             */
            font: null
        },
        ctors: {
            init: function () {
                this.text = "";
                this.color = "";
                this.fontSize = 14;
                this.font = "";
            },
            $ctor1: function (position, size, color, fontSize, font) {
                if (color === void 0) { color = ""; }
                if (fontSize === void 0) { fontSize = 14; }
                if (font === void 0) { font = ""; }

                GameEngineJS.GameObjects.TextArea.ctor.call(this, position, size);
                this.position = position;
                this.size = size;
                this.color = color;
                this.fontSize = fontSize;
                this.font = font;
            },
            ctor: function (position, size) {
                this.$initialize();
                GameEngineJS.GameObjects.GameObject.ctor.call(this);
                this.position = position;
                this.size = size;
                this.type = "TextArea";

                var canvas = Bridge.cast(document.createElement("canvas"), HTMLCanvasElement);
                canvas.width = Bridge.Int.clip32(Math.floor(size.X));
                canvas.height = Bridge.Int.clip32(Math.floor(size.Y));
                this.image = canvas;

            }
        },
        methods: {
            EraseAll: function () {
                var canvas = this.image;
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            Rewrite: function (text, x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.EraseAll();
                this.Write(text, x, y);
            },
            Write: function (text, x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var canvas = this.image;
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = this.color;
                ctx.font = this.fontSize + "px " + (this.font || "");
                ctx.fillText(text, x, ((y + this.fontSize) | 0));
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
                this.type = "TilemapLayer";
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
                this.size = new GameEngineJS.Maths.Vector2.$ctor1(Bridge.Int.umul(this.sizeX, this.tilesW), Bridge.Int.umul(this.sizeY, this.tilesH));

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvVGlsZU1hcC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yMkkuY3MiLCJNYXRocy9WZWN0b3I0LmNzIiwiU3lzdGVtL01vdXNlLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJDb21wb25lbnRzL0NvbGxpc2lvbi5jcyIsIkNvbXBvbmVudHMvTW92ZW1lbnQuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiLCJHYW1lT2JqZWN0cy9UZXh0QXJlYS5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvTGF5ZXIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7NEJBUTJCQTs7Z0JBQ2ZBLGNBQWNBOzs7Ozs7Ozs7Ozs7OzRCQ0VPQTs7Z0JBQ3JCQSxtQkFBY0E7Ozs7OztnQkFJZEEsMEJBQTJCQTs7Ozt3QkFDdkJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozt3QkFFSkEscUJBQWdCQTs7Ozs7Ozs7dUNBSUtBOztnQkFDekJBLElBQUlBO29CQUE2QkE7O2dCQUNqQ0EsMEJBQTRCQTs7Ozt3QkFFeEJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozt3QkFFSkEscUJBQWdC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cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBwYXJlbnQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudChHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZpcnR1YWwgdm9pZCBVcGRhdGUoKSB7fVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIGludGVybmFsIGNsYXNzIENvbXBvbmVudFJlYWRlclxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50UmVhZGVyKERpc3BsYXlMaXN0IGxpc3QpIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCBVcGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIGRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iai5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFJlY3Vyc2l2ZVVwZGF0ZShvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUmVjdXJzaXZlVXBkYXRlKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5TGlzdC5saXN0LkNvdW50IDw9IDApIHJldHVybjtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmoyLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgUmVjdXJzaXZlVXBkYXRlKG9iajIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcm90YXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICAgICAgcm90YXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYShWZWN0b3IyIHBvc2l0aW9uLGZsb2F0IHJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRGlzcGxheUxpc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxHYW1lT2JqZWN0PiBsaXN0IHsgZ2V0OyBzZXQ7IH0gIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoVGlsZU1hcCBvYmosIEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKExheWVyIGwgaW4gb2JqLmxheWVycy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIEFkZEF0KGwscGFyZW50LChpbnQpbC5pbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGxpc3QuQWRkKG9iaik7XHJcbiAgICAgICAgICAgIG9iai5fcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQXQoR2FtZU9iamVjdCBvYmosR2FtZU9iamVjdCBwYXJlbnQsIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCwgb2JqKTtcclxuICAgICAgICAgICAgb2JqLl9wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmUoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaXN0LlJlbW92ZShvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTW92ZShHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IG9sZEluZGV4ID0gbGlzdC5JbmRleE9mKG9iaik7XHJcbiAgICAgICAgICAgIGxpc3QuUmVtb3ZlQXQob2xkSW5kZXgpO1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCxvYmopO1xyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjZW5lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEgY2FtZXJhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBtb3VzZSA9IG5ldyBNb3VzZShfY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIuRmlsbFNjcmVlbihfY29sb3IpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBfbWFpbkRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyhvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YLCBvYmoucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouYW5nbGUsIG9iai5pbWFnZSxmYWxzZSwxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmosb2JqLnBvc2l0aW9uLlgsb2JqLnBvc2l0aW9uLlksb2JqLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdDaGlsZChHYW1lT2JqZWN0IG9iaixmbG9hdCB4LGZsb2F0IHksZmxvYXQgYW5nbGUpIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdYID0geCArIChmbG9hdCkoTWF0aC5Db3Mob2JqLmFuZ2xlKk1hdGguUEkvMTgwKSkgKyBvYmoyLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1kgPSB5ICsgKGZsb2F0KShNYXRoLlNpbihvYmouYW5nbGUqTWF0aC5QSS8xODApKSArIG9iajIucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3QW5nbGUgPSBvYmoyLmFuZ2xlICsgYW5nbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG5ld1gsIG5ld1ksIG9iajIuc2l6ZS5YLCBvYmoyLnNpemUuWSwgbmV3QW5nbGUsIG9iajIuaW1hZ2UsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmoyLG5ld1gsbmV3WSxuZXdBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlQcmVzc0V2ZW50IE9uS2V5UHJlc3NFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleURvd25FdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlEb3duKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlEb3duRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIgZHJhd2VyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NoZWR1bGVyIHNjaGVkdWxlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjZW5lIHNjZW5lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQgeyByZXR1cm4gc2NlbmUubW91c2U7IH0gfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9kaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIENvbXBvbmVudFJlYWRlciBfY29tcG9uZW50UmVhZGVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQpIDogdGhpcyhjYW52YXNJRCwgXCIjZmZmXCIpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCwgc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsIGNhbnZhc0lELCBjb2xvcik7XHJcbiAgICAgICAgICAgIF9jb21wb25lbnRSZWFkZXIgPSBuZXcgQ29tcG9uZW50UmVhZGVyKF9kaXNwbGF5TGlzdCk7XHJcblxyXG5cclxuICAgICAgICAgICAgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcigpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pc2NlbmUuUmVmcmVzaCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilfY29tcG9uZW50UmVhZGVyLlVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChUaWxlTWFwIG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkQXQob2JqLCBudWxsLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuUmVtb3ZlKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuTW92ZShvYmosaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbnQgSURJbmNyZW1lbnRlciA9IDA7XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gUG9zaXRpb24gb2YgdGhlIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gU2l6ZSBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHNpemUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gT2JqZWN0IEFuZ2xlIGluIGRlZ3JlZXMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYW5nbGUgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFVuaXF1ZSBJRCBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBpbnQgSUQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gSW1hZ2Ugb2YgdGhlIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gTGlzdCBvZiB0aGUgb2JqZWN0IGNvbXBvbmVudHMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gR2FtZSBPYmplY3QgdHlwZS5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdHlwZSB7IGdldDsgaW50ZXJuYWwgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0ID0gbmV3IERpc3BsYXlMaXN0KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBfcGFyZW50O1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBBZGQvTGluayBhIGNvbXBvbmVudCB0byB0aGlzIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgQ29tcG9uZW50IEFkZENvbXBvbmVudChzdHJpbmcgaW5zdGFuY2VOYW1lLCBDb21wb25lbnQgY29tcG9uZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcC5UaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKHRpbGVNYXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKG9iaix0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LkFkZEF0KG9iaiwgdGhpcywgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuTW92ZShvYmosIGluZGV4KTtcclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19JRD1JREluY3JlbWVudGVyKys7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3R5cGU9XCJVbmtub3duXCI7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUaWxlTWFwXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBYTUxIdHRwUmVxdWVzdCByZXF1ZXN0O1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBEaWN0aW9uYXJ5PHN0cmluZywgTGF5ZXI+IGxheWVycyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgU3ByaXRlU2hlZXQgX3RpbGVTaGVldDtcclxuICAgICAgICBpbnRlcm5hbCBWZWN0b3IySSBfc2l6ZTtcclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIgcG9zaXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVGlsZU1hcChTcHJpdGVTaGVldCB0aWxlU2hlZXQsIFZlY3RvcjIgcG9zLCBWZWN0b3IySSBzaXplKSB7XHJcbiAgICAgICAgICAgIGxheWVycyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGF5ZXI+KCk7XHJcbiAgICAgICAgICAgIF90aWxlU2hlZXQgPSB0aWxlU2hlZXQ7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gcG9zO1xyXG4gICAgICAgICAgICBfc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgTGF5ZXIgQWRkTGF5ZXIoc3RyaW5nIG5hbWUsdWludCBpbmRleCkge1xyXG4gICAgICAgICAgICBsYXllcnNbbmFtZV0gPSBuZXcgTGF5ZXIoaW5kZXgsIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJzW25hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlTGF5ZXIoc3RyaW5nIG5hbWUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW25hbWVdID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllciBHZXRMYXllcihzdHJpbmcgbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGF5ZXJzW25hbWVdO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgU2V0Q29sbGlzaW9uKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5LCBpbnQgY29sbGlzaW9uVHlwZSlcclxue1xyXG4gICAgU2V0Q29sbGlzaW9uKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSksIGNvbGxpc2lvblR5cGUpO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBTZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MsIGludCBjb2xsaXNpb25UeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5TZXRDb2xsaXNpb24oKHVpbnQpcG9zLlgsICh1aW50KXBvcy5ZLCBjb2xsaXNpb25UeXBlKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyBpbnQgR2V0Q29sbGlzaW9uKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5KVxyXG57XHJcbiAgICByZXR1cm4gR2V0Q29sbGlzaW9uKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSkpO1xyXG59ICAgICAgICBwdWJsaWMgaW50IEdldENvbGxpc2lvbihzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbGF5ZXJdLkdldENvbGxpc2lvbigodWludClwb3MuWCwgKHVpbnQpcG9zLlkpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgU2V0VGlsZShzdHJpbmcgbGF5ZXIsIGludCB4LCBpbnQgeSwgaW50IHRpbGUpXHJcbntcclxuICAgIFNldFRpbGUobGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSwgdGlsZSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIFNldFRpbGUoc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MsIGludCB0aWxlKSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tsYXllcl0uU2V0VGlsZSgodWludClwb3MuWCwgKHVpbnQpcG9zLlksIHRpbGUsZmFsc2UpO1xyXG4gICAgICAgIH1cclxucHVibGljIGludCBHZXRUaWxlKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5KVxyXG57XHJcbiAgICByZXR1cm4gR2V0VGlsZShsYXllciwgbmV3IFZlY3RvcjJJKHgsIHkpKTtcclxufSAgICAgICAgcHVibGljIGludCBHZXRUaWxlKHN0cmluZyBsYXllciwgVmVjdG9yMkkgcG9zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbGF5ZXJdLkdldFRpbGUoKHVpbnQpcG9zLlgsICh1aW50KXBvcy5ZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIExvYWRUaWxlZEpzb24oc3RyaW5nIHVybCwgdWludCBudW1iZXJPZkxheWVycykge1xyXG5cclxuICAgICAgICAgICAgZm9yICh1aW50IGkgPSAwOyBpIDwgbnVtYmVyT2ZMYXllcnM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgQWRkTGF5ZXIoaStcIlwiLCBpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5PbkxvYWQgKz0gTG9hZFRpbGVkO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lk9wZW4oXCJnZXRcIix1cmwpO1xyXG4gICAgICAgICAgICByZXF1ZXN0LlNlbmQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgTG9hZFRpbGVkKEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgZHluYW1pYyBhID0gSlNPTi5QYXJzZShyZXF1ZXN0LlJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIF9zaXplLlggPSBhLndpZHRoO1xyXG4gICAgICAgICAgICBfc2l6ZS5ZID0gYS5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBhLmxheWVycy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZHluYW1pYyBsYXllcmpzID0gYS5sYXllcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgTGF5ZXIgbGF5ZXIgPSBsYXllcnNbaSArIFwiXCJdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsYXllcmpzID0gbGF5ZXJqcy5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGogPSAwOyBqIDwgbGF5ZXJqcy5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbnQgaW5kZXhYID0gaiAlIF9zaXplLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IGluZGV4WSA9IChpbnQpTWF0aC5GbG9vcigoZmxvYXQpKGogLyBfc2l6ZS5YKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyLlNldFRpbGUoKHVpbnQpaW5kZXhYLCAodWludClpbmRleFksIGxheWVyanNbal0tMSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEcmF3ZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBfY3R4O1xyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgcHVibGljIERyYXdlcihIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2N0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEZpbGxTY3JlZW4oc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgICAgIF9jdHguRmlsbFJlY3QoMCwwLF9jYW52YXMuV2lkdGgsX2NhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhdyhmbG9hdCB4LCBmbG9hdCB5LCBmbG9hdCB3LCBmbG9hdCBoLCBmbG9hdCByLCBkeW5hbWljIGltZywgYm9vbCBmb2xsb3cgPSBmYWxzZSwgZmxvYXQgYWxwaGEgPSAxKSB7XHJcbiAgICAgICAgICAgIF9jdHguSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF9jYW52YXMuU3R5bGUuSW1hZ2VSZW5kZXJpbmcgPSBJbWFnZVJlbmRlcmluZy5QaXhlbGF0ZWQ7XHJcbiAgICAgICAgICAgIF9jdHguU2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgc3ggPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBzeSA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IHN3ID0gdztcclxuICAgICAgICAgICAgZmxvYXQgc2ggPSBoO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltZyA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLnNwcml0ZVNpemVYICE9IG51bGwgJiYgaW1nLnNwcml0ZVNpemVZICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IGltZzIgPSAoU3ByaXRlU2hlZXQpaW1nO1xyXG4gICAgICAgICAgICAgICAgaWYgKGltZzIuZGF0YS5XaWR0aCA9PSAwKSByZXR1cm47IFxyXG4gICAgICAgICAgICAgICAgc3ggPSAoaW1nMi5jdXJyZW50SW5kZXggJSAoaW1nMi5kYXRhLldpZHRoIC8gaW1nMi5zcHJpdGVTaXplWCkpICogaW1nMi5zcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgICAgIHN5ID0gKGZsb2F0KU1hdGguRmxvb3IoaW1nMi5jdXJyZW50SW5kZXggLyAoKGRvdWJsZSlpbWcyLmRhdGEuV2lkdGggLyBpbWcyLnNwcml0ZVNpemVYKSkgKiBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICAgICAgc3cgPSBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc2ggPSBpbWcyLnNwcml0ZVNpemVZO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nLmRhdGEgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nID0gaW1nLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vT2JqZWN0IFJvdGF0aW9uXHJcbiAgICAgICAgICAgIGZsb2F0IG94ID0geCArICh3IC8gMik7XHJcbiAgICAgICAgICAgIGZsb2F0IG95ID0geSArIChoIC8gMik7XHJcblxyXG4gICAgICAgICAgICBfY3R4LlRyYW5zbGF0ZShveCwgb3kpO1xyXG4gICAgICAgICAgICBfY3R4LlJvdGF0ZSgocikgKiBNYXRoLlBJIC8gMTgwKTsgLy9kZWdyZWVcclxuICAgICAgICAgICAgX2N0eC5UcmFuc2xhdGUoLW94LCAtb3kpO1xyXG4gICAgICAgICAgICAvLy0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgIF9jdHguRHJhd0ltYWdlKGltZywgc3gsIHN5LCBzdywgc2gsIHgsIHksIHcsIGgpO1xyXG4gICAgICAgICAgICBfY3R4LlJlc3RvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIEltYWdlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgZGF0YSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJbWFnZShzdHJpbmcgc3JjKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2UoSFRNTEltYWdlRWxlbWVudCBpbWcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkYXRhID0gaW1nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNwcml0ZVNoZWV0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgZGF0YSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc3ByaXRlU2l6ZVggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNwcml0ZVNpemVZIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBjdXJyZW50SW5kZXggeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU3ByaXRlU2hlZXQoc3RyaW5nIHNyYywgdWludCBzcHJpdGVTaXplWCwgdWludCBzcHJpdGVTaXplWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVTaXplWCA9IHNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZVNpemVZID0gc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3IyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIoKSB7XHJcbiAgICAgICAgICAgIFggPSAwO1xyXG4gICAgICAgICAgICBZID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyKGZsb2F0IFggLCBmbG9hdCBZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuWCA9IFg7XHJcbiAgICAgICAgICAgIHRoaXMuWSA9IFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJJXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGludCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMkkoaW50IFgsIGludCBZKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5YID0gWDtcclxuICAgICAgICAgICAgdGhpcy5ZID0gWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuTWF0aHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBaIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgVyB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3I0KGZsb2F0IFgsIGZsb2F0IFksIGZsb2F0IFosIGZsb2F0IFcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlggPSBYO1xyXG4gICAgICAgICAgICB0aGlzLlkgPSBZO1xyXG4gICAgICAgICAgICB0aGlzLlogPSBaO1xyXG4gICAgICAgICAgICB0aGlzLlcgPSBXO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3VzZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgeSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBNb3VzZShIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMpIHtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgVXBkYXRlKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDbGllbnRSZWN0IHJlY3QgPSBfY2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICB4ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFggLSAoZmxvYXQpcmVjdC5MZWZ0O1xyXG4gICAgICAgICAgICB5ID0gZS5BczxNb3VzZUV2ZW50PigpLkNsaWVudFkgLSAoZmxvYXQpcmVjdC5Ub3A7XHJcbiAgICAgICAgfVxyXG5cbiAgICBcbnByaXZhdGUgZmxvYXQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3g9MDtwcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX195PTA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NoZWR1bGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBMaXN0PEFjdGlvbj4gX2FjdGlvbkxpc3QgPSBuZXcgTGlzdDxBY3Rpb24+KCk7XHJcblxyXG4gICAgICAgIGludGVybmFsIFNjaGVkdWxlcigpIHtcclxuICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoQWN0aW9uIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgX2FjdGlvbkxpc3QuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IG1ldGhvZHMoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEFjdGlvbiBhIGluIF9hY3Rpb25MaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBhKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFdpbmRvdy5SZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFuaW1hdG9yIDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PiBfYW5pbWF0aW9ucyB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjdXJyZW50QW5pbWF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRGcmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBmcHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBwbGF5aW5nIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIGxhc3RUaW1lRnJhbWUgPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgQW5pbWF0b3IoR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUpXHJcbntcclxuICAgIEdvdG9BbmRQbGF5KGFuaW1hdGlvbk5hbWUsIDApO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBHb3RvQW5kUGxheShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgaW50IGZyYW1lKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRBbmltYXRpb24gPSBhbmltYXRpb25OYW1lO1xyXG4gICAgICAgICAgICBjdXJyZW50RnJhbWUgPSBmcmFtZTtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFN0b3AoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRTdG9wKHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoISgodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdID49IDApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW1hZ2UgPSAoSW1hZ2UpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFNwcml0ZVNoZWV0IHNoZWV0ID0gKFNwcml0ZVNoZWV0KXBhcmVudC5pbWFnZTtcclxuICAgICAgICAgICAgICAgIHNoZWV0LmN1cnJlbnRJbmRleCA9ICh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKSB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0YXJ0KCkge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDx1aW50PiBsaXN0KSB7XHJcbiAgICAgICAgICAgIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiB0ID0gbmV3IExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4+KCk7XHJcbiAgICAgICAgICAgIENyZWF0ZShhbmltYXRpb25OYW1lLCB0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PEltYWdlPiBsaXN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+IHQgPSBuZXcgTGlzdDxVbmlvbjxJbWFnZSwgdWludD4+KCk7XHJcbiAgICAgICAgICAgIHQgPSBsaXN0LkFzPExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICAgICAgQ3JlYXRlKGFuaW1hdGlvbk5hbWUsIHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiBsaXN0KXtcclxuICAgICAgICAgICAgX2FuaW1hdGlvbnNbYW5pbWF0aW9uTmFtZV0gPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZG91YmxlIG5vdyA9IERhdGVUaW1lLk5vdy5TdWJ0cmFjdChEYXRlVGltZS5NaW5WYWx1ZS5BZGRZZWFycygyMDE3KSkuVG90YWxNaWxsaXNlY29uZHM7XHJcbiAgICAgICAgICAgIGRvdWJsZSBkZWx0YSA9IG5vdyAtIGxhc3RUaW1lRnJhbWU7XHJcbiAgICAgICAgICAgIGlmIChkZWx0YSA+IDEwMDAvZnBzKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUrKztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl0uQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghKCh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV0gPj0gMCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hlZXQuY3VycmVudEluZGV4ID0gKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUZyYW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRBbmltYXRpb249XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY3VycmVudEZyYW1lPTA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2Zwcz0xO3ByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fcGxheWluZz1mYWxzZTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDb2xsaXNpb24gOiBDb21wb25lbnRcclxuICAgIHtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgTGlzdDxWZWN0b3I0PiBfYm94ZXM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDb2xsaXNpb24oR2FtZU9iamVjdCBwYXJlbnQpIDogYmFzZShwYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfYm94ZXMgPSBuZXcgTGlzdDxWZWN0b3I0PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQm94KGZsb2F0IHgxLGZsb2F0IHkxLCBmbG9hdCB3aWR0aCwgZmxvYXQgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIF9ib3hlcy5BZGQobmV3IFZlY3RvcjQoeDEseTEsd2lkdGgsaGVpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWChmbG9hdCB4LCBHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICBmbG9hdCBhZGRpbmcgPSAwO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZUFkZGluZyA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWRkaW5nID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQuX3BhcmVudCk7XHJcbiAgICAgICAgICAgICAgICBhbmdsZUFkZGluZyA9IChmbG9hdCkoTWF0aC5Db3MocGFyZW50Ll9wYXJlbnQuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSkgKiB4O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgPT0gbnVsbCkgYWRkaW5nICs9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZmxvYXQgUGFyZW50UG9zQ2FsY3VsYXRpb25ZKGZsb2F0IHksIEdhbWVPYmplY3QgcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShwYXJlbnQucG9zaXRpb24uWSwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguU2luKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhZGRpbmcgKyBhbmdsZUFkZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBib29sIEhpdFRlc3RPYmplY3QoR2FtZU9iamVjdCBvYmopIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IHB4ID0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IHB5ID0gcGFyZW50LnBvc2l0aW9uLlk7XHJcbiAgICAgICAgICAgIGZsb2F0IHAyeCA9IG9iai5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnkgPSBvYmoucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgIHBhcmVudCk7IFxyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksICBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqLl9wYXJlbnQgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcDJ4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKG9iai5wb3NpdGlvbi5YLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgcDJ5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKG9iai5wb3NpdGlvbi5ZLCBvYmopO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb21wb25lbnQgY3AgaW4gb2JqLmNvbXBvbmVudHMuVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3AuR2V0VHlwZSgpID09IHR5cGVvZihDb2xsaXNpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uIGMgPSAoQ29sbGlzaW9uKWNwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAoVmVjdG9yNCBiMiBpbiBjLl9ib3hlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuWCArIHB4IDwgYjIuWCArIHAyeCArIGIyLlogJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWCArIGIuWiArIHB4ID4gYjIuWCArIHAyeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5ZICsgcHkgPCBiMi5ZICsgYjIuVyArIHAyeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5XICsgYi5ZICsgcHkgID4gYjIuWSArIHAyeSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0UG9pbnQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh4IDwgYi5YICsgcHggKyBiLlogJiZcclxuICAgICAgICAgICAgICAgICAgIHggPiBiLlggKyBweCAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA8IGIuWSArIHB5ICsgYi5XICYmXHJcbiAgICAgICAgICAgICAgICAgICB5ID4gYi5ZICsgcHkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0TGF5ZXIoTGF5ZXIgbGF5ZXIsIGludCBjb2xsaWRlclZhbHVlKSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHB4ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5YLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgcHkgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYiBpbiBfYm94ZXMpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFggPSBweCArIGIuWDtcclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWSA9IHB5ICsgYi5ZO1xyXG5cclxuICAgICAgICAgICAgICAgIGZsb2F0IHRvdGFsWDIgPSB0b3RhbFggKyBiLlo7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFkyID0gdG90YWxZICsgYi5XO1xyXG5cclxuICAgICAgICAgICAgICAgIGludCBsZWZ0X3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWCAtIGxheWVyLnBvc2l0aW9uLlgpIC8gbGF5ZXIudGlsZXNXKTtcclxuICAgICAgICAgICAgICAgIGludCByaWdodF90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFgyIC0gbGF5ZXIucG9zaXRpb24uWCkgLyBsYXllci50aWxlc1cpO1xyXG4gICAgICAgICAgICAgICAgaW50IHRvcF90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFkgLSBsYXllci5wb3NpdGlvbi5ZKSAvIGxheWVyLnRpbGVzSCk7XHJcbiAgICAgICAgICAgICAgICBpbnQgYm90dG9tX3RpbGUgPSAoaW50KU1hdGguRmxvb3IoKHRvdGFsWTIgLSBsYXllci5wb3NpdGlvbi5ZKSAvIGxheWVyLnRpbGVzSCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IHRvcF90aWxlLTE7IHkgPD0gYm90dG9tX3RpbGUrMTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IGxlZnRfdGlsZS0xOyB4IDw9IHJpZ2h0X3RpbGUrMTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4IDwgMCB8fCB4ID4gbGF5ZXIuc2l6ZVggLSAxIHx8IHkgPiBsYXllci5zaXplWSAtIDEgfHwgeSA8IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgY29sbGlkZXIgPSBsYXllci5jb2xsaXNpb25EYXRhW3gseV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xsaWRlciAhPSBjb2xsaWRlclZhbHVlKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVYID0gKHggKiBsYXllci50aWxlc1cpICsgbGF5ZXIucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVkgPSAoeSAqIGxheWVyLnRpbGVzSCkgKyBsYXllci5wb3NpdGlvbi5ZO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQgdGlsZVgyID0gdGlsZVggKyBsYXllci50aWxlc1c7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVZMiA9IHRpbGVZICsgbGF5ZXIudGlsZXNIO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29sIG92ZXJYID0gKHRvdGFsWCA8IHRpbGVYMikgJiYgKHRvdGFsWDIgPiB0aWxlWCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2wgb3ZlclkgPSAodG90YWxZIDwgdGlsZVkyKSAmJiAodG90YWxZMiA+IHRpbGVZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJYICYmIG92ZXJZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIE1vdmVtZW50IDogQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIE1vdmVtZW50KEdhbWVPYmplY3QgX3BhcmVudCkgOiBiYXNlKF9wYXJlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgTW92ZVRvd2FyZChWZWN0b3IyIHBvcywgZmxvYXQgc3BlZWQpXHJcbntcclxuICAgIE1vdmVUb3dhcmQocG9zLlgsIHBvcy5ZLCBzcGVlZCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVUb3dhcmQoZmxvYXQgeCwgZmxvYXQgeSwgZmxvYXQgc3BlZWQpIHtcclxuICAgICAgICAgICAgZmxvYXQgZHggPSB4IC0gcGFyZW50LnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgIGZsb2F0IGR5ID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKGR5LCBkeCk7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWCArPSBzcGVlZCAqIChmbG9hdClNYXRoLkNvcyhhbmdsZSk7XHJcbiAgICAgICAgICAgIHBhcmVudC5wb3NpdGlvbi5ZICs9IHNwZWVkICogKGZsb2F0KU1hdGguU2luKGFuZ2xlKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIExvb2tBdChWZWN0b3IyIHBvcylcclxue1xyXG4gICAgTG9va0F0KHBvcy5YLCBwb3MuWSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIExvb2tBdChmbG9hdCB4LGZsb2F0IHkpIHtcclxuICAgICAgICAgICAgZmxvYXQgeDIgPSBwYXJlbnQucG9zaXRpb24uWCAtIHg7XHJcbiAgICAgICAgICAgIGZsb2F0IHkyID0geSAtIHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBhbmdsZSA9IChmbG9hdClNYXRoLkF0YW4yKHgyLCB5Mik7XHJcbiAgICAgICAgICAgIHBhcmVudC5hbmdsZSA9IGFuZ2xlICogKGZsb2F0KSgxODAvTWF0aC5QSSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGUgOiBHYW1lT2JqZWN0XHJcbiAgICB7XHJcbiAgICAgICAgLy9Db25zdHJ1Y3RvclxyXG4gICAgICAgIHB1YmxpYyBTcHJpdGUoVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplLCBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2UsIFNwcml0ZVNoZWV0PiBpbWFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJTcHJpdGVcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRleHRBcmVhIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdGV4dCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIGNvbG9yIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBJbiBwaXhlbHMsIEV4YW1wbGU6IDE0XHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgaW50IGZvbnRTaXplIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBFeGFtcGxlOiBBcmlhbFxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBmb250IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy9Db25zdHJ1Y3RvclxyXG4gICAgICAgIHB1YmxpYyBUZXh0QXJlYShWZWN0b3IyIHBvc2l0aW9uLCBWZWN0b3IyIHNpemUsIHN0cmluZyBjb2xvciA9IFwiXCIsIGludCBmb250U2l6ZSA9IDE0LCBzdHJpbmcgZm9udCA9IFwiXCIpOnRoaXMocG9zaXRpb24sIHNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udFNpemUgPSBmb250U2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5mb250ID0gZm9udDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgVGV4dEFyZWEoVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gXCJUZXh0QXJlYVwiO1xyXG5cclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzID0gKEhUTUxDYW52YXNFbGVtZW50KURvY3VtZW50LkNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgICAgIGNhbnZhcy5XaWR0aCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlgpO1xyXG4gICAgICAgICAgICBjYW52YXMuSGVpZ2h0ID0gKGludClNYXRoLkZsb29yKHNpemUuWSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBjYW52YXM7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRXJhc2VBbGwoKSB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgY3R4LkNsZWFyUmVjdCgwLCAwLCBjYW52YXMuV2lkdGgsIGNhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmV3cml0ZShzdHJpbmcgdGV4dCwgaW50IHggPSAwLCBpbnQgeSA9IDApIHtcclxuICAgICAgICAgICAgRXJhc2VBbGwoKTtcclxuICAgICAgICAgICAgV3JpdGUodGV4dCx4LHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgV3JpdGUoc3RyaW5nIHRleHQsIGludCB4ID0gMCwgaW50IHkgPSAwKSB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBjdHguRm9udCA9IGZvbnRTaXplICsgXCJweCBcIiArIGZvbnQ7XHJcbiAgICAgICAgICAgIGN0eC5GaWxsVGV4dCh0ZXh0LCB4LCB5K2ZvbnRTaXplKTtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3RleHQ9XCJcIjtwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fY29sb3I9XCJcIjtwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fZm9udFNpemU9MTQ7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2ZvbnQ9XCJcIjt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXBcclxue1xyXG4gICAgcHVibGljIGNsYXNzIExheWVyIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyB1aW50IGluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBpbnRbLF0gZGF0YSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgaW50WyxdIGNvbGxpc2lvbkRhdGEgeyBnZXQ7IHNldDt9XHJcblxyXG4gICAgICAgIHB1YmxpYyB1aW50IHRpbGVzVyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCB0aWxlc0ggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc2l6ZVggeyBnZXQ7IHByaXZhdGUgc2V0O31cclxuICAgICAgICBwdWJsaWMgdWludCBzaXplWSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTcHJpdGVTaGVldCBfc2hlZXQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllcih1aW50IF9pbmRleCwgVGlsZU1hcCB0aWxlTWFwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiVGlsZW1hcExheWVyXCI7XHJcbiAgICAgICAgICAgIGluZGV4ID0gX2luZGV4O1xyXG4gICAgICAgICAgICB0aWxlc1cgPSB0aWxlTWFwLl90aWxlU2hlZXQuc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgIHRpbGVzSCA9IHRpbGVNYXAuX3RpbGVTaGVldC5zcHJpdGVTaXplWTtcclxuICAgICAgICAgICAgc2l6ZVggPSAodWludCl0aWxlTWFwLl9zaXplLlg7XHJcbiAgICAgICAgICAgIHNpemVZID0gKHVpbnQpdGlsZU1hcC5fc2l6ZS5ZO1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IGludFtzaXplWCwgc2l6ZVldO1xyXG4gICAgICAgICAgICBjb2xsaXNpb25EYXRhID0gbmV3IGludFtzaXplWCwgc2l6ZVldO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplWDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemVZOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbaSwgal0gPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zaXRpb24gPSB0aWxlTWFwLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBzaXplID0gbmV3IFZlY3RvcjIoc2l6ZVggKiB0aWxlc1csIHNpemVZICogdGlsZXNIKTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClEb2N1bWVudC5DcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgICAgICBjYW52YXMuV2lkdGggPSAoaW50KU1hdGguRmxvb3Ioc2l6ZS5YKTtcclxuICAgICAgICAgICAgY2FudmFzLkhlaWdodCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlkpO1xyXG4gICAgICAgICAgICBpbWFnZSA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgICAgIF9zaGVldCA9IHRpbGVNYXAuX3RpbGVTaGVldDtcclxuICAgICAgICAgICAgX3NoZWV0LmRhdGEuT25Mb2FkICs9IENvbnN0cnVjdDtcclxuXHJcbiAgICAgICAgfVxyXG5pbnRlcm5hbCB2b2lkIENvbnN0cnVjdCgpXHJcbntcclxuICAgIENvbnN0cnVjdChuZXcgRXZlbnQoXCJcIikpO1xyXG59ICAgICAgICBpbnRlcm5hbCB2b2lkIENvbnN0cnVjdChFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGZvciAodWludCB5ID0gMDsgeSA8IHNpemVZOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAodWludCB4ID0gMDsgeCA8IHNpemVYOyB4Kyspe1xyXG4gICAgICAgICAgICAgICAgICAgIFNldFRpbGUoeCx5LGRhdGFbeCx5XSx0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCBTZXRUaWxlKHVpbnQgeCwgdWludCB5LCBpbnQgdGlsZSwgYm9vbCBieVBhc3NPbGQpIHtcclxuICAgICAgICAgICAgaWYgKCEoeCA+PSAwICYmIHggPD0gc2l6ZVggJiYgeSA+PSAwICYmIHkgPD0gc2l6ZVkpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGludCBvbGRUaWxlID0gZGF0YVt4LCB5XTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClpbWFnZTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aWxlID09IC0xICYmIG9sZFRpbGUgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbeCwgeV0gPSB0aWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LkNsZWFyUmVjdCh4KnRpbGVzVyx5KnRpbGVzSCx0aWxlc1csdGlsZXNIKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PSAtMSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZihvbGRUaWxlICE9IHRpbGUgfHwgYnlQYXNzT2xkKSB7IFxyXG4gICAgICAgICAgICAgICAgZGF0YVt4LCB5XSA9IHRpbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGltYWdlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGZsb2F0IGNhc2VfeCA9IChkYXRhW3gsIHldICUgdGlsZXNXKSAqIHRpbGVzVztcclxuICAgICAgICAgICAgICAgIGZsb2F0IGNhc2VfeSA9IChmbG9hdClNYXRoLkZsb29yKChmbG9hdClkYXRhW3gsIHldIC8gdGlsZXNXKSAqIHRpbGVzSDtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguRHJhd0ltYWdlKF9zaGVldC5kYXRhLCBjYXNlX3gsIGNhc2VfeSwgdGlsZXNXLCB0aWxlc0gsIHggKiB0aWxlc1csIHkgKiB0aWxlc0gsIHRpbGVzVywgdGlsZXNIKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIGludCBHZXRUaWxlKHVpbnQgeCwgdWludCB5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhW3gsIHldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCBTZXRDb2xsaXNpb24odWludCB4LCB1aW50IHksIGludCBjb2xsaXNpb24pIHtcclxuICAgICAgICAgICAgY29sbGlzaW9uRGF0YVt4LCB5XSA9IGNvbGxpc2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIGludCBHZXRDb2xsaXNpb24odWludCB4LCB1aW50IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gY29sbGlzaW9uRGF0YVt4LCB5XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
