using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using GameEngineJS.GameObjects;
using GameEngineJS.Graphics;
using GameEngineJS.Maths;
using GameEngineJS.System;

namespace GameEngineJS.Display
{
    public class Scene
    {

        public Camera camera { get; set; }

        private DisplayList _mainDisplayList;
        private Drawer _drawer;
        private HTMLCanvasElement _canvas;
        private string _color;
        public Mouse mouse { get; set; }

        public Scene(DisplayList objList,string canvasID,string color) {
            camera = new Camera();
            _mainDisplayList = objList;
            _canvas = Document.QuerySelector<HTMLCanvasElement>("canvas#" + canvasID);
            _drawer = new Drawer(_canvas);
            _color = color;
            mouse = new Mouse(_canvas);
        }

        public void Refresh() {
            _drawer.FillScreen(_color);
            foreach (GameObject obj in _mainDisplayList.list) {
                _drawer.Draw(obj.position.X - camera.position.X, obj.position.Y - camera.position.Y, obj.size.X, obj.size.Y, obj.angle, obj.image,false,1);
                DrawChild(obj,obj.position.X,obj.position.Y,obj.angle);
            }
        }

        private void DrawChild(GameObject obj,float x,float y,float angle) {
            foreach (GameObject obj2 in obj.displayList.list)
            {
                float newX = x + (float)(Math.Cos(obj.angle*Math.PI/180)) * obj2.position.X - camera.position.X;
                float newY = y + (float)(Math.Sin(obj.angle*Math.PI/180)) * obj2.position.Y - camera.position.Y;
                float newAngle = obj2.angle + angle;

                _drawer.Draw(newX, newY, obj2.size.X, obj2.size.Y, newAngle, obj2.image, false, 1);
                DrawChild(obj2,newX,newY,newAngle);

            }
        }


    }
}
