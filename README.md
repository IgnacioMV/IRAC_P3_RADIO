# IRAC_P3_RADIO

Basic internet radio developed for the course Integration of Networks, Applications and Contents, from the Master in Telecommunication Engineering.

The radio is based on a ShoutCast server, and Liquidsoap provides the audio stream. It was developed on Raspbian GNU/Linux 8 (Jessie).

### How to install and configure

This project relies on Liquidsoap (http://savonet.sourceforge.net/), ffmpeg and youtube-dl (https://github.com/rg3/youtube-dl) to retrieve the audio and play it, so you must install them and make them reachable from the bash/command line. Windows users have to add an environment variable to their Path, pointing at the ffmpeg.exe (no idea in this case about Liquidsoap; project is meant to run in a Linux environment, a Raspberry Pi in particular). Linux users should do the same, or install them (for example ```apt-get install ffmpeg```).

After that, run:

```
git clone https://github.com/IgnacioMV/irac_p3_radio.git
cd irac_p3_radio
npm install
```
Now we are going to configure the radio. For this section, paths will be provided as relative to the root folder of the project:

- Create a file named .env in the root folder of the project and write the following line (key can be obtained here https://developers.google.com/youtube/v3/getting-started):

```
KEY=YOUR_YOUTUBE_API_KEY
```
- ./sc/server/sc_serv.conf: configure the 4 passwords in file sc_serv.conf and the streampath to your stream.
- ./songs/play.liq: change password to the stream password you just defined in sc_serv.conf, as well as the url, name, etc. Change also the log.file.path value to your desired path.


### Running the radio

From the root folder of the project run:

```
npm start &
cd sc/server
./sc_serv &
cd ../../songs
liquidsoap ./play.liq &
```

Go to localhost:3000. Everything should be working correctly! You can add songs and they will be played in the same order. When the list reaches the end, the last song is repeated limitlessly.
The ShoutCast server can be accessed in localhost:8000.

