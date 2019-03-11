﻿using System;
using System.Collections.Generic;
using GameEngineJS.GameObjects;
using GameEngineJS.Graphics;
using Bridge;
using Bridge.Html5;

namespace GameEngineJS.Components
{
    public class Animator : Component
    {
        private Dictionary<string, List<Union<HTMLCanvasElement,Image, uint>>> _animations { get; set; }
        public string currentAnimation { get; set; } = "";
        public int currentFrame { get; set; } = 0;
        public int fps { get; set; } = 1;

        public bool playing { get; private set; } = false;
        private double lastTimeFrame = 0;

        public Animator(GameObject parent) : base(parent)
        {
            _animations = new Dictionary<string, List<Union<HTMLCanvasElement, Image, uint>>>();
        }

        public void GotoAndPlay(string animationName) => GotoAndPlay(animationName, 0);
        public void GotoAndPlay(string animationName, int frame) {
            currentAnimation = animationName;
            currentFrame = frame;
            playing = true;
        }

        public void GotoAndStop(string animationName) => GotoAndStop(animationName, 0);
        public void GotoAndStop(string animationName, int frame)
        {
            currentAnimation = animationName;
            currentFrame = frame;

            if (!((uint)_animations[currentAnimation][currentFrame] >= 0))
            {
                parent.image = (Image)_animations[currentAnimation][currentFrame];
            }
            else {
                SpriteSheet sheet = (SpriteSheet)parent.image;
                sheet.currentIndex = (uint)_animations[currentAnimation][currentFrame];
            }

            playing = false;
        }

        public void Stop() {
            playing = false;
        }

        public void Start() {
            playing = true;
        }

        public void Create(string animationName, List<uint> list) {
            List<Union<HTMLCanvasElement, Image, uint>> t = new List<Union<HTMLCanvasElement, Image, uint>>();
            t = list.As<List<Union<HTMLCanvasElement, Image, uint>>>();
            Create(animationName, t);
        }

        public void Create(string animationName, List<Image> list)
        {
            List<Union<HTMLCanvasElement, Image, uint>> t = new List<Union<HTMLCanvasElement, Image, uint>>();
            t = list.As<List<Union<HTMLCanvasElement, Image, uint>>>();
            Create(animationName, t);
        }

        public void Create(string animationName, List<HTMLCanvasElement> list) {
            List<Union<HTMLCanvasElement, Image, uint>> t = new List<Union<HTMLCanvasElement, Image, uint>>();
            t = list.As<List<Union<HTMLCanvasElement, Image, uint>>>();
            Create(animationName, t);
        }

        public void Create(string animationName, List<Union<HTMLCanvasElement, Image, uint>> list){
            _animations[animationName] = list;
        }

        internal override void Update() {
            if (!playing) return;

            double now = DateTime.Now.Subtract(DateTime.MinValue.AddYears(2017)).TotalMilliseconds;
            double delta = now - lastTimeFrame;
            if (delta > 1000/fps) {
                currentFrame++;
                if (currentFrame >= _animations[currentAnimation].Count) {
                    currentFrame = 0;
                }

                if (!((uint)_animations[currentAnimation][currentFrame] >= 0))
                {
                    if (_animations[currentAnimation][currentFrame].GetType() == typeof(Image)) {
                        parent.image = (Image)_animations[currentAnimation][currentFrame];
                    } else {
                        parent.image = (HTMLCanvasElement)_animations[currentAnimation][currentFrame];
                    }
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
