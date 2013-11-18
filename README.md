Simple http videofile server using html5 video capabilities.

PreReq:
-------
node version: v0.10.x or higher
npm version: 1.1.59 or higher
  

Install:
--------
cd <projectFolder>
npm install

Run:
----
node app.js --path <folder> --port <port>

Result:
-------
Share your (sane) mp4 files to html5 video supporting browser.
Of course works fine from ipad(retina) which was one of the goals.
(also managed to play video [encoded with proper settings] on my
nokia n9... which was unexpected)

Server shares folder you specify for it (follows symbolic links) and lists every
mp4 file on the webpage for easy click'n'play. Player won't start loading the
video until you click it, designed especially mobile in mind.

future goals:
-------------
* search function with simple episode number filter
  combined to function as playlist
* err simple password protected style of accessing the videos.


