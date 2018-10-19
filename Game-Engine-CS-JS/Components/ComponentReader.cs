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

        internal void update() {
            foreach (GameObject obj in displayList.list) {
                foreach (KeyValuePair<string, Component> component in obj.components)
                {
                    component.Value.Update();
                }
            }
        }
    }
}
