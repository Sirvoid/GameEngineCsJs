using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace GameEngineJS.System
{
    public class Scheduler
    {
        private List<Action> _actionList = new List<Action>();

        internal Scheduler() {
            Update();
        }

        public void Add(Action methods) {
            _actionList.Add(() => methods());
        }

        public void Update()
        {
            foreach (Action a in _actionList) {
                a();
            }
            Window.SetTimeout(() => Window.RequestAnimationFrame(Update), 1000/60);
            
        }
    }
}
