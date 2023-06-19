import React, { useEffect, useRef } from 'react'
import './App.css'
import ZoomVideo from '@zoom/videosdk'

function App() {
  const streamRef = useRef(null)

  const leaveRoom = () => {
    streamRef.current?.stopVideo()
  }

  const run = async () => {
    const client = ZoomVideo.createClient()
    await client.init('en-US', 'CDN')

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiVFhHUFBQVjdmRm5IbmdYTnJyOHFUSWtoWHg3blNKMWEwNjlIIiwiZXhwIjoxNjg3MTYzNTUzLCJnZW9fcmVnaW9ucyI6IlZOIiwiaWF0IjoxNjg3MTU5OTUzLCJyb2xlX3R5cGUiOjAsInNlc3Npb25fa2V5IjoiWWpEV291MEt2YyIsInRwYyI6IllqRFdvdTBLdmMiLCJ1c2VyX2lkZW50aXR5IjoiNzZkMDE4YWQtYjIzOC00YzY4LWExOTQtM2VhMjExYWE2YWExIiwidmVyc2lvbiI6MX0.6fzZOP7w2SZuSaNUGn05fI9-nTk9UdxxdqUn-w8URlo'
    const sessionKey = 'YjDWou0Kvc'
    try {
      await client.join(sessionKey, token, 'Duy')
      streamRef.current = client.getMediaStream()

      if (streamRef.current.isRenderSelfViewWithVideoElement()) {
        const videoElement = document.querySelector('#my-self-view-video')

        await streamRef.current.startVideo({ videoElement })

        videoElement.style.display = 'block'
      } else {
        await streamRef.current.startVideo()

        const canvasElement = document.querySelector('#my-self-view-canvas')
        const userInfo = client.getCurrentUserInfo()
        const canvasWidth = canvasElement.offsetWidth
        const canvasHeight = canvasElement.offsetHeight
        const videoWidth = 1920
        const videoHeight = 1080
        const xCoordinate = (canvasWidth - videoWidth) / 2
        const yCoordinate = (canvasHeight - videoHeight) / 2

        await streamRef.current.renderVideo(
          canvasElement,
          userInfo.userId,
          videoWidth,
          videoHeight,
          xCoordinate,
          yCoordinate,
          2
        )

        canvasElement.style.display = 'block'
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.stopVideo()
      }
    }
  }, [])

  return (
    <div className='App'>
      <h1>Test Zoom Video SDK</h1>
      <button onClick={run}>start video</button>
      <button onClick={leaveRoom}>leave video</button>
      <video id='my-self-view-video' width='1920' height='1080'></video>
      <canvas id='my-self-view-canvas' width='1920' height='1080'></canvas>
      <canvas
        id='participant-videos-canvas'
        height='1080'
        width='1920'
      ></canvas>
    </div>
  )
}

export default App
