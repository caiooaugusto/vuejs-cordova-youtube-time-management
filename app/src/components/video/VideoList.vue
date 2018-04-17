<template>
    <div>
        <v-toolbar
            class="search-toolbar elevation-20"
            color="white"
            dense
        >
            <v-text-field v-model="search" prepend-icon="search" hide-details single-line></v-text-field>
        </v-toolbar>

        <v-card class="time-to-spend">
            <v-card-title primary-title>
                <div class="headline">Time to expend daily (Minutes)</div>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click.native="showtimeToSpend = !showtimeToSpend">
                    <v-icon>{{ showtimeToSpend ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </v-btn>
            </v-card-title>
            <v-slide-y-transition>
                <v-card-text v-show="showtimeToSpend">

                    <form class="form-user">
                        <v-layout row wrap justify-space-between>
                            <v-flex xs3 class="ma-1">
                                <v-text-field label="Day 1" v-model="timeToSpend[0]" :min="0" :max="1440" type="number"></v-text-field>
                            </v-flex>
                            <v-flex xs3 class="ma-1">
                                <v-text-field label="Day 2" v-model="timeToSpend[1]" :min="0" :max="1440" type="number"></v-text-field>
                            </v-flex>
                            <v-flex xs3 class="ma-1">
                                <v-text-field label="Day 3" v-model="timeToSpend[2]" :min="0" :max="1440" type="number"></v-text-field>
                            </v-flex>
                            <v-flex xs3 class="ma-1">
                                <v-text-field label="Day 4" v-model="timeToSpend[3]" :min="0" :max="1440" type="number"></v-text-field>
                            </v-flex>
                            <v-flex xs3 class="ma-1">
                                <v-text-field label="Day 5" v-model="timeToSpend[4]" :min="0" :max="1440" type="number"></v-text-field>
                            </v-flex>
                            <v-flex xs3 class="ma-1">
                                <v-text-field label="Day 6" v-model="timeToSpend[5]" :min="0" :max="1440" type="number"></v-text-field>
                            </v-flex>
                            <v-flex xs3 class="ma-1">
                                <v-text-field label="Day 7" v-model="timeToSpend[6]" :min="0" :max="1440" type="number"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </form>

                    <div v-if="resultPerDay" class="headline mb-3">
                        How many days are needed to watch all the videos starting today?<br>You will need {{daysToWatchAllVideos}} days!
                    </div>

                    <div v-for="(pos, posIndex) in resultPerDay">
                        <div v-for="(video, videoIndex) in pos">
                            <div
                                class="subheading"
                                v-if="videoIndex == 0"
                            >
                                <b>Dia {{posIndex}}</b>
                            </div>
                            <br>
                            {{video.snippet.title}} - {{video.contentDetails.duration}}
                            <br>
                            <img :src="video.snippet.thumbnails.default.url">
                            <br><br>
                        </div>
                    </div>

                </v-card-text>
            </v-slide-y-transition>
        </v-card>

        <v-card v-if="mostUsedWords" class="white--text most-used-words theme--dark">
            <v-card-title primary-title>
                <div class="headline">Most used words in title and description of the result</div>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click.native="showMostUsedWords = !showMostUsedWords">
                    <v-icon>{{ showMostUsedWords ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </v-btn>
            </v-card-title>
            <v-slide-y-transition>
                <v-card-text v-show="showMostUsedWords">
                    <div class="center">
                        <v-chip class="white" v-for="word in mostUsedWords">{{word[0]}} ({{word[1]}})</v-chip>
                    </div>
                </v-card-text>
            </v-slide-y-transition>
        </v-card>

        <v-data-table
            dark
            v-if="items.length > 0"
            class="users-data-table elevation-1"
            :headers="headers"
            :items="items"
            item-key="id"
        >
            <template slot="items" scope="props">
                <tr
                    style="border-bottom:none;margin:10px;"
                    @click="props.expanded = !props.expanded"
                >
                    <td>
                        <div class="ma-2">
                            <img :src="props.item.snippet.thumbnails.medium.url">
                            <div class="subheading">{{ props.item.snippet.title }}</div>
                            <div class="body-2">{{ props.item.statistics.viewCount}} views</div>
                        </div>
                    </td>
                </tr>
            </template>

            <template slot="expand" scope="props">
                <v-card v-if="props.item.snippet.description" flat>
                    <form class="form-user">
                        <v-text-field
                            v-model="props.item.snippet.description"
                            label="Description"
                            multi-line
                            :disabled="true"
                        ></v-text-field>
                    </form>
                </v-card>
            </template>
        </v-data-table>

        <!--<v-btn
            class="fab-sync"
            dark
            fab
            @click.stop="dialog2 = true"
        >
            <v-icon class='white--text'>person_add</v-icon>
        </v-btn>-->
    </div>
</template>

<script>
    import VAlert from "vuetify/src/components/VAlert/VAlert";

    export default {
        components: {VAlert},
        $validates: true,
        data () {
            return {
                search: "",
                items: [],
                allItems: [],
                allItemsIds: "",
                mostUsedWords: null,
                showtimeToSpend: true,
                showMostUsedWords: true,
                result: null,
                resultPerDay: null,
                timeToSpend: [15,15,15,120,15,15,15],

                dialog2: false,
                menuDeadlineDate: false,
                menuDeadlineDateForm: false,

                title_form: '',
                description_form: '',
                deadline_date_string_form: null,
                deadline_date_string_form_formatted: null,
                status_form: false,
                headers: [
                    { text: '', value: 'thumbnails', align: 'left', sortable: false }
                ]
            }
        },
        watch: {
            search (query, queryOld) {
                if(query.length) {
                    this.searchVideos()
                }
            },
            timeToSpend (newEntry, oldEntry){
                this.searchVideos()
            }
        },
        methods: {
            searchVideos() {//fazer requisição de 4 paginas e junta-las
                this.$http.get('search?part=id&maxResults=5&type=video&q=' + this.search + '&key=AIzaSyC756WUk3Dfl2J2-Qt-4zrlYwwxtHvqPnk').then(response => {
                    this.allItems = response.body
                    this.headers[0].text = 'Approximately ' + this.allItems.pageInfo.totalResults + ' videos were found! Only the first 200 are being considered.'

                    this.buildAllItemsIdsString()

                    return response.json()
                }, error => {
                    alert(JSON.stringify(error))
                })
            },
            buildAllItemsIdsString(){
                var videos = this.allItems.items
                var videosIds = ""

                for(var x = 0; x < videos.length; x++){
                    if(x > 0) {
                        videosIds = videosIds + ','
                    }
                    videosIds = videosIds + videos[x].id.videoId
                }

                this.allItemsIds = videosIds

                this.getVideosInfo()
            },
            getVideosInfo(){
                this.$http.get('videos?part=snippet,contentDetails,statistics,topicDetails&id='+this.allItemsIds+'&key=AIzaSyC756WUk3Dfl2J2-Qt-4zrlYwwxtHvqPnk').then(response => {
                    this.allItems = response.body
                    this.items = this.allItems.items

                    this.getMostUsedWords()
                    this.daysRequiredToWatchVideos();

                    return response.json()
                }, error => {
                    alert(JSON.stringify(error))
                })
            },
            getMostUsedWords(){ //fazer setting da contante tamanho da palavra
                var wordsCount = {};

                for(var x = 0; x < this.items.length; x++) {
                    let title = this.items[x].snippet.title
                    let description = this.items[x].snippet.description

                    let titleArray = title.split(" ");
                    let descriptionArray = description.split(" ");

                    for(var i = 0; i < titleArray.length; i++){
                        if(titleArray[i].length < 3){
                            continue
                        }

                        if(wordsCount[titleArray[i]]){
                            wordsCount[titleArray[i]]++
                        }else{
                            wordsCount[titleArray[i]] = 1
                        }
                    }

                    for(var y = 0; y < descriptionArray.length; y++){
                        if(descriptionArray[y].length < 3){
                            continue
                        }

                        if(wordsCount[descriptionArray[y]]){
                            wordsCount[descriptionArray[y]]++
                        }else{
                            wordsCount[descriptionArray[y]] = 1
                        }
                    }
                }

                var sortable = [];
                for (var pos in wordsCount) {
                    sortable.push([pos, wordsCount[pos]]);
                }

                wordsCount = sortable.sort(function(a, b) {
                    return b[1] - a[1];
                })

                this.mostUsedWords = wordsCount.slice(0,5)
            },
            formatVideoDurationToSeconds(duration){
                var a = duration.match(/\d+/g);

                if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
                    a = [0, a[0], 0];
                }

                if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
                    a = [a[0], 0, a[1]];
                }
                if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
                    a = [a[0], 0, 0];
                }

                duration = 0;

                if (a.length == 3) {
                    duration = duration + parseInt(a[0]) * 3600;
                    duration = duration + parseInt(a[1]) * 60;
                    duration = duration + parseInt(a[2]);
                }

                if (a.length == 2) {
                    duration = duration + parseInt(a[0]) * 60;
                    duration = duration + parseInt(a[1]);
                }

                if (a.length == 1) {
                    duration = duration + parseInt(a[0]);
                }
                return duration
            },
            daysRequiredToWatchVideos(){
                const timeToSpendInMinutes = this.timeToSpend//[15, 120, 30, 150, 20, 40, 90]
                var maxTimeToSpend
                maxTimeToSpend = timeToSpendInMinutes.reduce(function(a, b) {
                    return Math.max(a, b);
                });
                var result = [[],[],[],[],[],[],[]], currentResultRow = 0
                var limitPerDay = 0, currentDayOfWeek = 0, currentVideoPosition = 0

                var resolveVideosDays = () => {
                    //faz um laço começando do ultimo video processado
                    for(var x = currentVideoPosition; x < this.items.length; x++){
                        let dayLimit = timeToSpendInMinutes[currentDayOfWeek]
                        let videoDuration = this.formatVideoDurationToSeconds(this.items[x].contentDetails.duration) / 60

                        //videos longer than max time to spend in a day will be ignored
                        if(maxTimeToSpend < videoDuration){
                            currentVideoPosition++

                            resolveVideosDays()
                            return
                        }

                        //se o proximo video for maior que limite de tempo do dia ou se o proximo video estourar o limite de tempo do dia
                        if(videoDuration > dayLimit || (limitPerDay + videoDuration) > dayLimit){
                            console.log('proximo dia')
                            //preenche a matriz
                            //if(emptyDay) {
                                for (var i = 0; i < result.length; i++) {
                                    //if (i != currentDayOfWeek) {
                                        result[i].push(null)
                                    //}
                                }
                            //}

                            //proximo video deve ser assistido no proximo dia
                            if(currentDayOfWeek == 6) { //se for o ultimo dia da semana, recomeça.
                                currentDayOfWeek = 0
                                //novos videos devem ser inseridos na proxima semana na matriz de resultados
                                currentResultRow++
                            }else{
                                currentDayOfWeek++
                            }

                            //zera o limite do dia corrente pois passará para o proximo dia
                            limitPerDay = 0

                            //salva posição do ultimo video analisado para recursão
                            currentVideoPosition = x

                            resolveVideosDays()
                            return
                        }
                        //alocar o video no mesmo dia
                        //emptyDay = false
                        //soma a duração do video ao limite do dia
                        limitPerDay += videoDuration

                        //preenche a matriz
                        for(var i = 0; i < result.length; i++){
                            if(i != currentDayOfWeek){
                                result[i].push(null)
                            }else{
                                console.log('add video')
                                result[i].push(this.items[x])
                            }
                        }
                    }
                    return
                }

                resolveVideosDays()
                this.result = result

                var resultPerDay = []
                var currentCollumn = 0
                var dayCount = 1

                var buildResultPerDay = (currentCollumn) => {
                    console.log('========starting currentCollumn======')
                    console.log(currentCollumn)
                    for (var i = 0; i < this.result.length; i++) {
                        var emptyCollumn = true
                        for (var t = 0; t < this.result.length; t++) {
                            if (this.result[t][currentCollumn]){
                                emptyCollumn = false
                            }
                        }

                        if(emptyCollumn){
                            console.log('coluna vazia!')
                            currentCollumn++
                            return buildResultPerDay(currentCollumn)
                        }else{
                            console.log('coluna NÃO vazia!')
                        }

                        if (this.result[i][currentCollumn]) {
                            for (var x = currentCollumn; x < this.result[0].length; x++) {

                                if (this.result[i][x]) {
                                    if(!resultPerDay[dayCount]){
                                        resultPerDay[dayCount] = []
                                    }
                                    resultPerDay[dayCount].push(this.result[i][x])
                                    if(!this.result[i][x+1]) {
                                        dayCount++
                                        currentCollumn = x+1
                                        return buildResultPerDay(currentCollumn)
                                    }
                                } else {
                                    currentCollumn = x + 1
                                    return buildResultPerDay(currentCollumn)
                                }
                            }
                        }
                    }
                }

                buildResultPerDay(currentCollumn)

                this.resultPerDay = resultPerDay
                this.daysToWatchAllVideos = this.resultPerDay.length-1

                console.log('this.result')
                console.log(this.result)
                console.log('this.resultPerDay')
                console.log(this.resultPerDay)
                console.log('this.daysToWatchAllVideos')
                console.log(this.daysToWatchAllVideos)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .fab-sync
        position fixed
        bottom 75px
        right 15px

    .search-toolbar
        z-index 1
        position fixed
        width 100%
        top 64px
        left 0px
        right 0px
        margin 0px

    .form-user
        margin 10px 30px 30px 30px

    .time-to-spend
        margin-top 80px
        margin-bottom 30px

    .most-used-words
        margin-bottom 30px

    .finished-task
        color #58ff68 !important
</style>