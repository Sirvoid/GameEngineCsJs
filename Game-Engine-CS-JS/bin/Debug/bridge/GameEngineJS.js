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
                this.position = new GameEngineJS.Math.Vector2(0, 0);
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
            Add: function (obj) {
                this.list.add(obj);
            }
        }
    });

    Bridge.define("GameEngineJS.Display.Scene", {
        fields: {
            camera: null,
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
                        this._drawer.Draw(obj.position.X - this.camera.position.X, obj.position.Y - this.camera.position.Y, obj.size.X, obj.size.Y, obj.image);
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
                this.OnKeyPressEvents(e.keyCode);
            },
            DoKeyDown: function (e) {
                if (Bridge.staticEquals(this.OnKeyDownEvents, null)) {
                    return;
                }
                this.OnKeyDownEvents(e.keyCode);
            },
            DoKeyUp: function (e) {
                if (Bridge.staticEquals(this.OnKeyUpEvents, null)) {
                    return;
                }
                this.OnKeyUpEvents(e.keyCode);
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
        ctors: {
            ctor: function (canvasID, color) {
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
            AddChild: function (obj) {
                this._displayList.Add(obj);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.GameObject", {
        fields: {
            position: null,
            size: null,
            image: null,
            components: null
        },
        ctors: {
            init: function () {
                this.components = new (System.Collections.Generic.Dictionary$2(System.String,GameEngineJS.Components.Component))();
            }
        },
        methods: {
            AddComponent: function (instanceName, component) {
                this.components.set(instanceName, component);
                return this.components.get(instanceName);
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
                if (img.data != null) {
                    img = img.data;
                }
                this._ctx.drawImage(img, x, y, w, h);
            }
        }
    });

    Bridge.define("GameEngineJS.Graphics.Image", {
        fields: {
            data: null
        },
        ctors: {
            ctor: function (src) {
                this.$initialize();
                this.data = new Image();
                this.data.src = src;

            }
        }
    });

    Bridge.define("GameEngineJS.Math.Vector2", {
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
            animations: null,
            currentAnimation: null,
            currentFrame: 0,
            fps: 0,
            _playing: false,
            lastTimeFrame: 0
        },
        ctors: {
            init: function () {
                this.currentAnimation = "";
                this.currentFrame = 0;
                this.fps = 1;
                this._playing = false;
                this.lastTimeFrame = 0;
            },
            ctor: function (parent) {
                this.$initialize();
                GameEngineJS.Components.Component.ctor.call(this, parent);
                this.animations = new (System.Collections.Generic.Dictionary$2(System.String,System.Collections.Generic.List$1(GameEngineJS.Graphics.Image)))();
            }
        },
        methods: {
            GotoAndPlay: function (animationName) {
                this.GotoAndPlay$1(animationName, 0);
            },
            GotoAndPlay$1: function (animationName, frame) {
                this.currentAnimation = animationName;
                this.currentFrame = frame;
                this._playing = true;
            },
            Create: function (animationName, list) {
                this.animations.set(animationName, list);
            },
            Update: function () {
                if (!this._playing) {
                    return;
                }

                var now = System.DateTime.subdd(System.DateTime.getNow(), System.DateTime.addYears(System.DateTime.getMinValue(), 2017)).getTotalMilliseconds();
                var delta = now - this.lastTimeFrame;
                if (delta > ((Bridge.Int.div(1000, this.fps)) | 0)) {
                    this.currentFrame = (this.currentFrame + 1) | 0;
                    if (this.currentFrame >= this.animations.get(this.currentAnimation).Count) {
                        this.currentFrame = 0;
                    }
                    System.Console.Write(this.currentFrame + " " + (this.currentAnimation || ""));
                    this.parent.image = this.animations.get(this.currentAnimation).getItem(this.currentFrame);

                    this.lastTimeFrame = now;
                }

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
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkNvbXBvbmVudHMvQ29tcG9uZW50LmNzIiwiQ29tcG9uZW50cy9Db21wb25lbnRSZWFkZXIuY3MiLCJEaXNwbGF5L0NhbWVyYS5jcyIsIkRpc3BsYXkvRGlzcGxheUxpc3QuY3MiLCJEaXNwbGF5L1NjZW5lLmNzIiwiRXZlbnRzL0tleUJvYXJkRXZlbnQuY3MiLCJHYW1lLmNzIiwiR2FtZU9iamVjdHMvR2FtZU9iamVjdC5jcyIsIkdyYXBoaWNzL0RyYXdlci5jcyIsIkdyYXBoaWNzL0ltYWdlLmNzIiwiTWF0aC9WZWN0b3IyLmNzIiwiU3lzdGVtL1NjaGVkdWxlci5jcyIsIkNvbXBvbmVudHMvQW5pbWF0b3IuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7NEJBUTJCQTs7Z0JBQ2ZBLGNBQVNBOzs7Ozs7Ozs7Ozs7OzRCQ0VZQTs7Z0JBQ3JCQSxtQkFBY0E7Ozs7OztnQkFJZEEsMEJBQTJCQTs7Ozt3QkFDdkJBLDJCQUFzREE7Ozs7Z0NBRWxEQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkNMUkEsZ0JBQVdBLElBQUlBO2dCQUNmQTs7OEJBR1VBLFdBQWtCQTs7Z0JBQzVCQSxnQkFBV0E7Z0JBQ1hBLGdCQUFXQTs7Ozs7Ozs7Ozs7NEJDSGdDQSxLQUFJQTs7OzsyQkFMbkNBO2dCQUNaQSxjQUFTQTs7Ozs7Ozs7Ozs7Ozs7NEJDT0FBLFNBQW9CQSxVQUFnQkE7O2dCQUM3Q0EsY0FBU0EsSUFBSUE7Z0JBQ2JBLHdCQUFtQkE7Z0JBQ25CQSxlQUFVQSx1QkFBMENBLGFBQVlBO2dCQUNoRUEsZUFBVUEsSUFBSUEsNkJBQU9BO2dCQUNyQkEsY0FBU0E7Ozs7OztnQkFJVEEsd0JBQW1CQTtnQkFDbkJBLDBCQUEyQkE7Ozs7d0JBQ3ZCQSxrQkFBYUEsaUJBQWlCQSx3QkFBbUJBLGlCQUFpQkEsd0JBQW1CQSxZQUFZQSxZQUFZQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JDWmpIQSwwQkFBMEJBLFlBQW9CQSxBQUFtREE7Z0JBQ2pHQSwwQkFBMEJBLFdBQW1CQSxBQUFtREE7Z0JBQ2hHQSwwQkFBMEJBLFNBQWlCQSxBQUFtREE7Ozs7a0NBRzFFQTtnQkFDcEJBLElBQUlBLDJDQUFvQkE7b0JBQU1BOztnQkFDOUJBLHNCQUF3QkE7O2lDQUdMQTtnQkFFbkJBLElBQUlBLDBDQUFtQkE7b0JBQU1BOztnQkFDN0JBLHFCQUF1QkE7OytCQUdOQTtnQkFFakJBLElBQUlBLHdDQUFpQkE7b0JBQU1BOztnQkFDM0JBLG1CQUFxQkE7Ozs7Ozs7Ozs7Ozs7OzRCQ2hCYkEsVUFBZ0JBOzs7Z0JBRXhCQSxvQkFBZUEsSUFBSUE7Z0JBQ25CQSxhQUFRQSxJQUFJQSwyQkFBTUEsbUJBQWFBLFVBQVNBO2dCQUN4Q0Esd0JBQW1CQSxJQUFJQSx3Q0FBZ0JBOztnQkFFdkNBLGlCQUFZQSxJQUFJQTtnQkFDaEJBLG1CQUFjQSxBQUF1QkE7Z0JBQ3JDQSxtQkFBY0EsQUFBdUJBOzs7O2dDQUdwQkE7Z0JBQ2pCQSxzQkFBaUJBOzs7Ozs7Ozs7Ozs7OztrQ0NsQjZCQSxLQUFJQTs7OztvQ0FHeEJBLGNBQXFCQTtnQkFFL0NBLG9CQUFXQSxjQUFnQkE7Z0JBQzNCQSxPQUFPQSxvQkFBV0E7Ozs7Ozs7Ozs7OzRCQ1ZSQTs7Z0JBQ1ZBLFlBQU9BLEFBQTBCQTtnQkFDakNBLGVBQVVBOzs7O2tDQUdTQTtnQkFDbkJBLHNCQUFpQkE7Z0JBQ2pCQSx5QkFBa0JBLG9CQUFjQTs7NEJBRTNCQSxHQUFTQSxHQUFTQSxHQUFTQSxHQUFTQTtnQkFFakRBLFlBQUtBLEdBQUdBLEdBQUdBLEdBQUdBLE1BQU1BOzs4QkFDRUEsR0FBU0EsR0FBU0EsR0FBU0EsR0FBU0EsR0FBU0EsS0FBYUEsUUFBYUE7Z0JBQ3JGQSxJQUFJQSxZQUFZQTtvQkFDWkEsTUFBTUE7O2dCQUVWQSxvQkFBZUEsS0FBS0EsR0FBR0EsR0FBR0EsR0FBR0E7Ozs7Ozs7Ozs7NEJDaEJwQkE7O2dCQUNUQSxZQUFPQTtnQkFDUEEsZ0JBQVdBOzs7Ozs7Ozs7Ozs7NEJDSEFBLElBQVdBOztnQkFDdEJBLFNBQUlBO2dCQUNKQSxTQUFJQTs7Ozs7Ozs7Ozs7bUNDSDJCQSxLQUFJQTs7OztnQkFHbkNBOzs7OzJCQUdZQTtnQkFDWkEscUJBQWdCQSxBQUF3QkE7b0JBQU1BOzs7OztnQkFLOUNBLDBCQUFxQkE7Ozs7d0JBQ2pCQTs7Ozs7Ozs7Z0JBR0pBLDZCQUE2QkEsQUFBdUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNUeENBOztrRUFBMEJBO2dCQUV0Q0Esa0JBQWFBLEtBQUlBOzs7O21DQUVMQTtnQkFFcEJBLG1CQUFZQTs7cUNBQ2lCQSxlQUFzQkE7Z0JBQzNDQSx3QkFBbUJBO2dCQUNuQkEsb0JBQWVBO2dCQUNmQTs7OEJBR2VBLGVBQXNCQTtnQkFDckNBLG9CQUFXQSxlQUFpQkE7OztnQkFJNUJBLElBQUlBLENBQUNBO29CQUFVQTs7O2dCQUVmQSxVQUFhQSxnREFBc0JBO2dCQUNuQ0EsWUFBZUEsTUFBTUE7Z0JBQ3JCQSxJQUFJQSxRQUFRQSx1QkFBS0E7b0JBQ2JBO29CQUNBQSxJQUFJQSxxQkFBZ0JBLG9CQUFXQTt3QkFDM0JBOztvQkFFSkEscUJBQWNBLDJCQUFxQkE7b0JBQ25DQSxvQkFBZUEsb0JBQVdBLCtCQUFrQkE7O29CQUU1Q0EscUJBQWdCQTs7Ozs7Ozs7Ozs0QkNsQ1ZBLFdBQW1CQSxPQUFlQTs7O2dCQUM1Q0EsZ0JBQVdBO2dCQUNYQSxZQUFPQTtnQkFDUEEsYUFBUUEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHM7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIGludGVybmFsIEdhbWVPYmplY3QgcGFyZW50IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBpbnRlcm5hbCBDb21wb25lbnQoR2FtZU9iamVjdCBfcGFyZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudCA9IF9wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnRlcm5hbCB2aXJ0dWFsIHZvaWQgVXBkYXRlKCkge31cclxuXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuQ29tcG9uZW50c1xyXG57XHJcbiAgICBpbnRlcm5hbCBjbGFzcyBDb21wb25lbnRSZWFkZXJcclxuICAgIHtcclxuICAgICAgICBpbnRlcm5hbCBEaXNwbGF5TGlzdCBkaXNwbGF5TGlzdCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIGludGVybmFsIENvbXBvbmVudFJlYWRlcihEaXNwbGF5TGlzdCBsaXN0KSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0ID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIHZvaWQgdXBkYXRlKCkge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChHYW1lT2JqZWN0IG9iaiBpbiBkaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChLZXlWYWx1ZVBhaXI8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudCBpbiBvYmouY29tcG9uZW50cylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuVmFsdWUuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGg7XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkRpc3BsYXlcclxue1xyXG4gICAgcHVibGljIGNsYXNzIENhbWVyYVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcm90YXRpb24geyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlY3RvcjIoMCwwKTtcclxuICAgICAgICAgICAgcm90YXRpb24gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYShWZWN0b3IyIF9wb3NpdGlvbixmbG9hdCBfcm90YXRpb24pIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBfcG9zaXRpb247XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gX3JvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEaXNwbGF5TGlzdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBMaXN0PEdhbWVPYmplY3Q+IGxpc3QgeyBnZXQ7IHNldDsgfSAgXHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBsaXN0LkFkZChvYmopO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIExpc3Q8R2FtZU9iamVjdD4gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2xpc3Q9bmV3IExpc3Q8R2FtZU9iamVjdD4oKSA7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRoO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2VuZVxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgQ2FtZXJhIGNhbWVyYSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgX21haW5EaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIERyYXdlciBfZHJhd2VyO1xyXG4gICAgICAgIHByaXZhdGUgSFRNTENhbnZhc0VsZW1lbnQgX2NhbnZhcztcclxuICAgICAgICBwcml2YXRlIHN0cmluZyBfY29sb3I7XHJcblxyXG4gICAgICAgIHB1YmxpYyBTY2VuZShEaXNwbGF5TGlzdCBvYmpMaXN0LHN0cmluZyBjYW52YXNJRCxzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgY2FtZXJhID0gbmV3IENhbWVyYSgpO1xyXG4gICAgICAgICAgICBfbWFpbkRpc3BsYXlMaXN0ID0gb2JqTGlzdDtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IERvY3VtZW50LlF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiY2FudmFzI1wiICsgY2FudmFzSUQpO1xyXG4gICAgICAgICAgICBfZHJhd2VyID0gbmV3IERyYXdlcihfY2FudmFzKTtcclxuICAgICAgICAgICAgX2NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBfZHJhd2VyLkZpbGxTY3JlZW4oX2NvbG9yKTtcclxuICAgICAgICAgICAgZm9yZWFjaCAoR2FtZU9iamVjdCBvYmogaW4gX21haW5EaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBfZHJhd2VyLkRyYXcob2JqLnBvc2l0aW9uLlggLSBjYW1lcmEucG9zaXRpb24uWCwgb2JqLnBvc2l0aW9uLlkgLSBjYW1lcmEucG9zaXRpb24uWSwgb2JqLnNpemUuWCwgb2JqLnNpemUuWSwgb2JqLmltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkV2ZW50c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgS2V5Qm9hcmRFdmVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleVByZXNzRXZlbnQoaW50IGtleWNvZGUpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlQcmVzc0V2ZW50IE9uS2V5UHJlc3NFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleURvd25FdmVudChpbnQga2V5Y29kZSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleURvd25FdmVudCBPbktleURvd25FdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEtleVVwRXZlbnQoaW50IGtleWNvZGUpO1xyXG4gICAgICAgIHB1YmxpYyBldmVudCBLZXlVcEV2ZW50IE9uS2V5VXBFdmVudHM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBLZXlCb2FyZEV2ZW50KCkge1xyXG4gICAgICAgICAgICBEb2N1bWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5LZXlQcmVzcywgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlQcmVzcyk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleURvd24sIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5RG93bik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleVVwLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleVVwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEb0tleVByZXNzKEV2ZW50IGUpIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5UHJlc3NFdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleVByZXNzRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5Q29kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlEb3duKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlEb3duRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5Q29kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRG9LZXlVcChFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKE9uS2V5VXBFdmVudHMgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBPbktleVVwRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5Q29kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBHYW1lRW5naW5lSlMuR3JhcGhpY3M7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5TeXN0ZW07XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkRpc3BsYXk7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKU1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgR2FtZVxyXG4gICAge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBEcmF3ZXIgZHJhd2VyIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU2NoZWR1bGVyIHNjaGVkdWxlciB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBTY2VuZSBzY2VuZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHJpdmF0ZSBEaXNwbGF5TGlzdCBfZGlzcGxheUxpc3Q7XHJcblxyXG4gICAgICAgIHByaXZhdGUgQ29tcG9uZW50UmVhZGVyIF9jb21wb25lbnRSZWFkZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lKHN0cmluZyBjYW52YXNJRCxzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIF9kaXNwbGF5TGlzdCA9IG5ldyBEaXNwbGF5TGlzdCgpO1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZShfZGlzcGxheUxpc3QsY2FudmFzSUQsY29sb3IpO1xyXG4gICAgICAgICAgICBfY29tcG9uZW50UmVhZGVyID0gbmV3IENvbXBvbmVudFJlYWRlcihfZGlzcGxheUxpc3QpO1xyXG5cclxuICAgICAgICAgICAgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcigpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pc2NlbmUuUmVmcmVzaCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilfY29tcG9uZW50UmVhZGVyLnVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGRDaGlsZChHYW1lT2JqZWN0IG9iaikge1xyXG4gICAgICAgICAgICBfZGlzcGxheUxpc3QuQWRkKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGg7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyIHBvc2l0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBzaXplIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVW5pb248SFRNTENhbnZhc0VsZW1lbnQsIEltYWdlPiBpbWFnZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8c3RyaW5nLCBDb21wb25lbnQ+IGNvbXBvbmVudHMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIENvbXBvbmVudD4oKTtcclxuXHJcbiAgICAgICAgLy9QdWJsaWMgTWV0aG9kc1xyXG4gICAgICAgIHB1YmxpYyBDb21wb25lbnQgQWRkQ29tcG9uZW50KHN0cmluZyBpbnN0YW5jZU5hbWUsIENvbXBvbmVudCBjb21wb25lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb21wb25lbnRzW2luc3RhbmNlTmFtZV0gPSBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzW2luc3RhbmNlTmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIERyYXdlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIF9jdHg7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBfY2FudmFzO1xyXG5cclxuICAgICAgICBwdWJsaWMgRHJhd2VyKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcykge1xyXG4gICAgICAgICAgICBfY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgICAgICBfY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmlsbFNjcmVlbihzdHJpbmcgY29sb3IpIHtcclxuICAgICAgICAgICAgX2N0eC5GaWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgX2N0eC5GaWxsUmVjdCgwLDAsX2NhbnZhcy5XaWR0aCxfY2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGR5bmFtaWMgaW1nKVxyXG57XHJcbiAgICBEcmF3KHgsIHksIHcsIGgsIDAsIGltZywgZmFsc2UsIDEpO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGZsb2F0IHIsIGR5bmFtaWMgaW1nLCBib29sIGZvbGxvdywgZmxvYXQgYWxwaGEpIHtcclxuICAgICAgICAgICAgaWYgKGltZy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGltZyA9IGltZy5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9jdHguRHJhd0ltYWdlKGltZywgeCwgeSwgdywgaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBJbWFnZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBIVE1MSW1hZ2VFbGVtZW50IGRhdGEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSW1hZ2Uoc3RyaW5nIHNyYykge1xyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgZGF0YS5TcmMgPSBzcmM7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5NYXRoXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBWZWN0b3IyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBZIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjIoZmxvYXQgX3ggLCBmbG9hdCBfeSkge1xyXG4gICAgICAgICAgICBYID0gX3g7XHJcbiAgICAgICAgICAgIFkgPSBfeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuU3lzdGVtXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBTY2hlZHVsZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIExpc3Q8QWN0aW9uPiBfYWN0aW9uTGlzdCA9IG5ldyBMaXN0PEFjdGlvbj4oKTtcclxuXHJcbiAgICAgICAgaW50ZXJuYWwgU2NoZWR1bGVyKCkge1xyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZChBY3Rpb24gbWV0aG9kcykge1xyXG4gICAgICAgICAgICBfYWN0aW9uTGlzdC5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT4gbWV0aG9kcygpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoQWN0aW9uIGEgaW4gX2FjdGlvbkxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGEoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2luZG93LlJlcXVlc3RBbmltYXRpb25GcmFtZSgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5Db21wb25lbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBbmltYXRvciA6IENvbXBvbmVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxJbWFnZT4+IGFuaW1hdGlvbnMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgY3VycmVudEFuaW1hdGlvbiB7IGdldDsgc2V0OyB9ICBcclxuICAgICAgICBwdWJsaWMgaW50IGN1cnJlbnRGcmFtZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBmcHMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGJvb2wgX3BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBsYXN0VGltZUZyYW1lID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIEFuaW1hdG9yKEdhbWVPYmplY3QgcGFyZW50KSA6IGJhc2UocGFyZW50KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgTGlzdDxJbWFnZT4+KCk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBHb3RvQW5kUGxheShzdHJpbmcgYW5pbWF0aW9uTmFtZSlcclxue1xyXG4gICAgR290b0FuZFBsYXkoYW5pbWF0aW9uTmFtZSwgMCk7XHJcbn0gICAgICAgIHB1YmxpYyB2b2lkIEdvdG9BbmRQbGF5KHN0cmluZyBhbmltYXRpb25OYW1lLCBpbnQgZnJhbWUpIHtcclxuICAgICAgICAgICAgY3VycmVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbk5hbWU7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZSA9IGZyYW1lO1xyXG4gICAgICAgICAgICBfcGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBDcmVhdGUoc3RyaW5nIGFuaW1hdGlvbk5hbWUsIExpc3Q8SW1hZ2U+IGxpc3Qpe1xyXG4gICAgICAgICAgICBhbmltYXRpb25zW2FuaW1hdGlvbk5hbWVdID0gbGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGludGVybmFsIG92ZXJyaWRlIHZvaWQgVXBkYXRlKCkge1xyXG4gICAgICAgICAgICBpZiAoIV9wbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBkb3VibGUgbm93ID0gRGF0ZVRpbWUuTm93LlN1YnRyYWN0KERhdGVUaW1lLk1pblZhbHVlLkFkZFllYXJzKDIwMTcpKS5Ub3RhbE1pbGxpc2Vjb25kcztcclxuICAgICAgICAgICAgZG91YmxlIGRlbHRhID0gbm93IC0gbGFzdFRpbWVGcmFtZTtcclxuICAgICAgICAgICAgaWYgKGRlbHRhID4gMTAwMC9mcHMpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBhbmltYXRpb25zW2N1cnJlbnRBbmltYXRpb25dLkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEZyYW1lID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGUoY3VycmVudEZyYW1lICsgXCIgXCIgKyBjdXJyZW50QW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5pbWFnZSA9IGFuaW1hdGlvbnNbY3VycmVudEFuaW1hdGlvbl1bY3VycmVudEZyYW1lXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUZyYW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXG5cclxuICAgIFxucHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRBbmltYXRpb249XCJcIiA7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2N1cnJlbnRGcmFtZT0wO3ByaXZhdGUgaW50IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19mcHM9MTt9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGg7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkNvbXBvbmVudHM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0c1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU3ByaXRlIDogR2FtZU9iamVjdFxyXG4gICAge1xyXG4gICAgICAgIC8vQ29uc3RydWN0b3JcclxuICAgICAgICBwdWJsaWMgU3ByaXRlKFZlY3RvcjIgX3Bvc2l0aW9uLCBWZWN0b3IyIF9zaXplLCBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2U+IF9pbWFnZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IF9zaXplO1xyXG4gICAgICAgICAgICBpbWFnZSA9IF9pbWFnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
