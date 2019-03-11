using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;

namespace GameEngineJS.Events
{
    public class MouseButtonEvent
    {

        public delegate void MouseDownEvent(int button);
        public event MouseDownEvent OnMouseDownEvents;

        public delegate void MouseUpEvent(int button);
        public event MouseUpEvent OnMouseUpEvents;

        public MouseButtonEvent() {
            Document.AddEventListener(EventType.MouseDown, DoMouseDown);
            Document.AddEventListener(EventType.MouseUp, DoMouseUp);
        }

        private void DoMouseDown(Event e)
        {
            if (OnMouseDownEvents == null) return;
            OnMouseDownEvents.Invoke(e.As<MouseEvent>().Button);
        }

        private void DoMouseUp(Event e)
        {
            if (OnMouseUpEvents == null) return;
            OnMouseUpEvents.Invoke(e.As<MouseEvent>().Button);
        }

    }
}
