using System;
using System.Collections.Generic;
using GameEngineJS.Display;
using GameEngineJS.GameObjects;

namespace GameEngineJS.Components
{
    internal class ComponentReader
    {
        internal DisplayList displayList { get; set; }

        internal ComponentReader(DisplayList list) {
            displayList = list;
        }

        internal void Update() {
            foreach (GameObject obj in displayList.list) {
                foreach (KeyValuePair<string, Component> component in obj.components)
                {
                    component.Value.Update();
                }
                RecursiveUpdate(obj);
            }
        }

        private void RecursiveUpdate(GameObject obj) {
            if (displayList.list.Count <= 0) return;
            foreach (GameObject obj2 in obj.displayList.list)
            {
                foreach (KeyValuePair<string, Component> component in obj2.components)
                {
                    component.Value.Update();
                }
                RecursiveUpdate(obj2);
            }
        }

    }
}
