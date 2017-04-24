# IRAC_P3_RADIO

Basic radio server developed for the course Integration of Networks, Applications and Contents, from the Master in Telecommunication Engineering.


### How to install and run:

This project relies on ffmpeg to retrieve the audio from the videos, so you must install it and make it reachable from the bash/command line. Windows users have to add an environment variable to their Path, pointing at the ffmpeg.exe. Linux users should do the same, or install it (for example ```apt-get install ffmpeg```).

After that, run:

```
git clone https://github.com/IgnacioMV/IRAC_P3_RADIO.git
cd irac_p3_radio
npm install
```

Then, create a file named .env in that same directory and write the following line:

```
KEY=YOUR_YOUTUBE_API_KEY
```

Save that file and run:

```
npm start
```

Go to localhost:3000

