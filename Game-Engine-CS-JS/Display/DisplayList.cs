using System;
using System.Collections.Generic;
using Bridge;
using Newtonsoft.Json;
using GameEngineJS.GameObjects;

namespace GameEngineJS.Display
{
    public class DisplayList
    {
        public List<GameObject> list { get; set; } = new List<GameObject>() ;

        public void Add(GameObject obj) {
            list.Add(obj);
        }
    }
}
