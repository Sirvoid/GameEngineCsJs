using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;

namespace GameEngineJS.Events
{
    public class KeyBoardEvent
    {
        public delegate void KeyPressEvent(string key);
        public event KeyPressEvent OnKeyPressEvents;

        public delegate void KeyDownEvent(string key);
        public event KeyDownEvent OnKeyDownEvents;

        public delegate void KeyUpEvent(string key);
        public event KeyUpEvent OnKeyUpEvents;

        public KeyBoardEvent() {
            Document.AddEventListener(EventType.KeyPress, DoKeyPress);
            Document.AddEventListener(EventType.KeyDown, DoKeyDown);
            Document.AddEventListener(EventType.KeyUp, DoKeyUp);
        }

        private void DoKeyPress(Event e) {
            if (OnKeyPressEvents == null) return;
            OnKeyPressEvents.Invoke(e.As<KeyboardEvent>().Key);
        }

        private void DoKeyDown(Event e)
        {
            if (OnKeyDownEvents == null) return;
            OnKeyDownEvents.Invoke(e.As<KeyboardEvent>().Key);
        }

        private void DoKeyUp(Event e)
        {
            if (OnKeyUpEvents == null) return;
            OnKeyUpEvents.Invoke(e.As<KeyboardEvent>().Key);
        }

    }
}
