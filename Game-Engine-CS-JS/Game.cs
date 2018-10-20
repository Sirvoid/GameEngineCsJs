using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Graphics;
using GameEngineJS.System;
using GameEngineJS.GameObjects;
using GameEngineJS.Display;
using GameEngineJS.Components;

namespace GameEngineJS
{
    public class Game
    {
        
        public Drawer drawer { get; set; }
        public Scheduler scheduler { get; set; }
        public Scene scene { get; set; }
        public Mouse mouse { get { return scene.mouse; } }

        private DisplayList _displayList;
        private ComponentReader _componentReader;

        public Game(string canvasID) : this(canvasID, "#fff") { }
        public Game(string canvasID,string color) {
            _displayList = new DisplayList();
            scene = new Scene(_displayList,canvasID,color);
            _componentReader = new ComponentReader(_displayList);
            

            scheduler = new Scheduler();
            scheduler.Add(scene.Refresh);
            scheduler.Add(_componentReader.update);
        }

        public void AddChild(GameObject obj) {
            _displayList.Add(obj);
        }
    }
}
