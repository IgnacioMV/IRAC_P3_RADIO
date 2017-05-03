#!/usr/bin/liquidsoap -v

set("log.file.path","/home/pi/IRAC/P3/irac_p3_radio/ls.log")
set("log.stdout",true)

def my_request_function() =
  result =
    list.hd(
      get_process_lines("node ./nextsong.js"))
  request.create(result)
end

s = request.dynamic(my_request_function)

output.shoutcast(%aac(channels=2, samplerate=44100, bitrate=330), name="IRAC G02 Radio!", url="http://79.150.159.1:8000/liste.pls?sid=1", host="127.0.0.1",port=8000, password="password4", mksafe(audio_to_stereo(s)))