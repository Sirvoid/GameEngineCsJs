using System;
using Bridge;
using Bridge.Html5;
using GameEngineJS.Maths;
using GameEngineJS.Graphics;
using GameEngineJS.Components;
using GameEngineJS.Display;
using GameEngineJS.GameObjects;
using GameEngineJS.GameObjects.TileMap;
using System.Collections.Generic;

namespace GameEngineJS.GameObjects
{
    public abstract class GameObject {
        private static int IDIncrementer = 0;

        /// <summary>
        /// Position of the GameObject.
        /// </summary>
        public Vector2 position { get; set; }

        /// <summary>
        /// Fixed on the screen if true.
        /// </summary>
        public bool screenFixed { get; set; } = false;

        /// <summary>
        /// Size of the GameObject.
        /// </summary>
        public Vector2 size { get; set; }
        
        /// <summary>
        /// Object Angle in degrees.
        /// </summary>
        public float angle { get; set; }

        /// <summary>
        /// Pivot for angle.
        /// </summary>
        public Vector2 pivot { get; set; }

        /// <summary>
        /// Unique ID of the GameObject.
        /// </summary>
        public int ID { get; private set; } = IDIncrementer++;

        /// <summary>
        /// Image of the GameObject.
        /// </summary>
        public Union<HTMLCanvasElement, Image, SpriteSheet> image { get; set; }
        
        /// <summary>
        /// List of the object components.
        /// </summary>
        public Dictionary<string, Component> components = new Dictionary<string, Component>();
        
        /// <summary>
        /// Game Object type.
        /// </summary>
        public string type { get; internal set; } = "Unknown";

        internal DisplayList displayList = new DisplayList();
        internal GameObject _parent;



        //Public Methods

        /// <summary>
        /// Add/Link a component to this GameObject.
        /// </summary>
        public Component AddComponent(string instanceName, Component component)
        {
            components[instanceName] = component;
            return components[instanceName];
        }

        public void AddChild(TileMap.TileMap tileMap) {
            displayList.Add(tileMap, this);
        }

        public void AddChild(GameObject obj) {
            displayList.Add(obj,this);
        }

        public void AddChildAt(GameObject obj, int index)
        {
            displayList.AddAt(obj, this, index);
        }

        public void RemoveChild(GameObject obj)
        {
            displayList.Remove(obj);
        }

        public void MoveChild(GameObject obj, int index)
        {
            displayList.Move(obj, index);
        }

    }
}
