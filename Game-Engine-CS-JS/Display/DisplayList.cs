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
                AddAt(l,parent,(int)l.index);
            }
        }
        public void Add(GameObject obj,GameObject parent) {
            list.Add(obj);
            obj._parent = parent;
        }

        public void AddAt(GameObject obj,GameObject parent, int index) {
            list.Insert(index, obj);
            obj._parent = parent;
        }

        public void Remove(TileMap obj) {
            foreach (Layer l in obj.layers.Values) {
                list.Remove(l);
            }
        }

        public void Remove(GameObject obj)
        {
            list.Remove(obj);
        }

        public void Move(GameObject obj, int index)
        {
            int oldIndex = list.IndexOf(obj);
            list.RemoveAt(oldIndex);
            list.Insert(index,obj);
        }

    }
}
