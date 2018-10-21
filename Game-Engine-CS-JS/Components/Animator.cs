using System;
using System.Collections.Generic;
using GameEngineJS.GameObjects;
using GameEngineJS.Graphics;
using Bridge;
using Bridge.Html5;

namespace GameEngineJS.Components
{
    public class Animator : Component
    {
        private Dictionary<string, List<Union<Image,uint>>> _animations { get; set; }
        public string currentAnimation { get; set; } = "" ;
        public int currentFrame { get; set; } = 0;
        public int fps { get; set; } = 1;

        private bool _playing = false;
        private double lastTimeFrame = 0;

        public Animator(GameObject parent) : base(parent)
        {
            _animations = new Dictionary<string, List<Union<Image, uint>>>();
        }

        public void GotoAndPlay(string animationName) => GotoAndPlay(animationName, 0);
        public void GotoAndPlay(string animationName, int frame) {
            currentAnimation = animationName;
            currentFrame = frame;
            _playing = true;
        }

        public void GotoAndStop(string animationName) => GotoAndStop(animationName, 0);
        public void GotoAndStop(string animationName, int frame)
        {
            currentAnimation = animationName;
            currentFrame = frame;
            _playing = false;
        }

        public void Stop() {
            _playing = false;
        }

        public void Start() {
            _playing = true;
        }

        public void Create(string animationName, List<uint> list) {
            List<Union<Image, uint>> t = new List<Union<Image, uint>>();
            t = list.As<List<Union<Image, uint>>>();
            Create(animationName, t);
        }
        public void Create(string animationName, List<Image> list)
        {
            List<Union<Image, uint>> t = new List<Union<Image, uint>>();
            t = list.As<List<Union<Image, uint>>>();
            Create(animationName, t);
        }
        public void Create(string animationName, List<Union<Image, uint>> list){
            _animations[animationName] = list;
        }

        internal override void Update() {
            if (!_playing) return;

            double now = DateTime.Now.Subtract(DateTime.MinValue.AddYears(2017)).TotalMilliseconds;
            double delta = now - lastTimeFrame;
            if (delta > 1000/fps) {
                currentFrame++;
                if (currentFrame >= _animations[currentAnimation].Count) {
                    currentFrame = 0;
                }

                if (!((uint)_animations[currentAnimation][currentFrame] >= 0))
                {
                    parent.image = (Image)_animations[currentAnimation][currentFrame];
                }
                else {
                    SpriteSheet sheet = (SpriteSheet)parent.image;
                    sheet.currentIndex = (uint)_animations[currentAnimation][currentFrame];
                }

                lastTimeFrame = now;
            }

        }

    }
}
