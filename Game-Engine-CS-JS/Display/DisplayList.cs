using System;
using System.Collections.Generic;
using Bridge;
using Newtonsoft.Json;
using GameEngineJS.GameObjects;
using GameEngineJS.GameObjects.TileMap;

namespace GameEngineJS.Display
{
    public class DisplayList
    {
        public List<GameObject> list { get; set; } = new List<GameObject>() ;

        public void Add(TileMap obj, GameObject parent) {
            foreach (Layer l in obj.layers.Values) {
                AddAt(l,parent,l.index);
            }
        }

        public void Add(GameObject obj,GameObject parent) {
            list.Add(obj);
            obj._parent = parent;
        }

        public void AddAt(GameObject obj,GameObject parent, uint index) {
            list.Insert((int)index, obj);
        }

    }
}
