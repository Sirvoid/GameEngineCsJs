using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace GameEngineJS.System
{
    public class Scheduler
    {
        private List<Action> actionList = new List<Action>();

        public Scheduler() {
            Update();
        }

        public void Add(Action methods) {
            actionList.Add(() => methods());
        }

        public void Update()
        {
            foreach (Action a in actionList) {
                a();
            }

            Window.RequestAnimationFrame(Update);
        }
    }
}
