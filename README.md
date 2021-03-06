# vuejs-cordova-youtube-time-management

● Search and shows YouTube videos for a search term;

● Shows the five most used words in titles and descriptions of the result;

● Shows how many days are needed to watch all the vídeos returned, with the following
conditions:

○ The user will input how much time he can expend daily during a week. For
example, [15, 120, 30, 150, 20, 40, 90] in minutes.

○ The user will not expend more time watching videos than his daily max.

○ The user will not start another video unless he can finish on the same day.

○ Videos longer than the longest day will be ignored.

○ The user will watch the videos in the exact order as returned.

○ Example: considering the week as stated above and the search returning 10
videos with the following durations: [20, 30, 60, 90, 200, 30, 40, 20, 60, 15], on
the first day no video will be watched, on the second the user will watch 3 videos
[20, 30, 60], on the third none will be watched, on the fourth 2 [90, 30] will be
watched and one will be ignored, on the fifth none will be watched, on the sixth
day one video [40] will be watched, on the seventh day 2 will be watched [20, 60]
and on the eighth day the last one will be watched [15].
○ Only the first 200 videos must be considered.
