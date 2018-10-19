﻿using System;
using System.Collections.Generic;
using GameEngineJS.GameObjects;
using GameEngineJS.Graphics;

namespace GameEngineJS.Components
{
    public class Animator : Component
    {
        public Dictionary<string, List<Image>> animations { get; set; }
        public string currentAnimation { get; set; } = "" ;
        public int currentFrame { get; set; } = 0;
        public int fps { get; set; } = 1;

        private bool _playing = false;
        private double lastTimeFrame = 0;

        public Animator(GameObject parent) : base(parent)
        {
            animations = new Dictionary<string, List<Image>>();
        }

        public void GotoAndPlay(string animationName) => GotoAndPlay(animationName, 0);
        public void GotoAndPlay(string animationName, int frame) {
            currentAnimation = animationName;
            currentFrame = frame;
            _playing = true;
        }

        public void Create(string animationName, List<Image> list){
            animations[animationName] = list;
        }

        internal override void Update() {
            if (!_playing) return;

            double now = DateTime.Now.Subtract(DateTime.MinValue.AddYears(2017)).TotalMilliseconds;
            double delta = now - lastTimeFrame;
            if (delta > 1000/fps) {
                currentFrame++;
                if (currentFrame >= animations[currentAnimation].Count) {
                    currentFrame = 0;
                }
                Console.Write(currentFrame + " " + currentAnimation);
                parent.image = animations[currentAnimation][currentFrame];

                lastTimeFrame = now;
            }

        }

    }
}
