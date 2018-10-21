using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Maths;
using GameEngineJS.Graphics;
using GameEngineJS.Components;
using GameEngineJS.Display;
using System.Collections.Generic;

namespace GameEngineJS.GameObjects
{
    public abstract class GameObject
    {
        public Vector2 position { get; set; }
        public Vector2 size { get; set; }
        public float angle { get; set; }
        public Union<HTMLCanvasElement, Image, SpriteSheet> image { get; set; }
        public Dictionary<string, Component> components = new Dictionary<string, Component>();
        internal DisplayList displayList = new DisplayList();
        internal GameObject _parent;

        //Public Methods
        public Component AddComponent(string instanceName, Component component)
        {
            components[instanceName] = component;
            return components[instanceName];
        }

        public void AddChild(GameObject obj) {
            displayList.Add(obj,this);
        }

    }
}
