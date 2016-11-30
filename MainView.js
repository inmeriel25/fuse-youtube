var Observable = require("FuseJS/Observable");

var mainPage = {title: "My YouTube", fontSize :30, handle: "pagesList", isShowingSearchBox : false};

var currentPage = Observable(mainPage);

var currentPageHandle = currentPage.map(function(x){
	return x.handle;
});

var currentPageTitle = currentPage.map(function(x){
	return x.title;
});

var currentPageTitleSize = currentPage.map(function(x){
	return x.fontSize;
});

// sub페이지 이동 시 (카텍고리 추가 시 사용할 것)
// function createPage(title) {
// 	return {
// 		title: title,
// 		clicked: function() {
// 			router.push("subPage", { title })
// 		}
// 	};
// }
var pages = Observable();

function pageButtonClicked(arg){
	currentPage.value = arg.data;
}

function goBack(arg){
	currentPage.value = mainPage;
}

function backButtonClicked(obj, KeyEventArgs){
	debug_log("*****************************   menu button clicked");
	// console.log('keypress - keyCode : ' + o);
	currentPage.value = mainPage;
}


// 검색 함수
var searchText = '';

function setSearchText(args) {
    searchText = args.value;
};

function search() {

    pages.clear();

    if (searchText === '') {

        fetch('https://www.googleapis.com/youtube/v3/videos?chart=mostPopular&key=AIzaSyCUPN1eA3f0ci7y6tr2xi9APBe6xml43Jw&part=snippet&maxResults=10', {
            headers: { "Content-type": "application/json"}
        }).then(function(response) {
            return response.json();    // This returns a promise
        }).then(function(responseObject) {
            if (responseObject.error === undefined) {
                responseObject.items.forEach(function(itemInfo, i) {
                    if (itemInfo.kind === 'youtube#video') {
                        pages.add({
                            duration : 0.5 + i * 0.1,
                            title: itemInfo.snippet.title.length > 48 ? itemInfo.snippet.title.substring(0, 46) + '...' : itemInfo.snippet.title,
                            fontSize: 15,
                            description: itemInfo.snippet.description,
                            channelTitle: itemInfo.snippet.channelTitle,
                            handle: itemInfo.id,
                            embed : 'http://www.youtube.com/embed/' + itemInfo.id,
                            thumbnail: itemInfo.snippet.thumbnails.medium.url
                        });
                    }
                });
            }
        }).catch(function(err) {
            // An error occured parsing Json
        });
    }

    else {
        fetch('https://www.googleapis.com/youtube/v3/search?q=' + searchText + '&key=AIzaSyCUPN1eA3f0ci7y6tr2xi9APBe6xml43Jw&part=snippet&maxResults=10', {
            headers: { "Content-type": "application/json"}
        }).then(function(response) {
            return response.json();    // This returns a promise
        }).then(function(responseObject) {
            if (responseObject.error === undefined) {
                responseObject.items.forEach(function(itemInfo, i) {
                    if (itemInfo.id.kind === 'youtube#video') {
                        pages.add({
                            duration : 0.5 + i * 0.1,
                            title: itemInfo.snippet.title.length > 48 ? itemInfo.snippet.title.substring(0, 46) + '...' : itemInfo.snippet.title,
                            fontSize: 15,
                            description: itemInfo.snippet.description,
                            channelTitle: itemInfo.snippet.channelTitle,
                            handle: itemInfo.id.videoId,
                            embed : 'http://www.youtube.com/embed/' + itemInfo.id,
                            thumbnail: itemInfo.snippet.thumbnails.medium.url
                        });
                    }
                });
            }
        }).catch(function(err) {
            // An error occured parsing Json
        });
    }
};

search();

module.exports = {
	pages : pages,
	currentPage : currentPage,
	currentPageHandle : currentPageHandle,
	currentPageTitle : currentPageTitle,
	currentPageTitleSize : currentPageTitleSize,
	pageButtonClicked : pageButtonClicked,
    goBack : goBack,
    backButtonClicked : backButtonClicked,
    setSearchText : setSearchText,
    search : search
};

