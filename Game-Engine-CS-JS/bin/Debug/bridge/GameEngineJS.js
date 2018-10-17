/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("GameEngineJS", function ($asm, globals) {
    "use strict";

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
            mainDisplayList: null,
            drawer: null,
            canvas: null,
            color: null
        },
        ctors: {
            ctor: function (objList, canvasID, _color) {
                this.$initialize();
                this.camera = new GameEngineJS.Display.Camera.ctor();
                this.mainDisplayList = objList;
                this.canvas = document.querySelector("canvas#" + (canvasID || ""));
                this.drawer = new GameEngineJS.Graphics.Drawer(this.canvas);
                this.color = _color;
            }
        },
        methods: {
            Refresh: function () {
                var $t;
                this.drawer.FillScreen(this.color);
                $t = Bridge.getEnumerator(this.mainDisplayList.list);
                try {
                    while ($t.moveNext()) {
                        var obj = $t.Current;
                        this.drawer.Draw(obj.position.X - this.camera.position.X, obj.position.Y - this.camera.position.Y, obj.size.X, obj.size.Y, obj.image);
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
            displayList: null
        },
        ctors: {
            ctor: function (canvasID, color) {
                this.$initialize();

                this.displayList = new GameEngineJS.Display.DisplayList();
                this.scene = new GameEngineJS.Display.Scene(this.displayList, canvasID, color);
                this.scheduler = new GameEngineJS.System.Scheduler();
                this.scheduler.Add(Bridge.fn.cacheBind(this.scene, this.scene.Refresh));
            }
        },
        methods: {
            AddChild: function (obj) {
                this.displayList.Add(obj);
            }
        }
    });

    Bridge.define("GameEngineJS.GameObjects.GameObject", {
        fields: {
            position: null,
            size: null,
            image: null
        }
    });

    Bridge.define("GameEngineJS.Graphics.Drawer", {
        fields: {
            ctx: null,
            canvas: null
        },
        ctors: {
            ctor: function (_canvas) {
                this.$initialize();
                this.ctx = _canvas.getContext("2d");
                this.canvas = _canvas;
            }
        },
        methods: {
            FillScreen: function (color) {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            },
            Draw: function (x, y, w, h, img) {
                this.Draw$1(x, y, w, h, 0, img, false, 1);
            },
            Draw$1: function (x, y, w, h, r, img, follow, alpha) {
                if (img.data != null) {
                    img = img.data;
                }
                this.ctx.drawImage(img, x, y, w, h);
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
            actionList: null
        },
        ctors: {
            init: function () {
                this.actionList = new (System.Collections.Generic.List$1(Function)).ctor();
            },
            ctor: function () {
                this.$initialize();
                this.Update();
            }
        },
        methods: {
            Add: function (methods) {
                this.actionList.add(function () {
                    methods();
                });
            },
            Update: function () {
                var $t;
                $t = Bridge.getEnumerator(this.actionList);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJHYW1lRW5naW5lSlMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkRpc3BsYXkvQ2FtZXJhLmNzIiwiRGlzcGxheS9EaXNwbGF5TGlzdC5jcyIsIkRpc3BsYXkvU2NlbmUuY3MiLCJFdmVudHMvS2V5Qm9hcmRFdmVudC5jcyIsIkdhbWUuY3MiLCJHcmFwaGljcy9EcmF3ZXIuY3MiLCJHcmFwaGljcy9JbWFnZS5jcyIsIk1hdGgvVmVjdG9yMi5jcyIsIlN5c3RlbS9TY2hlZHVsZXIuY3MiLCJHYW1lT2JqZWN0cy9TcHJpdGUuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBY1lBLGdCQUFXQSxJQUFJQTtnQkFDZkE7OzhCQUdVQSxXQUFrQkE7O2dCQUM1QkEsZ0JBQVdBO2dCQUNYQSxnQkFBV0E7Ozs7Ozs7Ozs7OzRCQ0hnQ0EsS0FBSUE7Ozs7MkJBTG5DQTtnQkFDWkEsY0FBU0E7Ozs7Ozs7Ozs7Ozs7OzRCQ09BQSxTQUFvQkEsVUFBZ0JBOztnQkFDN0NBLGNBQVNBLElBQUlBO2dCQUNiQSx1QkFBa0JBO2dCQUNsQkEsY0FBU0EsdUJBQTBDQSxhQUFZQTtnQkFDL0RBLGNBQVNBLElBQUlBLDZCQUFPQTtnQkFDcEJBLGFBQVFBOzs7Ozs7Z0JBSVJBLHVCQUFrQkE7Z0JBQ2xCQSwwQkFBMkJBOzs7O3dCQUN2QkEsaUJBQVlBLGlCQUFpQkEsd0JBQW1CQSxpQkFBaUJBLHdCQUFtQkEsWUFBWUEsWUFBWUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ1poSEEsMEJBQTBCQSxZQUFvQkEsQUFBbURBO2dCQUNqR0EsMEJBQTBCQSxXQUFtQkEsQUFBbURBO2dCQUNoR0EsMEJBQTBCQSxTQUFpQkEsQUFBbURBOzs7O2tDQUczRUE7Z0JBQ25CQSxJQUFJQSwyQ0FBb0JBO29CQUFNQTs7Z0JBQzlCQSxzQkFBd0JBOztpQ0FHTkE7Z0JBRWxCQSxJQUFJQSwwQ0FBbUJBO29CQUFNQTs7Z0JBQzdCQSxxQkFBdUJBOzsrQkFHUEE7Z0JBRWhCQSxJQUFJQSx3Q0FBaUJBO29CQUFNQTs7Z0JBQzNCQSxtQkFBcUJBOzs7Ozs7Ozs7Ozs7OzRCQ25CYkEsVUFBZ0JBOzs7Z0JBRXhCQSxtQkFBY0EsSUFBSUE7Z0JBQ2xCQSxhQUFRQSxJQUFJQSwyQkFBTUEsa0JBQVlBLFVBQVNBO2dCQUN2Q0EsaUJBQVlBLElBQUlBO2dCQUNoQkEsbUJBQWNBLEFBQXVCQTs7OztnQ0FHcEJBO2dCQUNqQkEscUJBQWdCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNoQk5BOztnQkFDVkEsV0FBTUEsQUFBMEJBO2dCQUNoQ0EsY0FBU0E7Ozs7a0NBR1VBO2dCQUNuQkEscUJBQWdCQTtnQkFDaEJBLHdCQUFpQkEsbUJBQWFBOzs0QkFFekJBLEdBQVNBLEdBQVNBLEdBQVNBLEdBQVNBO2dCQUVqREEsWUFBS0EsR0FBR0EsR0FBR0EsR0FBR0EsTUFBTUE7OzhCQUNFQSxHQUFTQSxHQUFTQSxHQUFTQSxHQUFTQSxHQUFTQSxLQUFhQSxRQUFhQTtnQkFDckZBLElBQUlBLFlBQVlBO29CQUNaQSxNQUFNQTs7Z0JBRVZBLG1CQUFjQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFHQTs7Ozs7Ozs7Ozs0QkNoQm5CQTs7Z0JBQ1RBLFlBQU9BO2dCQUNQQSxnQkFBV0E7Ozs7Ozs7Ozs7Ozs0QkNIQUEsSUFBV0E7O2dCQUN0QkEsU0FBSUE7Z0JBQ0pBLFNBQUlBOzs7Ozs7Ozs7OztrQ0NIMEJBLEtBQUlBOzs7O2dCQUdsQ0E7Ozs7MkJBR1lBO2dCQUNaQSxvQkFBZUEsQUFBd0JBO29CQUFNQTs7Ozs7Z0JBSzdDQSwwQkFBcUJBOzs7O3dCQUNqQkE7Ozs7Ozs7O2dCQUdKQSw2QkFBNkJBLEFBQXVCQTs7Ozs7Ozs7NEJDZjFDQSxXQUFtQkEsT0FBZUE7OztnQkFDNUNBLGdCQUFXQTtnQkFDWEEsWUFBT0E7Z0JBQ1BBLGFBQVFBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5NYXRoO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5EaXNwbGF5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBDYW1lcmFcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMiBwb3NpdGlvbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHJvdGF0aW9uIHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBWZWN0b3IyKDAsMCk7XHJcbiAgICAgICAgICAgIHJvdGF0aW9uID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBDYW1lcmEoVmVjdG9yMiBfcG9zaXRpb24sZmxvYXQgX3JvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICByb3RhdGlvbiA9IF9yb3RhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgRGlzcGxheUxpc3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgTGlzdDxHYW1lT2JqZWN0PiBsaXN0IHsgZ2V0OyBzZXQ7IH0gIFxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBBZGQoR2FtZU9iamVjdCBvYmopIHtcclxuICAgICAgICAgICAgbGlzdC5BZGQob2JqKTtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBMaXN0PEdhbWVPYmplY3Q+IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19saXN0PW5ldyBMaXN0PEdhbWVPYmplY3Q+KCkgO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HYW1lT2JqZWN0cztcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdyYXBoaWNzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuTWF0aDtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRGlzcGxheVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgU2NlbmVcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIENhbWVyYSBjYW1lcmEgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwcml2YXRlIERpc3BsYXlMaXN0IG1haW5EaXNwbGF5TGlzdDtcclxuICAgICAgICBwcml2YXRlIERyYXdlciBkcmF3ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcgY29sb3I7XHJcblxyXG4gICAgICAgIHB1YmxpYyBTY2VuZShEaXNwbGF5TGlzdCBvYmpMaXN0LHN0cmluZyBjYW52YXNJRCxzdHJpbmcgX2NvbG9yKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcclxuICAgICAgICAgICAgbWFpbkRpc3BsYXlMaXN0ID0gb2JqTGlzdDtcclxuICAgICAgICAgICAgY2FudmFzID0gRG9jdW1lbnQuUXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXCJjYW52YXMjXCIgKyBjYW52YXNJRCk7XHJcbiAgICAgICAgICAgIGRyYXdlciA9IG5ldyBEcmF3ZXIoY2FudmFzKTtcclxuICAgICAgICAgICAgY29sb3IgPSBfY29sb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBSZWZyZXNoKCkge1xyXG4gICAgICAgICAgICBkcmF3ZXIuRmlsbFNjcmVlbihjb2xvcik7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEdhbWVPYmplY3Qgb2JqIGluIG1haW5EaXNwbGF5TGlzdC5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBkcmF3ZXIuRHJhdyhvYmoucG9zaXRpb24uWCAtIGNhbWVyYS5wb3NpdGlvbi5YLCBvYmoucG9zaXRpb24uWSAtIGNhbWVyYS5wb3NpdGlvbi5ZLCBvYmouc2l6ZS5YLCBvYmouc2l6ZS5ZLCBvYmouaW1hZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuRXZlbnRzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBLZXlCb2FyZEV2ZW50XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5UHJlc3NFdmVudChpbnQga2V5Y29kZSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVByZXNzRXZlbnQgT25LZXlQcmVzc0V2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5RG93bkV2ZW50KGludCBrZXljb2RlKTtcclxuICAgICAgICBwdWJsaWMgZXZlbnQgS2V5RG93bkV2ZW50IE9uS2V5RG93bkV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIGRlbGVnYXRlIHZvaWQgS2V5VXBFdmVudChpbnQga2V5Y29kZSk7XHJcbiAgICAgICAgcHVibGljIGV2ZW50IEtleVVwRXZlbnQgT25LZXlVcEV2ZW50cztcclxuXHJcbiAgICAgICAgcHVibGljIEtleUJvYXJkRXZlbnQoKSB7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLktleVByZXNzLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6QnJpZGdlLkh0bWw1LkV2ZW50PilEb0tleVByZXNzKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5RG93biwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxnbG9iYWw6OkJyaWRnZS5IdG1sNS5FdmVudD4pRG9LZXlEb3duKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuS2V5VXAsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248Z2xvYmFsOjpCcmlkZ2UuSHRtbDUuRXZlbnQ+KURvS2V5VXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRG9LZXlQcmVzcyhFdmVudCBlKSB7XHJcbiAgICAgICAgICAgIGlmIChPbktleVByZXNzRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlQcmVzc0V2ZW50cy5JbnZva2UoZS5BczxLZXlib2FyZEV2ZW50PigpLktleUNvZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRG9LZXlEb3duKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlEb3duRXZlbnRzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgT25LZXlEb3duRXZlbnRzLkludm9rZShlLkFzPEtleWJvYXJkRXZlbnQ+KCkuS2V5Q29kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBEb0tleVVwKEV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoT25LZXlVcEV2ZW50cyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIE9uS2V5VXBFdmVudHMuSW52b2tlKGUuQXM8S2V5Ym9hcmRFdmVudD4oKS5LZXlDb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxudXNpbmcgR2FtZUVuZ2luZUpTLlN5c3RlbTtcclxudXNpbmcgR2FtZUVuZ2luZUpTLkdhbWVPYmplY3RzO1xyXG51c2luZyBHYW1lRW5naW5lSlMuRGlzcGxheTtcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEdhbWVcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgRHJhd2VyIGRyYXdlciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFNjaGVkdWxlciBzY2hlZHVsZXIgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgU2NlbmUgc2NlbmUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHByaXZhdGUgRGlzcGxheUxpc3QgZGlzcGxheUxpc3Q7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHVibGljIEdhbWUoc3RyaW5nIGNhbnZhc0lELHN0cmluZyBjb2xvcikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZGlzcGxheUxpc3QgPSBuZXcgRGlzcGxheUxpc3QoKTtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmUoZGlzcGxheUxpc3QsY2FudmFzSUQsY29sb3IpO1xyXG4gICAgICAgICAgICBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKCk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlci5BZGQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbilzY2VuZS5SZWZyZXNoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEFkZENoaWxkKEdhbWVPYmplY3Qgb2JqKSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlMaXN0LkFkZChvYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLkdyYXBoaWNzXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBEcmF3ZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHJpdmF0ZSBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXMgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgRHJhd2VyKEhUTUxDYW52YXNFbGVtZW50IF9jYW52YXMpIHtcclxuICAgICAgICAgICAgY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRClfY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICAgICAgY2FudmFzID0gX2NhbnZhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEZpbGxTY3JlZW4oc3RyaW5nIGNvbG9yKSB7XHJcbiAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAsMCxjYW52YXMuV2lkdGgsY2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGR5bmFtaWMgaW1nKVxyXG57XHJcbiAgICBEcmF3KHgsIHksIHcsIGgsIDAsIGltZywgZmFsc2UsIDEpO1xyXG59ICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KGZsb2F0IHgsIGZsb2F0IHksIGZsb2F0IHcsIGZsb2F0IGgsIGZsb2F0IHIsIGR5bmFtaWMgaW1nLCBib29sIGZvbGxvdywgZmxvYXQgYWxwaGEpIHtcclxuICAgICAgICAgICAgaWYgKGltZy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGltZyA9IGltZy5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5EcmF3SW1hZ2UoaW1nLCB4LCB5LCB3LCBoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG5cclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR3JhcGhpY3Ncclxue1xyXG4gICAgcHVibGljIGNsYXNzIEltYWdlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgZGF0YSB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBJbWFnZShzdHJpbmcgc3JjKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBkYXRhLlNyYyA9IHNyYztcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcblxyXG5uYW1lc3BhY2UgR2FtZUVuZ2luZUpTLk1hdGhcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFZlY3RvcjJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgWCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGZsb2F0IFkgeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMihmbG9hdCBfeCAsIGZsb2F0IF95KSB7XHJcbiAgICAgICAgICAgIFggPSBfeDtcclxuICAgICAgICAgICAgWSA9IF95O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEdhbWVFbmdpbmVKUy5TeXN0ZW1cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNjaGVkdWxlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgTGlzdDxBY3Rpb24+IGFjdGlvbkxpc3QgPSBuZXcgTGlzdDxBY3Rpb24+KCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBTY2hlZHVsZXIoKSB7XHJcbiAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgQWRkKEFjdGlvbiBtZXRob2RzKSB7XHJcbiAgICAgICAgICAgIGFjdGlvbkxpc3QuQWRkKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+IG1ldGhvZHMoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEFjdGlvbiBhIGluIGFjdGlvbkxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGEoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2luZG93LlJlcXVlc3RBbmltYXRpb25GcmFtZSgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKVVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgR2FtZUVuZ2luZUpTLk1hdGg7XHJcbnVzaW5nIEdhbWVFbmdpbmVKUy5HcmFwaGljcztcclxuXHJcbm5hbWVzcGFjZSBHYW1lRW5naW5lSlMuR2FtZU9iamVjdHNcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFNwcml0ZSA6IEdhbWVPYmplY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgU3ByaXRlKFZlY3RvcjIgX3Bvc2l0aW9uLCBWZWN0b3IyIF9zaXplLCBVbmlvbjxIVE1MQ2FudmFzRWxlbWVudCwgSW1hZ2U+IF9pbWFnZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IF9wb3NpdGlvbjtcclxuICAgICAgICAgICAgc2l6ZSA9IF9zaXplO1xyXG4gICAgICAgICAgICBpbWFnZSA9IF9pbWFnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
