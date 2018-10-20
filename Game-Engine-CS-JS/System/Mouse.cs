using System;
using Bridge.Html5;

namespace GameEngineJS.System
{
    public class Mouse
    {
        public float x { get; set; } = 0;
        public float y { get; set; } = 0;
        private HTMLCanvasElement _canvas;

        internal Mouse(HTMLCanvasElement canvas) {
            _canvas = canvas;
            Document.AddEventListener("mousemove",Update);
        }

        private void Update(Event e)
        {
            ClientRect rect = _canvas.GetBoundingClientRect();
            x = e.As<MouseEvent>().ClientX - (float)rect.Left;
            y = e.As<MouseEvent>().ClientY - (float)rect.Top;
        }
    }
}
