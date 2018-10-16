using System;
using Bridge;
using Newtonsoft.Json;
using GameEngineJS.GameObjects;

namespace GameEngineJS.Graphics
{
    public class Scene
    {

        private DisplayList mainDisplayList;
        private Drawer drawer;

        public Scene(DisplayList objList, Drawer _drawer) {
            mainDisplayList = objList;
            drawer = _drawer;
        }

        public void Refresh() {
            foreach (GameObject obj in mainDisplayList.list) {
                drawer.Draw(obj.position.X, obj.position.Y, obj.size.X, obj.size.Y, obj.image);
            }
        }
    }
}
