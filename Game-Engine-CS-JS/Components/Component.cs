using System;
using GameEngineJS.GameObjects;

namespace GameEngineJS.Components
{
    public class Component
    {
        internal GameObject parent { get; set; }
        internal Component(GameObject _parent) {
            parent = _parent;
        }

        internal virtual void Update() {}

    }
}
