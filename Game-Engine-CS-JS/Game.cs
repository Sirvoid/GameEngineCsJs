using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Graphics;
using GameEngineJS.System;
using GameEngineJS.GameObjects;

namespace GameEngineJS
{
    public class Game
    {
        public HTMLCanvasElement canvas { get; set;}
        public Drawer drawer { get; set; }
        public Scheduler scheduler { get; set; }

        private Scene scene;
        private DisplayList displayList;
        
        public Game(int canvasID,string color) {
            canvas = Document.QuerySelector<HTMLCanvasElement>("canvas#" + canvasID);
            drawer = new Drawer(canvas);
            displayList = new DisplayList();
            scene = new Scene(displayList,drawer);
            scheduler = new Scheduler();
            scheduler.Schedule(scene.Refresh);
        }

        public void AddChild(GameObject obj) {
            displayList.Add(obj);
        }
    }
}
