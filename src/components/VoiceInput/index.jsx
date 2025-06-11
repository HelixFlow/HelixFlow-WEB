import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import './index.less'
import { Drawer, Button } from 'antd'
import { getUUID } from '@/utils'
import { ReactComponent as RecordingIcon } from "@/assets/useCenter/recording.svg";
import { ReactComponent as StartIcon } from "@/assets/useCenter/voice_input.svg";
import { ReactComponent as StopIcon } from "@/assets/useCenter/voice_stop.svg";
import { voiceToText } from '@/services/Chat';

export default forwardRef((props, ref) => {
  const { onStart, onStop, onChange, initValue, setFileLength } = props;
  const mediaRecorder = useRef(null)
  const [recording, setRecording] = useState(false)
  const timer = useRef(null)
  const timeClock = useRef(null);
  const [time, setTime] = useState(60);
  const timeRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timeClock.current);
    }
  }, []);


  const handleStart = () => {
    navigator.mediaDevices.getUserMedia(
      {
        audio: true,
      },
    )
      // Success callback
      .then(function (stream) {
        onStart();
        mediaRecorder.current = new MediaRecorder(stream);
        bindEvent();
        setRecording(true);
        mediaRecorder.current.start();
        timeClock.current = setInterval(() => {
          if (time > 0) {
            setTime((pre) => pre - 1)
          } else {
            clearInterval(timeClock.current)
          }
        }, 1000)
        timer.current = setTimeout(() => {
          handleStop();
        }, 60000);

      })
      // Error callback
      .catch(function (err) {
        console.log("The following getUserMedia error occured: " + err);
      });
  }

  const bindEvent = () => {
    mediaRecorder.current.ondataavailable = function (e) {
      console.log('ondataavailable', mediaRecorder.current.state)
      const audio = e.data;
      // let data = new FormData();
      // data.append('voice', new Blob([audio]), getUUID() + '.mp3');
      const data = new File([audio], getUUID() + '.mp3', { type: 'audio/mp3' })
      onChange(data);
    }
  }

  const handleStop = () => {
    setFileLength(60 - time);
    clearInterval(timeClock.current)
    clearTimeout(timer.current);
    timer.current = null;
    setRecording(false);
    mediaRecorder.current?.stop();
    onStop();
    setTime(60);
  }

  useImperativeHandle(ref, () => {
    return {
      handleStop: handleStop,
    };
  }, [])

  return (
    <div className='voice_input'>
      {
        recording ? <>
          <span ref={timeRef}>
            {`${time}s'`}
          </span>
          <RecordingIcon className='recoding_icon' />
          <StopIcon onClick={handleStop} className='stop_icon' />
        </> : <StartIcon onClick={handleStart} className='start_icon' />
      }
    </div>
  )
})