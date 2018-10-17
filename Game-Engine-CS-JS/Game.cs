using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Graphics;
using GameEngineJS.System;
using GameEngineJS.GameObjects;
using GameEngineJS.Display;

namespace GameEngineJS
{
    public class Game
    {
        
        public Drawer drawer { get; set; }
        public Scheduler scheduler { get; set; }

        public Scene scene { get; set; }
        private DisplayList displayList;
        
        public Game(string canvasID,string color) {
            
            displayList = new DisplayList();
            scene = new Scene(displayList,canvasID,color);
            scheduler = new Scheduler();
            scheduler.Add(scene.Refresh);
        }

        public void AddChild(GameObject obj) {
            displayList.Add(obj);
        }
    }
}
