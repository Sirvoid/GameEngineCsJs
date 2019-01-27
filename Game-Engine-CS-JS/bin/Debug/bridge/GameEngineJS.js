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

                        var xPos = obj.screenFixed ? obj.position.X : obj.position.X - this.camera.position.X;
                        var yPos = obj.screenFixed ? obj.position.Y : obj.position.Y - this.camera.position.Y;
                        this._drawer.Draw(xPos, yPos, obj.size.X, obj.size.Y, obj.angle, obj.image, false, 1);
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

                var angleRad = 0;
                var xarCos = 0;
                var yarSin = 0;

                if (obj.displayList.list.Count !== 0) {
                    angleRad = obj.angle * Math.PI / 180;
                    xarCos = x + (Math.cos(angleRad));
                    yarSin = y + (Math.sin(angleRad));
                }

                $t = Bridge.getEnumerator(obj.displayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj2 = $t.Current;

                        var newX = obj2.screenFixed ? xarCos + obj2.position.X : xarCos + obj2.position.X - this.camera.position.X;
                        var newY = obj2.screenFixed ? yarSin + obj2.position.Y : yarSin + obj2.position.Y - this.camera.position.Y;
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
             * Fixed on the screen if true.
             *
             * @instance
             * @public
             * @memberof GameEngineJS.GameObjects.GameObject
             * @function screenFixed
             * @type boolean
             */
            screenFixed: false,
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
                this.screenFixed = false;
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

                if (r !== 0) {
                    var ox = x + (w / 2);
                    var oy = y + (h / 2);

                    this._ctx.translate(ox, oy);
                    this._ctx.rotate((r) * Math.PI / 180);
                    this._ctx.translate(-ox, -oy);
                }

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvVGlsZU1hcC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiR3JhcGhpY3MvU3ByaXRlU2hlZXQuY3MiLCJNYXRocy9WZWN0b3IyLmNzIiwiTWF0aHMvVmVjdG9yMkkuY3MiLCJNYXRocy9WZWN0b3I0LmNzIiwiU3lzdGVtL01vdXNlLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJDb21wb25lbnRzL0NvbGxpc2lvbi5jcyIsIkNvbXBvbmVudHMvTW92ZW1lbnQuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiLCJHYW1lT2JqZWN0cy9UZXh0QXJlYS5jcyIsIkdhbWVPYmplY3RzL1RpbGVNYXAvTGF5ZXIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7NEJBUTJCQTs7Z0JBQ2ZBLGNBQWNBOzs7Ozs7Ozs7Ozs7OzRCQ0VPQTs7Z0JBQ3JCQSxtQkFBY0E7Ozs7OztnQkFJZEEsMEJBQTJCQTs7Ozt3QkFDdkJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozt3QkFFSkEscUJBQWdCQTs7Ozs7Ozs7dUNBSUtBOztnQkFDekJBLElBQUlBO29CQUE2QkE7O2dCQUNqQ0EsMEJBQTRCQTs7Ozt3QkFFeEJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozt3QkFFSkEscUJBQWdC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UUEsYUFBUUE7Ozs7K0JBSzlFQSxHQUFRQTtnQkFDekJBLE9BQU9BLGVBQUtBLEdBQUdBOztvQ0FHUUEsR0FBUUEsR0FBUUE7Z0JBQ3ZDQSx3QkFBY0EsR0FBR0EsSUFBS0E7O29DQUdBQSxHQUFRQTtnQkFFOUJBLE9BQU9BLHdCQUFjQSxHQUFHQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29tcG9uZW50XHJcbiAgICB7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBwYXJlbnQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudChHYW1lT2JqZWN0IHBhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZpcnR1YWwgdm9pZCBVcGRhdGUoKSB7fVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIGludGVybmFsIGNsYXNzIENvbXBvbmVudFJlYWRlclxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgQ29tcG9uZW50UmVhZGVyKERpc3BsYXlMaXN0IGxpc3QpIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QgPSBsaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50ZXJuYWwgdm9pZCBVcGRhdGUoKSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIGRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKEtleVZhbHVlUGFpcjxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50IGluIG9iai5jb21wb25lbnRzKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5WYWx1ZS5VcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFJlY3Vyc2l2ZVVwZGF0ZShvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUmVjdXJzaXZlVXBkYXRlKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5TGlzdC5saXN0LkNvdW50IDw9IDApIHJldHVybjtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmoyIGluIG9iai5kaXNwbGF5TGlzdC5saXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmoyLmNvbXBvbmVudHMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LlZhbHVlLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgUmVjdXJzaXZlVXBkYXRlKG9iajIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcm90YXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICAgICAgcm90YXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYShWZWN0b3IyIHBvc2l0aW9uLGZsb2F0IHJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRGlzcGxheUxpc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxHYW1lT2JqZWN0PiBsaXN0IHsgZ2V0OyBzZXQ7IH0gIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoVGlsZU1hcCBvYmosIEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKExheWVyIGwgaW4gb2JqLmxheWVycy5WYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgIEFkZEF0KGwscGFyZW50LChpbnQpbC5pbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEdhbWVPYmplY3Qgb2JqLEdhbWVPYmplY3QgcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGxpc3QuQWRkKG9iaik7XHJcbiAgICAgICAgICAgIG9iai5fcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQXQoR2FtZU9iamVjdCBvYmosR2FtZU9iamVjdCBwYXJlbnQsIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCwgb2JqKTtcclxuICAgICAgICAgICAgb2JqLl9wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmUoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaXN0LlJlbW92ZShvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTW92ZShHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IG9sZEluZGV4ID0gbGlzdC5JbmRleE9mKG9iaik7XHJcbiAgICAgICAgICAgIGxpc3QuUmVtb3ZlQXQob2xkSW5kZXgpO1xyXG4gICAgICAgICAgICBsaXN0Lkluc2VydChpbmRleCxvYmopO1xyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjZW5lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEgY2FtZXJhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9tYWluRGlzcGxheUxpc3Q7XHJcbiAgICAgICAgcHJpdmF0ZSBEcmF3ZXIgX2RyYXdlcjtcclxuICAgICAgICBwcml2YXRlIEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgX2NvbG9yO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUoRGlzcGxheUxpc3Qgb2JqTGlzdCxzdHJpbmcgY2FudmFzSUQsc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgX21haW5EaXNwbGF5TGlzdCA9IG9iakxpc3Q7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBEb2N1bWVudC5RdWVyeVNlbGVjdG9yPEhUTUxDYW52YXNFbGVtZW50PihcImNhbnZhcyNcIiArIGNhbnZhc0lEKTtcclxuICAgICAgICAgICAgX2RyYXdlciA9IG5ldyBEcmF3ZXIoX2NhbnZhcyk7XHJcbiAgICAgICAgICAgIF9jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICBtb3VzZSA9IG5ldyBNb3VzZShfY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlZnJlc2goKSB7XHJcbiAgICAgICAgICAgIF9kcmF3ZXIuRmlsbFNjcmVlbihfY29sb3IpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBfbWFpbkRpc3BsYXlMaXN0Lmxpc3QpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBmbG9hdCB4UG9zID0gb2JqLnNjcmVlbkZpeGVkID8gb2JqLnBvc2l0aW9uLlggOiBvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgeVBvcyA9IG9iai5zY3JlZW5GaXhlZCA/IG9iai5wb3NpdGlvbi5ZIDogb2JqLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgICAgIF9kcmF3ZXIuRHJhdyh4UG9zLCB5UG9zLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouYW5nbGUsIG9iai5pbWFnZSxmYWxzZSwxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmosb2JqLnBvc2l0aW9uLlgsb2JqLnBvc2l0aW9uLlksb2JqLmFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdDaGlsZChHYW1lT2JqZWN0IG9iaixmbG9hdCB4LGZsb2F0IHksZmxvYXQgYW5nbGUpIHtcclxuXHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlUmFkID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgeGFyQ29zID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgeWFyU2luID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmouZGlzcGxheUxpc3QubGlzdC5Db3VudCAhPSAwKSB7IFxyXG4gICAgICAgICAgICAgICAgYW5nbGVSYWQgPSAoZmxvYXQpKG9iai5hbmdsZSAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgICAgICAgICAgeGFyQ29zID0geCArIChmbG9hdCkoTWF0aC5Db3MoYW5nbGVSYWQpKTtcclxuICAgICAgICAgICAgICAgIHlhclNpbiA9IHkgKyAoZmxvYXQpKE1hdGguU2luKGFuZ2xlUmFkKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqMiBpbiBvYmouZGlzcGxheUxpc3QubGlzdCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGZsb2F0IG5ld1ggPSBvYmoyLnNjcmVlbkZpeGVkID8geGFyQ29zICsgb2JqMi5wb3NpdGlvbi5YIDogeGFyQ29zICsgb2JqMi5wb3NpdGlvbi5YIC0gY2FtZXJhLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBuZXdZID0gb2JqMi5zY3JlZW5GaXhlZCA/IHlhclNpbiArIG9iajIucG9zaXRpb24uWSA6IHlhclNpbiArIG9iajIucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgbmV3QW5nbGUgPSBvYmoyLmFuZ2xlICsgYW5nbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgX2RyYXdlci5EcmF3KG5ld1gsIG5ld1ksIG9iajIuc2l6ZS5YLCBvYmoyLnNpemUuWSwgbmV3QW5nbGUsIG9iajIuaW1hZ2UsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgIERyYXdDaGlsZChvYmoyLG5ld1gsbmV3WSxuZXdBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5FdmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEtleUJvYXJkRXZlbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZGVsZWdhdGUgdm9pZCBLZXlQcmVzc0V2ZW50KHN0cmluZyBrZXkpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlQcmVzc0V2ZW50IE9uS2V5UHJlc3NFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleURvd25FdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChzdHJpbmcga2V5KTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5VXBFdmVudCBPbktleVVwRXZlbnRzO1xyXG5cclxuICAgICAgICBwdWJsaWMgS2V5Qm9hcmRFdmVudCgpIHtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5UHJlc3MsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5UHJlc3MpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlEb3duLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleURvd24pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlVcCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlVcCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlEb3duKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlEb3duRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBHYW1lXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIgZHJhd2VyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NoZWR1bGVyIHNjaGVkdWxlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjZW5lIHNjZW5lIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgTW91c2UgbW91c2UgeyBnZXQgeyByZXR1cm4gc2NlbmUubW91c2U7IH0gfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IF9kaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIENvbXBvbmVudFJlYWRlciBfY29tcG9uZW50UmVhZGVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgR2FtZShzdHJpbmcgY2FudmFzSUQpIDogdGhpcyhjYW52YXNJRCwgXCIjZmZmXCIpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCwgc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsIGNhbnZhc0lELCBjb2xvcik7XHJcbiAgICAgICAgICAgIF9jb21wb25lbnRSZWFkZXIgPSBuZXcgQ29tcG9uZW50UmVhZGVyKF9kaXNwbGF5TGlzdCk7XHJcblxyXG5cclxuICAgICAgICAgICAgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcigpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pc2NlbmUuUmVmcmVzaCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilfY29tcG9uZW50UmVhZGVyLlVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChUaWxlTWFwIG9iailcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdC5BZGQob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkQXQob2JqLCBudWxsLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuUmVtb3ZlKG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleCkge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuTW92ZShvYmosaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5EaXNwbGF5O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdhbWVPYmplY3Qge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGludCBJREluY3JlbWVudGVyID0gMDtcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBQb3NpdGlvbiBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBGaXhlZCBvbiB0aGUgc2NyZWVuIGlmIHRydWUuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgYm9vbCBzY3JlZW5GaXhlZCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gU2l6ZSBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHNpemUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gT2JqZWN0IEFuZ2xlIGluIGRlZ3JlZXMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYW5nbGUgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFVuaXF1ZSBJRCBvZiB0aGUgR2FtZU9iamVjdC5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBpbnQgSUQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gSW1hZ2Ugb2YgdGhlIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gTGlzdCBvZiB0aGUgb2JqZWN0IGNvbXBvbmVudHMuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4gY29tcG9uZW50cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQ29tcG9uZW50PigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gR2FtZSBPYmplY3QgdHlwZS5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdHlwZSB7IGdldDsgaW50ZXJuYWwgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIERpc3BsYXlMaXN0IGRpc3BsYXlMaXN0ID0gbmV3IERpc3BsYXlMaXN0KCk7XHJcbiAgICAgICAgaW50ZXJuYWwgR2FtZU9iamVjdCBfcGFyZW50O1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vUHVibGljIE1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBBZGQvTGluayBhIGNvbXBvbmVudCB0byB0aGlzIEdhbWVPYmplY3QuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBwdWJsaWMgQ29tcG9uZW50IEFkZENvbXBvbmVudChzdHJpbmcgaW5zdGFuY2VOYW1lLCBDb21wb25lbnQgY29tcG9uZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdID0gY29tcG9uZW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50c1tpbnN0YW5jZU5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoVGlsZU1hcC5UaWxlTWFwIHRpbGVNYXApIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKHRpbGVNYXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkQ2hpbGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuQWRkKG9iaix0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkQXQoR2FtZU9iamVjdCBvYmosIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LkFkZEF0KG9iaiwgdGhpcywgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVtb3ZlQ2hpbGQoR2FtZU9iamVjdCBvYmopXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXNwbGF5TGlzdC5SZW1vdmUob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVDaGlsZChHYW1lT2JqZWN0IG9iaiwgaW50IGluZGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QuTW92ZShvYmosIGluZGV4KTtcclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgYm9vbCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fc2NyZWVuRml4ZWQ9ZmFsc2U7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0lEPUlESW5jcmVtZW50ZXIrKztwcml2YXRlIHN0cmluZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fdHlwZT1cIlVua25vd25cIjt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHMuVGlsZU1hcFxyXG57XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFRpbGVNYXBcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIFhNTEh0dHBSZXF1ZXN0IHJlcXVlc3Q7XHJcblxyXG4gICAgICAgIGludGVybmFsIERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4gbGF5ZXJzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBTcHJpdGVTaGVldCBfdGlsZVNoZWV0O1xyXG4gICAgICAgIGludGVybmFsIFZlY3RvcjJJIF9zaXplO1xyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUaWxlTWFwKFNwcml0ZVNoZWV0IHRpbGVTaGVldCwgVmVjdG9yMiBwb3MsIFZlY3RvcjJJIHNpemUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBMYXllcj4oKTtcclxuICAgICAgICAgICAgX3RpbGVTaGVldCA9IHRpbGVTaGVldDtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBwb3M7XHJcbiAgICAgICAgICAgIF9zaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMYXllciBBZGRMYXllcihzdHJpbmcgbmFtZSx1aW50IGluZGV4KSB7XHJcbiAgICAgICAgICAgIGxheWVyc1tuYW1lXSA9IG5ldyBMYXllcihpbmRleCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZW1vdmVMYXllcihzdHJpbmcgbmFtZSkge1xyXG4gICAgICAgICAgICBsYXllcnNbbmFtZV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIExheWVyIEdldExheWVyKHN0cmluZyBuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllcnNbbmFtZV07XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBTZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHksIGludCBjb2xsaXNpb25UeXBlKVxyXG57XHJcbiAgICBTZXRDb2xsaXNpb24obGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSwgY29sbGlzaW9uVHlwZSk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIFNldENvbGxpc2lvbihzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcywgaW50IGNvbGxpc2lvblR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsYXllcnNbbGF5ZXJdLlNldENvbGxpc2lvbigodWludClwb3MuWCwgKHVpbnQpcG9zLlksIGNvbGxpc2lvblR5cGUpO1xyXG4gICAgICAgIH1cclxucHVibGljIGludCBHZXRDb2xsaXNpb24oc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHkpXHJcbntcclxuICAgIHJldHVybiBHZXRDb2xsaXNpb24obGF5ZXIsIG5ldyBWZWN0b3IySSh4LCB5KSk7XHJcbn0gICAgICAgIHB1YmxpYyBpbnQgR2V0Q29sbGlzaW9uKHN0cmluZyBsYXllciwgVmVjdG9yMkkgcG9zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxheWVyc1tsYXllcl0uR2V0Q29sbGlzaW9uKCh1aW50KXBvcy5YLCAodWludClwb3MuWSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBTZXRUaWxlKHN0cmluZyBsYXllciwgaW50IHgsIGludCB5LCBpbnQgdGlsZSlcclxue1xyXG4gICAgU2V0VGlsZShsYXllciwgbmV3IFZlY3RvcjJJKHgsIHkpLCB0aWxlKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgU2V0VGlsZShzdHJpbmcgbGF5ZXIsIFZlY3RvcjJJIHBvcywgaW50IHRpbGUpIHtcclxuICAgICAgICAgICAgbGF5ZXJzW2xheWVyXS5TZXRUaWxlKCh1aW50KXBvcy5YLCAodWludClwb3MuWSwgdGlsZSxmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBpbnQgeCwgaW50IHkpXHJcbntcclxuICAgIHJldHVybiBHZXRUaWxlKGxheWVyLCBuZXcgVmVjdG9yMkkoeCwgeSkpO1xyXG59ICAgICAgICBwdWJsaWMgaW50IEdldFRpbGUoc3RyaW5nIGxheWVyLCBWZWN0b3IySSBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxheWVyc1tsYXllcl0uR2V0VGlsZSgodWludClwb3MuWCwgKHVpbnQpcG9zLlkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgTG9hZFRpbGVkSnNvbihzdHJpbmcgdXJsLCB1aW50IG51bWJlck9mTGF5ZXJzKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpbnQgaSA9IDA7IGkgPCBudW1iZXJPZkxheWVyczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBBZGRMYXllcihpK1wiXCIsIGkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lk9uTG9hZCArPSBMb2FkVGlsZWQ7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuT3BlbihcImdldFwiLHVybCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuU2VuZCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBMb2FkVGlsZWQoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBkeW5hbWljIGEgPSBKU09OLlBhcnNlKHJlcXVlc3QuUmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgX3NpemUuWCA9IGEud2lkdGg7XHJcbiAgICAgICAgICAgIF9zaXplLlkgPSBhLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodWludCBpID0gMDsgaSA8IGEubGF5ZXJzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkeW5hbWljIGxheWVyanMgPSBhLmxheWVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBMYXllciBsYXllciA9IGxheWVyc1tpICsgXCJcIl07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxheWVyanMgPSBsYXllcmpzLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgaiA9IDA7IGogPCBsYXllcmpzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGludCBpbmRleFggPSBqICUgX3NpemUuWDtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgaW5kZXhZID0gKGludClNYXRoLkZsb29yKChmbG9hdCkoaiAvIF9zaXplLlgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIuU2V0VGlsZSgodWludClpbmRleFgsICh1aW50KWluZGV4WSwgbGF5ZXJqc1tqXS0xLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIERyYXdlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9jdHg7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBwdWJsaWMgRHJhd2VyKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmlsbFNjcmVlbihzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgX2N0eC5GaWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgX2N0eC5GaWxsUmVjdCgwLDAsX2NhbnZhcy5XaWR0aCxfY2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGZsb2F0IHIsIGR5bmFtaWMgaW1nLCBib29sIGZvbGxvdyA9IGZhbHNlLCBmbG9hdCBhbHBoYSA9IDEpIHtcclxuICAgICAgICAgICAgX2N0eC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgX2NhbnZhcy5TdHlsZS5JbWFnZVJlbmRlcmluZyA9IEltYWdlUmVuZGVyaW5nLlBpeGVsYXRlZDtcclxuICAgICAgICAgICAgX2N0eC5TYXZlKCk7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBzeCA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IHN5ID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgc3cgPSB3O1xyXG4gICAgICAgICAgICBmbG9hdCBzaCA9IGg7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1nID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuc3ByaXRlU2l6ZVggIT0gbnVsbCAmJiBpbWcuc3ByaXRlU2l6ZVkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgU3ByaXRlU2hlZXQgaW1nMiA9IChTcHJpdGVTaGVldClpbWc7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW1nMi5kYXRhLldpZHRoID09IDApIHJldHVybjsgXHJcbiAgICAgICAgICAgICAgICBzeCA9IChpbWcyLmN1cnJlbnRJbmRleCAlIChpbWcyLmRhdGEuV2lkdGggLyBpbWcyLnNwcml0ZVNpemVYKSkgKiBpbWcyLnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICAgICAgc3kgPSAoZmxvYXQpTWF0aC5GbG9vcihpbWcyLmN1cnJlbnRJbmRleCAvICgoZG91YmxlKWltZzIuZGF0YS5XaWR0aCAvIGltZzIuc3ByaXRlU2l6ZVgpKSAqIGltZzIuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgICAgICBzdyA9IGltZzIuc3ByaXRlU2l6ZVg7XHJcbiAgICAgICAgICAgICAgICBzaCA9IGltZzIuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbWcuZGF0YSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWcgPSBpbWcuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYociAhPSAwKSB7IFxyXG4gICAgICAgICAgICAgICAgLy9PYmplY3QgUm90YXRpb25cclxuICAgICAgICAgICAgICAgIGZsb2F0IG94ID0geCArICh3IC8gMik7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBveSA9IHkgKyAoaCAvIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKG94LCBveSk7XHJcbiAgICAgICAgICAgICAgICBfY3R4LlJvdGF0ZSgocikgKiBNYXRoLlBJIC8gMTgwKTsgLy9kZWdyZWVcclxuICAgICAgICAgICAgICAgIF9jdHguVHJhbnNsYXRlKC1veCwgLW95KTtcclxuICAgICAgICAgICAgICAgIC8vLS0tLS0tLVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfY3R4LkRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCB4LCB5LCB3LCBoKTtcclxuICAgICAgICAgICAgX2N0eC5SZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbWFnZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2Uoc3RyaW5nIHNyYykge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIEltYWdlKEhUTUxJbWFnZUVsZW1lbnQgaW1nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YSA9IGltZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTcHJpdGVTaGVldFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNwcml0ZVNpemVYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgdWludCBzcHJpdGVTaXplWSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgY3VycmVudEluZGV4IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFNwcml0ZVNoZWV0KHN0cmluZyBzcmMsIHVpbnQgc3ByaXRlU2l6ZVgsIHVpbnQgc3ByaXRlU2l6ZVkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlU2l6ZVggPSBzcHJpdGVTaXplWDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVTaXplWSA9IHNwcml0ZVNpemVZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoc1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVmVjdG9yMlxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBYIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyKCkge1xyXG4gICAgICAgICAgICBYID0gMDtcclxuICAgICAgICAgICAgWSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCBYICwgZmxvYXQgWSkge1xyXG4gICAgICAgICAgICB0aGlzLlggPSBYO1xyXG4gICAgICAgICAgICB0aGlzLlkgPSBZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3IySVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBpbnQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBZIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjJJKGludCBYLCBpbnQgWSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuWCA9IFg7XHJcbiAgICAgICAgICAgIHRoaXMuWSA9IFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3I0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgWiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFcgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yNChmbG9hdCBYLCBmbG9hdCBZLCBmbG9hdCBaLCBmbG9hdCBXKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5YID0gWDtcclxuICAgICAgICAgICAgdGhpcy5ZID0gWTtcclxuICAgICAgICAgICAgdGhpcy5aID0gWjtcclxuICAgICAgICAgICAgdGhpcy5XID0gVztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLlN5c3RlbVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTW91c2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgTW91c2UoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKSB7XHJcbiAgICAgICAgICAgIF9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFVwZGF0ZShFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ2xpZW50UmVjdCByZWN0ID0gX2NhbnZhcy5HZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgeCA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRYIC0gKGZsb2F0KXJlY3QuTGVmdDtcclxuICAgICAgICAgICAgeSA9IGUuQXM8TW91c2VFdmVudD4oKS5DbGllbnRZIC0gKGZsb2F0KXJlY3QuVG9wO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIGZsb2F0IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX194PTA7cHJpdmF0ZSBmbG9hdCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9feT0wO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjaGVkdWxlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgTGlzdDxBY3Rpb24+IF9hY3Rpb25MaXN0ID0gbmV3IExpc3Q8QWN0aW9uPigpO1xyXG5cclxuICAgICAgICBpbnRlcm5hbCBTY2hlZHVsZXIoKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEFjdGlvbiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgIF9hY3Rpb25MaXN0LkFkZCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PiBtZXRob2RzKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChBY3Rpb24gYSBpbiBfYWN0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgYSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBXaW5kb3cuUmVxdWVzdEFuaW1hdGlvbkZyYW1lKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pVXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRvciA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4gX2FuaW1hdGlvbnMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgY3VycmVudEFuaW1hdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBjdXJyZW50RnJhbWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgZnBzIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgcGxheWluZyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBsYXN0VGltZUZyYW1lID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIEFuaW1hdG9yKEdhbWVPYmplY3QgcGFyZW50KSA6IGJhc2UocGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2FuaW1hdGlvbnMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+Pj4oKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lKVxyXG57XHJcbiAgICBHb3RvQW5kUGxheShhbmltYXRpb25OYW1lLCAwKTtcclxufSAgICAgICAgcHVibGljIHZvaWQgR290b0FuZFBsYXkoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIGludCBmcmFtZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uTmFtZTtcclxuICAgICAgICAgICAgY3VycmVudEZyYW1lID0gZnJhbWU7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxucHVibGljIHZvaWQgR290b0FuZFN0b3Aoc3RyaW5nIGFuaW1hdGlvbk5hbWUpXHJcbntcclxuICAgIEdvdG9BbmRTdG9wKGFuaW1hdGlvbk5hbWUsIDApO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBHb3RvQW5kU3RvcChzdHJpbmcgYW5pbWF0aW9uTmFtZSwgaW50IGZyYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEoKHVpbnQpX2FuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXSA+PSAwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmltYWdlID0gKEltYWdlKV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBTcHJpdGVTaGVldCBzaGVldCA9IChTcHJpdGVTaGVldClwYXJlbnQuaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICBzaGVldC5jdXJyZW50SW5kZXggPSAodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdG9wKCkge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydCgpIHtcclxuICAgICAgICAgICAgcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8dWludD4gbGlzdCkge1xyXG4gICAgICAgICAgICBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4gdCA9IG5ldyBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4oKTtcclxuICAgICAgICAgICAgdCA9IGxpc3QuQXM8TGlzdDxVbmlvbjxJbWFnZSwgdWludD4+PigpO1xyXG4gICAgICAgICAgICBDcmVhdGUoYW5pbWF0aW9uTmFtZSwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIENyZWF0ZShzdHJpbmcgYW5pbWF0aW9uTmFtZSwgTGlzdDxJbWFnZT4gbGlzdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PiB0ID0gbmV3IExpc3Q8VW5pb248SW1hZ2UsIHVpbnQ+PigpO1xyXG4gICAgICAgICAgICB0ID0gbGlzdC5BczxMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4+KCk7XHJcbiAgICAgICAgICAgIENyZWF0ZShhbmltYXRpb25OYW1lLCB0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgQ3JlYXRlKHN0cmluZyBhbmltYXRpb25OYW1lLCBMaXN0PFVuaW9uPEltYWdlLCB1aW50Pj4gbGlzdCl7XHJcbiAgICAgICAgICAgIF9hbmltYXRpb25zW2FuaW1hdGlvbk5hbWVdID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIG92ZXJyaWRlIHZvaWQgVXBkYXRlKCkge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGRvdWJsZSBub3cgPSBEYXRlVGltZS5Ob3cuU3VidHJhY3QoRGF0ZVRpbWUuTWluVmFsdWUuQWRkWWVhcnMoMjAxNykpLlRvdGFsTWlsbGlzZWNvbmRzO1xyXG4gICAgICAgICAgICBkb3VibGUgZGVsdGEgPSBub3cgLSBsYXN0VGltZUZyYW1lO1xyXG4gICAgICAgICAgICBpZiAoZGVsdGEgPiAxMDAwL2Zwcykge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEZyYW1lKys7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lID49IF9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dLkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEZyYW1lID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoISgodWludClfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdID49IDApKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5pbWFnZSA9IChJbWFnZSlfYW5pbWF0aW9uc1tjdXJyZW50QW5pbWF0aW9uXVtjdXJyZW50RnJhbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgU3ByaXRlU2hlZXQgc2hlZXQgPSAoU3ByaXRlU2hlZXQpcGFyZW50LmltYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNoZWV0LmN1cnJlbnRJbmRleCA9ICh1aW50KV9hbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dW2N1cnJlbnRGcmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGFzdFRpbWVGcmFtZSA9IG5vdztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxuXHJcbiAgICBcbnByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19jdXJyZW50QW5pbWF0aW9uPVwiXCI7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRGcmFtZT0wO3ByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19mcHM9MTtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX3BsYXlpbmc9ZmFsc2U7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzLlRpbGVNYXA7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQ29sbGlzaW9uIDogQ29tcG9uZW50XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHJlYWRvbmx5IExpc3Q8VmVjdG9yND4gX2JveGVzO1xyXG5cclxuICAgICAgICBwdWJsaWMgQ29sbGlzaW9uKEdhbWVPYmplY3QgcGFyZW50KSA6IGJhc2UocGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX2JveGVzID0gbmV3IExpc3Q8VmVjdG9yND4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZEJveChmbG9hdCB4MSxmbG9hdCB5MSwgZmxvYXQgd2lkdGgsIGZsb2F0IGhlaWdodCkge1xyXG4gICAgICAgICAgICBfYm94ZXMuQWRkKG5ldyBWZWN0b3I0KHgxLHkxLHdpZHRoLGhlaWdodCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBmbG9hdCBQYXJlbnRQb3NDYWxjdWxhdGlvblgoZmxvYXQgeCwgR2FtZU9iamVjdCBwYXJlbnQpIHtcclxuICAgICAgICAgICAgZmxvYXQgYWRkaW5nID0gMDtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGVBZGRpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFkZGluZyA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgcGFyZW50Ll9wYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGVBZGRpbmcgPSAoZmxvYXQpKE1hdGguQ29zKHBhcmVudC5fcGFyZW50LmFuZ2xlICogTWF0aC5QSSAvIDE4MCkpICogeDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50ID09IG51bGwpIGFkZGluZyArPSBwYXJlbnQucG9zaXRpb24uWDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAgYWRkaW5nICsgYW5nbGVBZGRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGZsb2F0IFBhcmVudFBvc0NhbGN1bGF0aW9uWShmbG9hdCB5LCBHYW1lT2JqZWN0IHBhcmVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0IGFkZGluZyA9IDA7XHJcbiAgICAgICAgICAgIGZsb2F0IGFuZ2xlQWRkaW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhZGRpbmcgPSBQYXJlbnRQb3NDYWxjdWxhdGlvblkocGFyZW50LnBvc2l0aW9uLlksIHBhcmVudC5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlQWRkaW5nID0gKGZsb2F0KShNYXRoLlNpbihwYXJlbnQuX3BhcmVudC5hbmdsZSAqIE1hdGguUEkgLyAxODApKSAqIHk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCA9PSBudWxsKSBhZGRpbmcgKz0gcGFyZW50LnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWRkaW5nICsgYW5nbGVBZGRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYm9vbCBIaXRUZXN0T2JqZWN0KEdhbWVPYmplY3Qgb2JqKSB7XHJcblxyXG4gICAgICAgICAgICBmbG9hdCBweCA9IHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBweSA9IHBhcmVudC5wb3NpdGlvbi5ZO1xyXG4gICAgICAgICAgICBmbG9hdCBwMnggPSBvYmoucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcDJ5ID0gb2JqLnBvc2l0aW9uLlk7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50Ll9wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcHggPSBQYXJlbnRQb3NDYWxjdWxhdGlvblgocGFyZW50LnBvc2l0aW9uLlgsICBwYXJlbnQpOyBcclxuICAgICAgICAgICAgICAgIHB5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25ZKHBhcmVudC5wb3NpdGlvbi5ZLCAgcGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9iai5fcGFyZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHAyeCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChvYmoucG9zaXRpb24uWCwgb2JqKTtcclxuICAgICAgICAgICAgICAgIHAyeSA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWShvYmoucG9zaXRpb24uWSwgb2JqKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoQ29tcG9uZW50IGNwIGluIG9iai5jb21wb25lbnRzLlZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNwLkdldFR5cGUoKSA9PSB0eXBlb2YoQ29sbGlzaW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbiBjID0gKENvbGxpc2lvbiljcDtcclxuICAgICAgICAgICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIgaW4gX2JveGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKFZlY3RvcjQgYjIgaW4gYy5fYm94ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLlggKyBweCA8IGIyLlggKyBwMnggKyBiMi5aICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLlggKyBiLlogKyBweCA+IGIyLlggKyBwMnggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuWSArIHB5IDwgYjIuWSArIGIyLlcgKyBwMnkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuVyArIGIuWSArIHB5ICA+IGIyLlkgKyBwMnkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgSGl0VGVzdFBvaW50KGZsb2F0IHgsZmxvYXQgeSkge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgcHggPSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcHkgPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHB5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5ZLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIgaW4gX2JveGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA8IGIuWCArIHB4ICsgYi5aICYmXHJcbiAgICAgICAgICAgICAgICAgICB4ID4gYi5YICsgcHggJiZcclxuICAgICAgICAgICAgICAgICAgIHkgPCBiLlkgKyBweSArIGIuVyAmJlxyXG4gICAgICAgICAgICAgICAgICAgeSA+IGIuWSArIHB5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJvb2wgSGl0VGVzdExheWVyKExheWVyIGxheWVyLCBpbnQgY29sbGlkZXJWYWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgZmxvYXQgcHggPSBwYXJlbnQucG9zaXRpb24uWDtcclxuICAgICAgICAgICAgZmxvYXQgcHkgPSBwYXJlbnQucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX3BhcmVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBweCA9IFBhcmVudFBvc0NhbGN1bGF0aW9uWChwYXJlbnQucG9zaXRpb24uWCwgcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHB5ID0gUGFyZW50UG9zQ2FsY3VsYXRpb25YKHBhcmVudC5wb3NpdGlvbi5ZLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChWZWN0b3I0IGIgaW4gX2JveGVzKVxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgICAgZmxvYXQgdG90YWxYID0gcHggKyBiLlg7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFkgPSBweSArIGIuWTtcclxuXHJcbiAgICAgICAgICAgICAgICBmbG9hdCB0b3RhbFgyID0gdG90YWxYICsgYi5aO1xyXG4gICAgICAgICAgICAgICAgZmxvYXQgdG90YWxZMiA9IHRvdGFsWSArIGIuVztcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgbGVmdF90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFggLSBsYXllci5wb3NpdGlvbi5YKSAvIGxheWVyLnRpbGVzVyk7XHJcbiAgICAgICAgICAgICAgICBpbnQgcmlnaHRfdGlsZSA9IChpbnQpTWF0aC5GbG9vcigodG90YWxYMiAtIGxheWVyLnBvc2l0aW9uLlgpIC8gbGF5ZXIudGlsZXNXKTtcclxuICAgICAgICAgICAgICAgIGludCB0b3BfdGlsZSA9IChpbnQpTWF0aC5GbG9vcigodG90YWxZIC0gbGF5ZXIucG9zaXRpb24uWSkgLyBsYXllci50aWxlc0gpO1xyXG4gICAgICAgICAgICAgICAgaW50IGJvdHRvbV90aWxlID0gKGludClNYXRoLkZsb29yKCh0b3RhbFkyIC0gbGF5ZXIucG9zaXRpb24uWSkgLyBsYXllci50aWxlc0gpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoaW50IHkgPSB0b3BfdGlsZS0xOyB5IDw9IGJvdHRvbV90aWxlKzE7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHggPSBsZWZ0X3RpbGUtMTsgeCA8PSByaWdodF90aWxlKzE7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA8IDAgfHwgeCA+IGxheWVyLnNpemVYIC0gMSB8fCB5ID4gbGF5ZXIuc2l6ZVkgLSAxIHx8IHkgPCAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50IGNvbGxpZGVyID0gbGF5ZXIuY29sbGlzaW9uRGF0YVt4LHldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sbGlkZXIgIT0gY29sbGlkZXJWYWx1ZSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbG9hdCB0aWxlWCA9ICh4ICogbGF5ZXIudGlsZXNXKSArIGxheWVyLnBvc2l0aW9uLlg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVZID0gKHkgKiBsYXllci50aWxlc0gpICsgbGF5ZXIucG9zaXRpb24uWTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsb2F0IHRpbGVYMiA9IHRpbGVYICsgbGF5ZXIudGlsZXNXO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbG9hdCB0aWxlWTIgPSB0aWxlWSArIGxheWVyLnRpbGVzSDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbCBvdmVyWCA9ICh0b3RhbFggPCB0aWxlWDIpICYmICh0b3RhbFgyID4gdGlsZVgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib29sIG92ZXJZID0gKHRvdGFsWSA8IHRpbGVZMikgJiYgKHRvdGFsWTIgPiB0aWxlWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdmVyWCAmJiBvdmVyWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBNb3ZlbWVudCA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBNb3ZlbWVudChHYW1lT2JqZWN0IF9wYXJlbnQpIDogYmFzZShfcGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICB9XHJcbnB1YmxpYyB2b2lkIE1vdmVUb3dhcmQoVmVjdG9yMiBwb3MsIGZsb2F0IHNwZWVkKVxyXG57XHJcbiAgICBNb3ZlVG93YXJkKHBvcy5YLCBwb3MuWSwgc3BlZWQpO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBNb3ZlVG93YXJkKGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHNwZWVkKSB7XHJcbiAgICAgICAgICAgIGZsb2F0IGR4ID0geCAtIHBhcmVudC5wb3NpdGlvbi5YO1xyXG4gICAgICAgICAgICBmbG9hdCBkeSA9IHkgLSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpTWF0aC5BdGFuMihkeSwgZHgpO1xyXG5cclxuICAgICAgICAgICAgcGFyZW50LnBvc2l0aW9uLlggKz0gc3BlZWQgKiAoZmxvYXQpTWF0aC5Db3MoYW5nbGUpO1xyXG4gICAgICAgICAgICBwYXJlbnQucG9zaXRpb24uWSArPSBzcGVlZCAqIChmbG9hdClNYXRoLlNpbihhbmdsZSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBMb29rQXQoVmVjdG9yMiBwb3MpXHJcbntcclxuICAgIExvb2tBdChwb3MuWCwgcG9zLlkpO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBMb29rQXQoZmxvYXQgeCxmbG9hdCB5KSB7XHJcbiAgICAgICAgICAgIGZsb2F0IHgyID0gcGFyZW50LnBvc2l0aW9uLlggLSB4O1xyXG4gICAgICAgICAgICBmbG9hdCB5MiA9IHkgLSBwYXJlbnQucG9zaXRpb24uWTtcclxuICAgICAgICAgICAgZmxvYXQgYW5nbGUgPSAoZmxvYXQpTWF0aC5BdGFuMih4MiwgeTIpO1xyXG4gICAgICAgICAgICBwYXJlbnQuYW5nbGUgPSBhbmdsZSAqIChmbG9hdCkoMTgwL01hdGguUEkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aHM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgU3ByaXRlKFZlY3RvcjIgcG9zaXRpb24sIFZlY3RvcjIgc2l6ZSwgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlLCBTcHJpdGVTaGVldD4gaW1hZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiU3ByaXRlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRocztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuQ29tcG9uZW50cztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUZXh0QXJlYSA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHRleHQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBjb2xvciB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gSW4gcGl4ZWxzLCBFeGFtcGxlOiAxNFxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgcHVibGljIGludCBmb250U2l6ZSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gRXhhbXBsZTogQXJpYWxcclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgZm9udCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgVGV4dEFyZWEoVmVjdG9yMiBwb3NpdGlvbiwgVmVjdG9yMiBzaXplLCBzdHJpbmcgY29sb3IgPSBcIlwiLCBpbnQgZm9udFNpemUgPSAxNCwgc3RyaW5nIGZvbnQgPSBcIlwiKTp0aGlzKHBvc2l0aW9uLCBzaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRTaXplID0gZm9udFNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFRleHRBcmVhKFZlY3RvcjIgcG9zaXRpb24sIFZlY3RvcjIgc2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFwiVGV4dEFyZWFcIjtcclxuXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyA9IChIVE1MQ2FudmFzRWxlbWVudClEb2N1bWVudC5DcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgICAgICBjYW52YXMuV2lkdGggPSAoaW50KU1hdGguRmxvb3Ioc2l6ZS5YKTtcclxuICAgICAgICAgICAgY2FudmFzLkhlaWdodCA9IChpbnQpTWF0aC5GbG9vcihzaXplLlkpO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gY2FudmFzO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEVyYXNlQWxsKCkge1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpaW1hZ2U7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoMCwgMCwgY2FudmFzLldpZHRoLCBjYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJld3JpdGUoc3RyaW5nIHRleHQsIGludCB4ID0gMCwgaW50IHkgPSAwKSB7XHJcbiAgICAgICAgICAgIEVyYXNlQWxsKCk7XHJcbiAgICAgICAgICAgIFdyaXRlKHRleHQseCx5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFdyaXRlKHN0cmluZyB0ZXh0LCBpbnQgeCA9IDAsIGludCB5ID0gMCkge1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpaW1hZ2U7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgY3R4LkZvbnQgPSBmb250U2l6ZSArIFwicHggXCIgKyBmb250O1xyXG4gICAgICAgICAgICBjdHguRmlsbFRleHQodGV4dCwgeCwgeStmb250U2l6ZSk7XHJcbiAgICAgICAgfVxyXG5cbiAgICBcbnByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX190ZXh0PVwiXCI7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2NvbG9yPVwiXCI7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2ZvbnRTaXplPTE0O3ByaXZhdGUgc3RyaW5nIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19mb250PVwiXCI7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGhzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cy5UaWxlTWFwXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBMYXllciA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgdWludCBpbmRleCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgaW50ZXJuYWwgaW50WyxdIGRhdGEgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIGludGVybmFsIGludFssXSBjb2xsaXNpb25EYXRhIHsgZ2V0OyBzZXQ7fVxyXG5cclxuICAgICAgICBwdWJsaWMgdWludCB0aWxlc1cgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHVpbnQgdGlsZXNIIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyB1aW50IHNpemVYIHsgZ2V0OyBwcml2YXRlIHNldDt9XHJcbiAgICAgICAgcHVibGljIHVpbnQgc2l6ZVkgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgU3ByaXRlU2hlZXQgX3NoZWV0O1xyXG5cclxuICAgICAgICBwdWJsaWMgTGF5ZXIodWludCBfaW5kZXgsIFRpbGVNYXAgdGlsZU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBcIlRpbGVtYXBMYXllclwiO1xyXG4gICAgICAgICAgICBpbmRleCA9IF9pbmRleDtcclxuICAgICAgICAgICAgdGlsZXNXID0gdGlsZU1hcC5fdGlsZVNoZWV0LnNwcml0ZVNpemVYO1xyXG4gICAgICAgICAgICB0aWxlc0ggPSB0aWxlTWFwLl90aWxlU2hlZXQuc3ByaXRlU2l6ZVk7XHJcbiAgICAgICAgICAgIHNpemVYID0gKHVpbnQpdGlsZU1hcC5fc2l6ZS5YO1xyXG4gICAgICAgICAgICBzaXplWSA9ICh1aW50KXRpbGVNYXAuX3NpemUuWTtcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBpbnRbc2l6ZVgsIHNpemVZXTtcclxuICAgICAgICAgICAgY29sbGlzaW9uRGF0YSA9IG5ldyBpbnRbc2l6ZVgsIHNpemVZXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZVg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplWTsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2ksIGpdID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGlsZU1hcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IG5ldyBWZWN0b3IyKHNpemVYICogdGlsZXNXLCBzaXplWSAqIHRpbGVzSCk7XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpRG9jdW1lbnQuQ3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICAgICAgY2FudmFzLldpZHRoID0gKGludClNYXRoLkZsb29yKHNpemUuWCk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5IZWlnaHQgPSAoaW50KU1hdGguRmxvb3Ioc2l6ZS5ZKTtcclxuICAgICAgICAgICAgaW1hZ2UgPSBjYW52YXM7XHJcblxyXG4gICAgICAgICAgICBfc2hlZXQgPSB0aWxlTWFwLl90aWxlU2hlZXQ7XHJcbiAgICAgICAgICAgIF9zaGVldC5kYXRhLk9uTG9hZCArPSBDb25zdHJ1Y3Q7XHJcblxyXG4gICAgICAgIH1cclxuaW50ZXJuYWwgdm9pZCBDb25zdHJ1Y3QoKVxyXG57XHJcbiAgICBDb25zdHJ1Y3QobmV3IEV2ZW50KFwiXCIpKTtcclxufSAgICAgICAgaW50ZXJuYWwgdm9pZCBDb25zdHJ1Y3QoRXZlbnQgZSkge1xyXG4gICAgICAgICAgICBmb3IgKHVpbnQgeSA9IDA7IHkgPCBzaXplWTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHVpbnQgeCA9IDA7IHggPCBzaXplWDsgeCsrKXtcclxuICAgICAgICAgICAgICAgICAgICBTZXRUaWxlKHgseSxkYXRhW3gseV0sdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgU2V0VGlsZSh1aW50IHgsIHVpbnQgeSwgaW50IHRpbGUsIGJvb2wgYnlQYXNzT2xkKSB7XHJcbiAgICAgICAgICAgIGlmICghKHggPj0gMCAmJiB4IDw9IHNpemVYICYmIHkgPj0gMCAmJiB5IDw9IHNpemVZKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpbnQgb2xkVGlsZSA9IGRhdGFbeCwgeV07XHJcblxyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgPSAoSFRNTENhbnZhc0VsZW1lbnQpaW1hZ2U7XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGlsZSA9PSAtMSAmJiBvbGRUaWxlICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW3gsIHldID0gdGlsZTtcclxuICAgICAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoeCp0aWxlc1cseSp0aWxlc0gsdGlsZXNXLHRpbGVzSCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRpbGUgPT0gLTEpIHJldHVybjtcclxuICAgICAgICAgICAgaWYob2xkVGlsZSAhPSB0aWxlIHx8IGJ5UGFzc09sZCkgeyBcclxuICAgICAgICAgICAgICAgIGRhdGFbeCwgeV0gPSB0aWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbWFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBjYXNlX3ggPSAoZGF0YVt4LCB5XSAlIHRpbGVzVykgKiB0aWxlc1c7XHJcbiAgICAgICAgICAgICAgICBmbG9hdCBjYXNlX3kgPSAoZmxvYXQpTWF0aC5GbG9vcigoZmxvYXQpZGF0YVt4LCB5XSAvIHRpbGVzVykgKiB0aWxlc0g7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkRyYXdJbWFnZShfc2hlZXQuZGF0YSwgY2FzZV94LCBjYXNlX3ksIHRpbGVzVywgdGlsZXNILCB4ICogdGlsZXNXLCB5ICogdGlsZXNILCB0aWxlc1csIHRpbGVzSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBpbnQgR2V0VGlsZSh1aW50IHgsIHVpbnQgeSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YVt4LCB5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgU2V0Q29sbGlzaW9uKHVpbnQgeCwgdWludCB5LCBpbnQgY29sbGlzaW9uKSB7XHJcbiAgICAgICAgICAgIGNvbGxpc2lvbkRhdGFbeCwgeV0gPSBjb2xsaXNpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCBpbnQgR2V0Q29sbGlzaW9uKHVpbnQgeCwgdWludCB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbGxpc2lvbkRhdGFbeCwgeV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
