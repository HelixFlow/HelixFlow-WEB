
import React, { useState, useRef } from 'react';
import { ReactComponent as RightSoundStop } from "@/assets/useCenter/right_sound_stop.svg";
import { ReactComponent as LeftSoundStop } from "@/assets/useCenter/left_sound_stop.svg";
const AudioPlayer = ({
  item,
  currentAudio,
  modelType
}) => {
  // const [audio] = useState(new Audio(src)); // 使用useState创建audio实例
  const [isPlaying, setIsPlaying] = useState(false); // 使用isPlaying状态跟踪播放状态
  const audioRef = useRef(null);



  // 播放音频的方法
  const playAudio = () => {
    setIsPlaying(true);
    // console.log(item.id);
    // console.log(currentAudio);
    // if (item.id == currentAudio) {
    //   const blob = new Blob([item.content], { type: 'audio/mp3' });
    //   const url = URL.createObjectURL(blob);
    //   // console.log('dizhi====>>', url);
    //   audioRef.current = new Audio(url);
    //   audioRef.current.play();
    // } else {
    //   audioRef.current.pause();
    //   audioRef.current = null;
    // }
  };

  // 暂停音频的方法
  const pauseAudio = () => {
    setIsPlaying(false);
  };

  return (
    <>
      {

        isPlaying && (item.id === currentAudio) ?
          (modelType === 'TextToSpeech' ?
            <img style={{ width: '24px' }} src={require(`@/assets/useCenter/left_sound_play.png`)} onClick={pauseAudio} />
            : <img style={{ width: '24px' }} src={require(`@/assets/useCenter/right_sound_play.png`)} onClick={pauseAudio} />)
          :
          (modelType === 'TextToSpeech' ? <LeftSoundStop onClick={playAudio} /> : <RightSoundStop onClick={playAudio} />)
      }
    </>
  );
};

export default AudioPlayer;
