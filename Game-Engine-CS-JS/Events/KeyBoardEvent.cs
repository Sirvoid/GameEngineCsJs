using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;

namespace GameEngineJS.Events
{
    public class KeyBoardEvent
    {
        public delegate void KeyPressEvent(int keycode);
        public event KeyPressEvent OnKeyPressEvents;

        public delegate void KeyDownEvent(int keycode);
        public event KeyDownEvent OnKeyDownEvents;

        public delegate void KeyUpEvent(int keycode);
        public event KeyUpEvent OnKeyUpEvents;

        public KeyBoardEvent() {
            Document.AddEventListener(EventType.KeyPress, DoKeyPress);
            Document.AddEventListener(EventType.KeyDown, DoKeyDown);
            Document.AddEventListener(EventType.KeyUp, DoKeyUp);
        }

        private void DoKeyPress(Event e) {
            if (OnKeyPressEvents == null) return;
            OnKeyPressEvents.Invoke(e.As<KeyboardEvent>().KeyCode);
        }

        private void DoKeyDown(Event e)
        {
            if (OnKeyDownEvents == null) return;
            OnKeyDownEvents.Invoke(e.As<KeyboardEvent>().KeyCode);
        }

        private void DoKeyUp(Event e)
        {
            if (OnKeyUpEvents == null) return;
            OnKeyUpEvents.Invoke(e.As<KeyboardEvent>().KeyCode);
        }

    }
}
