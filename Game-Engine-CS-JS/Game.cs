using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Graphics;

namespace GameEngineJS
{
    public class Game
    {
        public HTMLCanvasElement canvas { get; set;}
        public Drawer drawer { get; set; }

        public Game(int canvasID,string color) {
            canvas = Document.QuerySelector<HTMLCanvasElement>("canvas#" + canvasID);
            drawer = new Drawer(canvas);
        }
    }
}
