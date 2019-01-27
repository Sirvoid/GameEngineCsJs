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
        public Mouse mouse { get; set; }

        private DisplayList _mainDisplayList;
        private Drawer _drawer;
        private HTMLCanvasElement _canvas;
        private string _color;
        

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

                float xPos = obj.screenFixed ? obj.position.X : obj.position.X - camera.position.X;
                float yPos = obj.screenFixed ? obj.position.Y : obj.position.Y - camera.position.Y;
                _drawer.Draw(xPos, yPos, obj.size.X, obj.size.Y, obj.angle, obj.image,false,1);
                DrawChild(obj,obj.position.X,obj.position.Y,obj.angle);
            }
        }

        private void DrawChild(GameObject obj,float x,float y,float angle) {

            float angleRad = 0;
            float xarCos = 0;
            float yarSin = 0;

            if (obj.displayList.list.Count != 0) { 
                angleRad = (float)(obj.angle * Math.PI / 180);
                xarCos = x + (float)(Math.Cos(angleRad));
                yarSin = y + (float)(Math.Sin(angleRad));
            }

            foreach (GameObject obj2 in obj.displayList.list) {

                float newX = obj2.screenFixed ? xarCos + obj2.position.X : xarCos + obj2.position.X - camera.position.X;
                float newY = obj2.screenFixed ? yarSin + obj2.position.Y : yarSin + obj2.position.Y - camera.position.Y;
                float newAngle = obj2.angle + angle;

                _drawer.Draw(newX, newY, obj2.size.X, obj2.size.Y, newAngle, obj2.image, false, 1);
                DrawChild(obj2,newX,newY,newAngle);

            }
        }


    }
}
