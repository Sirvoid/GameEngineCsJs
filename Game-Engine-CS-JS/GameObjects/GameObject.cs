using System;
using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using GameEngineJS.Math;
using GameEngineJS.Graphics;
using GameEngineJS.Components;
using System.Collections.Generic;

namespace GameEngineJS.GameObjects
{
    public abstract class GameObject
    {
        public Vector2 position { get; set; }
        public Vector2 size { get; set; }
        public Union<HTMLCanvasElement, Image> image { get; set; }
        public Dictionary<string, Component> components = new Dictionary<string, Component>();

        //Public Methods
        public void AddComponent(string instanceName, Component component)
        {
            components[instanceName] = component;
        }
    }
}
